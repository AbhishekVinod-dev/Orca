import csv
from collections import defaultdict
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[2] / "database" / "argo_profiles_final.csv"

TARGET_REGIONS = {"Arabian Sea", "Bay of Bengal"}
GRID_SIZE = 3.0  # degrees, for clustering nearby profiles into zones

# ARGO floats measure temperature/salinity, not chlorophyll. No live
# chlorophyll source is wired up yet (needs MODIS/Sentinel-3 per
# TECH_STACK.md Track B). This is a documented static reference range for
# the Indian coastal shelf, not a per-request measurement -- labeled
# honestly rather than presented as observed data.
CHLOROPHYLL_REFERENCE_RANGE = (0.3, 2.0)

SPECIES_BY_REGION = {
    "Arabian Sea": ["Indian Mackerel", "Sardine", "Pomfret"],
    "Bay of Bengal": ["Seer Fish", "Tuna", "Anchovy"],
}


def _load_zones() -> list[dict]:
    """Groups real ARGO near-surface (0-50 dbar) temperature readings into
    coarse geographic zones. Returns raw dicts (not PFZZone yet) so this
    module has no dependency on app.schemas."""
    buckets: dict[tuple[str, float, float], list[tuple[float, str]]] = defaultdict(list)

    with DATA_PATH.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["region"] not in TARGET_REGIONS:
                continue
            if row["pressure_bin"] != "(0, 50]":
                continue  # near-surface only, used as an SST proxy
            lat = float(row["latitude"])
            lng = float(row["longitude"])
            grid_lat = round(lat / GRID_SIZE) * GRID_SIZE
            grid_lng = round(lng / GRID_SIZE) * GRID_SIZE
            date_str = f"{row['year']}-{int(row['month']):02d}-{int(row['day']):02d}"
            buckets[(row["region"], grid_lat, grid_lng)].append((float(row["temp_adjusted"]), date_str))

    zones = []
    for i, ((region, grid_lat, grid_lng), readings) in enumerate(sorted(buckets.items()), start=1):
        if len(readings) < 3:
            continue  # too few real readings to call this a zone
        temps = [t for t, _ in readings]
        dates = [d for _, d in readings]
        sst_min, sst_max = min(temps), max(temps)
        avg_temp = sum(temps) / len(temps)
        # Confidence: warmer, more homogeneous readings suggest more stable
        # conditions -- a simple heuristic, not a fitted model.
        if 26 <= avg_temp <= 30 and (sst_max - sst_min) < 2:
            confidence, confidence_pct = "high", 80
        elif 24 <= avg_temp <= 31:
            confidence, confidence_pct = "medium", 60
        else:
            confidence, confidence_pct = "low", 40

        half = GRID_SIZE / 2
        zones.append({
            "id": f"PFZ-ARGO-{i:03d}",
            "name": f"{region} zone near {grid_lat:.1f}°N, {grid_lng:.1f}°E",
            "confidence": confidence,
            "confidence_pct": confidence_pct,
            "species": SPECIES_BY_REGION.get(region, []),
            "sst_range": (round(sst_min, 1), round(sst_max, 1)),
            "chlorophyll_range": CHLOROPHYLL_REFERENCE_RANGE,
            "depth_range": (0.0, 50.0),
            "coordinates": [[
                (grid_lng - half, grid_lat - half),
                (grid_lng + half, grid_lat - half),
                (grid_lng + half, grid_lat + half),
                (grid_lng - half, grid_lat + half),
                (grid_lng - half, grid_lat - half),
            ]],
            "centroid": (grid_lat, grid_lng),
            "area_km2": round((GRID_SIZE * 111) ** 2, 0),  # rough deg->km at equator
            "valid_date": min(dates),  # real historical ARGO observation date, not "today"
            "source_satellites": ["ARGO float profiles (in-situ, not satellite)"],
        })
    return zones


ARGO_ZONES: list[dict] = _load_zones()
