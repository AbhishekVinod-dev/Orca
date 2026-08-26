import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.mock_alerts import MOCK_ALERTS
from app.pipeline import data_agent, risk_agent

client = TestClient(app)


def _parse_sse(text: str) -> list[tuple[str, dict]]:
    events = []
    for block in text.strip().split("\n\n"):
        lines = block.splitlines()
        event = next(line[len("event: "):] for line in lines if line.startswith("event: "))
        data = next(line[len("data: "):] for line in lines if line.startswith("data: "))
        events.append((event, json.loads(data)))
    return events


def test_data_agent_returns_alerts_for_hazard_intents():
    assert len(data_agent("SAFETY")) == 7
    assert len(data_agent("CYCLONE")) == 7


def test_data_agent_returns_empty_for_non_hazard_intents():
    assert data_agent("PFZ") == []
    assert data_agent("OCEANOGRAPHY") == []
    assert data_agent("GENERAL") == []


def test_risk_agent_returns_zero_for_no_alerts():
    assert risk_agent([]) == 0


def test_risk_agent_returns_max_severity_score():
    alerts = [{"severity": "moderate"}, {"severity": "critical"}, {"severity": "low"}]
    assert risk_agent(alerts) == 100


@patch("app.pipeline.generate_advisory", return_value="Conditions are dangerous today.")
@patch("app.pipeline.classify_intent", return_value="CYCLONE")
def test_post_chat_streams_steps_then_final_with_verbatim_warning(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "is the cyclone dangerous", "language": "en"})

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")

    events = _parse_sse(response.text)
    step_events = [e for e in events if e[0] == "step"]
    final_events = [e for e in events if e[0] == "final"]

    assert len(step_events) == 4
    assert [s["agent"] for _, s in step_events] == ["Planner", "DataAgent", "RiskAgent", "ResponseAgent"]

    assert len(final_events) == 1
    final = final_events[0][1]
    assert final["response"].startswith("Conditions are dangerous today.")
    assert (
        "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. "
        "All fishing vessels advised to return to port immediately. Coastal communities in Tamil "
        "Nadu and Andhra Pradesh should prepare for evacuation."
    ) in final["response"]
    # B7: source ID and issuing authority must also render verbatim, not just description text
    assert "ALT-001" in final["response"]
    assert "IMD New Delhi" in final["response"]
    assert final["relatedData"]["alerts"] == [
        "ALT-001", "ALT-002", "ALT-003", "ALT-004", "ALT-005", "ALT-006", "ALT-007"
    ]


@patch("app.pipeline.generate_advisory", return_value="Advisory text.")
@patch("app.pipeline.classify_intent", return_value="SAFETY")
def test_b7_every_alert_field_renders_byte_identical(mock_intent, mock_advisory):
    """B7 audit: for every alert in the demo-mode data source, title, id,
    source, and description must appear byte-identical in the rendered
    response -- never summarized, reworded, or dropped."""
    response = client.post("/api/chat", json={"query": "is it safe today", "language": "en"})

    assert response.status_code == 200
    final = next(data for event, data in _parse_sse(response.text) if event == "final")
    rendered = final["response"]

    assert len(MOCK_ALERTS) == 7
    for alert in MOCK_ALERTS:
        assert alert["title"] in rendered, f"{alert['id']} title missing or altered"
        assert alert["id"] in rendered, f"{alert['id']} source ID missing"
        assert alert["source"] in rendered, f"{alert['id']} issuing authority missing"
        assert alert["description"] in rendered, f"{alert['id']} description missing or altered"


@patch("app.pipeline.generate_advisory", return_value="Here are some good fishing zones.")
@patch("app.pipeline.classify_intent", return_value="PFZ")
def test_post_chat_omits_warnings_for_non_hazard_intent(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "where should I fish", "language": "en"})

    assert response.status_code == 200
    events = _parse_sse(response.text)
    final = next(data for event, data in events if event == "final")

    assert final["response"] == "Here are some good fishing zones."
    assert final["relatedData"] is None
