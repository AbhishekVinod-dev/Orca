from fastapi import APIRouter
from services.agent_service import call_agent
from schema.chat_model import ChatRequest
from fastapi.responses import StreamingResponse

agent_router = APIRouter(prefix="/agent")


@agent_router.post("")
async def agent(request: ChatRequest):
    return StreamingResponse(call_agent(request.prompt), media_type="text/event-stream")
