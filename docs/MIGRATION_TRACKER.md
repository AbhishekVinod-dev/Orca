# ORCA Backend Migration Tracker

Last updated: 2026-09-05

## Active Backend

`backend/app/main.py` is the supported ORCA API. Start it from `backend/` with
`uv run uvicorn app.main:app --host 127.0.0.1 --port 8000` after creating a
Python 3.11+ environment and setting `GROQ_API_KEY`.

The root `main.py` legacy API is not supported for deployment. It has a
different route contract and its speech, INCOIS, and PostGIS integrations must
be migrated behind the active backend before being re-enabled.

## Progress

| Area | Status | Evidence |
| --- | --- | --- |
| One supported backend contract | In progress | Current API is documented as active; legacy API is not yet removed. |
| Startup compatibility | Complete | `backend/pyproject.toml` supports Python 3.11+, matching the verified environment. |
| Chat input validation | Complete | Empty prompts, unsupported languages, invalid coordinate ranges, and partial coordinates return `422`. |
| SSE error contract | Complete | `step`, `final`, and safe `error` events are JSON SSE records; responses disable buffering. |
| Demo-data disclosure | Complete | Demo alerts are labeled and excluded from chat safety reasoning. Frontend no longer simulates live intelligence. |
| Live cyclone source | Partial | GDACS is wired and marked live, but it is not an IMD substitute. |
| Current weather/wave source | Partial | Open-Meteo data is timestamped when available, but it does not validate a warning. |
| PFZ | Partial | Historical ARGO output has explicit limitations; live INCOIS/satellite PFZ is not implemented. |
| EEZ/PostGIS | Not started | Legacy-only implementation must be migrated with a read-only database role. |
| Speech-to-text | Not started | Legacy-only Sarvam integration requires file limits, MIME validation, and migration. |
| Translation | Not started | Current LLM language selection is constrained, but safety translation needs vetted sources. |
| Authentication/rate limiting | Not started | Required before public deployment. |
| Production E2E coverage | In progress | Current backend has unit/API tests; provider, database, speech, and browser E2E tests are missing. |

## Release Gates

- Do not present demo or historical data as live marine safety information.
- Do not issue a go/no-go departure recommendation without current official warning data.
- Add bounded retries, timeouts, rate limiting, and telemetry before public exposure.
- Use a read-only PostGIS role and integration tests before exposing EEZ lookups.
- Add real-source timestamp, URL, uncertainty, and limitation fields to every operational data product.

## Next Milestone

Migrate EEZ and speech behind `backend/app/main.py`, add their request limits and
integration tests, then replace the PFZ historical-data endpoint with an
officially licensed/current source.
