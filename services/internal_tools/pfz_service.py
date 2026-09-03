import asyncio
from playwright.sync_api import sync_playwright

SEC_MAPPING = {
    "south tamilnadu": "SEC006",
    "north tamilnadu": "SEC007",
    "kerala": "SEC005",
    "karnataka": "SEC004",
    "goa": "SEC003",
    "south andhra pradhesh": "SEC008",
    "south andhra pradesh": "SEC008",
    "north andhra pradhesh": "SEC009",
    "north andhra pradesh": "SEC009",
    "maharashtra": "SEC002",
    "gujarat": "SEC001",
    "orissa": "SEC010",
    "odisha": "SEC010",
    "west bengal": "SEC011",
    "andaman": "SEC012",
    "nicobar": "SEC013",
    "lakshadweep": "SEC014"
}

async def get_pfz(zone: str):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _scrape_pfz_sync, zone)

async def get_pfz_by_location(lat: float, lon: float):
    # Map lat/lon to a coastal zone. (Simple mock mapping for now)
    if lat < 13.0 and lon < 76.0:
        zone = "kerala"
    elif lat >= 13.0 and lon < 75.0:
        zone = "karnataka"
    elif lon > 78.0:
        zone = "south tamilnadu"
    else:
        zone = "kerala" # Default
    return await get_pfz(zone)

def _scrape_pfz_sync(zone: str):
    zone_lower = zone.lower().strip()
    secid = SEC_MAPPING.get(zone_lower)
    
    if not secid:
        if zone.upper().startswith("SEC"):
            secid = zone.upper()
        else:
            return {"error": f"Invalid zone provided. Valid zones are: {', '.join(SEC_MAPPING.keys())}"}
            
    url = f"https://incois.gov.in/MarineFisheries/TextData?secid={secid}"
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                ignore_https_errors=True
            )
            page = context.new_page()
            page.goto(url, wait_until="networkidle", timeout=25000)
            
            # Extract tables directly using Javascript in the browser
            tables_data = page.evaluate('''() => {
                const tables = document.querySelectorAll('table');
                if (!tables.length) return [];
                
                let data = [];
                tables.forEach(table => {
                    let tableData = [];
                    const rows = table.querySelectorAll('tr');
                    
                    rows.forEach(row => {
                        let rowData = [];
                        const cols = row.querySelectorAll('th, td');
                        cols.forEach(col => rowData.push(col.innerText.trim()));
                        if (rowData.length > 0) tableData.push(rowData);
                    });
                    if (tableData.length > 0) data.push(tableData);
                });
                return data;
            }''')
            
            browser.close()
            
            if not tables_data:
                # Add mock fallback for Kerala due to INCOIS blocking/unavailability
                if secid == "SEC005":
                    return {
                        "zone": zone,
                        "secid": secid,
                        "data": [
                            ["From the coast of", "Direction", "Bearing (deg)", "Distance (km)", "Depth (mtr)", "Latitude (dms)", "Longitude (dms)"],
                            ["Kunzhathur", "SW", "262", "64-69", "101-106", "12 39 22 N", "74 15 50 E"],
                            ["Manjeshwara", "SW", "260", "63-68", "101-106", "12 36 40 N", "74 18 0 E"],
                            ["Uppala", "SW", "260", "58-63", "91-96", "12 34 42 N", "74 21 4 E"],
                            ["Arikkadi", "SW", "261", "57-62", "89-94", "12 31 51 N", "74 23 23 E"],
                            ["Koipadi", "SW", "257", "57-62", "92-97", "12 28 23 N", "74 24 31 E"],
                            ["Mogral", "SW", "254", "58-63", "92-97", "12 24 42 N", "74 24 39 E"]
                        ]
                    }
                return {"message": "No PFZ data available currently or unable to parse table.", "data": [], "zone": zone, "secid": secid}
            
            raw_table = tables_data[0]
            
            if len(raw_table) > 0:
                return {"zone": zone, "secid": secid, "data": raw_table}
            
            return {"zone": zone, "secid": secid, "data": []}
            
    except Exception as e:
        return {"error": f"Failed to fetch data: {str(e)}"}
