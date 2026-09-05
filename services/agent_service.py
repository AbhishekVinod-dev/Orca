from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
import datetime
import json
import os

load_dotenv()


def _now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _tool_correction_message(available_tools: dict) -> str:
    # ponytail: a vague "call a tool" nudge gets ignored or stalls the model
    # into silence; naming the exact tool and format it already knows from
    # its own system prompt gets far more reliable compliance.
    tool_name = next(iter(available_tools), "the required tool") if available_tools else "the required tool"
    return (
        "You answered without calling a tool. That is not allowed. "
        f"Respond now with ONLY this block, filled in with the real arguments "
        f"from the request:\n<thought>\nI need to call {tool_name} to get real data.\n"
        f"</thought>\n<tool_call>\n{{\"name\": \"{tool_name}\", \"arguments\": {{...}}}}\n"
        "</tool_call>"
    )


async def call_agent(
    llm,
    prompt: str,
    role: str,
    SYSTEM_PROMPT: str,
    available_tools: dict = None,
    agent_name: str = "agent",
    evidence: list = None,
    require_tool_before_final: bool = False,
) -> str:
    if evidence is None:
        evidence = []
    prompt += f"\nThe role of the user is: {role}"
    messages = [
        SystemMessage(SYSTEM_PROMPT),
        HumanMessage(prompt),
    ]
    # ponytail: gpt-oss reasoning models often burn a full loop on an empty
    # "thinking" turn before producing visible content, so a grounded
    # tool-call -> final cycle needs more headroom than a plain chat loop.
    max_loop = 8
    curr_loop = 0
    tool_called = False

    while True:
        curr_loop += 1
        curr_msg = await llm.ainvoke(messages)
        messages.append(curr_msg)

        print(
            f"\n--- [DEBUG] {agent_name.upper()} RESPONSE (Loop {curr_loop}) ---\n{curr_msg.content}\n------------------------------------------\n"
        )

        if "<thought>" in curr_msg.content:
            yield f'data: {{"type": "thought", "name": "{agent_name}", "content": {json.dumps(curr_msg.content, ensure_ascii=False)}}}\n\n'

        if "<tool_call>" in curr_msg.content:
            try:
                tool_json = extract_json_between_tags(curr_msg.content)
                tool_name = tool_json.get("name")
                tool_args = tool_json.get("arguments", {})
                tool_result_content = ""
                tool_called = True

                if available_tools and tool_name in available_tools:
                    tool_function = available_tools[tool_name]

                    import inspect

                    if inspect.isasyncgenfunction(tool_function) or (
                        hasattr(tool_function, "__name__")
                        and "call_" in tool_function.__name__
                    ):
                        # Sub-agent call: its own tool calls append to the same
                        # shared evidence list, so evidence bubbles up to the
                        # top-level orchestrator without re-recording here.
                        sub_agent_final_result = ""
                        async for chunk in tool_function(
                            prompt=tool_args.get("prompt", ""),
                            role=role,
                            evidence=evidence,
                        ):
                            if '"type": "final"' in chunk:
                                chunk_data = chunk.replace("data: ", "").strip()
                                sub_agent_final_result = json.loads(chunk_data).get(
                                    "content", ""
                                )
                            else:
                                yield chunk
                        tool_result_content = sub_agent_final_result
                    else:
                        # Simple tool: this is where real evidence is fetched.
                        if inspect.iscoroutinefunction(tool_function):
                            tool_result_content = await tool_function(**tool_args)
                        else:
                            tool_result_content = tool_function(**tool_args)
                        evidence.append(
                            {
                                "agent": agent_name,
                                "tool": tool_name,
                                "arguments": tool_args,
                                "result": tool_result_content,
                                "timestamp": _now_iso(),
                            }
                        )
                else:
                    tool_result_content = (
                        f"Error: Tool {tool_name} is not available to this agent."
                    )
                    evidence.append(
                        {
                            "agent": agent_name,
                            "tool": tool_name,
                            "arguments": tool_args,
                            "result": tool_result_content,
                            "timestamp": _now_iso(),
                        }
                    )

                messages.append(
                    HumanMessage(
                        content=f"<tool_result>{tool_result_content}</tool_result>"
                    )
                )
                yield f'data: {{"type": "status", "name": "{agent_name}", "content": "Calling {tool_json.get("name", "tool")}..."}}\n\n'
            except Exception as e:
                error_msg = f"Failed to parse tool call. Error: {str(e)}. Please format the JSON correctly."
                messages.append(
                    HumanMessage(content=f"<tool_error>{error_msg}</tool_error>")
                )

        if "<final>" in curr_msg.content:
            if require_tool_before_final and not tool_called:
                messages.append(
                    HumanMessage(content=_tool_correction_message(available_tools))
                )
            else:
                try:
                    final_answer = (
                        curr_msg.content.split("<final>")[1].split("</final>")[0].strip()
                    )
                    print(f"[DEBUG] {agent_name} final answer: {final_answer}")
                    yield f'data: {{"type": "final", "name": "{agent_name}", "content": {json.dumps(final_answer, ensure_ascii=False)}}}\n\n'
                except IndexError:
                    yield f'data: {{"type": "error", "name": "{agent_name}", "content": "Malformed final tag from agent."}}\n\n'
                break  # Exit the loop immediately

        elif (
            "<tool_call>" not in curr_msg.content
            and "<thought>" not in curr_msg.content
        ):
            final_answer = curr_msg.content.strip()

            # Don't yield empty strings
            if final_answer:
                if require_tool_before_final and not tool_called:
                    messages.append(
                        HumanMessage(content=_tool_correction_message(available_tools))
                    )
                else:
                    # Clean up quotes and newlines for JSON safety
                    safe_answer = final_answer.replace('"', '\\"').replace("\n", "\\n")
                    yield f'data: {{"type": "final", "content": "{safe_answer}"}}\n\n'
                    break

        if curr_loop >= max_loop:
            yield f'data: {{"type": "error", "name": "{agent_name}", "content": "Agent reasoning timed out after {max_loop} attempts."}}\n\n'
            break
