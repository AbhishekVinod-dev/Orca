# 📐 Orca Data Schemas (`schema/`)

This directory contains Pydantic models enforcing data contracts and payload validation across FastAPI endpoints and agent channels.

---

## 📄 Schemas in [`chat_model.py`](chat_model.py)

### `ChatRequest`

Defines the payload structure for `/api/v1/agent` requests:

```python
from pydantic import BaseModel


class ChatRequest(BaseModel):
    prompt: str  # User natural language input
    role: str  # Persona/role of user (e.g., "fisherman", "port_authority")
    lang: str  # Preferred language code (e.g., "en", "ta", "hi", "te")
    lat: float  # Current latitude coordinate
    long: float  # Current longitude coordinate
```

---

## 🔒 Data Validation & Types

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `prompt` | `str` | Yes | Query text, e.g. *"Can I set sail for fishing today?"* |
| `role` | `str` | Yes | User persona driving agent tone and safety thresholds. |
| `lang` | `str` | Yes | Target language for automatic Sarvam AI translation. |
| `lat` | `float` | Yes | WGS84 latitude coordinate. |
| `long` | `float` | Yes | WGS84 longitude coordinate. |
