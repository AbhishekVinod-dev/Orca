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
  onStep: (step: BackendAgentStep) => void,
  disclosureLevel: number = 2,
  bandwidthMode: string = 'normal'
): Promise<string> {
  const requestBody = {
    prompt: query,
    query,
    role,
    lang,
    language: lang,
    lat,
    long,
    lng: long,
    disclosure_level: disclosureLevel,
    bandwidth_mode: bandwidthMode
  };
  console.log('[Chat API] Sending request to backend agent:', { ...requestBody, prompt: query.substring(0, 50) });

  let endpoint = `${API_URL}/api/chat`;
  let res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    // Try fallback to /api/v1/agent if /api/chat is not available
    try {
      const fallbackRes = await fetch(`${API_URL}/api/v1/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (fallbackRes.ok && fallbackRes.body) {
        res = fallbackRes;
      }
    } catch {}
  }

  if (!res.ok || !res.body) {
    throw new Error(`Agent request failed with status: ${res.status}`);
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
      if (!block.trim()) continue;

      const eventLine = block.split('\n').find(l => l.startsWith('event:'));
      const dataLine = block.split('\n').find(l => l.startsWith('data:'));
      if (!dataLine) continue;

      const eventType = eventLine ? eventLine.slice('event:'.length).trim() : '';
      const jsonStr = dataLine.slice('data:'.length).trim();
      try {
        if (!jsonStr || (!jsonStr.startsWith('{') && !jsonStr.startsWith('['))) {
          console.warn("Invalid SSE data format, skipping:", jsonStr.substring(0, 50));
          continue;
        }

        const data = JSON.parse(jsonStr);
        const resolvedType = eventType || data.type || 'status';

        if (resolvedType === 'hazard_alert') {
          onStep({
            type: 'status',
            name: 'Hazard Warning',
            content: typeof data.content === 'object' ? JSON.stringify(data.content) : data.content
          });
        } else if (resolvedType === 'thought' || resolvedType === 'step' || resolvedType === 'status') {
          onStep({
            type: 'status',
            name: data.agent || data.name || 'Planner Agent',
            content: data.detail ? `${data.action || ''}: ${data.detail}` : (typeof data.content === 'string' ? data.content : JSON.stringify(data.content))
          });
        } else if (resolvedType === 'a2a_step') {
          onStep({
            type: 'status',
            name: `${data.sender || 'Agent'} ➔ ${data.target || 'Agent'}`,
            content: `Intent: ${data.intent || 'Delegating task'}`
          });
        } else if (resolvedType === 'evidence') {
          onStep({
            type: 'status',
            name: 'Evidence Synthesizer',
            content: typeof data.content === 'object' ? `Observed: ${data.content?.observations?.length || 0} signals` : String(data.content)
          });
        } else if (resolvedType === 'persona_response' || resolvedType === 'final') {
          const rawResp = typeof data === 'string' ? data : (data.response || data.content || JSON.stringify(data));
          if (typeof rawResp === 'string') {
            try {
              const contentStr = rawResp.trim();
              if (contentStr.startsWith('{') || contentStr.startsWith('[')) {
                const parsed = JSON.parse(contentStr);
                finalResponse = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
              } else {
                finalResponse = rawResp;
              }
            } catch {
              finalResponse = rawResp;
            }
          } else {
            finalResponse = JSON.stringify(rawResp);
          }
        } else if (data.response) {
          finalResponse = data.response;
        } else {
          onStep({
            type: 'status',
            name: data.name || data.agent || 'System',
            content: typeof data.content === 'string' ? data.content : (data.detail || JSON.stringify(data))
          });
        }
      } catch (e) {
        if (jsonStr.length > 0) {
          console.error("Failed to parse SSE step:", {
            error: e instanceof Error ? e.message : String(e),
            jsonPreview: jsonStr.substring(0, 150)
          });
        }
      }
    }
  }

  console.log('[Chat API] Response streaming complete, final response length:', finalResponse.length);
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
    // Backend endpoint /api/v1/eez_boundaries is not yet implemented
    return null;
  },

  getRawPFZ: async (_zone: string): Promise<any | null> => {
    // Backend endpoint /api/v1/pfz/{zone} is not yet implemented
    return null;
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
    onStep: (step: BackendAgentStep) => void,
    disclosureLevel?: number,
    bandwidthMode?: string
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
    return streamRealChat(message, role, lang, lat, long, onStep, disclosureLevel, bandwidthMode);
  },
};
