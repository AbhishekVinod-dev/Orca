# 📋 ORCA Marine Intelligence Platform — Complete ISRO Implementation Roadmap

This roadmap details the step-by-step implementation tasks required to build the **Universal Multi-Agent, Multi-Provider, Multi-Persona Marine Intelligence Platform** adhering strictly to the **ISRO Baseline Specification (`ORCA_Marine_Intelligence_Platform_Specification.md`)**.

---

## 🔑 Phase 1: Multi-Provider LLM Key Pool & Infrastructure
- [ ] **Task 1.1**: Build `services/llm_pool_manager.py` with multi-provider API key rotation (Groq, NVIDIA NIM, OpenAI, OpenRouter).
- [ ] **Task 1.2**: Implement rate-limit tracking, exponential backoff, and automatic key rotation on `429` errors.
- [ ] **Task 1.3**: Configure agent-to-provider assignment matrix (Fast Groq LLMs for Planner/Router; Deep LLMs for Evidence Synthesizer).

---

## 🛑 Phase 2: Safety Override, Dynamic RAG & Intent Model (Spec #40, #42, #43)
- [ ] **Task 2.1**: Build Deterministic Safety Engine (`services/safety_engine.py`) to intercept queries for wave > 2.5m, wind > 25kts, cyclone alerts, and MPA trespass without binary safety claims (**Spec #42**).
- [ ] **Task 2.2**: Build Standard RAG vs Agentic RAG Router (`services/rag_router.py`) to dynamically direct static doc queries vs complex spatial-temporal queries.
- [ ] **Task 2.3**: Build Intent Classifier & Structured Validation Engine (`services/intent_service.py`) supporting 17 explicit intents (**Spec #40**): `FISHING_AREA_SUITABILITY`, `DEPARTURE_CONDITIONS`, `HAZARD_AVOIDANCE`, `ROUTE_CONTEXT`, `MARINE_CONDITIONS`, `PFZ_DISCOVERY`, `HISTORICAL_ANALYSIS`, `TREND_ANALYSIS`, `SPECIES_ANALYSIS`, `ECOSYSTEM_ANALYSIS`, `POLICY_SCENARIO`, `REGULATORY_LOOKUP`, `AQUACULTURE_RISK`, `VESSEL_OPERATION`, `DATASET_DISCOVERY`, `EXPLANATION`, `COMPARE_REGIONS`.
- [ ] **Task 2.4**: Implement Normalized Multi-Hazard Pipeline (`services/hazard_pipeline.py`) intersecting Cyclone, Lightning, Wind, Wave, Rain, and Storm Surge data with spatial/temporal user boundaries (**Spec #43**).

---

## 🔄 Phase 3: Agent-to-Agent (A2A) Messaging Bus & Memory System
- [ ] **Task 3.1**: Define A2A Envelope schema in `schema/a2a_schema.py` (`trace_id`, `sender`, `target`, `intent`, `payload`).
- [ ] **Task 3.2**: Build A2A Context Bus (`services/a2a_bus.py`) supporting parallel agent fan-out and fan-in evidence collection.
- [ ] **Task 3.3**: Implement Memory System (`services/memory_service.py`) covering Short-Term Working Memory, Episodic User Memory, and Vector RAG Memory.

---

## ⚖️ Phase 4: Evidence Synthesis, Response Contract & Governance (Spec #41, #47, #48, #49)
- [ ] **Task 4.1**: Build Evidence Schema (`schema/evidence_schema.py`) supporting observations, derived indicators, correlations, conflicts, limitations, and citations.
- [ ] **Task 4.2**: Implement Evidence Engine (`services/evidence_engine.py`) with hierarchical ranking (`In-situ > Satellite > Model > Baseline`) and explicit conflict logging.
- [ ] **Task 4.3**: Add Data Provenance & Citation Tracking for all dataset observations (`source_id`, `timestamp`, `confidence_score`) with audit logging (**Spec #47**).
- [ ] **Task 4.4**: Implement Standardized Backend Response Contract (`schema/response_contract.py`) containing `answer`, `recommendation`, `evidence`, `hazards`, `geofences`, `maps`, `charts`, `sources`, `limitations`, `conflicts`, `freshness`, and `language` (**Spec #41**).
- [ ] **Task 4.5**: Build Data Quality & Bias Reporting Module (`services/data_quality.py`) calculating data freshness, resolution, completeness, and highlighting geographic/vessel/language gaps (**Spec #48, #49**).

---

## 👥 Phase 5: 5-Level Progressive Disclosure, Persona Adapters & Security (Spec #46)
- [ ] **Task 5.1**: Build Persona & Progressive Disclosure Engine (`services/persona_adapter.py`).
- [ ] **Task 5.2**: Implement **Fisherman Persona Mode** (Simple, actionable, voice-friendly, regional terms, Tamil/Hindi translation).
- [ ] **Task 5.3**: Implement **Oceanographer Persona Mode** (Scientific SST, Chlorophyll-a, Argo profiles, data tables, provenance citations).
- [ ] **Task 5.4**: Implement **Policymaker Persona Mode** (Executive summary, EEZ compliance, MPA alerts, risk scores).
- [ ] **Task 5.5**: Implement **Aquaculture Mode** & **Shipping Mode** adapters.
- [ ] **Task 5.6**: Implement 5 Disclosure Levels (Level 1: Simple -> Level 5: Raw Data JSON).
- [ ] **Task 5.7**: Build Tool-Level Role-Based Access Control (RBAC) (`services/rbac_service.py`) enforcing access rules across 9 user roles (`PUBLIC_USER`, `FISHERMAN`, `RESEARCHER`, `NGO`, `AQUACULTURE_OPERATOR`, `MARITIME_OPERATOR`, `REGULATOR`, `ADMIN`, `DATA_PROVIDER`) (**Spec #46**).

---

## 🗺️ Phase 6: Geofencing, Route Intelligence, Map Metadata & Offline Sync (Spec #27, #31, #44, #45)
- [ ] **Task 6.1**: Implement Geofencing Service (`services/internal_tools/geofence_service.py`) for Territorial Waters (12 NM), EEZ (200 NM), and MPAs.
- [ ] **Task 6.2**: Implement Route Context Trade-Off Analyzer (`services/internal_tools/route_service.py`) comparing alternative route corridors (e.g. Route A vs Route B trade-offs) without autonomous navigation claims (**Spec #45**).
- [ ] **Task 6.3**: Implement Map Layer Metadata & Provenance Injector for SST, Chlorophyll, PFZ, wave, wind, cyclone, and boundary layers carrying timestamp, source, resolution, and freshness (**Spec #44**).
- [ ] **Task 6.4**: Implement Offline & Low-Bandwidth Synchronization engine (`services/offline_sync.py`) and schema (`schema/offline_schema.py`) with delta payload compression, offline intelligence bundle creation, and conservative stale-data handling (**Spec #27, #31**).
- [ ] **Task 6.5**: Build User Catch Feedback logging pipeline (`services/feedback_service.py`).

---

## 🚫 Phase 7: Production Rigor & Zero Mock Data Protocol (Spec #50)
- [ ] **Task 7.1**: Audit and completely remove all mock/placeholder data routines from production pipelines; enforce real data connectors (**Spec #50**).
- [ ] **Task 7.2**: Isolate synthetic data fixtures strictly within `tests/fixtures/` with explicit dev/test labels.

---

## 🧪 Phase 8: Verification, Multi-Axis Evaluation Framework & Code Graph (Spec #51, #52)
- [ ] **Task 8.1**: Build Multi-Level Automated Test Suite (`tests/`) covering unit tests (geospatial/temporal/units), integration tests (ingestion/tools), and AI evals (grounding/hallucination) (**Spec #51**).
- [ ] **Task 8.2**: Implement 6-Dimension Evaluation Framework (`services/evaluation_service.py`) scoring Data, Retrieval, Reasoning, Recommendation, Safety, and UX (**Spec #52**).
- [x] **Task 8.3**: Re-build Code Knowledge Graph (`code-review-graph`) and update architectural documentation.
