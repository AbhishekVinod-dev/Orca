# ORCA — Mock → Live Migration Tracker

Companion to [orca-backend.prd.md](../.claude/PRPs/prds/orca-backend.prd.md). Covers **Phase 1 (Live Demo Slice)** and **Phase 2 (Persistence & Ingestion)**.

**Deadline: Thursday 27 Aug 2026.** Phase 1 is a ~24-hour sprint. Phase 2 begins after the deadline.

**How to use**: update `Status` and `Owner` in place. Status values: `todo` · `wip` · `blocked` · `done`.

**Roles** (6 people, mixed skill): `BE1` `BE2` = backend-capable · `INFRA` = cache/deploy · `FE1` `FE2` = frontend · `QA` = demo script + pitch.

---

## Migration Inventory

Every mock function in the codebase, its target endpoint, and which phase retires it. **Nothing here gets deleted** — all of it survives as the demo-mode fallback.

| # | Mock export | Location | Target endpoint | Phase | Status |
|---|---|---|---|---|---|
| M1 | `getMockResponse()` | [chatResponses.ts:212](../lib/mock/chatResponses.ts#L212) | `POST /api/chat` (SSE) | **1** | todo |
| M2 | `fetchAlerts()` | [alertsData.ts:133](../lib/mock/alertsData.ts#L133) | `GET /api/alerts` | **1** | todo |
| M3 | `fetchAlertsByRegion()` | [alertsData.ts:139](../lib/mock/alertsData.ts#L139) | `GET /api/alerts?region=` | **1** | todo |
| M4 | `fetchPFZZones()` | [pfzData.ts:110](../lib/mock/pfzData.ts#L110) | `GET /api/pfz?lat=&lng=&radius=` | 4 | deferred |
| M5 | `fetchAllPFZZones()` | [pfzData.ts:116](../lib/mock/pfzData.ts#L116) | `GET /api/pfz` | 4 | deferred |
| M6 | `fetchSSTData()` | [oceanLayerData.ts:142](../lib/mock/oceanLayerData.ts#L142) | `GET /api/layers/sst` | 4 | deferred |
| M7 | `fetchChlorophyllData()` | [oceanLayerData.ts:148](../lib/mock/oceanLayerData.ts#L148) | `GET /api/layers/chlorophyll` | 4 | deferred |
| M8 | `fetchRoutes()` | [oceanLayerData.ts:154](../lib/mock/oceanLayerData.ts#L154) | `POST /api/routes` | 5 | deferred |
| M9 | `fetchGeofences()` | [oceanLayerData.ts:160](../lib/mock/oceanLayerData.ts#L160) | `GET /api/geofences` | 5 | deferred |
| M10 | `reverseGeocode()` | [useGeolocation.ts:8](../lib/geo/useGeolocation.ts#L8) | — audit whether already real | 2 | todo |

**Phase 1 migrates 3 of 10.** Everything marked `deferred` keeps serving mock data and **must be labelled "sample data" in the UI** (task F4). Shipping unlabelled fake data in a safety product is the one unacceptable outcome.

---

## Phase 1 — Live Demo Slice (Wed 26 → Thu 27 Aug)

### Critical path & risk ordering

The PRD says resolve IMD paths first because they gate everything. With one day, run the two integrations **in parallel instead** — they're independent until wiring:

- **Groq/chat has zero external unknowns.** The API is verified, models confirmed production. It *will* work. This is the guaranteed win.
- **IMD has one unresolved unknown** (exact endpoint paths, possible IP whitelisting). It's the higher-value demo but the riskier one.

Working them in parallel means a failure on the IMD side doesn't cost you the chat pipeline too.

### Hard decision point — **T+4h**

If IMD endpoint paths are not resolved and returning parseable data by T+4h, **stop and fall back**: ship chat-only against mock alerts, and re-scope the demo narrative to the conversational interface. Do not spend the back half of the day debugging a government API.

| Gate | Condition | Action |
|---|---|---|
| **GO** | IMD returns parseable cyclone/marine JSON by T+4h | Continue full Phase 1 (B3, B4) |
| **NO-GO** | Still unresolved at T+4h | Drop M2/M3 to Phase 2. Chat pipeline reads mock alerts. Demo narrative pivots to the interface. |

### Backend track

| ID | Task | Owner | Depends | Status | Verification |
|---|---|---|---|---|---|
| B1 | Read `api.imd.gov.in/public/api_reference.html`; extract exact paths + response schemas for Cyclone Track, Cyclone Wind Warning, marine/coastal bulletins | BE1 | — | wip | Paths extracted (see below); curl against all 6 candidate endpoints returns `401 {"error":"API key missing"}` — blocked on developer account registration, in progress |
| B2 | Confirm IMD needs no IP whitelisting **from Render's egress**, not just from a laptop | BE1 | B1 | todo | Same curl succeeds from a deployed test endpoint |
| B3 | FastAPI skeleton + Pydantic models mirroring `Alert`, `AgentStep`, `ChatResponse` field-for-field | BE2 | — | done | `/docs` renders; a model round-trips a copy-pasted mock record unchanged — done on branch `backend/b3-fastapi-skeleton`, not yet merged to main |
| B4 | `GET /api/alerts` — map IMD payload → `Alert` shape (incl. `source`, `issuedAt`, `expiresAt`, `[lat,lng]` order) | BE1 | B1, B3 | wip | Response validates against the TS `Alert` interface — done against demo-mode mock data (commit `efd3fc1`), swap to real IMD client pending B1/B2 |
| B5 | `POST /api/chat` — 2-call pipeline: `gpt-oss-120b` Planner → DB/mock fetch → deterministic risk score → `gpt-oss-20b` ResponseAgent | BE2 | B3 | done | Returns a full `ChatResponse` incl. 4-element `agentTrace` — verified against real Groq API (commits `e8c7d9b`, `099f7c8`, `07c6b2e`), ~3.3s for both LLM calls, verbatim warning passthrough confirmed live |
| B6 | SSE streaming + emit `AgentStep` events per stage | BE2 | B5 | todo | `AgentPipeline.tsx` animates against real timings, unmodified |
| B7 | **Official warning passthrough** — IMD text, source ID, issuing authority rendered verbatim, never LLM-paraphrased | BE1 | B4, B5 | todo | Diff rendered warning text against the raw IMD payload — must be byte-identical |
| B8 | **Measure real tokens/query** and record it in [TECH_STACK.md](../TECH_STACK.md) throughput section | BE2 | B5 | todo | An actual number replaces the 3–5K estimate |

**B1 extracted endpoints (2026-08-26)** — from `api_reference.html`, unauthenticated so far; schemas below are as documented, not yet verified against a real authenticated response:

| Endpoint | Purpose | Params | Response |
|---|---|---|---|
| `GET /api/v1/cyclone_track` | Observed + forecast cyclone positions | none | JSON: lat/lng, wind speed ranges, category |
| `GET /api/v1/cyclone_wind` | Wind warning zones | none | GeoJSON MultiPolygon, 27/34/50/64kt thresholds |
| `GET /api/v1/cyclone_cou` | Cone of uncertainty | none | GeoJSON MultiPolygon |
| `GET /api/v1/portwarning` | Port warnings | `id` (optional) | JSON: port name, issuing authority, date, text |
| `GET /api/v1/seabulletin` | Sea area forecasts | `id` (optional) | JSON array: wind, weather, visibility, sea condition |
| `GET /api/v1/coastalbulletin` | Coastal conditions/port signals | none | JSON array |

All 6 base at `https://api.imd.gov.in`. All confirmed via curl to require an API key (`401 {"error":"API key missing"}`) — see Open Blockers.

### Infra track

| ID | Task | Owner | Depends | Status | Verification |
|---|---|---|---|---|---|
| I1 | Groq API key provisioned, stored as env/secret (never committed) | INFRA | — | todo | Secret scan of git history returns nothing |
| I2 | Cache on `(normalised_query, language, date)` — in-memory is acceptable for Phase 1; Upstash if time allows | INFRA | B5 | todo | Second identical query returns with zero Groq calls |
| I3 | **Pre-warm cache with the exact demo script questions** | INFRA, QA | I2 | todo | Every scripted question is a cache hit before judging starts |
| I4 | Deploy to Render; CORS allows the Vercel origin | INFRA | B3 | todo | Frontend calls the deployed URL from a browser without CORS errors |
| I5 | Keep-warm cron (GitHub Actions, every 10 min) — repo **public** so minutes are unlimited | INFRA | I4 | todo | Service responds in <2s after 30 min idle |
| I6 | **Demo-mode fallback**: on IMD or Groq failure, serve `lib/mock/*` fixtures instead of erroring | INFRA | B4, B5 | todo | Kill the Groq key → app still answers, visibly degraded |

### Frontend track

| ID | Task | Owner | Depends | Status | Verification |
|---|---|---|---|---|---|
| F1 | Swap `getMockResponse` → `fetch` in [ChatInterface.tsx:60](../components/chat/ChatInterface.tsx#L60) | FE1 | B6 | todo | **Zero edits** to `AgentPipeline.tsx` / `MessageBubble.tsx` |
| F2 | Swap `fetchAlerts` → `fetch` in [alerts/page.tsx:164](../app/alerts/page.tsx#L164) | FE2 | B4 | todo | Alert cards render live IMD data; toast still fires |
| F3 | `NEXT_PUBLIC_API_URL` env var + local-mock fallback when unset | FE1 | — | todo | `npm run dev` works with no backend running |
| F4 | **Label all still-mocked features as "sample data"** (PFZ, SST/chl, routes, geofences) | FE2 | — | todo | Every mocked surface carries a visible badge |
| F5 | Surface data freshness (`last_updated` / "issued X ago") on alert cards | FE2 | B4 | todo | Stale data is visibly stale, not silently wrong |

### QA / demo track

| ID | Task | Owner | Depends | Status | Verification |
|---|---|---|---|---|---|
| Q1 | Write the demo script — exact questions, exact order | QA | — | todo | Script committed; feeds I3 |
| Q2 | Run the full script end-to-end on the **deployed** URL, twice | QA | F1, F2, I4 | todo | 10 consecutive queries, zero rate-limit failures |
| Q3 | Cold-start rehearsal — leave idle 30 min, then demo | QA | I5 | todo | First response <8s |
| Q4 | Failure rehearsal — kill IMD, kill Groq, confirm graceful degradation | QA | I6 | todo | No stack traces, no blank screens, no silently-wrong answers |
| Q5 | Pitch narrative reflects the honest positioning: **unification + interpretation of official feeds**, not novel data | QA | — | todo | Deck states INCOIS/IMD as sources explicitly |

### Phase 1 — Definition of Done

- [ ] Asking *"is it safe to sail tomorrow?"* on the deployed URL returns an answer traceable to an IMD warning issued that day
- [ ] `git diff` shows **zero** changes to `ChatInterface.tsx` internals beyond the single fetch swap, and none at all to `AgentPipeline.tsx` / `MessageBubble.tsx`
- [ ] 10 consecutive demo questions complete without a rate-limit failure
- [ ] Every still-mocked feature is visibly labelled as sample data
- [ ] Killing any single dependency degrades visibly rather than silently
- [ ] Official IMD warning text renders byte-identical to source

---

## Phase 2 — Persistence & Ingestion (post-deadline)

Runs parallel with Phase 3 (Multilingual). Goal: stop hitting IMD per request, and make freshness a first-class concept rather than an assumption.

| ID | Task | Owner | Depends | Status | Verification |
|---|---|---|---|---|---|
| P1 | Neon project + PostGIS enabled | INFRA | — | todo | `SELECT postgis_version();` succeeds |
| P2 | Schema: `alerts` (geometry Point, severity, source, issued/expires), `ingestion_runs` (source, started, status, row count) | BE1 | P1 | todo | Migration applies clean from empty |
| P3 | Ingestion job: IMD → Postgres, idempotent on re-run | BE1 | P2, B1 | todo | Running twice produces no duplicates |
| P4 | GitHub Actions cron (every 3h) hitting the ingestion endpoint | INFRA | P3 | todo | Two consecutive scheduled runs succeed unattended |
| P5 | `/api/alerts` reads Postgres, not IMD live; PostGIS `ST_DWithin` for proximity | BE2 | P3 | todo | Response time drops; IMD call count per request = 0 |
| P6 | **Ingestion failure alarm** — a silent cron failure leaving alerts stale is the most dangerous failure mode in this product | BE1 | P4 | todo | Force a failure → alarm fires and UI shows staleness |
| P7 | `last_updated` in every API response; frontend renders age | BE2, FE2 | P5 | todo | UI shows "issued 2h ago" and warns past a threshold |
| P8 | Audit `reverseGeocode()` (M10) — determine if it calls a real service or is stubbed | FE1 | — | todo | Documented; replaced if stubbed |
| P9 | Enforce **no raw grids** storage invariant | BE1 | P2 | todo | DB size stays well under 0.5 GB after a week of ingestion |
| P10 | If Phase 1 hit NO-GO: complete the deferred M2/M3 IMD migration here | BE1 | P3 | todo | Alerts served from live IMD-sourced data |

### Phase 2 — Definition of Done

- [ ] Alerts served from Postgres, refreshed on schedule, with visible age
- [ ] Ingestion runs unattended for 48h without manual intervention
- [ ] A forced ingestion failure produces an alarm **and** a visible stale-data state
- [ ] DB size confirms no raw satellite grids are being persisted

---

## Contract Parity Gate

The falsifiable target from the PRD. Each response must match its TS interface **field-for-field** — same names, same optionality, same tuple order.

| Contract | TS source | Checks |
|---|---|---|
| `Alert` | [alertsData.ts:7](../lib/mock/alertsData.ts#L7) | `coordinates` is `[lat, lng]` (**not** GeoJSON `[lng, lat]`) · `issuedAt`/`expiresAt` ISO-8601 UTC · `windSpeed`/`waveHeight`/`distance` optional · `severity` ∈ critical/high/moderate/low · `type` ∈ cyclone/lightning/high-wave/geofence/fog/wind |
| `AgentStep` | [chatResponses.ts:5](../lib/mock/chatResponses.ts#L5) | `agent` ∈ Planner/DataAgent/RiskAgent/ResponseAgent · `duration_ms` present · **4 elements even though only 2 are LLM calls** |
| `ChatResponse` | [chatResponses.ts:14](../lib/mock/chatResponses.ts#L14) | `relatedData.pfzZones`/`alerts` are ID string arrays · `chartData` is `{label, value}[]` |
| `PFZZone` | [pfzData.ts:5](../lib/mock/pfzData.ts#L5) | `coordinates` polygon rings are `[lng, lat]` · `centroid` is `[lat, lng]` — **opposite order, easy to get wrong** · `valid_date` is `YYYY-MM-DD` |

> **Coordinate-order trap**: `Alert.coordinates` and `PFZZone.centroid` are `[lat, lng]`, but `PFZZone.coordinates` polygon rings are `[lng, lat]` (GeoJSON convention). PostGIS is `[lng, lat]` throughout. Mixing these puts Chennai in Somalia and will not throw — it will just render wrong. Assert on this in B3.

---

## Rollback

Every migrated function keeps its mock beside it. Rollback is a one-line env change, not a revert.

| Trigger | Action | Owner |
|---|---|---|
| IMD unreachable / schema changed | `USE_MOCK_ALERTS=true` → `fetchAlerts` serves fixtures | INFRA |
| Groq rate-limited or key dead | `USE_MOCK_CHAT=true` → `getMockResponse` serves canned responses | INFRA |
| Backend down entirely | `NEXT_PUBLIC_API_URL` unset → frontend uses local mocks (F3) | FE1 |
| Cold start during judging | Hit the URL before presenting; keep-warm cron (I5) | QA |

**Do not delete `lib/mock/*`.** It is shipped fallback infrastructure, not dead code.

---

## Open Blockers

| Blocker | Owner | Impact if unresolved |
|---|---|---|
| IMD exact endpoint paths (B1) | BE1 | Resolved — paths extracted from `api_reference.html` (see B1 row) |
| IMD API key registration (new, found 2026-08-26) | BE1 | **Triggers the T+4h NO-GO** — all 6 candidate endpoints return `401 {"error":"API key missing"}`; a developer account must be registered and a key issued before B4 can call any IMD endpoint. Registration in progress |
| Cyclone APIs not in self-service checklist (new, found 2026-08-26) | BE1 | **Bigger than the key blocker above.** The registration form's "Select APIs You Need Access To" list has no Cyclone Track / Cyclone Wind Warning / Cyclone Cone of Uncertainty entry — confirmed by reading the full alphabetical checkbox list end to end. Only Port Warning, Sea Area Bulletin, and Coastal Area Bulletin (all marine/coastal, not cyclone) are self-registrable. Cyclone endpoints returned `401` (exist) not `404` (don't exist), so they're real but gated behind something other than this form — likely a manual/separate request to IMD. **If this doesn't resolve before the deadline, the primary demo hypothesis ("is it safe to sail tomorrow" traced to a cyclone warning) has no data path — fall back to Port Warning/Sea Area Bulletin/Coastal Bulletin as the safety data source instead of cyclone track data.** |
| IMD IP whitelisting from Render egress (B2) | BE1 | Works locally, fails in production — the worst failure shape. Verify from deployed, not laptop |
| INCOIS access (403) | — | None on Phases 1–2. Dual-tracked; Phase 4 concern only |
| Real tokens/query unmeasured (B8) | BE2 | Cache sizing and the demo-safety margin are guesswork until measured |

---

*Created: 2026-08-26 · Phase 1 deadline: Thursday 2026-08-27*
