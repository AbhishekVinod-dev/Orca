from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
from schema.chat_model import ChatRequest
import os
from services.agent_service import call_agent
from prompts.system_prompts import ORCHESTRATOR_SYSTEM_PROMPT

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

SYSTEM_PROMPT = ORCHESTRATOR_SYSTEM_PROMPT


async def call_orchestrator(user_data: ChatRequest):
    # result = await call_agent(
    #     llm, user_data.prompt, user_data.lang, user_data.role, SYSTEM_PROMPT
    # )
    async for chunk in call_agent(llm, user_data.prompt, user_data.role, SYSTEM_PROMPT):
        print("From orchestrator")
        yield chunk
