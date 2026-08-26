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
