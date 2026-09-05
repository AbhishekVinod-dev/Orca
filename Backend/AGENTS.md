# Orca Agent Instructions

## Package Manager
Use **uv** or **pip**:
- `uv run python main.py`
- `uv run pytest tests/`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Run App | `uv run python main.py` |
| Test All | `uv run python -m unittest discover tests` |
| Test Single File | `uv run python -m unittest tests/test_backend_comprehensive.py` |

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Gemini Flash 3.6 <noreply@google.com>
```

## Key Conventions
- **Additive Architecture**: Keep core code unmodified. Add new capabilities via hooks, decorators, or isolated modules.
- **XML Reasoning Schema**: All LLM agents MUST return reasoning using `<thought>...</thought>`, tool execution using `<tool_call>{...}</tool_call>`, and final answer inside `<final>...</final>`.
- **A2A Bus Protocol**: Inter-agent communication MUST use `A2AEnvelope` (`trace_id`, `sender_agent`, `target_agent`, `intent`, `payload`).
- **Data Provenance**: Every observation returned to personas MUST include `source_id`, `confidence_score`, and `timestamp`.
- **PFZ Fields Guarantee**: Ocean & PFZ responses MUST always return `suitability`, `safety`, `sst`, and `chlorophyll`.
