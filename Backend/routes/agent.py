from fastapi import APIRouter
from services.orchestrator import call_orchestrator
from schema.chat_model import ChatRequest
from fastapi.responses import StreamingResponse

agent_router = APIRouter(prefix="/agent")


@agent_router.post("")
async def agent(request: ChatRequest):
    return StreamingResponse(
        call_orchestrator(request),
        media_type="text/event-stream",
    )
