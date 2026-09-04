from fastapi import FastAPI, APIRouter
from routes.auth import auth_router
from routes.speech import speech_router
from routes.agent import agent_router
from routes.internal_tools.eez_boundaries import eez_boundaries_router
from routes.internal_tools.pfz import pfz_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

api_router = APIRouter(prefix="/api/v1")
app.include_router(api_router)

api_router.include_router(auth_router)
api_router.include_router(speech_router)
api_router.include_router(agent_router)
api_router.include_router(eez_boundaries_router)
api_router.include_router(pfz_router)


@app.get("/")
async def root():
    return {"msg": "hlo wrld"}
