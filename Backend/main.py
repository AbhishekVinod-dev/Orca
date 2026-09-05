from fastapi import FastAPI, APIRouter
from routes.auth import auth_router
from routes.speech import speech_router
from routes.agent import agent_router
from routes.internal_tools.eez_boundaries import eez_boundaries_router
from routes.internal_tools.pfz import pfz_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ORCA Marine Intelligence Platform API", version="1.0.0")

api_router = APIRouter(prefix="/api/v1")

internal_tools_router = APIRouter(prefix="/internal_tools")
internal_tools_router.include_router(eez_boundaries_router)
internal_tools_router.include_router(pfz_router)

api_router.include_router(auth_router)
api_router.include_router(speech_router)
api_router.include_router(agent_router)
api_router.include_router(eez_boundaries_router)
api_router.include_router(pfz_router)
api_router.include_router(internal_tools_router)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"msg": "hlo wrld"}

