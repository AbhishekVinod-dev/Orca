import asyncio
import json
import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

load_dotenv()

from app.argo_data import ARGO_ZONES
from app.gdacs_client import fetch_active_cyclones
from app.mock_alerts import MOCK_ALERTS
from app.open_meteo_client import fetch_conditions
from app.pipeline import stream_chat_pipeline
from app.schemas import Alert, ChatRequest, ChatResponse, PFZZone

app = FastAPI(title="ORCA Backend")
logger = logging.getLogger(__name__)

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
        if conditions.get("observed_at"):
            enriched["conditionsObservedAt"] = conditions["observed_at"]
        if enriched.get("dataStatus") == "demo":
            enriched["dataStatus"] = "mixed"
    except Exception:
        pass  # demo-mode fallback: keep the static mock values
    return Alert.model_validate(enriched)


def _demo_alert(record: dict) -> dict:
    """Prevent local demo records from impersonating official warnings."""
    alert = dict(record)
    alert["title"] = f"DEMO ONLY: {alert['title']}"
    alert["description"] = (
        "Synthetic demonstration data, not a current official warning. Do not make navigation "
        f"or departure decisions from this record. Original demo text: {alert['description']}"
    )
    alert["source"] = "ORCA demo data (not an official warning)"
    alert["dataStatus"] = "demo"
    return alert


@app.get("/api/alerts")
async def get_alerts() -> list[Alert]:
    # IMD is still blocked (see docs/MIGRATION_TRACKER.md Open Blockers), so
    # cyclone alerts come from GDACS (real, keyless) when it reports an
    # active cyclone affecting India; otherwise the mock cyclone entry is
    # kept as the demo-mode fallback. windSpeed/waveHeight are live via
    # Open-Meteo, with the same per-alert fallback pattern.
    records = [_demo_alert(record) for record in MOCK_ALERTS]
    try:
        live_cyclones = await fetch_active_cyclones()
    except Exception:
        live_cyclones = []
    if live_cyclones:
        records = [r for r in records if r["type"] != "cyclone"] + [
            {**record, "dataStatus": "live"} for record in live_cyclones
        ]
    return await asyncio.gather(*(_enrich_alert(record) for record in records))


def _distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    from math import atan2, cos, radians, sin, sqrt

    r = 6371
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return r * 2 * atan2(sqrt(a), sqrt(1 - a))


@app.get("/api/pfz")
def get_pfz_zones(
    lat: float | None = Query(default=None, ge=-90, le=90),
    lng: float | None = Query(default=None, ge=-180, le=180),
    radius: float = Query(default=2000, gt=0, le=3000),
) -> list[PFZZone]:
    # Real ARGO float SST data (Arabian Sea + Bay of Bengal). Chlorophyll is
    # a static reference range, not observed -- see app/argo_data.py. No
    # live chlorophyll source is wired up yet (needs MODIS/Sentinel-3).
    if (lat is None) != (lng is None):
        raise HTTPException(status_code=422, detail="lat and lng must be provided together")
    zones = ARGO_ZONES
    if lat is not None and lng is not None:
        zones = [z for z in zones if _distance_km(lat, lng, z["centroid"][0], z["centroid"][1]) <= radius]
    return [PFZZone.model_validate(z) for z in zones]


def _sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _chat_event_stream(query: str, language: str):
    try:
        for kind, payload in stream_chat_pipeline(query, language):
            if kind == "step":
                yield _sse_event("step", payload.model_dump(by_alias=True, mode="json"))
            else:
                yield _sse_event("final", payload.model_dump(by_alias=True, mode="json"))
    except Exception:
        logger.warning("Chat upstream failed")
        yield _sse_event("error", {
            "code": "upstream_unavailable",
            "message": "The advisory service is temporarily unavailable. Please try again later.",
        })


@app.post("/api/chat")
def post_chat(payload: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _chat_event_stream(payload.query, payload.language),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
