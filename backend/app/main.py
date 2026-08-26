import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

load_dotenv()

from app.mock_alerts import MOCK_ALERTS
from app.pipeline import stream_chat_pipeline
from app.schemas import Alert, ChatRequest, ChatResponse

app = FastAPI(title="ORCA Backend")

origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/alerts")
def get_alerts() -> list[Alert]:
    # TODO: swap for a real IMD-backed client once API access is granted
    # (see docs/MIGRATION_TRACKER.md Open Blockers). Demo-mode data until then.
    return [Alert.model_validate(record) for record in MOCK_ALERTS]


def _sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _chat_event_stream(query: str, language: str):
    for kind, payload in stream_chat_pipeline(query, language):
        if kind == "step":
            yield _sse_event("step", payload.model_dump(by_alias=True, mode="json"))
        else:
            yield _sse_event("final", payload.model_dump(by_alias=True, mode="json"))


@app.post("/api/chat")
def post_chat(payload: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _chat_event_stream(payload.query, payload.language),
        media_type="text/event-stream",
    )
