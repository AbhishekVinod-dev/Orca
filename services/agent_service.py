from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
import os

load_dotenv()

# apikey = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="qwen/qwen3.6-27b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
)

SYSTEM_PROMPT = """
You are a marine intelligence agent. You must reason using the following format. 
You only get to choose ONE block per message:

Option 1: Call a Tool
<thought>
I need to find the wave height.
</thought>
<tool_call>
{"name": "get_wave_forecast", "arguments": {"lat": 13.08, "lon": 80.27}}
</tool_call>

Option 2: Final Answer
<final>
It is not safe to go to sea because wave heights are 4 meters.
</final>

AVAILABLE TOOLS:
1. get_wave_forecast(lat: float, lon: float) -> Returns wave height in meters.
"""


async def call_agent(prompt: str) -> str:
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
                mock_observation = f"Result of {tool_json['name']}: Mock data received."
                messages.append(
                    HumanMessage(
                        content=f"<tool_result>{mock_observation}</tool_result>"
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

        if curr_loop > max_loop or prev_declaration == "final":
            try:
                final_answer = curr_msg.content.split("<final>")[1].split("</final>")[0]
                final_msg = (
                    f'data: {{"type": "final", "content": "{final_answer}"}}\n\n'
                )
                yield final_msg
                print(final_msg)
            except IndexError:
                if curr_loop > max_loop:
                    yield f'data: {{"type": "error", "content": "Query timed out. Please try a more specific question."}}\n\n'
                else:
                    # If it wasn't a timeout but the tags were just malformed
                    yield f'data: {{"type": "final", "content": "{curr_msg.content}"}}\n\n'
                    print(
                        f'data: {{"type": "final", "content": "{curr_msg.content}"}}\n\n'
                    )
            break
