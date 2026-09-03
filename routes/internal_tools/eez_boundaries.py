from fastapi import APIRouter
from services.internal_tools.eez_boundaries_service import get_eez_boundaries

eez_boundaries_router = APIRouter(prefix="/eez_boundaries")


@eez_boundaries_router.get("")
async def fetch_eez_boundaries(lat: float, long: float):
    return await get_eez_boundaries(lat, long)
