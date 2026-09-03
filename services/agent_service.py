from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
import json
import os

load_dotenv()


async def call_agent(
    llm, prompt: str, role: str, SYSTEM_PROMPT: str, available_tools: dict = None
) -> str:
    prompt += f"The role of the user is: {role}"
    messages = [
        SystemMessage(SYSTEM_PROMPT),
        HumanMessage(prompt),
    ]
    max_loop = 5
    curr_loop = 0
    prev_declaration = ""
    final_msg = ""

    while True:

        curr_loop += 1

        curr_msg = await llm.ainvoke(messages)
        ai_msg = curr_msg.content
        messages.append(curr_msg)

        if "<thought>" in curr_msg.content:
            prev_declaration = "thought"
            yield f'data: {{"type": "thought", "content": "{curr_msg.content}"}}\n\n'
            print(f'data: {{"type": "thought", "content": "{curr_msg.content}"}}\n\n')
        else:
            prev_declaration = "final"

        if "<tool_call>" in curr_msg.content:
            try:
                tool_json = extract_tool_json_between_tags(curr_msg.content)
                # mock_observation = f"Result of {tool_json['name']}: Mock data received."
                tool_name = tool_json.get("name")
                tool_args = tool_json.get("arguments", {})
                tool_result_content = ""

                if available_tools and tool_name in available_tools:
                    # 1. Grab the function from the dictionary
                    tool_function = available_tools[tool_name]

                    # 2. Execute it dynamically
                    sub_agent_final_result = ""
                    async for chunk in tool_function(
                        prompt=tool_args.get("prompt"), role=role
                    ):
                        yield chunk
                        if '"type": "final"' in chunk:
                            chunk_data = chunk.replace("data: ", "").strip()
                            sub_agent_final_result = json.loads(chunk_data)["content"]

                    tool_result_content = sub_agent_final_result
                else:
                    tool_result_content = (
                        f"Error: Tool {tool_name} is not available to this agent."
                    )
                messages.append(
                    HumanMessage(
                        content=f"<tool_result>{tool_result_content}</tool_result>"
                    )
                )
                yield f"data: {{\"type\": \"status\", \"content\": \"Calling {tool_json['name']}...\"}}\n\n"
                print(
                    f"data: {{\"type\": \"status\", \"content\": \"Calling {tool_json['name']}...\"}}\n\n"
                )
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
                yield f'data: {{"type": "final", "content": "{final_answer}"}}\n\n'
            except IndexError:
                yield f'data: {{"type": "error", "content": "Malformed final tag from agent."}}\n\n'
            break  # Exit the loop immediately

        if curr_loop >= max_loop:
            yield f'data: {{"type": "error", "content": "Agent reasoning timed out after {max_loop} attempts."}}\n\n'
