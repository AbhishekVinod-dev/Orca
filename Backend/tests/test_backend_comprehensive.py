import sys
import json
import requests
import unittest

BASE_URL = "http://127.0.0.1:8000"


class TestOrcaBackendAPI(unittest.TestCase):
    """
    Comprehensive Test Suite for Orca Marine Intelligence Platform Backend APIs.
    Tests all endpoints, user personas, disclosure levels, and edge cases.
    """

    def test_01_root_endpoint(self):
        res = requests.get(f"{BASE_URL}/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("msg", res.json())
        print("[PASS] ROOT endpoint")

    def test_02_auth_endpoint(self):
        res = requests.get(f"{BASE_URL}/api/v1/auth")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("msg", data)
        print(f"[PASS] AUTH endpoint: {data}")

    def test_03_eez_boundaries_endpoint(self):
        res = requests.get(f"{BASE_URL}/api/v1/internal_tools/eez_boundaries")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("type", data)
        self.assertEqual(data["type"], "FeatureCollection")
        print(f"[PASS] EEZ BOUNDARIES endpoint: {len(data.get('features', []))} features returned")

    def test_04_pfz_endpoint_valid_zone(self):
        res = requests.get(f"{BASE_URL}/api/v1/internal_tools/pfz/south%20tamilnadu")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("zone", data)
        self.assertEqual(data["zone"], "south tamilnadu")
        print(f"[PASS] PFZ VALID ZONE endpoint: {data['zone']}")

    def test_05_pfz_endpoint_special_zone(self):
        res = requests.get(f"{BASE_URL}/api/v1/internal_tools/pfz/kerala")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("zone", data)
        self.assertEqual(data["zone"], "kerala")
        print(f"[PASS] PFZ KERALA ZONE endpoint: {data['zone']}")


    def test_06_agent_persona_fisherman(self):
        payload = {
            "prompt": "Is it safe to sail near Rameswaram today?",
            "role": "fisherman",
            "lang": "ta",
            "lat": 9.2882,
            "long": 79.3129,
            "disclosure_level": 1,
            "bandwidth_mode": "low"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload, stream=True)
        self.assertEqual(res.status_code, 200)

        chunks_received = 0
        text_content = ""
        for chunk in res.iter_content(chunk_size=1024):
            if chunk:
                chunks_received += 1
                text_content += chunk.decode("utf-8", errors="ignore")

        self.assertGreater(chunks_received, 0)
        self.assertIn("data:", text_content)
        print(f"[PASS] AGENT FISHERMAN PERSONA: {chunks_received} SSE chunks received")

    def test_07_agent_persona_oceanographer(self):
        payload = {
            "prompt": "Provide SST, Chlorophyll-a, and Argo profile data for Chennai coastal waters.",
            "role": "oceanographer",
            "lang": "en",
            "lat": 12.5000,
            "long": 80.2000,
            "disclosure_level": 4,
            "bandwidth_mode": "normal"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload, stream=True)
        self.assertEqual(res.status_code, 200)

        chunks_received = 0
        for chunk in res.iter_content(chunk_size=1024):
            if chunk:
                chunks_received += 1

        self.assertGreater(chunks_received, 0)
        print(f"[PASS] AGENT OCEANOGRAPHER PERSONA: {chunks_received} SSE chunks received")

    def test_08_agent_persona_policymaker(self):
        payload = {
            "prompt": "Check EEZ compliance and MPA violations near Marine National Park.",
            "role": "policymaker",
            "lang": "en",
            "lat": 22.4500,
            "long": 69.1000,
            "disclosure_level": 3,
            "bandwidth_mode": "normal"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload, stream=True)
        self.assertEqual(res.status_code, 200)

        chunks_received = 0
        for chunk in res.iter_content(chunk_size=1024):
            if chunk:
                chunks_received += 1

        self.assertGreater(chunks_received, 0)
        print(f"[PASS] AGENT POLICYMAKER PERSONA: {chunks_received} SSE chunks received")

    def test_09_agent_persona_aquaculture(self):
        payload = {
            "prompt": "What are the salinity and water temperature conditions for coastal shrimp farming?",
            "role": "aquaculture",
            "lang": "en",
            "lat": 16.5000,
            "long": 82.0000,
            "disclosure_level": 2,
            "bandwidth_mode": "normal"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload, stream=True)
        self.assertEqual(res.status_code, 200)
        print("[PASS] AGENT AQUACULTURE PERSONA")

    def test_10_agent_persona_shipping(self):
        payload = {
            "prompt": "Assess wave height and safe route corridors for cargo vessel departure.",
            "role": "shipping",
            "lang": "en",
            "lat": 13.0800,
            "long": 80.2700,
            "disclosure_level": 3,
            "bandwidth_mode": "normal"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload, stream=True)
        self.assertEqual(res.status_code, 200)
        print("[PASS] AGENT SHIPPING PERSONA")

    def test_11_edge_case_disclosure_level_out_of_range(self):
        payload = {
            "prompt": "Test invalid level",
            "role": "fisherman",
            "lat": 10.0,
            "long": 75.0,
            "disclosure_level": 10
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload)
        self.assertEqual(res.status_code, 422)
        print("[PASS] EDGE CASE INVALID DISCLOSURE LEVEL (HTTP 422 Validation Error)")

    def test_12_edge_case_missing_required_lat_long(self):
        payload = {
            "prompt": "Missing lat long coordinates"
        }
        res = requests.post(f"{BASE_URL}/api/v1/agent", json=payload)
        self.assertEqual(res.status_code, 422)
        print("[PASS] EDGE CASE MISSING COORDS (HTTP 422 Validation Error)")

    def test_13_speech_endpoint_missing_file(self):
        res = requests.post(f"{BASE_URL}/api/v1/speech")
        self.assertEqual(res.status_code, 422)
        print("[PASS] SPEECH ENDPOINT MISSING FILE (HTTP 422 Validation Error)")


if __name__ == "__main__":
    unittest.main()

