import psycopg2
from dotenv import load_dotenv
import asyncio
import os

load_dotenv()

conn_str = f"dbname={os.getenv('DB_NAME')} user=postgres password={os.getenv('DB_PASSWORD')} host=localhost"


async def connect_to_db():
    conn = await asyncio.to_thread(psycopg2.connect, conn_str)
    return conn
