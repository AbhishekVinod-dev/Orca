# 🤖 Orca Multi-Agent System Prompts (`prompts/`)

This directory contains system prompts, agent personas, tool specification tags, and reasoning instructions for the Orca agentic framework.

---

## 📜 System Prompts in [`system_prompts.py`](system_prompts.py)

### 1. 🧠 `ORCHESTRATOR_SYSTEM_PROMPT`
- **Role**: Master Maritime Agent Coordinator.
- **Responsibilities**:
  - Analyzes incoming user requests along with injected user coordinates (`[Context: User is currently located at Latitude X, Longitude Y]`).
  - Decides whether to invoke sub-agents:
    - `<tool_call>{"name": "call_meteorology_agent", "arguments": {"prompt": "..."}}</tool_call>`
    - `<tool_call>{"name": "call_spatial_agent", "arguments": {"prompt": "..."}}</tool_call>`
  - Generates the final user-facing response inside `<final>...</final>` tags.

### 2. 🌦️ `METEOROLOGY_SYSTEM_PROMPT`
- **Role**: Specialist Marine Meteorologist.
- **Tools**: Invokes `get_marine_weather_forecast` to inspect wave height, wind, currents, and water temperature.
- **Guidance**: Formats marine safety warnings, swell advisories, and weather forecasts for non-technical sea workers.

### 3. 🗺️ `SPATIAL_SYSTEM_PROMPT`
- **Role**: GIS & Fishery Spatial Intelligence Specialist.
- **Tools**: Invokes `get_pfz_by_location` to fetch Potential Fishing Zones.
- **Guidance**: Provides spatial coordinates, fish abundance predictions, and boundary warnings.

---

## 🏷️ XML Tag Rules Engine

All agents in Orca must follow strict XML tag conventions:

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
