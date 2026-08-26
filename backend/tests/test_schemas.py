from app.schemas import Alert, AgentStep, ChatResponse

ALT_001 = {
    "id": "ALT-001",
    "type": "cyclone",
    "severity": "critical",
    "title": "Cyclone Warning: Bay of Bengal",
    "description": "Severe cyclonic storm MICHAUNG intensifying rapidly. Wind speeds exceeding 120 km/h. All fishing vessels advised to return to port immediately. Coastal communities in Tamil Nadu and Andhra Pradesh should prepare for evacuation.",
    "region": "Bay of Bengal (N)",
    "coordinates": [13.5, 82.1],
    "issuedAt": "2026-08-25T06:00:00Z",
    "expiresAt": "2026-08-27T06:00:00Z",
    "source": "IMD New Delhi",
    "affectedZones": ["Tamil Nadu Coast", "Andhra Pradesh Coast", "Puducherry"],
    "windSpeed": 120,
    "waveHeight": 8.5,
    "distance": 340,
}


def test_alert_round_trips_mock_record():
    alert = Alert.model_validate(ALT_001)
    assert alert.model_dump(by_alias=True, mode="json", exclude_unset=True) == ALT_001


DATA_AGENT_STEP = {
    "agent": "DataAgent",
    "status": "done",
    "action": "Pulling cyclone track data",
    "detail": "Retrieved IMD Best Track data + NHC vortex messages (last update: 1500 IST)",
    "duration_ms": 540,
    "sources": ["IMD Cyclone Warning Division", "RSMC New Delhi"],
}


def test_agent_step_round_trips_mock_record():
    step = AgentStep.model_validate(DATA_AGENT_STEP)
    assert step.model_dump(by_alias=True, mode="json", exclude_unset=True) == DATA_AGENT_STEP


R_003 = {
    "id": "R-003",
    "queryPatterns": ["cyclone", "storm", "hurricane", "michaung", "tropical"],
    "response": """🌀 **Cyclone MICHAUNG — Latest Update (1800 IST, Aug 25)**

**Current Position:** 13.5°N, 82.1°E (Bay of Bengal)
**Category:** Severe Cyclonic Storm
**Maximum Sustained Winds:** 120 km/h, gusts to 145 km/h
**Central Pressure:** 978 hPa
**Movement:** NNW at 12 km/h

**Predicted Track (IMD):**
- 24h: 15.2°N, 80.9°E — landfall near Bapatla, Andhra Pradesh likely
- 48h: Weakening over land (60 km/h)

**Danger Zones (Next 48 hrs):**
- 🔴 North Tamil Nadu coast (Chennai to Nellore)
- 🔴 Southern Andhra Pradesh (Ongole to Machilipatnam)
- 🟡 Odisha southern coast
- 🟡 Yanam, Puducherry

**Fishermen Alert:**
All fishing vessels currently at sea in Bay of Bengal must return to port **IMMEDIATELY**. Seek shelter. Do not attempt to outrun the storm.

**Evacuation Zones:** Coastal areas within 5 km of Bay of Bengal — contact District Disaster Management Authority.""",
    "agentTrace": [
        {"agent": "Planner", "status": "done", "action": "Intent classification", "detail": "Detected: CYCLONE_QUERY — high priority routing", "duration_ms": 88, "sources": []},
        {"agent": "DataAgent", "status": "done", "action": "Pulling cyclone track data", "detail": "Retrieved IMD Best Track data + NHC vortex messages (last update: 1500 IST)", "duration_ms": 540, "sources": ["IMD Cyclone Warning Division", "RSMC New Delhi"]},
        {"agent": "RiskAgent", "status": "done", "action": "Impact assessment", "detail": "Computed wind radii, storm surge height, coastal vulnerability index", "duration_ms": 410, "sources": ["NDMA Coastal Risk Atlas", "IMD Storm Surge Model"]},
        {"agent": "ResponseAgent", "status": "done", "action": "Emergency advisory generation", "detail": "Generated zone-specific safety advisories with evacuation guidance", "duration_ms": 200, "sources": []},
    ],
    "relatedData": {
        "alerts": ["ALT-001"],
        "coordinates": [13.5, 82.1],
    },
}


def test_chat_response_round_trips_mock_record():
    chat_response = ChatResponse.model_validate(R_003)
    assert chat_response.model_dump(by_alias=True, mode="json", exclude_unset=True) == R_003


R_001 = {
    "id": "R-001",
    "queryPatterns": ["pfz", "fishing zone", "where to fish", "fishing today", "catch"],
    "response": """🎯 **Potential Fishing Zones — August 25, 2026**

Based on latest **MODIS Aqua** and **Sentinel-3 OLCI** satellite data processed 4 hours ago, I've identified **3 high-confidence PFZ zones** near your location:

---

**🟢 Zone 1: Rameswaram Offshore (91% confidence)**
- Distance: ~68 nm from Rameswaram harbor
- Target species: Seer Fish, Pomfret, Red Snapper
- SST: 27.5–29°C | Chlorophyll: 1.2–3.4 mg/m³
- Best window: **0500–1000 IST** (before sea state worsens)

**🟡 Zone 2: Chennai Offshore (87% confidence)**
- Distance: ~45 nm from Chennai coast
- Target species: Indian Mackerel, Tuna
- SST: 28.2–29.8°C | Chlorophyll: 0.8–2.1 mg/m³
- Note: Monitor ALT-001 cyclone track before departing

**🟡 Zone 3: Vizhinjam Offshore (72% confidence)**
- Distance: ~90 nm from Vizhinjam port
- Target species: Sardine, Anchovy, Mackerel
- Check high-wave advisory (ALT-002) before venturing

⚠️ **Active Alert**: Cyclone warning in Bay of Bengal — Tamil Nadu fishermen should prioritize Zone 3 (Arabian Sea side) today.

Want me to calculate a safe route to any of these zones?""",
    "agentTrace": [
        {"agent": "Planner", "status": "done", "action": "Intent classification", "detail": "Detected: PFZ_QUERY with location context", "duration_ms": 120, "sources": []},
        {"agent": "DataAgent", "status": "done", "action": "Fetching satellite data", "detail": "Retrieved MODIS + Sentinel-3 L2 products (2026-08-25T02:00Z)", "duration_ms": 890, "sources": ["INCOIS ERDDAP", "NASA OceanColor"]},
        {"agent": "DataAgent", "status": "done", "action": "Computing PFZ algorithm", "detail": "Applied SST gradient + chlorophyll bloom detection (Cayula-Cornillon method)", "duration_ms": 340, "sources": ["IMD NWP Model"]},
        {"agent": "RiskAgent", "status": "done", "action": "Cross-referencing alerts", "detail": "Checked ALT-001 (cyclone) and ALT-002 (waves) against zone locations", "duration_ms": 210, "sources": ["IMD Real-time Feed"]},
        {"agent": "ResponseAgent", "status": "done", "action": "Generating response", "detail": "Ranked zones by confidence + safety, formatted for fishermen", "duration_ms": 180, "sources": []},
    ],
    "relatedData": {
        "pfzZones": ["PFZ-001", "PFZ-002", "PFZ-003"],
        "alerts": ["ALT-001", "ALT-002"],
        "chartData": [
            {"label": "Rameswaram", "value": 91},
            {"label": "Chennai", "value": 87},
            {"label": "Vizhinjam", "value": 72},
            {"label": "Veraval", "value": 68},
            {"label": "Paradip", "value": 54},
        ],
    },
}


def test_chat_response_round_trips_pfz_mock_record_with_chart_data():
    chat_response = ChatResponse.model_validate(R_001)
    assert chat_response.model_dump(by_alias=True, mode="json", exclude_unset=True) == R_001
