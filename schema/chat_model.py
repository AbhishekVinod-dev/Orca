from pydantic import BaseModel


class ChatRequest(BaseModel):
    prompt: str
    role: str
    lang: str
    lat: float
    long: float
