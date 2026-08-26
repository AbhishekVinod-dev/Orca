export type ChatMessage = {
  id: string;
  role: "user" | "orca";
  content: string;
  detectedLanguage?: string;
  timestamp: string;
  contextLabel?: string;
  attachments?: {
    type: "map" | "chart" | "evidence";
    id: string;
  }[];
};

export type PFZZone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  suitability: number;
  chlorophyll: number;
  sst: number;
  safetyScore: number;
};

export type MarineAlert = {
  id: string;
  // "weather"/"waves" cover the mock fixtures in data/mockData.ts; the rest
  // are the real values GET /api/alerts returns (see backend/app/schemas.py
  // AlertType).
  type: "weather" | "waves" | "lightning" | "cyclone" | "high-wave" | "geofence" | "fog" | "wind";
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  location: string;
  timestamp: string;
  description: string;
  coordinates?: [number, number]; // [lat, lng], present on real backend alerts
};

export type EvidenceSource = {
  id: string;
  name: string;
  category: "satellite" | "ocean" | "weather" | "gis" | "advisory";
  status: "used" | "available";
  summary: string;
};

export type AgentStep = {
  id: string;
  agent: string;
  status: "pending" | "running" | "complete";
  detail?: string;
};

export type MapLayer = "pfz" | "sst" | "chlorophyll" | "alerts" | "routes" | "geofences";

export type Geofence = {
  id: string;
  name: string;
  coordinates: [number, number][]; // Array of [lat, lng]
  description: string;
  riskLevel: "restricted" | "warning";
};

export type VesselRoute = {
  id: string;
  name: string;
  path: [number, number][]; // Array of [lat, lng]
  status: "safe" | "caution" | "unsafe";
};
