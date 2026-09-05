import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from main import app
from schema.offline_schema import (
    CacheStatus,
    OfflineBundleRequest,
    DeltaSyncRequest,
)
from services.offline_sync import OfflineSyncService

client = TestClient(app)


def test_calculate_freshness_live():
    now = datetime.now(timezone.utc)
    freshness = OfflineSyncService.calculate_freshness(
        source="INCOIS",
        data_type="wave_forecast",
        retrieved_at=now,
    )
    assert freshness.status == CacheStatus.LIVE
    assert freshness.age_hours < 0.1
    assert freshness.is_conservative_fallback is False


def test_calculate_freshness_stale_warning():
    stale_time = datetime.now(timezone.utc) - timedelta(hours=10)  # wave forecast TTL is 6.0h
    freshness = OfflineSyncService.calculate_freshness(
        source="INCOIS",
        data_type="wave_forecast",
        retrieved_at=stale_time,
    )
    assert freshness.status == CacheStatus.STALE_WARNING
    assert freshness.age_hours >= 9.9
    assert freshness.is_conservative_fallback is True


def test_wrap_tool_output_with_stale_warning():
    stale_time = datetime.now(timezone.utc) - timedelta(hours=12)
    wrapped = OfflineSyncService.wrap_tool_output(
        tool_name="get_wave_forecast",
        data_type="wave_forecast",
        source="Open-Meteo",
        payload={"wave_height": 2.8, "period_s": 8.5},
        retrieved_at=stale_time,
    )
    assert wrapped["tool"] == "get_wave_forecast"
    assert "freshness" in wrapped
    assert wrapped["freshness"]["status"] == CacheStatus.STALE_WARNING.value
    assert "safety_warning" in wrapped
    assert "Exercise caution" in wrapped["safety_warning"]


def test_create_offline_bundle():
    request = OfflineBundleRequest(
        user_id="usr_fisher_001",
        bbox=[80.0, 13.0, 81.0, 14.0],
        include_conversations=True,
    )
    bundle = OfflineSyncService.create_offline_bundle(
        request=request,
        maps=[{"layer": "sst"}],
        saved_routes=[{"route_id": "rt_1"}],
        previous_conversations=[{"turn": "1"}],
        retrieved_intelligence=[{"data": "val"}],
        alerts_advisories=[{"alert": "cyclone"}],
    )
    assert bundle.bundle_id.startswith("bundle_usr_fisher_001_")
    assert bundle.user_id == "usr_fisher_001"
    assert len(bundle.checksum) == 64  # SHA-256 length
    assert len(bundle.maps) == 1


def test_api_offline_freshness_endpoint():
    now_iso = datetime.now(timezone.utc).isoformat()
    response = client.get(
        f"/api/v1/offline/freshness?source=INCOIS&data_type=pfz&retrieved_at_iso={now_iso}"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "INCOIS"
    assert data["status"] == "LIVE"


def test_api_offline_bundle_endpoint():
    payload = {
        "user_id": "usr_test_123",
        "bbox": [80.2, 13.0, 80.5, 13.5],
        "include_conversations": True,
    }
    response = client.post("/api/v1/offline/bundle", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "usr_test_123"
    assert "checksum" in data
    assert len(data["retrieved_intelligence"]) > 0


def test_api_offline_sync_endpoint():
    payload = {
        "user_id": "usr_test_123",
        "offline_turns": [{"query": "wave status", "answer": "1.2m"}],
    }
    response = client.post("/api/v1/offline/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["synced_turns"] == 1
    assert len(data["new_alerts"]) > 0
