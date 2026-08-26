from unittest.mock import AsyncMock, patch

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


@patch(
    "app.main.fetch_conditions",
    new_callable=AsyncMock,
    return_value={"wind_speed_kmh": 99.0, "wind_gusts_kmh": 120.0, "wave_height_m": 3.3},
)
def test_get_alerts_overlays_live_wind_and_wave(mock_fetch):
    response = client.get("/api/alerts")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 7
    assert body[0]["id"] == "ALT-001"
    assert body[0]["type"] == "cyclone"
    assert body[0]["coordinates"] == [13.5, 82.1]
    # ALT-001 has windSpeed/waveHeight in the mock -> overlaid with live values
    assert body[0]["windSpeed"] == 99
    assert body[0]["waveHeight"] == 3.3
    # ALT-004 (geofence) has neither field in the mock -> stays absent, not invented
    alt_004 = next(a for a in body if a["id"] == "ALT-004")
    assert alt_004.get("windSpeed") is None
    assert alt_004.get("waveHeight") is None


@patch("app.main.fetch_conditions", new_callable=AsyncMock, side_effect=Exception("network down"))
def test_get_alerts_falls_back_to_mock_values_on_fetch_failure(mock_fetch):
    response = client.get("/api/alerts")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 7
    # ALT-001's original mock windSpeed/waveHeight, unchanged
    assert body[0]["windSpeed"] == 120
    assert body[0]["waveHeight"] == 8.5
