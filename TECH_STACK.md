# ORCA — Tech Stack

Marine intelligence platform for SIH 2026. Frontend is built; backend below is the planned/improvised stack (not yet implemented — see [README.md](README.md) for current mock-data state).

## Frontend (built)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Animation | Framer Motion, Lottie |
| Map | Leaflet / react-leaflet |
| Charts | Recharts |
| Markdown rendering | react-markdown |
| Icons | lucide-react |
| Hosting | Vercel (free/Hobby tier) |

## Backend (planned)

| Layer | Choice | Why |
|---|---|---|
| API framework | **FastAPI** (Python) | Async, native SSE streaming for the chat agent trace, Pydantic models mirror existing TS types |
| Agent pipeline | Hand-rolled sequential Python. **4 UI stages ≠ 4 LLM calls:** Planner = LLM, DataAgent = DB/cache fetch (no LLM), RiskAgent = deterministic scoring + LLM only for synthesis, ResponseAgent = template for structured output | Fixed flow, no branching — LangGraph is unneeded overhead. Capping at **2 LLM calls/query** is forced by Groq's 6K TPM ceiling (see limits table). `AgentPipeline.tsx` still renders 4 steps regardless of how each is produced — no frontend change needed |
| LLM host | **Groq** (free API tier) | Free, hosted (no self-hosting/GPU), fastest inference available — matters since each query triggers 4 sequential LLM calls |
| LLM — reasoning stages (Planner, RiskAgent) | **`openai/gpt-oss-120b`** (via Groq) | **Production** status on Groq, 500 T/sec. Chosen over `qwen/qwen3.6-27b` — which benchmarks better but is **preview-only** (evaluation use, withdrawable without notice — the exact failure mode that already killed the Llama picks) |
| LLM — formatting stages (DataAgent, ResponseAgent) | **`openai/gpt-oss-20b`** (via Groq) | **Production** status, 1000 T/sec — fastest available, right for lookup-and-format stages that aren't reasoning |
| LLM alternatives | Google Gemini API (free tier), OpenRouter free models, NVIDIA NIM (Nemotron hosted), GLM-5.2 (strongest open agentic model, not on Groq — via OpenRouter/self-host) | Backups / model A-B testing |
| Local LLM dev | Ollama (Nemotron, Llama, etc.) | Local prompt iteration only — not for the deployed demo (self-hosting reintroduces manual uptime babysitting) |
| Route optimization | networkx / A*-Dijkstra over a hazard-weighted grid — **not an LLM call** | Deterministic pathfinding; LLM only narrates the computed route in ResponseAgent |
| Geofence checks | PostGIS `ST_DWithin` / point-in-polygon — **not an LLM call** | Deterministic geometry; LLM only phrases the alert text |
| Database | **Neon** (serverless Postgres + PostGIS) | Free tier, auto-resumes on connection (no manual "restore" click, unlike Supabase) |
| Cache / pub-sub | **Upstash** (serverless Redis) | Free tier, auto-wakes per request, used for caching satellite pulls and pushing live alerts |
| Realtime push (alerts) | **Dropped for hackathon** — `GET /api/alerts` is client-polled instead | An SSE/Upstash push channel is real work with no judge-visible payoff over polling; revisit post-hackathon if latency matters |
| **Multilingual output** | 8 languages — English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam | **Hard requirement**, not optional: [settings/page.tsx](app/settings/page.tsx) already ships the selector and a mock trace says "Generating bilingual response." INCOIS itself publishes PFZ advisories multilingually per sector. Collides directly with the 6K TPM ceiling — the same answer in Tamil is a second generation unless cached, so **cache keys must be (query + language)**, and safety-critical warning text must be translated from a vetted source string, never free-generated |
| Geospatial processing | geopandas, shapely | PFZ zone polygons, geofencing / proximity checks |
| Satellite data processing | xarray, netCDF4, rasterio | Parsing MODIS / Sentinel-3 NetCDF/HDF5 grids |
| PFZ algorithm | SST gradient + chlorophyll bloom detection (Cayula-Cornillon method) | Core oceanographic computation over ingested grids |
| Scheduled ingestion | **GitHub Actions** (cron workflow hitting an ingestion endpoint) | Free, avoids paying for an always-on worker |
| Backend hosting | Render or Google Cloud Run (free tier) | Scales to zero, auto-wakes on request (cold start, no manual step) |

> **Note:** Groq deprecated models twice already in 2026 (Feb, June). Verify current model IDs at `console.groq.com/docs/models` before wiring API calls — and check **production vs. preview** status, not just presence in the list.

## Verified free-tier limits (checked 2026-08-26)

| Service | Verified limits | Implication |
|---|---|---|
| **Groq** free tier | 30 req/min · **6,000 tokens/min** · 14,400 req/day, org-wide (not per key). No credit card. | **TPM is the binding constraint.** 6K TPM ≈ 1–2 full pipeline queries/min. Forces collapsing 4 stages → ~2 real LLM calls. |
| **Neon** free tier | 0.5 GB storage/project · 100 CU-hours/project/mo · up to 2 CU · autoscaling, branching. **PostGIS supported.** | 0.5 GB confirms the no-raw-grids invariant — derived polygons and summary stats only. |
| **Render** free web service | Still available, no card. 512 MB RAM / 0.1 CPU. Spins down after **15 min** idle, ~**1 min** cold start. Bandwidth cut 100 GB → **5 GB** (Apr 2026). | 1-min cold start is a live-demo risk — warm it before judging. |
| **GitHub Actions** | **Public repos: unlimited** standard-runner minutes. Private: 2,000 Linux min/mo. | Keep the repo public and ingestion cron is free and uncapped. |
| **IMD API** (`api.imd.gov.in`) | **28 APIs**, incl. 3 cyclone (Track, Wind Warning as GeoJSON MultiPolygon at 27/34/50/64 kt), 4 marine, 2 warnings. **Correction (2026-08-26, B1 verification):** the reference/docs page returns HTTP 200 publicly, but the actual data endpoints all return `401 {"error":"API key missing"}` — confirmed via curl on `cyclone_track`, `cyclone_wind`, `cyclone_cou`, `portwarning`, `seabulletin`, `coastalbulletin`. This is a full API management portal requiring a registered developer account (Register/Login on `api.imd.gov.in`). | Not the guaranteed win it looked like — account registration (and possible approval wait) is now on the critical path. Registration in progress. |
| **NASA OceanColor** | Free, but **Earthdata Login required**; generate a token in EDL profile for API use. `earthaccess` Python lib handles auth+search+download. | Store the token as a CI secret for the ingestion job. |
| **Copernicus / Sentinel-3** | Free and open via simple pre-registration; OData + S3 APIs for programmatic access. | Same — credentials as CI secrets. |
| **INCOIS** | PFZ advisories daily (except fishing-ban periods), 14 sectors / ~1,223 nodes, published as maps + text via WebGIS, disseminated by phone/fax/email/radio/app. **No public API documented.** A GeoServer exists at `incois.gov.in/geoserver/` but returns **HTTP 403** to anonymous requests (`/gisserver/PFZ/` → 404). | **The one unresolved blocker.** Machine-readable PFZ is access-controlled, not open. Either (a) request institutional access — reasonable for an ISRO-themed SIH entry, or (b) compute PFZ from MODIS/Sentinel-3, which *are* openly accessible. This gates the ingest-vs-compute decision. |

## PFZ data strategy — dual track

INCOIS access is requested but unconfirmed, and a government reply won't land before a hackathon deadline. Both tracks are built in parallel; nobody is blocked waiting on an email.

| | Track A — INCOIS (primary, pending) | Track B — Compute-it-yourself (fallback, build now) |
|---|---|---|
| **Data source** | Official INCOIS PFZ advisories, if access is granted | Raw MODIS (NASA OceanColor) + Sentinel-3 OLCI (Copernicus) — both open with free registration, confirmed above |
| **Method** | Ingest their published zones directly | Implement SST-gradient + chlorophyll-bloom detection (Cayula-Cornillon) ourselves |
| **Effort** | Days, once access exists | Weeks of algorithm work — this is real oceanographic computation |
| **Trust** | Authoritative — it's the national ocean information centre's own output | Unverified — no ground truth to check output against unless compared to Track A |
| **Dependency** | Blocked on an external reply with no committed SLA | None — works today, no one's permission required |
| **Status** | Email sent (see request draft in conversation) — do not build against this yet | **Start now.** This is the path the prototype ships on by default |

**Rule:** Track B is the default and what the prototype demos on. If Track A comes through — before or after the deadline — swap the data source behind the same PFZ API contract (`relatedData.pfzZones` shape in [chatResponses.ts](lib/mock/chatResponses.ts)) without touching the pipeline or frontend. If it never comes through, Track B is a complete, self-sufficient answer on its own — it was never a stopgap.

### Throughput budget (the real ceiling)

At ~500–600 output tokens per response plus system prompt and retrieved context, **2 LLM calls/query ≈ 3–5K tokens**. Against 6,000 TPM that is roughly **1 query/minute, single-user**. Judges will ask more than one question, so response caching keyed on **(query + language)** is mandatory infrastructure, not an optimization. Re-measure once real prompt sizes exist and record the actual number here.

## External data sources (free, public)

- **IMD API gateway** — `api.imd.gov.in` (cyclone track, cyclone wind warning, marine/coastal bulletins, warnings)
- **INCOIS** — PFZ advisories, ocean state forecasts (access method to be confirmed)
- **NASA OceanColor / OB.DAAC** (MODIS) — Earthdata Login required
- **Copernicus Data Space** (Sentinel-3 OLCI) — registration required

## Cost summary

Everything above runs on free tiers; the full stack is $0 for a hackathon demo. The binding constraint is not money but **Groq's 6,000 tokens/min** — design the pipeline around that ceiling, not around per-token cost.
