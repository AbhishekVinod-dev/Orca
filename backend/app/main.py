import asyncio
import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

load_dotenv()

from app.mock_alerts import MOCK_ALERTS
from app.open_meteo_client import fetch_conditions
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


async def _enrich_alert(record: dict) -> Alert:
    enriched = dict(record)
    try:
        conditions = await fetch_conditions(record["coordinates"][0], record["coordinates"][1])
        if "windSpeed" in record:
            enriched["windSpeed"] = round(conditions["wind_speed_kmh"])
        if "waveHeight" in record:
            enriched["waveHeight"] = round(conditions["wave_height_m"], 1)
    except Exception:
        pass  # demo-mode fallback: keep the static mock values
    return Alert.model_validate(enriched)


@app.get("/api/alerts")
async def get_alerts() -> list[Alert]:
    # TODO: swap title/description/severity/source for a real IMD-backed
    # client once API access is granted (see docs/MIGRATION_TRACKER.md Open
    # Blockers). windSpeed/waveHeight are already live via Open-Meteo, with
    # a per-alert fallback to demo-mode data if that call fails.
    return await asyncio.gather(*(_enrich_alert(record) for record in MOCK_ALERTS))


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
