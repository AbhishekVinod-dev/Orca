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

// POST /api/chat SSE event payloads (backend/app/schemas.py AgentStep /
// ChatResponse).
export type BackendAgentStep = {
  agent: 'Planner' | 'DataAgent' | 'RiskAgent' | 'ResponseAgent';
  status: 'pending' | 'running' | 'done';
  action: string;
  detail: string;
  duration_ms: number;
  sources?: string[];
};

type BackendChatResponse = {
  id: string;
  response: string;
};

async function streamRealChat(query: string, onStep: (step: BackendAgentStep) => void): Promise<string> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, language: 'en' }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`POST /api/chat failed: ${res.status}`);
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
      const eventLine = block.split('\n').find(l => l.startsWith('event:'));
      const dataLine = block.split('\n').find(l => l.startsWith('data:'));
      if (!eventLine || !dataLine) continue;
      const event = eventLine.slice('event:'.length).trim();
      const data = JSON.parse(dataLine.slice('data:'.length).trim());
      if (event === 'step') {
        onStep(data as BackendAgentStep);
      } else if (event === 'final') {
        finalResponse = (data as BackendChatResponse).response;
      }
    }
  }
  return finalResponse;
}

export const apiService = {
  getPFZ: async (): Promise<PFZZone[]> => {
    await delay(600);
    return MOCK_PFZ;
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
  streamChat: async (message: string, onStep: (step: BackendAgentStep) => void): Promise<string> => {
    if (!API_URL) {
      const mockAgents: BackendAgentStep['agent'][] = ['Planner', 'DataAgent', 'RiskAgent'];
      const mockDelays = [1000, 1500, 1500];
      for (let i = 0; i < mockAgents.length; i++) {
        await delay(mockDelays[i]);
        onStep({ agent: mockAgents[i], status: 'done', action: '', detail: '', duration_ms: mockDelays[i] });
      }
      return apiService.sendChatMessage(message);
    }
    return streamRealChat(message, onStep);
  },
};
