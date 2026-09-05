import hashlib
import json
import zlib
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from schema.offline_schema import (
    CacheStatus,
    FreshnessMetadata,
    OfflineBundle,
    OfflineBundleRequest,
    DeltaSyncRequest,
    DeltaSyncResponse,
)


class OfflineSyncService:
    """
    Offline & Low-Bandwidth Synchronization Engine adhering to Section #27 & #31
    of the ORCA Marine Intelligence Platform Specification.
    """

    DEFAULT_TTL_HOURS = {
        "weather_forecast": 6.0,
        "wave_forecast": 6.0,
        "cyclone_alert": 3.0,
        "pfz": 24.0,
        "sst": 24.0,
        "chlorophyll": 48.0,
        "eez_boundary": 720.0,  # 30 days
        "mpa": 720.0,
    }

    @staticmethod
    def calculate_freshness(
        source: str,
        data_type: str,
        retrieved_at: datetime,
        valid_until: Optional[datetime] = None,
        forecast_period: Optional[str] = None,
        is_offline_retrieval: bool = False,
    ) -> FreshnessMetadata:
        """
        Builds structured FreshnessMetadata adhering strictly to specification rules:
        - Visible source, retrieval timestamp, validity period, LIVE / CACHED status, age of info.
        - Conservative behavior when safety-critical information is stale.
        """
        now = datetime.now(timezone.utc)
        if retrieved_at.tzinfo is None:
            retrieved_at = retrieved_at.replace(tzinfo=timezone.utc)

        age_seconds = (now - retrieved_at).total_seconds()
        age_hours = max(0.0, round(age_seconds / 3600.0, 2))

        ttl_hours = OfflineSyncService.DEFAULT_TTL_HOURS.get(data_type, 12.0)
        is_stale = age_hours > ttl_hours

        # Determine Cache Status
        if is_offline_retrieval or is_stale:
            if is_stale and data_type in ["weather_forecast", "wave_forecast", "cyclone_alert"]:
                status = CacheStatus.STALE_WARNING
                is_conservative = True
            else:
                status = CacheStatus.CACHED
                is_conservative = False
        else:
            status = CacheStatus.LIVE
            is_conservative = False

        # Format ISO strings
        retrieved_iso = retrieved_at.isoformat()
        if valid_until:
            if valid_until.tzinfo is None:
                valid_until = valid_until.replace(tzinfo=timezone.utc)
            valid_iso = valid_until.isoformat()
        else:
            valid_iso = (retrieved_at + timedelta(hours=ttl_hours)).isoformat()

        return FreshnessMetadata(
            status=status,
            retrieved_at=retrieved_iso,
            valid_until=valid_iso,
            forecast_period=forecast_period or f"Valid within {ttl_hours}h window",
            source=source,
            age_hours=age_hours,
            is_conservative_fallback=is_conservative,
        )

    @staticmethod
    def wrap_tool_output(
        tool_name: str,
        data_type: str,
        source: str,
        payload: Dict[str, Any],
        retrieved_at: Optional[datetime] = None,
        forecast_period: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Wraps any deterministic tool response with standard freshness metadata envelope.
        """
        retrieved_dt = retrieved_at or datetime.now(timezone.utc)
        freshness = OfflineSyncService.calculate_freshness(
            source=source,
            data_type=data_type,
            retrieved_at=retrieved_dt,
            forecast_period=forecast_period,
        )

        wrapped = {
            "tool": tool_name,
            "freshness": freshness.model_dump(),
            "data": payload,
        }

        # Apply conservative warning if stale safety data
        if freshness.is_conservative_fallback:
            wrapped["safety_warning"] = (
                f"STATUS: {freshness.status.value} (Age: {freshness.age_hours}h). "
                f"Information is STALE. Exercise caution and verify official alerts before departure."
            )

        return wrapped

    @staticmethod
    def create_offline_bundle(
        request: OfflineBundleRequest,
        maps: List[Dict[str, Any]],
        saved_routes: List[Dict[str, Any]],
        previous_conversations: List[Dict[str, Any]],
        retrieved_intelligence: List[Dict[str, Any]],
        alerts_advisories: List[Dict[str, Any]],
        compress: bool = False,
    ) -> OfflineBundle:
        """
        Creates a bundled offline package for download by at-sea or low-connectivity clients.
        Generates SHA-256 checksum for data integrity verification.
        """
        now = datetime.now(timezone.utc)
        generated_at_iso = now.isoformat()
        bundle_id = f"bundle_{request.user_id}_{int(now.timestamp())}"

        bundle_dict = {
            "bundle_id": bundle_id,
            "generated_at": generated_at_iso,
            "user_id": request.user_id,
            "region_bbox": request.bbox,
            "maps": maps,
            "saved_routes": saved_routes,
            "previous_conversations": previous_conversations if request.include_conversations else [],
            "retrieved_intelligence": retrieved_intelligence,
            "alerts_advisories": alerts_advisories,
        }

        # Calculate checksum over JSON representation
        json_bytes = json.dumps(bundle_dict, sort_keys=True).encode("utf-8")
        checksum = hashlib.sha256(json_bytes).hexdigest()

        return OfflineBundle(
            bundle_id=bundle_id,
            generated_at=generated_at_iso,
            user_id=request.user_id,
            region_bbox=request.bbox,
            maps=maps,
            saved_routes=saved_routes,
            previous_conversations=previous_conversations if request.include_conversations else [],
            retrieved_intelligence=retrieved_intelligence,
            alerts_advisories=alerts_advisories,
            checksum=checksum,
            is_compressed=compress,
        )

    @staticmethod
    def process_delta_sync(request: DeltaSyncRequest) -> DeltaSyncResponse:
        """
        Processes client-side offline conversation turns and syncs back newly updated advisories/freshness.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        synced_count = len(request.offline_turns)

        # Example updated advisories
        sample_new_alerts = [
            {
                "alert_id": "ALT_2026_0905_01",
                "type": "WAVE_WARNING",
                "severity": "MODERATE",
                "title": "High Wave Advisory — Off Chennai Coast",
                "issued_at": now_iso,
                "freshness": OfflineSyncService.calculate_freshness(
                    source="INCOIS",
                    data_type="wave_forecast",
                    retrieved_at=datetime.now(timezone.utc),
                ).model_dump(),
            }
        ]

        return DeltaSyncResponse(
            synced_turns=synced_count,
            new_alerts=sample_new_alerts,
            updated_freshness={},
            sync_timestamp=now_iso,
        )
