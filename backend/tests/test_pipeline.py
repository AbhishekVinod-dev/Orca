from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.pipeline import data_agent, risk_agent

client = TestClient(app)


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
def test_post_chat_returns_chat_response_with_verbatim_warning(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "is the cyclone dangerous", "language": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["response"].startswith("Conditions are dangerous today.")
    assert (
        "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. "
        "All fishing vessels advised to return to port immediately. Coastal communities in Tamil "
        "Nadu and Andhra Pradesh should prepare for evacuation."
    ) in body["response"]
    assert len(body["agentTrace"]) == 4
    assert body["agentTrace"][0]["agent"] == "Planner"
    assert body["agentTrace"][1]["agent"] == "DataAgent"
    assert body["agentTrace"][2]["agent"] == "RiskAgent"
    assert body["agentTrace"][3]["agent"] == "ResponseAgent"
    assert body["relatedData"]["alerts"] == [
        "ALT-001", "ALT-002", "ALT-003", "ALT-004", "ALT-005", "ALT-006", "ALT-007"
    ]


@patch("app.pipeline.generate_advisory", return_value="Here are some good fishing zones.")
@patch("app.pipeline.classify_intent", return_value="PFZ")
def test_post_chat_omits_warnings_for_non_hazard_intent(mock_intent, mock_advisory):
    response = client.post("/api/chat", json={"query": "where should I fish", "language": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["response"] == "Here are some good fishing zones."
    assert body["relatedData"] is None
