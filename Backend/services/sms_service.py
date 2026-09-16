import logging
import os

import httpx

logger = logging.getLogger("orca.sms")

FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2"


async def send_alert_sms(numbers: list[str], message: str) -> dict:
    """Sends `message` to `numbers` via Fast2SMS Quick SMS (route=q,
    language=unicode for Tamil support). Swapping providers later means
    rewriting only this function -- callers keep this signature."""
    api_key = os.getenv("FAST2SMS_API_KEY")
    if not api_key:
        raise RuntimeError("FAST2SMS_API_KEY is not set")

    params = {
        "authorization": api_key,
        "route": "q",
        "message": message,
        "language": "unicode",
        "flash": 0,
        "numbers": ",".join(numbers),
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(FAST2SMS_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

    status = "sent" if data.get("return") else "failed"
    if status == "failed":
        logger.warning(f"Fast2SMS rejected send: {data}")
    return {"status": status, "provider": "fast2sms", "response": data}


if __name__ == "__main__":
    # ponytail: manual check, not an automated test -- this hits the real
    # paid Fast2SMS API, so it's run by hand against your own number.
    # usage: python -m services.sms_service <phone_number> "<message>"
    import asyncio
    import sys

    if len(sys.argv) != 3:
        print('usage: python -m services.sms_service <phone_number> "<message>"')
        sys.exit(1)

    print(asyncio.run(send_alert_sms([sys.argv[1]], sys.argv[2])))
