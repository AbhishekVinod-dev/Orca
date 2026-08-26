# Real alternative to IMD cyclone track/warning APIs (B1/B2), which remain
# blocked on a developer key IMD has not issued and a self-service checklist
# that doesn't even list cyclone endpoints -- see docs/MIGRATION_TRACKER.md
# Open Blockers. GDACS (Global Disaster Alert and Coordination System, run by
# the EU JRC + UN OCHA) is free, keyless, and aggregates real tropical
# cyclone bulletins (source agency e.g. JTWC) as GeoJSON. Verified live via
# curl: https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH

from datetime import datetime, timedelta, timezone

import httpx

GDACS_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"

# GDACS alert levels are Green/Orange/Red (impact-based). Mapped onto our
# critical/high/moderate/low scale -- GDACS has no "low" tier for an event
# that's real enough to be listed at all, so Green maps to "moderate".
SEVERITY_MAP = {"Green": "moderate", "Orange": "high", "Red": "critical"}

# GDACS's own "iscurrent" flag means "latest episode record for this event
# id", NOT "happening today" -- verified live: it stayed true for cyclones
# that ended months ago. A storm's warning relevance doesn't end the instant
# its bulletin's `todate` passes, so keep a short grace window rather than
# requiring todate >= now.
RECENCY_GRACE = timedelta(days=2)


async def fetch_active_cyclones(country: str = "India") -> list[dict]:
    """Real tropical cyclone events affecting `country` that are ongoing or
    ended within the last two days, straight from GDACS. Raises on failure
    -- callers fall back to demo-mode mock data, same pattern as
    open_meteo_client.fetch_conditions."""
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(GDACS_URL, params={"eventlist": "TC", "country": country})
        resp.raise_for_status()
        data = resp.json()

    now = datetime.now(timezone.utc)
    alerts = []
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
            "coordinates": (lat, lng),
            "issuedAt": p["fromdate"],
            "expiresAt": p["todate"],
            "source": f"GDACS ({p.get('source') or 'multi-source'})",
            "affectedZones": [c["countryname"] for c in p.get("affectedcountries", [])],
        })
    return alerts
