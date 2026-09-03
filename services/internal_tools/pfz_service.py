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
                return {"message": "No PFZ data available currently or unable to parse table.", "data": [], "zone": zone, "secid": secid}
            
            raw_table = tables_data[0]
            
            if len(raw_table) > 0:
                return {"zone": zone, "secid": secid, "data": raw_table}
            
            return {"zone": zone, "secid": secid, "data": []}
            
    except Exception as e:
        return {"error": f"Failed to fetch data: {str(e)}"}
