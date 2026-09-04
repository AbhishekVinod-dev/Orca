from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
from schema.chat_model import ChatRequest
from services.agent_service import call_agent
from prompts.system_prompts import METEOROLOGY_SYSTEM_PROMPT
import os

load_dotenv()

# apikey = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
)

SYSTEM_PROMPT = METEOROLOGY_SYSTEM_PROMPT


from services.internal_tools.open_meteo import get_marine_weather_forecast


async def call_meteorology_agent(prompt: str, role: str) -> str:
    available_tools = {"get_marine_weather_forecast": get_marine_weather_forecast}

    async for chunk in call_agent(
        llm,
        prompt,
        role,
        SYSTEM_PROMPT,
        available_tools=available_tools,
        agent_name="meteorology_agent",
    ):
        print("From the meteorological agent")
        yield chunk
