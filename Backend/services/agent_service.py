from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
import json
import os

load_dotenv()


async def call_agent(
    llm,
    prompt: str,
    role: str,
    SYSTEM_PROMPT: str,
    available_tools: dict = None,
    agent_name: str = "agent",
) -> str:
    prompt += f"\nThe role of the user is: {role}"
    messages = [
        SystemMessage(SYSTEM_PROMPT),
        HumanMessage(prompt),
    ]
    max_loop = 5
    curr_loop = 0

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

                if available_tools and tool_name in available_tools:
                    tool_function = available_tools[tool_name]

                    import inspect

                    if inspect.isasyncgenfunction(tool_function) or (
                        hasattr(tool_function, "__name__")
                        and "call_" in tool_function.__name__
                    ):
                        sub_agent_final_result = ""
                        async for chunk in tool_function(
                            prompt=tool_args.get("prompt", ""), role=role
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
                        # Simple tool
                        if inspect.iscoroutinefunction(tool_function):
                            tool_result_content = await tool_function(**tool_args)
                        else:
                            tool_result_content = tool_function(**tool_args)
                else:
                    tool_result_content = (
                        f"Error: Tool {tool_name} is not available to this agent."
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
                # Clean up quotes and newlines for JSON safety
                safe_answer = final_answer.replace('"', '\\"').replace("\n", "\\n")
                yield f'data: {{"type": "final", "content": "{safe_answer}"}}\n\n'
                break

        if curr_loop >= max_loop:
            yield f'data: {{"type": "error", "name": "{agent_name}", "content": "Agent reasoning timed out after {max_loop} attempts."}}\n\n'
            break
