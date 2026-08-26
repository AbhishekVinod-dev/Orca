import { ChatMessage, PFZZone, MarineAlert, EvidenceSource, Geofence, VesselRoute } from '../types';

export const MOCK_PFZ: PFZZone[] = [
  { id: 'pfz1', name: 'Zone Alpha', latitude: 15.35, longitude: 73.1, suitability: 92, chlorophyll: 4.2, sst: 28.5, safetyScore: 85 },
  { id: 'pfz2', name: 'Zone Beta', latitude: 14.8, longitude: 72.5, suitability: 88, chlorophyll: 3.8, sst: 29.0, safetyScore: 90 },
  { id: 'pfz3', name: 'Zone Gamma', latitude: 12.5, longitude: 74.2, suitability: 75, chlorophyll: 2.1, sst: 27.8, safetyScore: 60 },
];

export const MOCK_ALERTS: MarineAlert[] = [
  { id: 'alert1', type: 'cyclone', severity: 'critical', title: 'Cyclone Warning', location: 'Bay of Bengal', timestamp: new Date().toISOString(), description: 'Severe cyclonic storm forming. Avoid deep sea fishing in the region.' },
  { id: 'alert2', type: 'waves', severity: 'high', title: 'High Wave Alert', location: 'Arabian Sea Coast', timestamp: new Date().toISOString(), description: 'Waves expected to reach 3.5m. Small vessels advised to stay in harbor.' },
  { id: 'alert3', type: 'lightning', severity: 'moderate', title: 'Thunderstorm Risk', location: 'Kerala Coast', timestamp: new Date().toISOString(), description: 'Isolated thunderstorms with lightning predicted.' },
];

export const MOCK_EVIDENCE: EvidenceSource[] = [
  { id: 'ev1', name: 'INSAT-3D SST', category: 'satellite', status: 'used', summary: 'Sea Surface Temperature anomalies detected.' },
  { id: 'ev2', name: 'Oceansat-3 Chlorophyll', category: 'satellite', status: 'used', summary: 'High chlorophyll-a concentration indicating plankton bloom.' },
  { id: 'ev3', name: 'INCOIS Wave Forecast', category: 'ocean', status: 'available', summary: 'Normal wave conditions in the targeted PFZ.' },
];

export const MOCK_GEOFENCES: Geofence[] = [
  { id: 'geo1', name: 'Naval Exercise Area', description: 'Restricted area due to ongoing naval exercises.', riskLevel: 'restricted', coordinates: [[13.0, 72.0], [13.5, 72.0], [13.5, 72.5], [13.0, 72.5]] },
];

export const MOCK_ROUTES: VesselRoute[] = [
  { id: 'route1', name: 'Safe Coastal Route', status: 'safe', path: [[15.5, 73.5], [15.0, 73.8], [14.5, 74.0], [14.0, 74.3]] },
];

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 'init', role: 'orca', content: 'Hello! I am ORCA, your Marine Intelligence Platform. How can I assist you with sea conditions, fishing zones, or safety today?', timestamp: new Date().toISOString() }
];
