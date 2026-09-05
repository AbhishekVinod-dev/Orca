from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class CacheStatus(str, Enum):
    LIVE = "LIVE"
    CACHED = "CACHED"
    STALE_WARNING = "STALE_WARNING"


class FreshnessMetadata(BaseModel):
    status: CacheStatus = Field(..., description="LIVE, CACHED, or STALE_WARNING status")
    retrieved_at: str = Field(..., description="ISO 8601 retrieval timestamp")
    valid_until: Optional[str] = Field(None, description="ISO 8601 validity threshold")
    forecast_period: Optional[str] = Field(None, description="Descriptive forecast period window (e.g. 29 Aug 12:00–18:00)")
    source: str = Field(..., description="Data provider or tool source identifier")
    age_hours: float = Field(..., ge=0.0, description="Age of information in hours")
    is_conservative_fallback: bool = Field(default=False, description="True if stale safety-critical information is forced conservative")


class OfflineBundleRequest(BaseModel):
    user_id: str = Field(..., description="Unique user/vessel identifier")
    bbox: List[float] = Field(..., min_length=4, max_length=4, description="Bounding box [min_lon, min_lat, max_lon, max_lat]")
    include_conversations: bool = Field(default=True, description="Whether to include recent offline conversation history")
    max_age_hours: float = Field(default=48.0, ge=1.0, description="Maximum age of cached records to include")


class OfflineBundle(BaseModel):
    bundle_id: str = Field(..., description="Unique bundle identifier")
    generated_at: str = Field(..., description="ISO 8601 generation timestamp")
    user_id: str = Field(..., description="User ID associated with bundle")
    region_bbox: List[float] = Field(..., description="Bounding box [min_lon, min_lat, max_lon, max_lat]")
    maps: List[Dict[str, Any]] = Field(default_factory=list, description="Cached map layer tiles and spatial vectors")
    saved_routes: List[Dict[str, Any]] = Field(default_factory=list, description="Saved route corridors and context")
    previous_conversations: List[Dict[str, Any]] = Field(default_factory=list, description="Recent conversation turns and evidence")
    retrieved_intelligence: List[Dict[str, Any]] = Field(default_factory=list, description="Cached marine tool queries (SST, PFZ, Weather)")
    alerts_advisories: List[Dict[str, Any]] = Field(default_factory=list, description="Active and cached alerts and safety advisories")
    checksum: str = Field(..., description="SHA-256 hash checksum for payload verification")
    is_compressed: bool = Field(default=False, description="True if payload data is compressed with zlib")


class DeltaSyncRequest(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    last_sync_timestamp: Optional[str] = Field(None, description="ISO timestamp of last successful sync")
    offline_turns: List[Dict[str, Any]] = Field(default_factory=list, description="Conversations/queries conducted offline by client")


class DeltaSyncResponse(BaseModel):
    synced_turns: int = Field(..., description="Number of offline turns successfully processed")
    new_alerts: List[Dict[str, Any]] = Field(default_factory=list, description="New advisories published since last sync")
    updated_freshness: Dict[str, FreshnessMetadata] = Field(default_factory=dict, description="Freshness metadata for requested items")
    sync_timestamp: str = Field(..., description="ISO timestamp of this sync completion")
