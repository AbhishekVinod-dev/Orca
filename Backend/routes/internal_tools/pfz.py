from fastapi import APIRouter
from services.internal_tools.pfz_service import get_pfz

pfz_router = APIRouter(prefix="/pfz")


@pfz_router.get("/{zone}")
async def fetch_pfz(zone: str):
    res = await get_pfz(zone)
    return res
