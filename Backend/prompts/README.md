# 🤖 Orca Multi-Agent System Prompts (`Backend/prompts/`)

This directory contains system prompts, agent personas, tool specification tags, and reasoning instructions for the Orca multi-agent framework.

---

## 📜 Production System Prompts in [`system_prompts.py`](system_prompts.py)

### 1. 🧠 `ORCHESTRATOR_SYSTEM_PROMPT`
- **Role**: Master Maritime Agent Coordinator.
- **Responsibilities**:
  - Analyzes incoming user requests along with injected user coordinates (`[Context: User is currently located at Latitude X, Longitude Y]`).
  - Evaluates pre-LLM safety guardrails and coordinates A2A bus parallel tool execution (`call_meteorology_agent`, `call_spatial_agent`, `get_ocean_intelligence`, `evaluate_geofence`).
  - Synthesizes evidence packages and delegates output formatting to persona adapters.

### 2. 🌦️ `METEOROLOGY_SYSTEM_PROMPT`
- **Role**: Specialist Marine Meteorologist.
- **Tools**: Invokes `get_marine_weather_forecast`, `get_wind_stress`, and `check_cyclone_potential`.
- **Guidance**: Formats marine safety warnings, swell advisories, and sea state forecasts for non-technical sea workers.

### 3. 🗺️ `SPATIAL_SYSTEM_PROMPT`
- **Role**: GIS & Fishery Spatial Intelligence Specialist.
- **Tools**: Invokes `check_imbl_distance`, `get_pfz_by_location`, and `evaluate_geofence`.
- **Guidance**: Queries PostGIS spatial databases for 12 NM Territorial Waters, 200 NM EEZ boundaries, and IMBL distance calculations. Summarizes spatial findings without returning raw GeoJSON dumps.

### 4. 🌊 `OCEANOGRAPHY_SYSTEM_PROMPT`
- **Role**: Physical & Biological Oceanography Specialist.
- **Tools**: Invokes `get_pfz` and `get_ocean_intelligence`.
- **Guidance**: Parses INCOIS Potential Fishing Zones (PFZ), Sea Surface Temperature (SST), Chlorophyll-a concentrations, and Argo float datasets.
- **Mandated Response Fields**: Always includes `suitability`, `safety`, `sst`, and `chlorophyll` (using satellite estimated baselines if live scraped tables omit them).

### 5. 🛑 `SAFETY_GUARD_SYSTEM_PROMPT`
- **Role**: Pre-LLM Deterministic Safety & Hazard Interceptor.
- **Guidance**: Evaluates threshold rules for wave height ($> 2.5\text{m}$), wind speed ($> 25\text{kts}$), cyclone potential ($> 80\text{ kJ/cm}^2$), and MPA border trespass.

### 6. 👥 `PERSONA_ADAPTER_SYSTEM_PROMPT`
- **Role**: 5-Persona & 5-Level Progressive Disclosure Response Adapter.
- **Guidance**: Formats evidence packages into tailored responses for **Fisherman**, **Oceanographer**, **Policymaker**, **Aquaculture**, and **Shipping** personas across 5 disclosure levels.

---

## 🏷️ XML Tag Rules Engine

All reasoning agents in Orca MUST follow strict XML tag conventions:

```xml
<thought>
Reasoning step detailing why a tool or sub-agent is being invoked.
</thought>
<tool_call>
{
  "name": "tool_or_subagent_name",
  "arguments": {
    "key": "value"
  }
}
</tool_call>
<final>
Final structured response returned to the orchestrator/user.
</final>
```
