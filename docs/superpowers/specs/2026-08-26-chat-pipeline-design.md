# B5: POST /api/chat — Groq 2-Call Pipeline — Design

Companion to [orca-backend.prd.md](../../../.claude/PRPs/prds/orca-backend.prd.md) and [MIGRATION_TRACKER.md](../../MIGRATION_TRACKER.md), task **B5**. Depends on B3 (done) and B4 (done, demo-mode). Does not include B6 (SSE streaming) or I2 (caching) — those are separate tasks.

## Goal

`POST /api/chat` returns a full `ChatResponse` (matching the existing Pydantic model) produced by a 4-stage pipeline where only 2 stages call an LLM, per the PRD's token-budget constraint (Groq's 6,000 TPM ceiling).

## Architecture

```
POST /api/chat  {query, lat?, lng?, language}
  │
  ├─ Planner (LLM 1, gpt-oss-120b)
  │    → classifies intent (PFZ / SAFETY / CYCLONE / OCEANOGRAPHY / GENERAL)
  │    → malformed JSON response falls back to intent "GENERAL", does not fail the request
  │
  ├─ DataAgent (no LLM, pure function)
  │    → returns MOCK_ALERTS (same fixture B4 serves); real IMD client swaps in later
  │      behind the same function signature
  │
  ├─ RiskAgent (no LLM, deterministic)
  │    → max severity score across matched alerts (critical=100/high=70/moderate=40/low=15)
  │    → 0 if no alerts matched
  │
  └─ ResponseAgent (LLM 2, gpt-oss-20b)
       → generates advisory prose ONLY — the prompt never includes alert text to reproduce
       → code (not the LLM) appends matched alerts' title/description verbatim as a
         separate block after the LLM's prose

Returns ChatResponse: {id, queryPatterns: [], response, agentTrace: [4 AgentStep], relatedData: {alerts: [...ids]}}
```

## The safety-critical decision

The LLM never generates warning text. This is the one requirement in this task that must not be relaxed — the PRD flags LLM-paraphrased safety warnings as a Critical risk ("hallucinates a safety advisory"). `ResponseAgent`'s prompt produces advisory framing only; official warning text is concatenated by plain Python string logic from the real `Alert.title`/`Alert.description` fields, never regenerated. This makes byte-identical passthrough structural, not a prompt instruction an LLM could still violate.

## Components

- **`app/groq_client.py`** — thin wrapper around the official `groq` Python SDK (OpenAI-compatible). One function per model call, both taking a prompt and returning parsed text/JSON.
- **`app/pipeline.py`** — `data_agent()`, `risk_agent()`, and `run_chat_pipeline()` (orchestrates all 4 stages, builds `ChatResponse` with real `duration_ms` per stage via `time.perf_counter()`).
- **`app/main.py`** — adds `POST /api/chat` accepting `{query, lat, lng, language}`, calling `run_chat_pipeline()`.

## Out of scope

SSE streaming (B6), response caching (I2), IMD-backed DataAgent (waits on B1/B2), retry/fallback on Groq failure (I6), Qwen model (rejected — preview-only on Groq, see Decisions Log).

## Error handling

- Planner JSON parse failure → fall back to `intent: "GENERAL"`, pipeline continues
- Groq call failure (either LLM) → propagates as a 500; graceful demo-mode fallback is I6's separate scope
- No alerts matched → RiskAgent returns 0, ResponseAgent still responds, no "Official Warnings" block appended

## Testing plan

- `data_agent()`, `risk_agent()` — pure functions, direct unit tests, no mocking
- Planner JSON-parse fallback — malformed JSON input → asserts `intent == "GENERAL"`
- `POST /api/chat` integration test — mocks the Groq client (no real API calls in the automated suite — slow, flaky, burns TPM budget), asserts response matches `ChatResponse` shape and that a known alert's `description` appears byte-identical in `response` when RiskAgent matches it
- Real-model behavior (prompt quality, actual Groq latency) is a manual check run once locally with the real key — not part of the automated suite
