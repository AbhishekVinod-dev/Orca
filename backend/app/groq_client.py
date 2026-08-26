import json
import os

from groq import Groq
from dotenv import load_dotenv

PLANNER_MODEL = "openai/gpt-oss-120b"
RESPONSE_MODEL = "openai/gpt-oss-20b"

VALID_INTENTS = {"PFZ", "SAFETY", "CYCLONE", "OCEANOGRAPHY", "GENERAL"}

_client: Groq | None = None
load_dotenv()


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    return _client


def classify_intent(query: str) -> str:
    completion = _get_client().chat.completions.create(
        model=PLANNER_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the user's marine-safety query into exactly one intent. "
                    'Respond with ONLY a JSON object: {"intent": "<INTENT>"} where '
                    "<INTENT> is one of PFZ, SAFETY, CYCLONE, OCEANOGRAPHY, GENERAL."
                ),
            },
            {"role": "user", "content": query},
        ],
    )
    content = completion.choices[0].message.content
    try:
        parsed = json.loads(content)
        intent = parsed.get("intent")
        if intent in VALID_INTENTS:
            return intent
    except (json.JSONDecodeError, AttributeError, TypeError):
        pass
    return "GENERAL"


def generate_advisory(query: str, intent: str, risk_score: int, language: str) -> str:
    completion = _get_client().chat.completions.create(
        model=RESPONSE_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are ORCA, a marine safety assistant for Indian coastal fishermen. "
                    "Write a short, plain-language advisory paragraph responding to the "
                    "user's query, in the language specified. Base your tone on the risk "
                    "score (0-100, higher is more dangerous). Do NOT invent specific wind "
                    "speeds, wave heights, or warning text -- official warnings are appended "
                    "separately after your response. Do not repeat or reference specific "
                    "numeric values you were not given."
                ),
            },
            {
                "role": "user",
                "content": f"Query: {query}\nIntent: {intent}\nRisk score: {risk_score}\nRespond in: {language}",
            },
        ],
    )
    return completion.choices[0].message.content.strip()
