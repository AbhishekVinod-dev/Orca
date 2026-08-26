# B5: POST /api/chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `POST /api/chat` returns a full `ChatResponse` via a 4-stage pipeline (Planner LLM → DataAgent → RiskAgent → ResponseAgent LLM), with official alert text passed through byte-identical, never LLM-paraphrased.

**Architecture:** `app/groq_client.py` wraps the two LLM calls (Planner, ResponseAgent) behind plain functions. `app/pipeline.py` orchestrates all 4 stages and builds the `ChatResponse`; `data_agent`/`risk_agent` are pure, LLM-free functions. `app/main.py` adds the endpoint.

**Tech Stack:** Same as B3/B4 (FastAPI, Pydantic v2, uv, pytest) plus the official `groq` Python SDK.

## Global Constraints

- **Safety-critical, non-negotiable:** the LLM never generates official warning text. `generate_advisory()`'s prompt must not include alert title/description text for the model to reproduce. The pipeline appends real `Alert` field values as plain string concatenation, after the LLM call returns.
- DataAgent returns `MOCK_ALERTS` only when intent is `"SAFETY"` or `"CYCLONE"`; all other intents get `[]`. (Corrects the design doc's initial "always return all alerts" — see [chat-pipeline-design.md](../specs/2026-08-26-chat-pipeline-design.md).)
- No SSE streaming (B6), no caching (I2), no real IMD client (waits on B1/B2), no Qwen model (rejected, preview-only on Groq) — all out of scope for this plan.
- No automated test makes a real Groq API call — all Groq interaction is mocked in tests via `unittest.mock.patch`, patched at the point of use (`app.pipeline.classify_intent`/`app.pipeline.generate_advisory` for pipeline tests, `app.groq_client._get_client` for groq_client's own tests).
- Models: `openai/gpt-oss-120b` (Planner), `openai/gpt-oss-20b` (ResponseAgent) — both via Groq.
- Groq API key read from `GROQ_API_KEY` env var (already in `backend/.env`, gitignored).

---

### Task 1: Groq client wrapper

**Files:**
- Create: `backend/app/groq_client.py`
- Test: `backend/tests/test_groq_client.py`
- Modify: `backend/pyproject.toml` (add `groq` dependency)

**Interfaces:**
- Produces: `classify_intent(query: str) -> str` (returns one of `"PFZ"`, `"SAFETY"`, `"CYCLONE"`, `"OCEANOGRAPHY"`, `"GENERAL"`, falling back to `"GENERAL"` on any parse failure) and `generate_advisory(query: str, intent: str, risk_score: int, language: str) -> str` (returns stripped LLM prose, never including alert-specific text). Also `_get_client() -> Groq`, a lazy singleton — Task 2 does not call this directly, but tests patch it.

- [ ] **Step 1: Add the `groq` dependency**

Edit `backend/pyproject.toml` — add `"groq>=0.11"` to the `dependencies` list (alongside `fastapi`, `uvicorn[standard]`), so it reads:

```toml
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.32",
    "groq>=0.11",
]
```

Run (from `backend/`): `uv sync`
Expected: installs `groq` and its dependencies; no errors.

- [ ] **Step 2: Write the failing tests**

Write `backend/tests/test_groq_client.py`:

```python
from unittest.mock import MagicMock, patch


def _fake_completion(content: str):
    message = MagicMock()
    message.content = content
    choice = MagicMock()
    choice.message = message
    completion = MagicMock()
    completion.choices = [choice]
    return completion


@patch("app.groq_client._get_client")
def test_classify_intent_parses_valid_json(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion('{"intent": "CYCLONE"}')
    mock_get_client.return_value = mock_client

    assert classify_intent("Is the cyclone dangerous?") == "CYCLONE"


@patch("app.groq_client._get_client")
def test_classify_intent_falls_back_to_general_on_malformed_json(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion("not json")
    mock_get_client.return_value = mock_client

    assert classify_intent("anything") == "GENERAL"


@patch("app.groq_client._get_client")
def test_classify_intent_falls_back_to_general_on_unknown_intent_value(mock_get_client):
    from app.groq_client import classify_intent

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion('{"intent": "NOT_A_REAL_INTENT"}')
    mock_get_client.return_value = mock_client

    assert classify_intent("anything") == "GENERAL"


@patch("app.groq_client._get_client")
def test_generate_advisory_returns_stripped_content(mock_get_client):
    from app.groq_client import generate_advisory

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _fake_completion("  Stay safe out there.  ")
    mock_get_client.return_value = mock_client

    result = generate_advisory("is it safe", "SAFETY", 70, "en")

    assert result == "Stay safe out there."
```

- [ ] **Step 3: Run the tests to verify they fail**

Run (from `backend/`): `uv run pytest tests/test_groq_client.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.groq_client'`.

- [ ] **Step 4: Implement `app/groq_client.py`**

```python
import json
import os

from groq import Groq

PLANNER_MODEL = "openai/gpt-oss-120b"
RESPONSE_MODEL = "openai/gpt-oss-20b"

VALID_INTENTS = {"PFZ", "SAFETY", "CYCLONE", "OCEANOGRAPHY", "GENERAL"}

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    return _client


def classify_intent(query: str) -> str:
    completion = _get_client().chat.completions.create(
        model=PLANNER_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the user's marine-safety query into exactly one intent. "
                    'Respond with ONLY a JSON object: {"intent": "<INTENT>"} where '
                    "<INTENT> is one of PFZ, SAFETY, CYCLONE, OCEANOGRAPHY, GENERAL."
                ),
            },
            {"role": "user", "content": query},
        ],
    )
    content = completion.choices[0].message.content
    try:
        parsed = json.loads(content)
        intent = parsed.get("intent")
        if intent in VALID_INTENTS:
            return intent
    except (json.JSONDecodeError, AttributeError, TypeError):
        pass
    return "GENERAL"


def generate_advisory(query: str, intent: str, risk_score: int, language: str) -> str:
    completion = _get_client().chat.completions.create(
        model=RESPONSE_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are ORCA, a marine safety assistant for Indian coastal fishermen. "
                    "Write a short, plain-language advisory paragraph responding to the "
                    "user's query, in the language specified. Base your tone on the risk "
                    "score (0-100, higher is more dangerous). Do NOT invent specific wind "
                    "speeds, wave heights, or warning text -- official warnings are appended "
                    "separately after your response. Do not repeat or reference specific "
                    "numeric values you were not given."
                ),
            },
            {
                "role": "user",
                "content": f"Query: {query}\nIntent: {intent}\nRisk score: {risk_score}\nRespond in: {language}",
            },
        ],
    )
    return completion.choices[0].message.content.strip()
```

- [ ] **Step 5: Run the tests to verify they pass**

Run (from `backend/`): `uv run pytest tests/test_groq_client.py -v`
Expected: `4 passed`

- [ ] **Step 6: Commit**

```bash
git add backend/pyproject.toml backend/uv.lock backend/app/groq_client.py backend/tests/test_groq_client.py
git commit -m "feat(backend): add Groq client wrapper for Planner/ResponseAgent"
```

---

### Task 2: Pipeline orchestration + `POST /api/chat`

**Files:**
- Create: `backend/app/pipeline.py`
- Modify: `backend/app/schemas.py` (add `ChatRequest`)
- Modify: `backend/app/main.py` (add `POST /api/chat`)
- Test: `backend/tests/test_pipeline.py`

**Interfaces:**
- Consumes: `classify_intent`, `generate_advisory` from `app.groq_client` (Task 1); `MOCK_ALERTS` from `app.mock_alerts` (already exists); `AgentStep`, `Alert`, `ChatResponse` from `app.schemas` (already exist).
- Produces: `data_agent(intent: str) -> list[dict]`, `risk_agent(alerts: list[dict]) -> int`, `run_chat_pipeline(query: str, language: str = "en") -> ChatResponse`. `ChatRequest` Pydantic model (fields: `query: str`, `lat: Optional[float] = None`, `lng: Optional[float] = None`, `language: str = "en"`).

- [ ] **Step 1: Write the failing tests**

Write `backend/tests/test_pipeline.py`:

```python
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.pipeline import data_agent, risk_agent

client = TestClient(app)


def test_data_agent_returns_alerts_for_hazard_intents():
    assert len(data_agent("SAFETY")) == 7
    assert len(data_agent("CYCLONE")) == 7


def test_data_agent_returns_empty_for_non_hazard_intents():
    assert data_agent("PFZ") == []
    assert data_agent("OCEANOGRAPHY") == []
    assert data_agent("GENERAL") == []


def test_risk_agent_returns_zero_for_no_alerts():
    assert risk_agent([]) == 0


def test_risk_agent_returns_max_severity_score():
    alerts = [{"severity": "moderate"}, {"severity": "critical"}, {"severity": "low"}]
    assert risk_agent(alerts) == 100


@patch("app.pipeline.generate_advisory", return_value="Conditions are dangerous today.")
@patch("app.pipeline.classify_intent", return_value="CYCLONE")
def test_post_chat_returns_chat_response_with_verbatim_warning(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "is the cyclone dangerous", "language": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["response"].startswith("Conditions are dangerous today.")
    assert (
        "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. "
        "All fishing vessels advised to return to port immediately. Coastal communities in Tamil "
        "Nadu and Andhra Pradesh should prepare for evacuation."
    ) in body["response"]
    assert len(body["agentTrace"]) == 4
    assert body["agentTrace"][0]["agent"] == "Planner"
    assert body["agentTrace"][1]["agent"] == "DataAgent"
    assert body["agentTrace"][2]["agent"] == "RiskAgent"
    assert body["agentTrace"][3]["agent"] == "ResponseAgent"
    assert body["relatedData"]["alerts"] == [
        "ALT-001", "ALT-002", "ALT-003", "ALT-004", "ALT-005", "ALT-006", "ALT-007"
    ]


@patch("app.pipeline.generate_advisory", return_value="Here are some good fishing zones.")
@patch("app.pipeline.classify_intent", return_value="PFZ")
def test_post_chat_omits_warnings_for_non_hazard_intent(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "where should I fish", "language": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["response"] == "Here are some good fishing zones."
    assert body["relatedData"] is None
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (from `backend/`): `uv run pytest tests/test_pipeline.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.pipeline'`.

- [ ] **Step 3: Add `ChatRequest` to `app/schemas.py`**

Append to `backend/app/schemas.py` (at the end of the file):

```python
class ChatRequest(BaseModel):
    query: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    language: str = "en"
```

- [ ] **Step 4: Implement `app/pipeline.py`**

```python
import time

from app.groq_client import classify_intent, generate_advisory
from app.mock_alerts import MOCK_ALERTS
from app.schemas import AgentStep, ChatResponse

SEVERITY_SCORE = {"critical": 100, "high": 70, "moderate": 40, "low": 15}
HAZARD_INTENTS = {"SAFETY", "CYCLONE"}


def data_agent(intent: str) -> list[dict]:
    if intent not in HAZARD_INTENTS:
        return []
    return MOCK_ALERTS


def risk_agent(alerts: list[dict]) -> int:
    if not alerts:
        return 0
    return max(SEVERITY_SCORE[a["severity"]] for a in alerts)


def run_chat_pipeline(query: str, language: str = "en") -> ChatResponse:
    steps: list[AgentStep] = []

    start = time.perf_counter()
    intent = classify_intent(query)
    steps.append(AgentStep(
        agent="Planner",
        status="done",
        action="Intent classification",
        detail=f"Detected: {intent}",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    ))

    start = time.perf_counter()
    alerts = data_agent(intent)
    steps.append(AgentStep(
        agent="DataAgent",
        status="done",
        action="Fetching alerts",
        detail=f"Retrieved {len(alerts)} active alert(s)",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=["Demo-mode mock data"],
    ))

    start = time.perf_counter()
    risk_score = risk_agent(alerts)
    steps.append(AgentStep(
        agent="RiskAgent",
        status="done",
        action="Risk scoring",
        detail=f"Composite risk score: {risk_score}",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    ))

    start = time.perf_counter()
    advisory = generate_advisory(query, intent, risk_score, language)
    response_text = advisory
    if alerts:
        warnings_block = "\n\n".join(f"**{a['title']}**\n{a['description']}" for a in alerts)
        response_text = f"{advisory}\n\n---\n\n**Official Warnings:**\n\n{warnings_block}"
    steps.append(AgentStep(
        agent="ResponseAgent",
        status="done",
        action="Generating response",
        detail="Synthesized advisory with official warnings appended verbatim",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    ))

    return ChatResponse(
        id=f"chat-{int(time.time() * 1000)}",
        query_patterns=[],
        response=response_text,
        agent_trace=steps,
        related_data={"alerts": [a["id"] for a in alerts]} if alerts else None,
    )
```

- [ ] **Step 5: Add `POST /api/chat` to `app/main.py`**

Edit `backend/app/main.py` — update the imports at the top:

```python
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.mock_alerts import MOCK_ALERTS
from app.pipeline import run_chat_pipeline
from app.schemas import Alert, ChatRequest, ChatResponse
```

Add this endpoint after `get_alerts`:

```python
@app.post("/api/chat")
def post_chat(payload: ChatRequest) -> ChatResponse:
    return run_chat_pipeline(payload.query, payload.language)
```

- [ ] **Step 6: Run the tests to verify they pass**

Run (from `backend/`): `uv run pytest tests/test_pipeline.py -v`
Expected: `6 passed`

Then run the full suite: `uv run pytest -v`
Expected: all tests pass (17 total: 3 from test_main.py, 4 from test_schemas.py, 4 from test_groq_client.py, 6 from test_pipeline.py).

- [ ] **Step 7: Commit**

```bash
git add backend/app/pipeline.py backend/app/schemas.py backend/app/main.py backend/tests/test_pipeline.py
git commit -m "feat(backend): add chat pipeline orchestration and POST /api/chat"
```
