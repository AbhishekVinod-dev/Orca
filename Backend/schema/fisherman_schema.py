from typing import Optional

from pydantic import BaseModel, Field

PHONE_PATTERN = r"^(\+91)?[6-9]\d{9}$"
LANG_PATTERN = r"^(en|ta)$"


class FishermanContact(BaseModel):
    phone: str = Field(..., pattern=PHONE_PATTERN, description="10-digit Indian mobile number, optionally +91-prefixed")
    name: str = Field(..., min_length=1, max_length=120)
    preferred_lang: str = Field(default="en", pattern=LANG_PATTERN, description="ta | en")
    coastal_zone_id: str = Field(..., min_length=1, max_length=60)


class FishermanContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    preferred_lang: Optional[str] = Field(default=None, pattern=LANG_PATTERN)
    coastal_zone_id: Optional[str] = Field(default=None, min_length=1, max_length=60)
