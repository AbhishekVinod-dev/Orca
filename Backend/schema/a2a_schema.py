from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime


class A2AEnvelope(BaseModel):
    trace_id: str = Field(..., description="Unique request trace ID across the agent graph")
    sender_agent: str = Field(..., description="Name of sending agent (e.g. planner_agent)")
    target_agent: str = Field(..., description="Name of receiving agent (e.g. weather_intelligence_agent)")
    intent: str = Field(..., description="Action intent or tool request name")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Structured arguments passed to target agent")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z", description="Creation timestamp")


class A2AResponse(BaseModel):
    trace_id: str = Field(..., description="Matching request trace ID")
    sender_agent: str = Field(..., description="Name of responding agent")
    status: str = Field(default="success", description="Execution status: success | error | warning")
    result: Dict[str, Any] = Field(default_factory=dict, description="Structured output payload")
    error_message: Optional[str] = Field(None, description="Error message if status is error")
