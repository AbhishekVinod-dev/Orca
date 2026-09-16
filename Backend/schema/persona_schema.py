from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class UserPersonaRole(str, Enum):
    FISHERMAN = "fisherman"
    OCEANOGRAPHER = "oceanographer"
    POLICYMAKER = "policymaker"
    AQUACULTURE = "aquaculture"
    SHIPPING = "shipping"


class ProgressiveDisclosureLevel(int, Enum):
    SIMPLE = 1       # Level 1: Simple intelligence recommendation
    WHY = 2          # Level 2: Why (core indicators)
    EVIDENCE = 3     # Level 3: Evidence (observations & sources)
    SCIENTIFIC = 4   # Level 4: Scientific detail (depth, SST, salinity, Argo)
    RAW_DATA = 5     # Level 5: Raw data payload & links


class PersonaConfig(BaseModel):
    role: UserPersonaRole = Field(default=UserPersonaRole.FISHERMAN, description="Active user role persona")
    disclosure_level: ProgressiveDisclosureLevel = Field(default=ProgressiveDisclosureLevel.WHY, description="Progressive disclosure level (1 to 5)")
    lang: str = Field(default="en", description="Target language code (e.g. en, ta, hi, te, ml)")
    bandwidth_mode: str = Field(default="normal", description="Network bandwidth mode: normal | low")
