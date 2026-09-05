from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timezone
from typing import List, Optional
from schema.offline_schema import (
    OfflineBundle,
    OfflineBundleRequest,
    DeltaSyncRequest,
    DeltaSyncResponse,
    FreshnessMetadata,
)
from services.offline_sync import OfflineSyncService

offline_router = APIRouter(prefix="/offline", tags=["Offline & Connectivity"])


@offline_router.post("/bundle", response_model=OfflineBundle)
async def export_offline_bundle(request: OfflineBundleRequest):
    """
    Exports a comprehensive offline intelligence bundle (maps, routes, previous turns, intelligence, advisories)
    for a given bounding box and user session.
    """
    try:
        # Sample cached layers and routes for requested bbox
        maps = [
            {
                "layer_id": "sst_south_india",
                "type": "raster_tile",
                "bbox": request.bbox,
                "freshness": OfflineSyncService.calculate_freshness(
                    source="NOAA_AVHRR",
                    data_type="sst",
                    retrieved_at=datetime.now(timezone.utc),
                ).model_dump(),
            }
        ]

        saved_routes = [
            {
                "route_id": "RT_CHENNAI_PFZ_1",
                "name": "Chennai Harbor to Coastal PFZ Zone 4",
                "waypoints": [[80.27, 13.08], [80.45, 13.15], [80.60, 13.25]],
            }
        ]

        previous_conversations = [
            {
                "turn_id": "TRN_001",
                "query": "Is it safe to go fishing near Chennai tomorrow morning?",
                "answer": "Conditions appear favorable early morning, but wave height is forecast to increase after 14:00.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        ]

        retrieved_intelligence = [
            OfflineSyncService.wrap_tool_output(
                tool_name="get_pfz_forecast",
                data_type="pfz",
                source="INCOIS_PFZ",
                payload={"pfz_zone": "Chennai Offshore", "depth_m": 45, "potential_yield": "High"},
            )
        ]

        alerts_advisories = [
            {
                "alert_id": "ADV_2026_0905",
                "severity": "LOW",
                "message": "Routine seasonal wind shift observed in Bay of Bengal.",
            }
        ]

        bundle = OfflineSyncService.create_offline_bundle(
            request=request,
            maps=maps,
            saved_routes=saved_routes,
            previous_conversations=previous_conversations,
            retrieved_intelligence=retrieved_intelligence,
            alerts_advisories=alerts_advisories,
        )
        return bundle
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate offline bundle: {str(e)}")


@offline_router.post("/sync", response_model=DeltaSyncResponse)
async def sync_offline_delta(request: DeltaSyncRequest):
    """
    Synchronizes client-side offline conversation turns and returns updated advisories and freshness metadata.
    """
    try:
        return OfflineSyncService.process_delta_sync(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute delta sync: {str(e)}")


@offline_router.get("/freshness", response_model=FreshnessMetadata)
async def get_freshness_status(
    source: str = Query(..., description="Data source name (e.g. INCOIS, Open-Meteo)"),
    data_type: str = Query(..., description="Data type (e.g. wave_forecast, sst, pfz)"),
    retrieved_at_iso: str = Query(..., description="ISO 8601 retrieval timestamp"),
    is_offline: bool = Query(False, description="Whether query was executed offline"),
):
    """
    Returns calculated FreshnessMetadata including LIVE/CACHED/STALE_WARNING status and conservative flags.
    """
    try:
        clean_iso = retrieved_at_iso.replace(" ", "+")
        dt = datetime.fromisoformat(clean_iso)
        return OfflineSyncService.calculate_freshness(
            source=source,
            data_type=data_type,
            retrieved_at=dt,
            is_offline_retrieval=is_offline,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid timestamp format or parameters: {str(e)}")
