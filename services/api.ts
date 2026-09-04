import { MOCK_PFZ, MOCK_ALERTS, MOCK_EVIDENCE, MOCK_GEOFENCES, MOCK_ROUTES } from '../data/mockData';
import { PFZZone, MarineAlert, EvidenceSource, Geofence, VesselRoute } from '../types';

// Unset in local dev with no backend running -> every call below falls back
// to the mock data/timing that was already here (F3's local-mock fallback).
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/alerts response shape (backend/app/schemas.py Alert) -- different
// field names than this app's MarineAlert, see docs/MIGRATION_TRACKER.md
// Contract Parity Gate. Mapped in toMarineAlert() below, not renamed
// upstream, so the backend keeps IMD/GDACS's actual field names.
type BackendAlert = {
  id: string;
  type: MarineAlert['type'];
  severity: MarineAlert['severity'];
  title: string;
  description: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  issuedAt: string;
  source: string;
};

function toMarineAlert(a: BackendAlert): MarineAlert {
  return {
    id: a.id,
    type: a.type,
    severity: a.severity,
    title: a.title,
    location: a.region,
    timestamp: a.issuedAt,
    description: a.description,
    coordinates: a.coordinates,
  };
}

export type BackendAgentStep = {
  type: 'thought' | 'status' | 'final' | 'error';
  name: string;
  content: string;
};

async function streamRealChat(
  query: string,
  role: string,
  lang: string,
  lat: number,
  long: number,
  onStep: (step: BackendAgentStep) => void
): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: query, role, lang, lat, long }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`POST /agent failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const dataLine = block.split('\n').find(l => l.startsWith('data:'));
      if (!dataLine) continue;
      
      try {
        const data = JSON.parse(dataLine.slice('data:'.length).trim()) as BackendAgentStep;
        if (data.type === 'final' && (data.name === 'orchestrator' || !data.name)) {
          finalResponse = data.content;
        } else {
          onStep(data);
        }
      } catch (e) {
        console.error("Failed to parse SSE step", e, dataLine);
      }
    }
  }
  return finalResponse;
}

export const apiService = {
  getPFZ: async (lat?: number, lng?: number, radius?: number): Promise<PFZZone[]> => {
    if (!API_URL) {
      await delay(600);
      return MOCK_PFZ;
    }
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    if (radius !== undefined) params.append('radius', radius.toString());
    
    const url = params.toString() ? `${API_URL}/api/pfz?${params.toString()}` : `${API_URL}/api/pfz`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`GET /api/pfz failed: ${res.status}`);
    }
    const rawData = await res.json();
    return rawData.map((d: any) => ({
      id: d.id,
      name: d.name,
      latitude: d.centroid?.[0] || 0,
      longitude: d.centroid?.[1] || 0,
      suitability: d.confidence_pct || 0,
      chlorophyll: d.chlorophyll_range ? Math.round((d.chlorophyll_range[0] + d.chlorophyll_range[1]) / 2 * 10) / 10 : 0,
      sst: d.sst_range ? Math.round((d.sst_range[0] + d.sst_range[1]) / 2 * 10) / 10 : 0,
      safetyScore: 90 // Default safety score as it's not present in backend data
    }));
  },

  getEEZBoundaries: async (): Promise<any | null> => {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/api/v1/eez_boundaries`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("Failed to fetch EEZ Boundaries", e);
      return null;
    }
  },

  getRawPFZ: async (zone: string): Promise<any | null> => {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/api/v1/pfz/${encodeURIComponent(zone)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("Failed to fetch PFZ data", e);
      return null;
    }
  },

  getAlerts: async (): Promise<MarineAlert[]> => {
    if (!API_URL) {
      await delay(500);
      return MOCK_ALERTS;
    }
    const res = await fetch(`${API_URL}/api/alerts`);
    if (!res.ok) {
      throw new Error(`GET /api/alerts failed: ${res.status}`);
    }
    const alerts: BackendAlert[] = await res.json();
    return alerts.map(toMarineAlert);
  },

  getEvidence: async (): Promise<EvidenceSource[]> => {
    await delay(800);
    return MOCK_EVIDENCE;
  },

  getGeofences: async (): Promise<Geofence[]> => {
    await delay(400);
    return MOCK_GEOFENCES;
  },

  getRoutes: async (): Promise<VesselRoute[]> => {
    await delay(700);
    return MOCK_ROUTES;
  },

  // Simulating a chat response that takes some time to 'think'
  sendChatMessage: async (message: string): Promise<string> => {
    await delay(2500);
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('pfz') || lowerMsg.includes('fish')) {
      return "I have located several Potential Fishing Zones (PFZ) near your current map center. I've highlighted them on the map. Zone Alpha has the highest suitability based on current SST and chlorophyll levels.";
    }

    if (lowerMsg.includes('safe') || lowerMsg.includes('cyclone') || lowerMsg.includes('weather')) {
      return "There is a severe cyclone warning in the Bay of Bengal, and high waves predicted off the Arabian Sea Coast. I recommend staying in harbor or sticking to the designated safe coastal routes.";
    }

    if (lowerMsg.includes('route')) {
      return "I've overlaid a safe coastal route on the map avoiding the restricted naval exercise geofence.";
    }

    return "I am analyzing the latest marine intelligence. Based on current satellite and oceanographic data, conditions are normal, but please review the map and alerts panel for specific localized advisories.";
  },

  // Real SSE-driven chat when NEXT_PUBLIC_API_URL is set; otherwise fires
  // onStep on the same cadence the old pure-mock simulation used, then
  // resolves with sendChatMessage's canned reply (F3 local-mock fallback).
  streamChat: async (
    message: string, 
    role: string,
    lang: string,
    lat: number,
    long: number,
    onStep: (step: BackendAgentStep) => void
  ): Promise<string> => {
    if (!API_URL) {
      const mockAgents = ['orchestrator', 'spatial_agent', 'meteorology_agent'];
      const mockDelays = [1000, 1500, 1500];
      for (let i = 0; i < mockAgents.length; i++) {
        await delay(mockDelays[i]);
        onStep({ type: 'status', name: mockAgents[i], content: 'Processing data...' });
      }
      return apiService.sendChatMessage(message);
    }
    return streamRealChat(message, role, lang, lat, long, onStep);
  },
};
