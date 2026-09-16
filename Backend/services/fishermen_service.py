import asyncio
import logging
from typing import Optional

from services.db_connection_service import connect_to_db

logger = logging.getLogger("orca.fishermen")

_COLUMNS = "phone, name, preferred_lang, coastal_zone_id"


def _row_to_dict(row) -> dict:
    return {"phone": row[0], "name": row[1], "preferred_lang": row[2], "coastal_zone_id": row[3]}


async def list_fishermen(zone: Optional[str] = None) -> list[dict]:
    conn = await connect_to_db()
    if conn is None:
        logger.warning("No DB connection: returning empty fisherman list")
        return []
    try:
        cur = conn.cursor()
        if zone:
            query = f"SELECT {_COLUMNS} FROM fisherman_contact WHERE coastal_zone_id = %s ORDER BY name"
            await asyncio.to_thread(cur.execute, query, (zone,))
        else:
            query = f"SELECT {_COLUMNS} FROM fisherman_contact ORDER BY name"
            await asyncio.to_thread(cur.execute, query)
        rows = await asyncio.to_thread(cur.fetchall)
        cur.close()
        return [_row_to_dict(r) for r in rows]
    finally:
        conn.close()


async def create_fisherman(phone: str, name: str, preferred_lang: str, coastal_zone_id: str) -> dict:
    conn = await connect_to_db()
    if conn is None:
        raise RuntimeError("Database unavailable")
    try:
        cur = conn.cursor()
        query = f"""
            INSERT INTO fisherman_contact (phone, name, preferred_lang, coastal_zone_id)
            VALUES (%s, %s, %s, %s)
            RETURNING {_COLUMNS}
        """
        await asyncio.to_thread(cur.execute, query, (phone, name, preferred_lang, coastal_zone_id))
        row = await asyncio.to_thread(cur.fetchone)
        conn.commit()
        cur.close()
        return _row_to_dict(row)
    finally:
        conn.close()


async def update_fisherman(phone: str, updates: dict) -> Optional[dict]:
    # Caller must only pass keys from FishermanContactUpdate's declared fields --
    # they're interpolated into the SET clause below.
    if not updates:
        raise ValueError("No fields to update")
    conn = await connect_to_db()
    if conn is None:
        raise RuntimeError("Database unavailable")
    try:
        cur = conn.cursor()
        set_clause = ", ".join(f"{field} = %s" for field in updates)
        query = f"""
            UPDATE fisherman_contact SET {set_clause}
            WHERE phone = %s
            RETURNING {_COLUMNS}
        """
        await asyncio.to_thread(cur.execute, query, (*updates.values(), phone))
        row = await asyncio.to_thread(cur.fetchone)
        conn.commit()
        cur.close()
        return _row_to_dict(row) if row else None
    finally:
        conn.close()


async def delete_fisherman(phone: str) -> bool:
    conn = await connect_to_db()
    if conn is None:
        raise RuntimeError("Database unavailable")
    try:
        cur = conn.cursor()
        await asyncio.to_thread(cur.execute, "DELETE FROM fisherman_contact WHERE phone = %s", (phone,))
        deleted = cur.rowcount > 0
        conn.commit()
        cur.close()
        return deleted
    finally:
        conn.close()


if __name__ == "__main__":
    # ponytail: manual check against a live DB -- apply
    # scripts/migrations/001_fisherman_sms_tables.sql first.
    # usage: python -m services.fishermen_service
    async def _self_check():
        phone = "9999999999"
        await delete_fisherman(phone)  # start clean
        created = await create_fisherman(phone, "Test Fisherman", "en", "test-zone")
        assert created["phone"] == phone
        listed = await list_fishermen(zone="test-zone")
        assert any(f["phone"] == phone for f in listed)
        updated = await update_fisherman(phone, {"name": "Updated Name"})
        assert updated["name"] == "Updated Name"
        assert await delete_fisherman(phone) is True
        assert await delete_fisherman(phone) is False
        print("fishermen_service self-check passed")

    asyncio.run(_self_check())
