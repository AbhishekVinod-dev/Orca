# FastAPI Skeleton (B3) — Design

Companion to [orca-backend.prd.md](../../../.claude/PRPs/prds/orca-backend.prd.md) and [MIGRATION_TRACKER.md](../../MIGRATION_TRACKER.md), task **B3**. This is the first backend task — no dependencies, unblocks B4 (`/api/alerts`) and B5 (`/api/chat`).

## Goal

A running FastAPI service with Pydantic models that mirror the existing TS contracts (`Alert`, `AgentStep`, `ChatResponse`) field-for-field, so B4/B5 can build real endpoints against a verified schema instead of guessing types later.

## Scope

**In scope:**
- `backend/` directory in this repo (monorepo), managed with `uv`
- `Alert`, `AgentStep`, `ChatResponse` Pydantic models
- FastAPI app with CORS (Vercel origin + `localhost:3000`), `/docs`, `/health`
- One round-trip test per model against a copy-pasted real mock record

**Out of scope (later tasks):**
- `PFZZone` model — Phase 4, not built yet
- Any real endpoint logic (`/api/alerts`, `/api/chat`) — B4/B5
- Groq, IMD, Neon, or any external integration

## Structure

```
backend/
├── pyproject.toml       # uv-managed, Python 3.12+, deps: fastapi, uvicorn[standard]
├── app/
│   ├── main.py            # FastAPI() instance, CORS, /health
│   └── schemas.py         # Alert, AgentStep, ChatResponse
├── tests/
│   └── test_schemas.py    # round-trip check (see Verification)
└── .gitignore              # .venv/, __pycache__/
```

## Model design

- **camelCase wire format**: Pydantic v2 `alias_generator=to_camel`, `populate_by_name=True`. Python attributes stay snake_case; serialized JSON matches the TS contract exactly (`waveHeight`, `issuedAt`, `agentTrace`, etc.).
- **`Literal` types, not `Enum`**: mirrors the TS string unions (`AlertType`, `AlertSeverity`, `AgentStep.agent`, `AgentStep.status`) with less code.
- **Timestamps stay `str`**: `issuedAt`/`expiresAt` are kept as plain strings, not parsed to `datetime`. Parsing and re-serializing risks turning `"2026-08-25T06:00:00Z"` into `"2026-08-25T06:00:00+00:00"`, which would violate the contract-parity gate's byte-identical requirement for official warning passthrough (B7).
- **Coordinate tuples**: `Tuple[float, float]` for `Alert.coordinates` ([lat, lng] per the contract-parity gate's coordinate-order note) and `ChatResponse.relatedData.coordinates`.

Field source of truth: [alertsData.ts:7](../../../lib/mock/alertsData.ts#L7) (`Alert`), [chatResponses.ts:5](../../../lib/mock/chatResponses.ts#L5) (`AgentStep`), [chatResponses.ts:14](../../../lib/mock/chatResponses.ts#L14) (`ChatResponse`).

## Verification

Matches the tracker's own B3 acceptance criteria:
- `uvicorn app.main:app` starts; `/docs` renders with all three models visible in the schema
- `tests/test_schemas.py` copy-pastes one real record per model (e.g. `ALT-001` from `alertsData.ts`, `R-003` from `chatResponses.ts` — it has `coordinates` set) and asserts the model round-trips it unchanged: `Model.model_validate(record).model_dump(by_alias=True) == record`

No frontend changes. No new dependencies beyond `fastapi`, `uvicorn[standard]`, and `pytest` (dev).
