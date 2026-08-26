# FastAPI Skeleton (B3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a FastAPI service at `backend/` with Pydantic models that mirror the existing TS contracts (`Alert`, `AgentStep`, `ChatResponse`) field-for-field, unblocking B4 (`/api/alerts`) and B5 (`/api/chat`).

**Architecture:** A single FastAPI app (`app/main.py`) with CORS enabled, plus a `app/schemas.py` module holding the three Pydantic models. No business endpoints yet — this task only proves the models round-trip real mock data unchanged and the service boots.

**Tech Stack:** Python 3.12+, `uv` (dependency management, `[tool.uv] package = false` — this is an application, not a library), FastAPI, Pydantic v2, pytest.

## Global Constraints

- Backend lives at `backend/` inside this repo (monorepo) — not a separate repo.
- Wire format (JSON field names) must exactly match the TS contracts in [lib/mock/alertsData.ts](../../../lib/mock/alertsData.ts) and [lib/mock/chatResponses.ts](../../../lib/mock/chatResponses.ts) — those files are the source of truth, not any blanket casing assumption. In particular, `AgentStep.duration_ms` is already snake_case in the TS interface (not `durationMs`); it must NOT be run through a camelCase alias generator, or the round-trip test will fail.
- `issuedAt`/`expiresAt` (`Alert`) stay plain `str` fields — never parsed to `datetime`. Reformatting on serialize (e.g. `Z` → `+00:00`) would violate the byte-identical warning-passthrough requirement downstream (B7).
- Coordinates are `tuple[float, float]` representing `[lat, lng]`.
- Out of scope: `PFZZone` model (Phase 4), any real business endpoint beyond `/health` (B4/B5 build those).
- CORS origins come from a `CORS_ORIGINS` env var (comma-separated), defaulting to `http://localhost:3000`.

---

### Task 1: Project scaffold + health endpoint

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/.gitignore`
- Test: `backend/tests/test_main.py`

**Interfaces:**
- Produces: a FastAPI `app` instance importable as `from app.main import app`, with `GET /health` returning `{"status": "ok"}` and `GET /docs` returning 200.

- [ ] **Step 1: Create the project structure and `pyproject.toml`**

Create the directories `backend/app/` and `backend/tests/`.

Write `backend/pyproject.toml`:

```toml
[project]
name = "orca-backend"
version = "0.1.0"
description = "ORCA marine intelligence backend"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.32",
]

[dependency-groups]
dev = [
    "pytest>=8.3",
    "httpx>=0.27",
]

[tool.uv]
package = false
```

- [ ] **Step 2: Run `uv sync` to create the virtual environment and lockfile**

Run (from `backend/`): `uv sync`
Expected: creates `backend/.venv/` and `backend/uv.lock`; no errors.

- [ ] **Step 3: Write the failing test**

Write `backend/tests/__init__.py` (empty file).

Write `backend/tests/test_main.py`:

```python
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_docs_renders():
    response = client.get("/docs")
    assert response.status_code == 200
```

- [ ] **Step 4: Run the test to verify it fails**

Run (from `backend/`): `uv run pytest tests/test_main.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.main'` (or `'app'`), since `app/main.py` doesn't exist yet.

- [ ] **Step 5: Implement `app/main.py`**

Write `backend/app/__init__.py` (empty file).

Write `backend/app/main.py`:

```python
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
```

- [ ] **Step 6: Run the test to verify it passes**

Run (from `backend/`): `uv run pytest tests/test_main.py -v`
Expected: `2 passed`

- [ ] **Step 7: Add `.gitignore`**

Write `backend/.gitignore`:

```
.venv/
__pycache__/
*.pyc
.pytest_cache/
```

- [ ] **Step 8: Commit**

```bash
git add backend/pyproject.toml backend/uv.lock backend/app/__init__.py backend/app/main.py backend/tests/__init__.py backend/tests/test_main.py backend/.gitignore
git commit -m "feat(backend): scaffold FastAPI app with health check"
```

---

### Task 2: `Alert` schema

**Files:**
- Create: `backend/app/schemas.py`
- Test: `backend/tests/test_schemas.py`

**Interfaces:**
- Consumes: nothing from Task 1 directly (independent module), but the project scaffold (venv, pytest config) from Task 1 must exist to run tests.
- Produces: `Alert` Pydantic model in `app/schemas.py`, importable as `from app.schemas import Alert`. Wire format uses camelCase (`issuedAt`, `expiresAt`, `affectedZones`, `windSpeed`, `waveHeight`) via `alias_generator=to_camel` + `populate_by_name=True`. Later tasks (`AgentStep`, `ChatResponse`) are added to this same file.

- [ ] **Step 1: Write the failing test**

Write `backend/tests/test_schemas.py`:

```python
from app.schemas import Alert

ALT_001 = {
    "id": "ALT-001",
    "type": "cyclone",
    "severity": "critical",
    "title": "Cyclone Warning: Bay of Bengal",
    "description": "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. All fishing vessels advised to return to port immediately. Coastal communities in Tamil Nadu and Andhra Pradesh should prepare for evacuation.",
    "region": "Bay of Bengal (N)",
    "coordinates": [13.5, 82.1],
    "issuedAt": "2026-08-25T06:00:00Z",
    "expiresAt": "2026-08-27T06:00:00Z",
    "source": "IMD New Delhi",
    "affectedZones": ["Tamil Nadu Coast", "Andhra Pradesh Coast", "Puducherry"],
    "windSpeed": 120,
    "waveHeight": 8.5,
    "distance": 340,
}


def test_alert_round_trips_mock_record():
    alert = Alert.model_validate(ALT_001)
    assert alert.model_dump(by_alias=True, mode="json", exclude_unset=True) == ALT_001
```

- [ ] **Step 2: Run the test to verify it fails**

Run (from `backend/`): `uv run pytest tests/test_schemas.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.schemas'`, since `app/schemas.py` doesn't exist yet.

- [ ] **Step 3: Implement the `Alert` model**

Write `backend/app/schemas.py`:

```python
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

AlertType = Literal["cyclone", "lightning", "high-wave", "geofence", "fog", "wind"]
AlertSeverity = Literal["critical", "high", "moderate", "low"]


class Alert(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    type: AlertType
    severity: AlertSeverity
    title: str
    description: str
    region: str
    coordinates: tuple[float, float]  # [lat, lng]
    issued_at: str
    expires_at: str
    source: str
    affected_zones: list[str]
    wind_speed: Optional[float] = None
    wave_height: Optional[float] = None
    distance: Optional[float] = None
```

- [ ] **Step 4: Run the test to verify it passes**

Run (from `backend/`): `uv run pytest tests/test_schemas.py -v`
Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add backend/app/schemas.py backend/tests/test_schemas.py
git commit -m "feat(backend): add Alert schema"
```

---

### Task 3: `AgentStep` + `ChatResponse` schemas

**Files:**
- Modify: `backend/app/schemas.py` (append to the file from Task 2)
- Modify: `backend/tests/test_schemas.py` (append to the file from Task 2)

**Interfaces:**
- Consumes: nothing from `Alert` directly; appends to the same `app/schemas.py` file Task 2 created.
- Produces: `AgentStep`, `ChartDataPoint`, `RelatedData`, `ChatResponse` in `app/schemas.py`. `ChatResponse.agent_trace` is `list[AgentStep]`; `ChatResponse.related_data` is `Optional[RelatedData]`.

- [ ] **Step 1: Write the failing tests**

Append to `backend/tests/test_schemas.py`:

```python
from app.schemas import AgentStep, ChatResponse

DATA_AGENT_STEP = {
    "agent": "DataAgent",
    "status": "done",
    "action": "Pulling cyclone track data",
    "detail": "Retrieved IMD Best Track data + NHC vortex messages (last update: 1500 IST)",
    "duration_ms": 540,
    "sources": ["IMD Cyclone Warning Division", "RSMC New Delhi"],
}


def test_agent_step_round_trips_mock_record():
    step = AgentStep.model_validate(DATA_AGENT_STEP)
    assert step.model_dump(by_alias=True, mode="json", exclude_unset=True) == DATA_AGENT_STEP


R_003 = {
    "id": "R-003",
    "queryPatterns": ["cyclone", "storm", "hurricane", "michaung", "tropical"],
    "response": """🌀 **Cyclone MICHAUNG — Latest Update (1800 IST, Aug 25)**

**Current Position:** 13.5°N, 82.1°E (Bay of Bengal)
**Category:** Severe Cyclonic Storm
**Maximum Sustained Winds:** 120 km/h, gusts to 145 km/h
**Central Pressure:** 978 hPa
**Movement:** NNW at 12 km/h

**Predicted Track (IMD):**
- 24h: 15.2°N, 80.9°E — landfall near Bapatla, Andhra Pradesh likely
- 48h: Weakening over land (60 km/h)

**Danger Zones (Next 48 hrs):**
- 🔴 North Tamil Nadu coast (Chennai to Nellore)
- 🔴 Southern Andhra Pradesh (Ongole to Machilipatnam)
- 🟡 Odisha southern coast
- 🟡 Yanam, Puducherry

**Fishermen Alert:**
All fishing vessels currently at sea in Bay of Bengal must return to port **IMMEDIATELY**. Seek shelter. Do not attempt to outrun the storm.

**Evacuation Zones:** Coastal areas within 5 km of Bay of Bengal — contact District Disaster Management Authority.""",
    "agentTrace": [
        {"agent": "Planner", "status": "done", "action": "Intent classification", "detail": "Detected: CYCLONE_QUERY — high priority routing", "duration_ms": 88, "sources": []},
        {"agent": "DataAgent", "status": "done", "action": "Pulling cyclone track data", "detail": "Retrieved IMD Best Track data + NHC vortex messages (last update: 1500 IST)", "duration_ms": 540, "sources": ["IMD Cyclone Warning Division", "RSMC New Delhi"]},
        {"agent": "RiskAgent", "status": "done", "action": "Impact assessment", "detail": "Computed wind radii, storm surge height, coastal vulnerability index", "duration_ms": 410, "sources": ["NDMA Coastal Risk Atlas", "IMD Storm Surge Model"]},
        {"agent": "ResponseAgent", "status": "done", "action": "Emergency advisory generation", "detail": "Generated zone-specific safety advisories with evacuation guidance", "duration_ms": 200, "sources": []},
    ],
    "relatedData": {
        "alerts": ["ALT-001"],
        "coordinates": [13.5, 82.1],
    },
}


def test_chat_response_round_trips_mock_record():
    chat_response = ChatResponse.model_validate(R_003)
    assert chat_response.model_dump(by_alias=True, mode="json", exclude_unset=True) == R_003
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (from `backend/`): `uv run pytest tests/test_schemas.py -v`
Expected: FAIL — `ImportError: cannot import name 'AgentStep' from 'app.schemas'`.

- [ ] **Step 3: Implement `AgentStep`, `ChartDataPoint`, `RelatedData`, `ChatResponse`**

Append to `backend/app/schemas.py` (below the `Alert` class):

```python
class AgentStep(BaseModel):
    agent: Literal["Planner", "DataAgent", "RiskAgent", "ResponseAgent"]
    status: Literal["pending", "running", "done"]
    action: str
    detail: str
    duration_ms: int
    sources: Optional[list[str]] = None


class ChartDataPoint(BaseModel):
    label: str
    value: float


class RelatedData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    pfz_zones: Optional[list[str]] = None
    alerts: Optional[list[str]] = None
    coordinates: Optional[tuple[float, float]] = None
    chart_data: Optional[list[ChartDataPoint]] = None


class ChatResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    query_patterns: list[str]
    response: str
    agent_trace: list[AgentStep]
    related_data: Optional[RelatedData] = None
```

Note: `AgentStep` intentionally has no `alias_generator` — every field name already matches the wire format exactly (`duration_ms` is snake_case in the TS source too), so aliasing it would break the round-trip test.

- [ ] **Step 4: Run the tests to verify they pass**

Run (from `backend/`): `uv run pytest tests/test_schemas.py -v`
Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add backend/app/schemas.py backend/tests/test_schemas.py
git commit -m "feat(backend): add AgentStep and ChatResponse schemas"
```
