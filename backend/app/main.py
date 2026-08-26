import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.mock_alerts import MOCK_ALERTS
from app.schemas import Alert

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
