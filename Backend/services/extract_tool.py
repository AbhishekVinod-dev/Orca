import re
import json


def extract_json_between_tags(ai_text: str) -> dict:
    # 1. re.DOTALL ensures it captures everything, even if the JSON spans multiple lines
    # 2. re.IGNORECASE makes it immune if the LLM hallucinates <TOOL_CALL>
    match = re.search(
        r"<tool_call>(.*?)</tool_call>", ai_text, re.DOTALL | re.IGNORECASE
    )

    if not match:
        raise ValueError("Tool call tags not found in the AI response.")

    # 3. Extract the text and strip leading/trailing whitespace or newlines
    raw_json_string = match.group(1).strip()

    try:
        # 4. Convert the string into a Python dictionary
        tool_data = json.loads(raw_json_string)
        return tool_data
    except json.JSONDecodeError as e:
        # 5. Systems Management: Catch the error if the LLM generated bad JSON
        raise ValueError(
            f"LLM generated malformed JSON: {e}. Raw text: {raw_json_string}"
        )
