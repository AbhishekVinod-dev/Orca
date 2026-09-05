import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
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


def test_data_agent_excludes_demo_alerts_for_every_intent():
    for intent in ("SAFETY", "CYCLONE", "PFZ", "OCEANOGRAPHY", "GENERAL"):
        assert data_agent(intent) == []


def test_risk_agent_returns_zero_for_no_alerts():
    assert risk_agent([]) == 0


def test_risk_agent_returns_max_severity_score():
    alerts = [{"severity": "moderate"}, {"severity": "critical"}, {"severity": "low"}]
    assert risk_agent(alerts) == 100


@patch("app.pipeline.generate_advisory", return_value="Conditions are dangerous today.")
@patch("app.pipeline.classify_intent", return_value="CYCLONE")
def test_post_chat_streams_steps_then_final_without_demo_warnings(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "is the cyclone dangerous", "language": "en"})

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    assert response.headers["cache-control"] == "no-cache"
    events = _parse_sse(response.text)
    step_events = [event for event in events if event[0] == "step"]
    final_events = [event for event in events if event[0] == "final"]

    assert len(step_events) == 4
    assert [step["agent"] for _, step in step_events] == ["Planner", "DataAgent", "RiskAgent", "ResponseAgent"]
    assert len(final_events) == 1
    assert final_events[0][1]["response"] == "Conditions are dangerous today."
    assert final_events[0][1]["relatedData"] is None
    assert "No live official warning feed" in step_events[1][1]["detail"]


@patch("app.pipeline.generate_advisory", return_value="Here are some historical observations.")
@patch("app.pipeline.classify_intent", return_value="PFZ")
def test_post_chat_omits_warnings_for_non_hazard_intent(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "where should I fish", "language": "en"})

    assert response.status_code == 200
    final = next(data for event, data in _parse_sse(response.text) if event == "final")
    assert final["response"] == "Here are some historical observations."
    assert final["relatedData"] is None


@patch("app.main.stream_chat_pipeline", side_effect=RuntimeError("provider unavailable"))
def test_post_chat_streams_a_safe_error_event_when_pipeline_fails(mock_pipeline):
    response = client.post("/api/chat", json={"query": "is it safe today"})

    assert response.status_code == 200
    assert _parse_sse(response.text) == [
        ("error", {
            "code": "upstream_unavailable",
            "message": "The advisory service is temporarily unavailable. Please try again later.",
        })
    ]
