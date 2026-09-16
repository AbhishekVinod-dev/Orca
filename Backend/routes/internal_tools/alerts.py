from fastapi import APIRouter
from services.internal_tools.alerts_service import get_alerts

alerts_router = APIRouter(prefix="/alerts")


@alerts_router.get("")
async def fetch_alerts():
    return await get_alerts()
