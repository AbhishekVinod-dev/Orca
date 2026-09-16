import os
import sys

# ponytail: Windows' default console codepage (cp1252) can't encode chars
# LLM responses routinely contain (narrow no-break space, etc.), crashing
# any print()/traceback of that text mid-request. Force UTF-8 stdio.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router
from routes.speech import speech_router
from routes.agent import agent_router
from routes.fishermen import fishermen_router
from routes.internal_tools.eez_boundaries import eez_boundaries_router
from routes.internal_tools.pfz import pfz_router
from routes.internal_tools.alerts import alerts_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ORCA Marine Intelligence Platform API", version="1.0.0")

origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")

internal_tools_router = APIRouter(prefix="/internal_tools")
internal_tools_router.include_router(eez_boundaries_router)
internal_tools_router.include_router(pfz_router)
internal_tools_router.include_router(alerts_router)

api_router.include_router(auth_router)
api_router.include_router(speech_router)
api_router.include_router(agent_router)
api_router.include_router(fishermen_router)
api_router.include_router(eez_boundaries_router)
api_router.include_router(pfz_router)
api_router.include_router(alerts_router)
api_router.include_router(internal_tools_router)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"msg": "hlo wrld"}

