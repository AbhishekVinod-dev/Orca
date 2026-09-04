import psycopg2
import asyncpg
from dotenv import load_dotenv
import asyncio
import os

load_dotenv()

conn_str = f"dbname={os.getenv('DB_NAME')} user=neondb_owner password={os.getenv('DB_PASSWORD')} host=ep-empty-mud-aetrv1zt-pooler.c-2.us-east-2.aws.neon.tech sslmode=require"

DATABASE_URL = os.getenv("DATABASE_URL")


async def connect_to_db():
    conn = await asyncio.to_thread(psycopg2.connect, conn_str)
    return conn
    # conn = await asyncpg.connect(DATABASE_URL)
    # return conn
