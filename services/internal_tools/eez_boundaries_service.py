import psycopg2
from services.db_connection_service import connect_to_db
from fastapi.responses import JSONResponse
import asyncio
import json


async def get_eez_boundaries(lat: float, long: float):
    conn_obj = await connect_to_db()
    cur = conn_obj.cursor()
    query = """
        SELECT geoname, 
               ST_AsGeoJSON(ST_Simplify(wkb_geometry, 0.01)) as geojson_data
        FROM maritime_boundaries 
        WHERE mrgid = 8480;
        """
    await asyncio.to_thread(cur.execute, query)
    row = await asyncio.to_thread(cur.fetchone)
    cur.close()
    conn_obj.close()
    if row:
        region_name = row[0]
        # 3. PostGIS returns the GeoJSON as a string, so we must parse it into a Python dict
        geometry = json.loads(row[1])

        # 4. Construct a standard GeoJSON Feature structure
        geojson_feature = {
            "type": "Feature",
            "properties": {"name": region_name},
            "geometry": geometry,
        }
        return JSONResponse(content=geojson_feature)
    return JSONResponse(content={"error": "Boundary not found"}, status_code=404)
