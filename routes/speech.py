from fastapi import APIRouter, WebSocket

speech_router = APIRouter(prefix="/speech")


@speech_router.websocket("/ws")
async def speech_ws():
    return {"smth": "Hloo"}
