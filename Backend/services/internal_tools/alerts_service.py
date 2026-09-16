# Real tropical-cyclone alerts from GDACS (free, keyless) merged with a
# static mock fallback for the other hazard types. Ported from the old
# backend (git history: backend/app/gdacs_client.py + mock_alerts.py) --
# neither backend-latest nor sanjay-backend ship an alerts route. IMD's
# cyclone APIs remain blocked on a key that was never issued -- see
# docs/MIGRATION_TRACKER.md Open Blockers.
#
# Field names are camelCase (issuedAt, affectedZones, ...) to match the
# frontend's BackendAlert shape in services/api.ts -- do not snake_case them.

from datetime import datetime, timedelta, timezone

import httpx

GDACS_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"

# GDACS impact levels are Green/Orange/Red. Green maps to "moderate" -- GDACS
# has no "low" tier for an event real enough to be listed at all.
SEVERITY_MAP = {"Green": "moderate", "Orange": "high", "Red": "critical"}

# GDACS's "iscurrent" flag means "latest episode for this event id", not
# "happening today" (verified live: stayed true for cyclones ended months
# ago). Keep a short grace window on `todate` instead.
RECENCY_GRACE = timedelta(days=2)

# Demo-mode fallback data, kept in sync with data/mockData.ts on the frontend.
MOCK_ALERTS: list[dict] = [
    {
        "id": "ALT-001",
        "type": "cyclone",
        "severity": "critical",
        "title": "Cyclone Warning: Bay of Bengal",
        "description": "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. All fishing vessels advised to return to port immediately. Coastal communities in Tamil Nadu and Andhra Pradesh should prepare for evacuation.",
        "region": "Bay of Bengal (N)",
        "coordinates": [13.5, 82.1],
        "issuedAt": "2026-08-25T06:00:00Z",
        "expiresAt": "2026-08-27T06:00:00Z",
        "source": "IMD New Delhi",
        "affectedZones": ["Tamil Nadu Coast", "Andhra Pradesh Coast", "Puducherry"],
        "windSpeed": 120,
        "waveHeight": 8.5,
        "distance": 340,
    },
    {
        "id": "ALT-002",
        "type": "high-wave",
        "severity": "high",
        "title": "High Wave Alert: Arabian Sea",
        "description": "Wave heights of 4-6 m expected along Kerala and Karnataka coastlines due to active southwest monsoon. Small vessels should not venture into the sea.",
        "region": "Arabian Sea (SE)",
        "coordinates": [10.5, 75.8],
        "issuedAt": "2026-08-25T03:00:00Z",
        "expiresAt": "2026-08-26T03:00:00Z",
        "source": "INCOIS Hyderabad",
        "affectedZones": ["Kerala (N)", "Karnataka", "Goa"],
        "waveHeight": 5.2,
        "distance": 120,
    },
    {
        "id": "ALT-003",
        "type": "lightning",
        "severity": "high",
        "title": "Thunderstorm & Lightning Warning",
        "description": "Active thunderstorm cell moving NNE at 25 km/h. Lightning strikes likely within 20 km radius. Fishermen advised to return immediately and stay clear of tall masts.",
        "region": "Gulf of Mannar",
        "coordinates": [8.9, 78.6],
        "issuedAt": "2026-08-25T09:30:00Z",
        "expiresAt": "2026-08-25T21:30:00Z",
        "source": "IMD Chennai",
        "affectedZones": ["Gulf of Mannar", "Tuticorin", "Ramanathapuram"],
        "windSpeed": 45,
        "distance": 67,
    },
    {
        "id": "ALT-004",
        "type": "geofence",
        "severity": "high",
        "title": "Maritime Boundary Alert: International Waters",
        "description": "Two vessels detected approaching Sri Lankan EEZ boundary. Maintain at least 5 nm buffer. Indian Navy patrol active in the region.",
        "region": "Palk Strait",
        "coordinates": [9.4, 80.2],
        "issuedAt": "2026-08-25T07:15:00Z",
        "expiresAt": "2026-08-25T19:15:00Z",
        "source": "Indian Coast Guard",
        "affectedZones": ["Palk Strait", "Rameswaram", "Mandapam"],
        "distance": 180,
    },
    {
        "id": "ALT-005",
        "type": "wind",
        "severity": "moderate",
        "title": "Strong Wind Advisory: Lakshadweep Sea",
        "description": "Wind speeds of 35-45 knots expected. Medium-sized vessels should exercise caution. Safe navigation windows: 0600-1000 IST and 1600-1900 IST.",
        "region": "Lakshadweep Sea",
        "coordinates": [10.5, 72.6],
        "issuedAt": "2026-08-25T00:00:00Z",
        "expiresAt": "2026-08-26T00:00:00Z",
        "source": "INCOIS Hyderabad",
        "affectedZones": ["Lakshadweep Islands", "North Kerala"],
        "windSpeed": 72,
        "distance": 420,
    },
    {
        "id": "ALT-006",
        "type": "fog",
        "severity": "moderate",
        "title": "Dense Fog Advisory: West Bengal Coast",
        "description": "Visibility dropping below 200m in early morning hours (0300-0700 IST). Vessels should use foghorns and radar. Reduce speed and maintain safe distance.",
        "region": "West Bengal Coast",
        "coordinates": [21.8, 87.6],
        "issuedAt": "2026-08-25T18:00:00Z",
        "expiresAt": "2026-08-26T08:00:00Z",
        "source": "IMD Kolkata",
        "affectedZones": ["Haldia", "Sagar Island", "Paradip"],
        "distance": 890,
    },
    {
        "id": "ALT-007",
        "type": "high-wave",
        "severity": "low",
        "title": "Moderate Wave Forecast: Gujarat Coast",
        "description": "Wave heights of 1.5-2.5 m expected along Saurashtra coast. Experienced fishermen may operate with caution. Monitor updates every 6 hours.",
        "region": "Saurashtra Coast",
        "coordinates": [21.5, 69.5],
        "issuedAt": "2026-08-25T06:00:00Z",
        "expiresAt": "2026-08-26T06:00:00Z",
        "source": "INCOIS Hyderabad",
        "affectedZones": ["Veraval", "Porbandar", "Dwarka"],
        "waveHeight": 2.1,
        "distance": 1100,
    },
]


async def fetch_active_cyclones(country: str = "India") -> list[dict]:
    """Real tropical cyclone events affecting `country`, ongoing or ended
    within the last two days, from GDACS. Raises on failure so get_alerts()
    can fall back to the mock cyclone entry."""
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(GDACS_URL, params={"eventlist": "TC", "country": country})
        resp.raise_for_status()
        data = resp.json()

    now = datetime.now(timezone.utc)
    alerts: list[dict] = []
    for feature in data.get("features", []):
        p = feature["properties"]
        todate = datetime.fromisoformat(p["todate"]).replace(tzinfo=timezone.utc)
        if todate < now - RECENCY_GRACE:
            continue  # stale episode, not an active warning today
        lng, lat = feature["geometry"]["coordinates"]
        alerts.append({
            "id": f"GDACS-{p['eventid']}",
            "type": "cyclone",
            "severity": SEVERITY_MAP.get(p["alertlevel"], "moderate"),
            "title": p["name"],
            "description": p["htmldescription"],
            "region": p["country"],
            "coordinates": [lat, lng],
            "issuedAt": p["fromdate"],
            "expiresAt": p["todate"],
            "source": f"GDACS ({p.get('source') or 'multi-source'})",
            "affectedZones": [c["countryname"] for c in p.get("affectedcountries", [])],
        })
    return alerts


async def get_alerts() -> list[dict]:
    """All marine alerts: live GDACS cyclones (when available) replace the
    mock cyclone entry; the other hazard types stay as demo-mode mocks."""
    records = list(MOCK_ALERTS)
    try:
        live_cyclones = await fetch_active_cyclones()
    except Exception:
        live_cyclones = []
    if live_cyclones:
        records = [r for r in records if r["type"] != "cyclone"] + live_cyclones
    return records
