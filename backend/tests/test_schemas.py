from app.schemas import Alert

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
