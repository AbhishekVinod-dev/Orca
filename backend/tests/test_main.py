from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_docs_renders():
    response = client.get("/docs")
    assert response.status_code == 200


def test_get_alerts_returns_seven_mock_alerts():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 7
    assert body[0]["id"] == "ALT-001"
    assert body[0]["type"] == "cyclone"
    assert body[0]["coordinates"] == [13.5, 82.1]
