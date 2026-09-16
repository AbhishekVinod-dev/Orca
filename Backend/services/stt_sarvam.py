import os
import asyncio
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

try:
    from sarvamai import SarvamAI
    SARVAM_KEY = os.getenv("SARVAM_API_KEY", "")
    client = SarvamAI(api_subscription_key=SARVAM_KEY) if SARVAM_KEY else None
except Exception:
    client = None


async def stt(file: UploadFile):
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Sarvam AI Speech-to-Text service is unconfigured or SARVAM_API_KEY is missing."
        )

    audio_bytes = await file.read()

    def call_sarvam_sdk():
        return client.speech_to_text.transcribe(file=(file.filename, audio_bytes))

    response = await asyncio.to_thread(call_sarvam_sdk)
    return response

