# 🌐 Orca API Controllers (`routes/`)

The `routes/` directory defines FastAPI endpoint routers for client applications, mobile apps, and microservice consumers.

---

## 📡 Endpoints Specification

| Prefix | Endpoint | Method | Response Type | Controller File | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `/api/v1/agent` | `/` | `POST` | `text/event-stream` | [`agent.py`](agent.py) | Main agent streaming chat interface (SSE). Accepts `ChatRequest`. |
| `/api/v1/speech` | `/` | `POST` | `application/json` | [`speech.py`](speech.py) | Audio file speech-to-text endpoint. |
| `/api/v1/auth` | `/` | `POST` | `application/json` | [`auth.py`](auth.py) | User authentication endpoint. |
| `/api/v1/internal_tools/eez_boundaries` | `/` | `POST` | `application/json` | [`internal_tools/eez_boundaries.py`](internal_tools/eez_boundaries.py) | Direct REST access to EEZ spatial query. |
| `/api/v1/internal_tools/pfz` | `/` | `POST` | `application/json` | [`internal_tools/pfz.py`](internal_tools/pfz.py) | Direct REST access to PFZ advisory query. |

---

## 💻 Streaming Example (`/api/v1/agent`)

### Request Payload:
```json
{
  "prompt": "Is it safe to fish near location 12.97, 80.24 today?",
  "role": "fisherman",
  "lang": "ta",
  "lat": 12.971594,
  "long": 80.244722
}
```

### Event Stream Output:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8

data: {"type": "thought", "name": "orchestrator", "content": "Checking weather and spatial boundaries..."}

data: {"type": "status", "name": "orchestrator", "content": "Calling call_meteorology_agent..."}

data: {"type": "final", "name": "orchestrator", "content": "இன்று அலை உயரம் 1.2 மீட்டராக உள்ளது, மீன்பிடிக்க பாதுகாப்பானது."}
```
