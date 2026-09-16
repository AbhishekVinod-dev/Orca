import os
import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("orca.db")

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "orca_db")
DB_URL = os.getenv("DB_URL", f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")


async def connect_to_db():
    """
    Establishes connection to PostGIS database for EEZ spatial queries.
    Returns database connection or fallback mock connection object.
    """
    try:
        import psycopg2

        def _connect():
            # Attempt connection with 3-second timeout
            return psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT,
                connect_timeout=3,
            )

        conn = await asyncio.to_thread(_connect)
        logger.info(f"Connected to PostgreSQL database '{DB_NAME}' at {DB_HOST}")
        return conn
    except Exception as e:
        logger.warning(f"PostgreSQL connection warning ({DB_HOST}:{DB_PORT}): {e}. Using spatial fallback service.")
        return None
