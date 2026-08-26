# ORCA Backend

## Problem Statement

ORCA's frontend is complete and convincing — chat interface, live map, alerts feed, 8-language settings — but every number it displays is hardcoded. Fishermen, coastal authorities, and disaster agencies cannot make a single real decision with it, because no satellite feed, weather service, or language model is connected. Without a backend, ORCA is a demo of an idea rather than an instrument anyone can use, and the safety claims it makes on screen are unbacked.

## Evidence

- **Verified in code**: `getMockResponse()` in [chatResponses.ts:212](lib/mock/chatResponses.ts#L212) keyword-matches a query against 5 canned responses and returns after a `setTimeout`. Its own comment reads `TODO: replace with streaming call to /api/chat (LLM + agents backend)`.
- **Verified in code**: [alertsData.ts:2](lib/mock/alertsData.ts#L2) — `TODO: replace with call to /api/alerts for real-time INCOIS/IMD alerts`. [pfzData.ts:3](lib/mock/pfzData.ts#L3) — `TODO: replace fetchPFZZones with call to /api/pfz?lat=&lng=&date=`.
- **Verified in code**: no `app/api/` directory exists. Zero backend routes.
- **Verified externally (2026-08-26)**: `api.imd.gov.in` is live and returns HTTP 200 with no auth wall, publishing 28 APIs including Cyclone Track and Cyclone Wind Warning as GeoJSON. The real data ORCA claims to use is genuinely reachable.
- **Assumption — not validated**: that fishermen would adopt a conversational interface over INCOIS's existing SMS/radio/app dissemination. No user interviews conducted. Needs validation through field conversation with a fishing community, which is out of scope before the hackathon deadline.

## Proposed Solution

Build a Python FastAPI service that replaces the three mock data functions behind API contracts identical to the existing TypeScript interfaces, so the frontend swaps `getMockResponse` → `fetch` with no component changes. Live cyclone and marine data comes from IMD's verified public API; conversational responses come from a two-call LLM pipeline on Groq's free tier. Python is chosen over Node because the satellite/geospatial ecosystem (xarray, geopandas, rasterio) has no real equivalent elsewhere, and because oceanographic NetCDF processing is Python's home turf.

The work is phased so that Phase 1 is demonstrable by the hackathon deadline with two features genuinely live, while the remaining mocked features stay mocked and honestly labelled.

## Key Hypothesis

We believe **a conversational interface over live IMD cyclone and marine data** will **let a fisherman decide whether to sail without interpreting a technical bulletin** for **small-vessel operators on India's coast**.

We'll know we're right when **a judge can ask "is it safe to go out tomorrow?" in plain language and receive an answer traceable to an IMD warning issued that day, with the official warning text shown verbatim alongside it**.

## What We're NOT Building

- **Our own cyclone/weather model** — IMD is the national authority and publishes forecasts via API. Re-deriving them would be worse and slower.
- **User accounts / authentication** — nothing in the current frontend requires identity; browser geolocation plus a region setting covers personalisation. Adding auth costs days and buys nothing for the hypothesis.
- **Mobile apps** — the frontend is a responsive web app; INCOIS already ships a mobile app for this audience.
- **Vessel tracking / AIS integration** — large scope, requires hardware and data partnerships, unrelated to the core hypothesis.
- **Offline-first sync** — genuinely valuable at sea where connectivity fails, but a full offline architecture is out of scope for a hackathon backend. Noted as the highest-value post-hackathon addition.
- **Persisting conversation history server-side** — conversations live in Zustand in-browser today. Fine.

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Live data end-to-end** (primary) | ≥2 of 6 features served by real APIs, zero mock fallback on the demo path | Ask the deployed app a cyclone question; trace the response to an IMD payload fetched that day |
| Frontend changes required to swap mocks → API | **0** edits to `ChatInterface.tsx`, `AgentPipeline.tsx`, `MessageBubble.tsx` | Git diff after the swap |
| Chat response latency (warm) | < 8s p50 end-to-end | Timed from request to final SSE token |
| Demo survives repeated questioning | ≥10 consecutive queries without a rate-limit failure | Cached-response hit rate during a scripted demo run |
| Official warning fidelity | 100% of IMD warnings render source text + issuing authority verbatim | Manual inspection of every alert card |

## Open Questions

- [ ] **INCOIS programmatic access** — request sent, no reply expected before the deadline. Gates whether PFZ is ingested or computed. Dual-tracked so nothing blocks (see Technical Approach).
- [ ] **Actual token cost per query** — the 6K TPM budget assumes ~500–600 output tokens plus prompt/context. Must be measured against real prompts in Phase 1, not estimated.
- [ ] **IMD endpoint paths and response schemas** — the gateway is confirmed live and the API catalogue is published, but exact paths were not resolved (guessed paths returned 404). Requires reading `api.imd.gov.in/public/api_reference.html` in detail during Phase 1.
- [ ] **IMD rate limits / IP whitelisting** — one source mentions IP whitelisting; the live probe showed no auth wall. If whitelisting turns out to apply, scale-to-zero hosting with dynamic egress IPs becomes a problem. Verify early.
- [ ] **Whether translation quality is acceptable for safety text** — LLM-translated cyclone warnings into 8 languages is a real risk. Mitigation is fixed vetted strings, but the tradeoff is untested.
- [ ] **Is the conversational interface actually wanted by fishermen?** — unvalidated core assumption (see Evidence).

---

## Users & Context

**Primary User**

- **Who**: A small-vessel fisherman operating from a Tamil Nadu, Kerala, or Andhra Pradesh harbour, deciding at 4am whether to sail. Likely reading in Tamil, Malayalam, or Telugu rather than English; may have limited literacy.
- **Current behavior**: Checks INCOIS/IMD bulletins via radio, harbour display boards, SMS, or word of mouth. Interprets technical wave-height and wind-speed figures without training, or relies on experience and local consensus.
- **Trigger**: Pre-departure, in the dark, under time pressure, with money at stake — a wasted trip costs fuel; a wrong call costs lives.
- **Success state**: A plain-language go / don't-go answer with the reason and the official source attached, in their own language, in under a minute.

**Evidence for this profile**: partly inferred from the product itself — [settings/page.tsx](app/settings/page.tsx) ships 8 Indian languages, 11 coastal regions, a "Large Text Mode" for field use, and an "Icon-First Mode" explicitly labelled *"designed for low-literacy / quick-scan use"*. Those choices encode a user hypothesis the team already made. It has not been validated with real users.

**Job to Be Done**

When **deciding before dawn whether to take my boat out**, I want to **know if conditions are dangerous and where fish are likely to be**, so I can **earn a living without risking my life or wasting fuel**.

**Secondary Users**

- **Coastal authority / disaster management officer** — needs regional cyclone impact zones and evacuation-relevant advisories, not per-boat guidance.
- **Researcher** — wants SST/chlorophyll layers; tolerant of raw data, intolerant of unsourced numbers.

**Non-Users**

- **Commercial deep-sea fleets** — have onboard meteorological equipment, dedicated routing services, and trained navigators.
- **Recreational boaters / tourists** — different risk profile, different regulatory context, not an SIH problem statement.
- **International waters operators** — the data sources are India-specific.

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| **Must** | `GET /api/alerts` backed by live IMD cyclone + marine APIs | The verified data path, and the safety-critical feature. Highest judge value, lowest technical risk. |
| **Must** | `POST /api/chat` — 2-call LLM pipeline on Groq, SSE streaming | The product's entire interaction model. Without it ORCA is a map. |
| **Must** | Response caching keyed on `(query, language)` | Not an optimisation — mandatory. At 6K TPM the demo fails on the second question without it. |
| **Must** | Official warning passthrough | IMD text, source ID, issuing authority render unmodified. Non-negotiable in a safety product. |
| **Should** | `GET /api/pfz` — dual-tracked (INCOIS if granted, computed otherwise) | The headline feature, but the weakest data path today. |
| **Should** | Persistence in Neon + PostGIS; scheduled ingestion via GitHub Actions | Needed for freshness, geofencing, and to stop hammering IMD per request. |
| **Should** | Multilingual responses (8 languages) | Hard requirement of the shipped UI, but Phase 1 can ship English-only without breaking anything. |
| **Could** | Geofence proximity alerts (PostGIS `ST_DWithin`) | Deterministic and cheap once PostGIS exists. |
| **Could** | Safe-route optimisation (networkx over a hazard-weighted grid) | Deterministic pathfinding, not an LLM task. Meaningful work; not needed to prove the hypothesis. |
| **Won't** | SST/chlorophyll raster tiles served from our own store | 0.5 GB Neon ceiling forbids storing grids. Derived summaries only. |
| **Won't** | Auth, vessel tracking, offline sync, mobile apps | See "What We're NOT Building". |

### MVP Scope

A deployed FastAPI service exposing `/api/alerts` and `/api/chat`. Alerts are real IMD cyclone and marine warnings. Chat is a real two-call Groq pipeline that reads those alerts and answers in natural language, streaming over SSE so the existing agent-trace animation plays against real work. PFZ, SST/chlorophyll, routes, and geofencing continue to serve existing mock data, clearly labelled as sample data in the UI.

The measurable bar: **ask "is it safe to sail tomorrow?" and get an answer derived from an IMD warning issued that day.**

### User Flow (critical path)

1. User opens `/app`, browser geolocation resolves position (or falls back to the region set in Settings).
2. User types "is it safe to go out tomorrow?" — or taps a suggestion chip.
3. `POST /api/chat` with `{query, lat, lng, language}`.
4. **Cache check** on `(normalised_query, language, date)`. On hit, stream the stored response and skip both LLM calls.
5. **LLM call 1 — Planner**: classify intent, extract location/time context. Emits trace step 1.
6. **DataAgent — no LLM**: query Postgres for active alerts near the user (PostGIS proximity), plus the latest IMD marine bulletin. Emits trace step 2.
7. **RiskAgent — deterministic**: compute a composite safety score from wind/wave/cyclone-distance thresholds. Emits trace step 3.
8. **LLM call 2 — ResponseAgent**: synthesise the scored data into plain language in the requested language, with official warning text appended verbatim. Emits trace step 4, streams tokens over SSE.
9. Response cached. Frontend renders it through the existing `MessageBubble` and `AgentPipeline` components, unchanged.

---

## Technical Approach

**Feasibility**: **HIGH** for Phase 1 — every external dependency was verified live on 2026-08-26. **MEDIUM** overall, entirely because of the PFZ data path.

### Architecture Notes

- **4 UI pipeline stages ≠ 4 LLM calls.** `AgentPipeline.tsx` renders four steps but is agnostic to how each is produced. Only Planner and ResponseAgent call an LLM; DataAgent is a database fetch and RiskAgent is deterministic scoring. This halves token burn against a hard ceiling and costs nothing visually.
- **API contracts mirror the existing TypeScript interfaces exactly** — Pydantic models reproduce `Alert` ([alertsData.ts:7](lib/mock/alertsData.ts#L7)), `PFZZone` ([pfzData.ts:5](lib/mock/pfzData.ts#L5)), `ChatResponse` / `AgentStep` ([chatResponses.ts:5](lib/mock/chatResponses.ts#L5)). Field names, optionality, and the `[lat, lng]` tuple convention carry over unchanged. Timestamps stay ISO-8601 UTC (`2026-08-25T06:00:00Z`); `valid_date` stays `YYYY-MM-DD`.
- **Never persist raw satellite grids.** Neon's free tier is 0.5 GB. Store derived polygons, summary statistics, and alert records only.
- **Deterministic work stays out of the LLM.** Route pathfinding and geofence containment are exact geometry. An LLM doing arithmetic in a safety product is a correctness risk, not a shortcut.
- **PFZ dual track**: Track A ingests official INCOIS advisories if access is granted; Track B computes zones from MODIS/Sentinel-3, which are openly accessible. Both sit behind the same `/api/pfz` contract, so the source can swap without touching the pipeline or frontend. **Track B is the default** — the prototype ships on it and it is a complete answer on its own, not a stopgap.

### Verified Constraints (checked 2026-08-26)

| Dependency | Verified limit | Consequence |
|---|---|---|
| Groq free tier | 30 req/min · **6,000 tokens/min** · 14,400 req/day, org-wide | TPM is the binding constraint of the entire system — ~1 query/min uncached |
| Groq models | `openai/gpt-oss-120b` + `gpt-oss-20b` are **production**; `qwen/qwen3.6-27b` is **preview-only** | Use gpt-oss. Preview models get withdrawn without notice |
| Neon | 0.5 GB/project, PostGIS supported | No raw grids |
| Render free | 512 MB RAM, spins down at 15 min idle, **~1 min cold start** | Warm the service before judging |
| GitHub Actions | Unlimited on **public** repos | Keep the repo public; ingestion cron is free |
| IMD API | 28 APIs documented; endpoints confirmed via curl (2026-08-26): all require a registered developer account + API key (`401 {"error":"API key missing"}`). Reference docs page is public (200), the data API is not | Primary data path exists but registration is now on the critical path, not a pure formality |
| INCOIS | GeoServer exists but returns **403**; no public API documented | The one genuine blocker |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **6K TPM ceiling throttles the live demo** | **H** | **H** | Cache on `(query, language)`; pre-warm the cache with the exact demo script; cap at 2 LLM calls; fall back to mock fixtures rather than erroring |
| Render 1-min cold start during judging | **H** | M | Hit the service immediately before the demo; a GitHub Actions cron ping every 10 min keeps it warm |
| IMD endpoint paths/schemas unknown | M | H | Resolve on day 1 of Phase 1 — this is the first task, before any pipeline work |
| IMD applies IP whitelisting to data endpoints | M | H | Verify on day 1. If it applies, proxy through a fixed-IP host or pre-fetch into Postgres via CI |
| INCOIS never grants access | **H** | M | Track B is the default path and requires no permission |
| LLM hallucinates a safety advisory | M | **Critical** | Official warning text passes through verbatim with source attribution; LLM prose is supplementary and never the sole rendering of a warning |
| Mistranslation of safety text into 8 languages | M | H | Fixed vetted strings per language for warning text; LLM translates only non-critical prose |
| Team is mixed-skill; backend concentrates on 2–3 people | **H** | M | Phase 1 tasks are scoped so frontend-only members stay productive on the mock→API swap, demo QA, and pitch |

---

## Implementation Phases

<!--
  STATUS: pending | in-progress | complete
  PARALLEL: phases that can run concurrently
  DEPENDS: phases that must complete first
  PRP: link to generated plan file once created
-->

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | **Live Demo Slice** | FastAPI service, IMD-backed `/api/alerts`, Groq-backed `/api/chat` with caching, deployed. **Hackathon deliverable.** | pending | - | - | - |
| 2 | Persistence & Ingestion | Neon + PostGIS schema, scheduled IMD ingestion via GitHub Actions, freshness metadata | pending | with 3 | 1 | - |
| 3 | Multilingual | 8-language responses, vetted warning strings, language-aware cache keys | pending | with 2 | 1 | - |
| 4 | PFZ (dual track) | Track B compute from MODIS/Sentinel-3; Track A swap if INCOIS access lands | pending | - | 2 | - |
| 5 | Geofence & Routing | PostGIS proximity alerts; networkx hazard-weighted routing | pending | with 4 | 2 | - |
| 6 | Hardening | Error/degradation behaviour, stale-data UI signals, demo-mode fallback, eval | pending | - | 4, 5 | - |

### Phase Details

**Phase 1: Live Demo Slice** — *the hackathon deliverable*

- **Goal**: Two features genuinely live, end-to-end, deployed and demoable.
- **Scope**:
  - Resolve IMD endpoint paths and schemas from the published API reference (**do this first — it gates everything else**)
  - FastAPI skeleton, Pydantic models mirroring the existing TS interfaces
  - `GET /api/alerts` → IMD cyclone track + wind warning + marine bulletins, mapped into the `Alert` shape
  - `POST /api/chat` → 2-call Groq pipeline (`gpt-oss-120b` Planner, `gpt-oss-20b` ResponseAgent), SSE streaming, emitting the existing `AgentStep` trace shape
  - In-memory or Upstash cache on `(normalised_query, language, date)`
  - Frontend swap: `getMockResponse` → `fetch`, `fetchAlerts` → `fetch`. **Zero component edits.**
  - Deploy to Render; keep-warm cron
  - **Demo-mode fallback**: if IMD or Groq fails, serve the existing `lib/mock/*` fixtures rather than erroring. This is shipped behaviour, not dead code.
- **Success signal**: On the deployed URL, asking "is it safe to sail tomorrow?" returns an answer traceable to an IMD warning issued that day, and 10 consecutive questions complete without a rate-limit failure.
- **Team split (6, mixed skill)**: 2 backend-capable on FastAPI + IMD + Groq; 1 on caching + deployment + keep-warm; 2 frontend on the mock→API swap and stale-data UI labelling; 1 on demo-script QA and pitch narrative.

**Phase 2: Persistence & Ingestion**
- **Goal**: Stop fetching IMD per request; establish freshness as a first-class concept.
- **Scope**: Neon schema with PostGIS geometry columns for alerts and zones; GitHub Actions cron hitting an ingestion endpoint; `last_updated` surfaced through every API response.
- **Success signal**: Alerts served from Postgres, refreshed on schedule, with age visible to the user.

**Phase 3: Multilingual**
- **Goal**: Deliver the 8 languages the UI already promises.
- **Scope**: Language parameter through the pipeline; vetted fixed strings for all safety-critical warning text; cache keys include language.
- **Success signal**: The same question in Tamil and English returns equivalent guidance, with identical official warning text.

**Phase 4: PFZ (dual track)**
- **Goal**: Make the headline feature real.
- **Scope**: Track B — ingest MODIS/Sentinel-3 via `earthaccess` and Copernicus OData, implement SST-gradient + chlorophyll-bloom detection, emit `PFZZone` polygons. Track A — if INCOIS access lands, swap the source behind the same contract.
- **Success signal**: `/api/pfz?lat=&lng=&date=` returns computed zones matching the existing `PFZZone` shape.

**Phase 5: Geofence & Routing**
- **Goal**: The two remaining deterministic features.
- **Scope**: PostGIS `ST_DWithin` proximity alerts against maritime boundary polygons; networkx A*/Dijkstra over a hazard-weighted grid.
- **Success signal**: A route request returns a path that measurably avoids active cyclone polygons.

**Phase 6: Hardening**
- **Goal**: Behave correctly when things break.
- **Scope**: Explicit degradation behaviour per source; stale-data warnings in the UI; ingestion failure alarms (a silent cron failure leaving alerts stale is the single most dangerous failure mode); evaluation of PFZ output against INCOIS advisories if available.
- **Success signal**: Killing each dependency in turn produces a correct, visible degraded state rather than a silent wrong answer.

### Parallelism Notes

Phase 1 is deliberately serial and all-hands — it is the deadline. Phases 2 and 3 parallelise cleanly because persistence and translation touch different layers. Phases 4 and 5 both depend on PostGIS from Phase 2 but are independent of each other (satellite processing vs. graph search), making them a natural split for two sub-teams. Phase 6 must come last because it hardens everything before it.

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Backend language | Python / FastAPI | Node/Express, Next.js API routes | xarray/geopandas/rasterio have no real equivalent elsewhere; native SSE; Pydantic mirrors the existing TS types |
| Agent orchestration | Hand-rolled sequential functions | LangGraph, CrewAI | Fixed 4-stage flow with no branching — a framework adds a dependency and a debugging layer for a for-loop |
| LLM provider | Groq free tier | Anthropic, Gemini, OpenRouter, self-hosted Ollama | Free, hosted, fastest inference; self-hosting reintroduces uptime babysitting |
| LLM models | `gpt-oss-120b` + `gpt-oss-20b` | `qwen/qwen3.6-27b` | Qwen benchmarks better but is **preview-only** on Groq — withdrawable without notice, the exact failure that already killed the Llama 3.x picks |
| LLM call count | 2 per query, not 4 | 4 (one per UI stage) | 6K TPM ceiling. Frontend renders 4 steps regardless |
| Database | Neon (serverless Postgres + PostGIS) | Supabase, self-hosted Postgres | Supabase free projects pause after ~7 days idle and need a manual dashboard click; Neon auto-resumes on connection |
| Cache / pub-sub | Upstash Redis | Supabase Realtime, self-hosted Redis | Serverless, auto-wakes, free tier, no always-on server |
| Scheduled ingestion | GitHub Actions cron | Always-on worker, Render cron | Unlimited minutes on public repos; no server to babysit |
| PFZ source | Dual track, Track B default | Wait for INCOIS access | INCOIS GeoServer returns 403 and a government reply won't land before the deadline; Track B needs no permission |
| Route & geofence computation | Deterministic code, no LLM | LLM-computed | Exact geometry in a safety product; an LLM doing arithmetic is a correctness risk |
| Mock data | Retained as demo-mode fallback | Deleted after swap | If a source fails during judging the demo must still run |
| Route contract | Single-point `fetchRoutes(lat, lng)`, corridor-based | Origin→destination point-to-point | Reconciled against the legacy frontend PRD (2026-08-26): point-to-point adds scope Phase 5 doesn't need yet. Corridor suggestions are enough for the hackathon demo |
| Input language handling | Output-language only — `language` param passed explicitly from the Settings picker | Auto-detect input language (legacy PRD wanted this) | No LLM/library spent detecting what's already an explicit UI selection; simplest path under the 6K TPM ceiling |
| Geofence notification prefs | Client-side only (Zustand/localStorage) | Backend-persisted per-user prefs | Backend already excludes auth/accounts (see "What We're NOT Building"); persisting prefs server-side would silently reintroduce a user concept |
| Alert delivery | Polled `GET /api/alerts` | SSE/Upstash push (see TECH_STACK.md) | Real-time push was speculative infra with no judge-visible payoff over polling; dropped for the hackathon deadline, revisit post-Phase-1 |

---

## Research Summary

**Market Context**

INCOIS already operates the authoritative version of ORCA's core feature: daily PFZ advisories across 14 coastal sectors and ~1,223 nodes, disseminated multilingually by radio, SMS, electronic harbour boards, and a mobile app. IMD independently publishes cyclone warnings through 28 public APIs. **ORCA's differentiation is therefore not data generation — it is unification and interpretation**: putting several official feeds behind one plain-language, multilingual conversational interface aimed at a low-literacy field user. This reframes the product honestly and is a stronger pitch than implying the data is novel.

The competitive risk is that INCOIS's own app already reaches this audience. The defensible claim is the interface and the cross-source synthesis, not the underlying science.

**Technical Context**

All eight external dependencies were verified live on 2026-08-26 rather than recalled. Two prior assumptions were falsified in the process: Llama 3.3 70B / 3.1 8B were announced for deprecation on Groq, and the replacement Qwen3.6 27B turned out to be preview-only — both discovered only by querying primary sources. The binding constraint on the entire system is **not cost but Groq's 6,000 tokens/min**, which drove the decision to collapse four pipeline stages into two LLM calls and to treat caching as mandatory infrastructure.

The single unresolved dependency is INCOIS programmatic access (HTTP 403, no documented public API), which is dual-tracked so it blocks nothing.

---

*Generated: 2026-08-26*
*Status: DRAFT — Phase 1 ready to plan; core user assumption unvalidated*
