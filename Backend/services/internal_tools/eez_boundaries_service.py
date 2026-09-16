import psycopg2
from services.db_connection_service import connect_to_db
from fastapi.responses import JSONResponse
import asyncio
import json


async def get_eez_boundaries():
    try:
        conn_obj = await connect_to_db()
        if conn_obj is None:
            return _fallback_eez_geojson()

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
            geometry = json.loads(row[1])

            geojson_feature = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {"name": region_name, "mrgid": 8480},
                    "geometry": geometry,
                }]
            }
            return JSONResponse(content=geojson_feature)
        return _fallback_eez_geojson()
    except Exception:
        return _fallback_eez_geojson()


def _fallback_eez_geojson():
    return JSONResponse(content={
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {"name": "Indian Exclusive Economic Zone (EEZ)", "mrgid": 8480},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[68.0, 6.0], [88.0, 6.0], [88.0, 22.0], [68.0, 22.0], [68.0, 6.0]]]
            }
        }]
    })

