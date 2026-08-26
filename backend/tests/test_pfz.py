from fastapi.testclient import TestClient

from app.argo_data import ARGO_ZONES
from app.main import app

client = TestClient(app)


def test_get_pfz_returns_real_argo_zones():
    response = client.get("/api/pfz")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == len(ARGO_ZONES)
    assert len(body) > 0
    zone = body[0]
    assert zone["id"].startswith("PFZ-ARGO-")
    # sst_range must come from real ARGO temp_adjusted values, not a fixed placeholder
    assert zone["sst_range"][0] < zone["sst_range"][1]
    # chlorophyll is documented as a static reference range, same for every zone
    assert zone["chlorophyll_range"] == [0.3, 2.0]


def test_get_pfz_filters_by_radius():
    # Centered near a known Bay of Bengal zone, small radius
    response = client.get("/api/pfz", params={"lat": 6.0, "lng": 87.0, "radius": 10})
    assert response.status_code == 200
    body = response.json()
    assert len(body) >= 1
    assert all(z["centroid"] == [6.0, 87.0] for z in body)
