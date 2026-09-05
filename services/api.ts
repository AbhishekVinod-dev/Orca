import { PFZZone, MarineAlert, EvidenceSource, Geofence, VesselRoute } from '../types';

// The UI must not present synthetic data as live marine intelligence.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

type BackendChatError = {
  code: string;
  message: string;
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
      } else if (event === 'error') {
        throw new Error((data as BackendChatError).message);
      }
    }
  }
  return finalResponse;
}

export const apiService = {
  getPFZ: async (): Promise<PFZZone[]> => {
    return [];
  },

  getAlerts: async (): Promise<MarineAlert[]> => {
    if (!API_URL) {
      return [];
    }
    const res = await fetch(`${API_URL}/api/alerts`);
    if (!res.ok) {
      throw new Error(`GET /api/alerts failed: ${res.status}`);
    }
    const alerts: BackendAlert[] = await res.json();
    return alerts.map(toMarineAlert);
  },

  getEvidence: async (): Promise<EvidenceSource[]> => {
    return [];
  },

  getGeofences: async (): Promise<Geofence[]> => {
    return [];
  },

  getRoutes: async (): Promise<VesselRoute[]> => {
    return [];
  },

  sendChatMessage: async (message: string): Promise<string> => {
    void message;
    return "Live marine advisory service is unavailable. Check official local maritime authorities before going to sea.";
  },

  // Never simulate agent activity or live intelligence when the backend is unavailable.
  streamChat: async (message: string, onStep: (step: BackendAgentStep) => void): Promise<string> => {
    if (!API_URL) {
      void onStep;
      return apiService.sendChatMessage(message);
    }
    return streamRealChat(message, onStep);
  },
};
