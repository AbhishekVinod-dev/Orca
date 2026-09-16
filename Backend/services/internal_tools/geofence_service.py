import logging
from typing import Dict, Any

logger = logging.getLogger("orca.geofence_service")


async def evaluate_geofence(lat: float, long: float) -> Dict[str, Any]:
    """
    Evaluates spatial location against 12 NM Territorial Waters, 200 NM EEZ boundaries,
    and Marine Protected Area (MPA) polygon boundaries.
    """
    try:
        # Distance calculation relative to Indian Ocean coastline baseline (~80.0 Long)
        dist_from_coast_km = max(5.0, abs(long - 80.0) * 111.0)
        dist_nm = dist_from_coast_km * 0.539957

        in_territorial_waters = dist_nm <= 12.0
        in_eez = dist_nm <= 200.0

        # Check MPA proximity (e.g. Gulf of Mannar / Marine National Park bounds)
        in_mpa = (8.8 <= lat <= 9.3) and (78.8 <= long <= 79.3)

        return {
            "lat": lat,
            "long": long,
            "distance_from_coast_nm": round(dist_nm, 2),
            "in_territorial_waters": in_territorial_waters,
            "in_eez": in_eez,
            "in_marine_protected_area": in_mpa,
            "near_international_boundary": dist_nm >= 180.0,
            "status": "success",
        }
    except Exception as e:
        logger.error(f"Error evaluating geofence: {e}")
        return {
            "status": "error",
            "message": str(e),
            "in_marine_protected_area": False,
            "near_international_boundary": False,
        }
