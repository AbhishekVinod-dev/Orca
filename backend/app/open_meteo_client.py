import asyncio

import httpx

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"


async def fetch_conditions(lat: float, lng: float) -> dict:
    """Real current wind (km/h) and wave height (m) at the given coordinates,
    from Open-Meteo (free, no API key). Raises on any failure -- callers
    fall back to static demo-mode data."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        wind_task = client.get(
            FORECAST_URL,
            params={"latitude": lat, "longitude": lng, "current": "wind_speed_10m,wind_gusts_10m"},
        )
        wave_task = client.get(
            MARINE_URL,
            params={"latitude": lat, "longitude": lng, "hourly": "wave_height"},
        )
        wind_resp, wave_resp = await asyncio.gather(wind_task, wave_task)
        wind_resp.raise_for_status()
        wave_resp.raise_for_status()

        wind = wind_resp.json()["current"]
        wave_height = wave_resp.json()["hourly"]["wave_height"][0]

        return {
            "wind_speed_kmh": wind["wind_speed_10m"],
            "wind_gusts_kmh": wind["wind_gusts_10m"],
            "wave_height_m": wave_height,
        }
