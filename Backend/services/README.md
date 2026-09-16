# ⚙️ Orca Services Layer (`services/`)

The `services/` module contains the core agent execution engine, orchestration logic, database connection management, XML tool extraction, and external API service integrations.

---

## 📂 Sub-modules & Components

| File | Primary Symbol | Description |
| :--- | :--- | :--- |
| [`agent_service.py`](agent_service.py) | `call_agent()` | Async generator loop running XML tool-calling and reasoning loops (`<thought>`, `<tool_call>`, `<final>`). |
| [`orchestrator.py`](orchestrator.py) | `call_orchestrator()` | Primary entry point agent. Injects user coordinates (`lat`, `long`), handles sub-agent delegation, and performs multilingual output translation. |
| [`stt_sarvam.py`](stt_sarvam.py) | `stt()` | Audio processing service leveraging Sarvam AI API for Indian language speech-to-text. |
| [`db_connection_service.py`](db_connection_service.py) | `connect_to_db()` | PostgreSQL database connection factory for PostGIS spatial queries. |
| [`extract_tool.py`](extract_tool.py) | `extract_json_between_tags()` | Helper utility to parse JSON arguments out of `<tool_call>` tags in LLM responses. |

---

## 🔄 Agent Execution & Streaming Protocol (`agent_service.py`)

`call_agent` manages recursive agent execution and yields Server-Sent Events (SSE) formatted as JSON strings:

1. **Thought Event**:
   ```json
   data: {"type": "thought", "name": "orchestrator", "content": "<thought>Analyzing user request...</thought>"}
   ```
2. **Status / Tool Execution Event**:
   ```json
   data: {"type": "status", "name": "orchestrator", "content": "Calling call_meteorology_agent..."}
   ```
3. **Final Response Event**:
   ```json
   data: {"type": "final", "name": "orchestrator", "content": "The sea condition is currently moderate with wave height 1.2m..."}
   ```
4. **Error Event**:
   ```json
   data: {"type": "error", "name": "orchestrator", "content": "Agent reasoning timed out after 5 attempts."}
   ```

---

## 🔗 Internal Dependencies

- `services/orchestrator.py` depends on:
  - `services/agent_service.py`
  - `services/internal_tools/execute_meteorology_agent.py`
  - `services/internal_tools/execute_spatial_agent.py`
  - `prompts/system_prompts.py`
  - `schema/chat_model.py`
