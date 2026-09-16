from fastapi import APIRouter, UploadFile, File, HTTPException
from services.stt_sarvam import stt

speech_router = APIRouter(prefix="/speech")


@speech_router.post("")
async def speech(file: UploadFile = File(...)):
    try:
        response = await stt(file)
        return {"transcript": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
