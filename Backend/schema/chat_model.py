from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    prompt: str = Field(..., description="Natural language user query")
    role: str = Field(default="fisherman", description="User persona role: fisherman | oceanographer | policymaker | aquaculture | shipping")
    lang: str = Field(default="en", description="Target language code (e.g. en, ta, hi, te, ml)")
    lat: float = Field(..., description="WGS84 Latitude coordinate")
    long: float = Field(..., description="WGS84 Longitude coordinate")
    disclosure_level: Optional[int] = Field(default=2, ge=1, le=5, description="Progressive disclosure depth level (1-5)")
    bandwidth_mode: Optional[str] = Field(default="normal", description="Network bandwidth mode: normal | low")
