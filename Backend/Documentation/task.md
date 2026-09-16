# 📋 ORCA Marine Intelligence Platform — Complete ISRO Implementation Roadmap

This roadmap details the step-by-step implementation tasks required to build the **Universal Multi-Agent, Multi-Provider, Multi-Persona Marine Intelligence Platform** adhering strictly to the **ISRO Baseline Specification (`ORCA_Marine_Intelligence_Platform_Specification.md`)**.

---

## 🔑 Phase 1: Multi-Provider LLM Key Pool & Infrastructure
- [ ] **Task 1.1**: Build `services/llm_pool_manager.py` with multi-provider API key rotation (Groq, NVIDIA NIM, OpenAI, OpenRouter).
- [ ] **Task 1.2**: Implement rate-limit tracking, exponential backoff, and automatic key rotation on `429` errors.
- [ ] **Task 1.3**: Configure agent-to-provider assignment matrix (Fast Groq LLMs for Planner/Router; Deep LLMs for Evidence Synthesizer).

---

## 🛑 Phase 2: Safety Override & Dynamic RAG Router
- [ ] **Task 2.1**: Build Deterministic Safety Engine (`services/safety_engine.py`) to intercept queries for wave > 2.5m, wind > 25kts, cyclone alerts, and MPA trespass.
- [ ] **Task 2.2**: Build Standard RAG vs Agentic RAG Router (`services/rag_router.py`) to dynamically direct static doc queries vs complex spatial-temporal queries.

---

## 🔄 Phase 3: Agent-to-Agent (A2A) Messaging Bus & Memory System
- [ ] **Task 3.1**: Define A2A Envelope schema in `schema/a2a_schema.py` (`trace_id`, `sender`, `target`, `intent`, `payload`).
- [ ] **Task 3.2**: Build A2A Context Bus (`services/a2a_bus.py`) supporting parallel agent fan-out and fan-in evidence collection.
- [ ] **Task 3.3**: Implement Memory System (`services/memory_service.py`) covering Short-Term Working Memory, Episodic User Memory, and Vector RAG Memory.

---

## ⚖️ Phase 4: Evidence Synthesis, Conflict & Provenance Engine
- [ ] **Task 4.1**: Build Evidence Schema (`schema/evidence_schema.py`) supporting observations, derived indicators, correlations, conflicts, limitations, and citations.
- [ ] **Task 4.2**: Implement Evidence Engine (`services/evidence_engine.py`) with hierarchical ranking (`In-situ > Satellite > Model > Baseline`) and explicit conflict logging.
- [ ] **Task 4.3**: Add Data Provenance & Citation Tracking for all dataset observations (`source_id`, `timestamp`, `confidence_score`).

---

## 👥 Phase 5: 5-Level Progressive Disclosure & 5-Persona Adapters
- [ ] **Task 5.1**: Build Persona & Progressive Disclosure Engine (`services/persona_adapter.py`).
- [ ] **Task 5.2**: Implement **Fisherman Persona Mode** (Simple, actionable, voice-friendly, regional terms, Tamil/Hindi translation).
- [ ] **Task 5.3**: Implement **Oceanographer Persona Mode** (Scientific SST, Chlorophyll-a, Argo profiles, data tables, provenance citations).
- [ ] **Task 5.4**: Implement **Policymaker Persona Mode** (Executive summary, EEZ compliance, MPA alerts, risk scores).
- [ ] **Task 5.5**: Implement **Aquaculture Mode** & **Shipping Mode** adapters.
- [ ] **Task 5.6**: Implement 5 Disclosure Levels (Level 1: Simple -> Level 5: Raw Data JSON).

---

## 🗺️ Phase 6: Geofencing, Route Intelligence & Offline Sync
- [ ] **Task 6.1**: Implement Geofencing Service (`services/internal_tools/geofence_service.py`) for Territorial Waters (12 NM), EEZ (200 NM), and MPAs.
- [ ] **Task 6.2**: Implement Safe Route Corridor calculator (`services/internal_tools/route_service.py`).
- [ ] **Task 6.3**: Implement Offline & Low-Bandwidth Synchronization engine (`services/offline_sync.py`) with delta payload compression.
- [ ] **Task 6.4**: Build User Catch Feedback logging pipeline (`services/feedback_service.py`).

---

## 🧪 Phase 7: Verification & Code Knowledge Graph Indexing
- [ ] **Task 7.1**: Create automated unit tests for Safety Overrides, Evidence Conflict Resolution, and Persona Formatting (`tests/`).
- [x] **Task 7.2**: Re-build Code Knowledge Graph (`code-review-graph`) and update architectural documentation.
