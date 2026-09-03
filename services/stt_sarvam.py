from sarvamai import SarvamAI
import os
from fastapi import UploadFile
import asyncio
from dotenv import load_dotenv

load_dotenv()

client = SarvamAI(
    api_subscription_key=os.getenv("SARVAM_API_KEY"),
)


async def stt(file: UploadFile):
    audio_bytes = await file.read()

    def call_sarvam_sdk():
        # Pass a tuple of (filename, bytes) which most Python SDKs require
        # Alternatively, some SDKs accept just the raw bytes depending on their version
        return client.speech_to_text.transcribe(file=(file.filename, audio_bytes))

    response = await asyncio.to_thread(call_sarvam_sdk)
    return response
