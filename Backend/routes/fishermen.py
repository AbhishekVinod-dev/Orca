from typing import Optional

import psycopg2
from fastapi import APIRouter, HTTPException
from schema.fisherman_schema import FishermanContact, FishermanContactUpdate
from services.fishermen_service import (
    create_fisherman,
    delete_fisherman,
    list_fishermen,
    update_fisherman,
)

fishermen_router = APIRouter(prefix="/fishermen")


@fishermen_router.get("")
async def get_fishermen(zone: Optional[str] = None):
    try:
        return await list_fishermen(zone)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@fishermen_router.post("")
async def add_fisherman(contact: FishermanContact):
    try:
        return await create_fisherman(
            contact.phone, contact.name, contact.preferred_lang, contact.coastal_zone_id
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except psycopg2.IntegrityError as e:
        raise HTTPException(status_code=409, detail=f"Fisherman with this phone already exists: {e}")


@fishermen_router.put("/{phone}")
async def edit_fisherman(phone: str, update: FishermanContactUpdate):
    updates = update.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    try:
        result = await update_fisherman(phone, updates)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    if result is None:
        raise HTTPException(status_code=404, detail="Fisherman not found")
    return result


@fishermen_router.delete("/{phone}")
async def remove_fisherman(phone: str):
    try:
        deleted = await delete_fisherman(phone)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    if not deleted:
        raise HTTPException(status_code=404, detail="Fisherman not found")
    return {"deleted": phone}
