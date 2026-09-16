from fastapi import APIRouter
from services.auth_service import handle_auth

auth_router = APIRouter(prefix="/auth")


@auth_router.get("")
async def authenticator():
    return await handle_auth()
