from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

AlertType = Literal["cyclone", "lightning", "high-wave", "geofence", "fog", "wind"]
AlertSeverity = Literal["critical", "high", "moderate", "low"]


class Alert(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    type: AlertType
    severity: AlertSeverity
    title: str
    description: str
    region: str
    coordinates: tuple[float, float]  # [lat, lng]
    issued_at: str
    expires_at: str
    source: str
    affected_zones: list[str]
    wind_speed: Optional[float] = None
    wave_height: Optional[float] = None
    distance: Optional[float] = None


class AgentStep(BaseModel):
    agent: Literal["Planner", "DataAgent", "RiskAgent", "ResponseAgent"]
    status: Literal["pending", "running", "done"]
    action: str
    detail: str
    duration_ms: int
    sources: Optional[list[str]] = None


class ChartDataPoint(BaseModel):
    label: str
    value: float


class RelatedData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    pfz_zones: Optional[list[str]] = None
    alerts: Optional[list[str]] = None
    coordinates: Optional[tuple[float, float]] = None
    chart_data: Optional[list[ChartDataPoint]] = None


class ChatResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    query_patterns: list[str]
    response: str
    agent_trace: list[AgentStep]
    related_data: Optional[RelatedData] = None
