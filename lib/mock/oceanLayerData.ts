// lib/mock/oceanLayerData.ts
// Mock SST, Chlorophyll grid data, routes, and geofences
// TODO: replace with calls to /api/sst, /api/chlorophyll, /api/routes, /api/geofences

export interface SSTPoint {
  lat: number;
  lng: number;
  value: number; // °C
}

export interface ChlorophyllPoint {
  lat: number;
  lng: number;
  value: number; // mg/m³
}

export interface VesselRoute {
  id: string;
  name: string;
  type: 'safe' | 'caution' | 'restricted';
  waypoints: [number, number][]; // [lat, lng]
  distance_nm: number;
  estimated_hours: number;
  hazards: string[];
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'eez-boundary' | 'restricted' | 'protected-marine' | 'deep-sea-mining';
  coordinates: [number, number][][]; // polygon [lat, lng]
  color: string;
  description: string;
}

// SST grid — Indian Ocean region, sampled at ~1° resolution
export const mockSSTData: SSTPoint[] = [
  // Bay of Bengal
  { lat: 8.0, lng: 80.0, value: 28.2 },
  { lat: 9.0, lng: 80.0, value: 28.5 },
  { lat: 10.0, lng: 80.0, value: 28.8 },
  { lat: 11.0, lng: 80.0, value: 29.0 },
  { lat: 12.0, lng: 80.0, value: 29.2 },
  { lat: 13.0, lng: 80.0, value: 29.4 },
  { lat: 14.0, lng: 80.5, value: 29.1 },
  { lat: 15.0, lng: 81.0, value: 28.9 },
  { lat: 16.0, lng: 82.0, value: 28.6 },
  { lat: 17.0, lng: 82.5, value: 28.3 },
  { lat: 8.0, lng: 82.0, value: 28.0 },
  { lat: 9.0, lng: 82.0, value: 28.3 },
  { lat: 10.0, lng: 82.0, value: 28.7 },
  { lat: 12.0, lng: 82.0, value: 29.0 },
  { lat: 15.0, lng: 83.0, value: 29.5 },
  { lat: 18.0, lng: 84.0, value: 28.1 },
  { lat: 20.0, lng: 86.0, value: 27.8 },
  // Arabian Sea
  { lat: 8.0, lng: 74.0, value: 27.5 },
  { lat: 9.0, lng: 74.5, value: 27.8 },
  { lat: 10.0, lng: 75.0, value: 28.1 },
  { lat: 11.0, lng: 75.5, value: 28.4 },
  { lat: 12.0, lng: 75.5, value: 28.6 },
  { lat: 14.0, lng: 74.0, value: 28.9 },
  { lat: 16.0, lng: 73.0, value: 28.3 },
  { lat: 18.0, lng: 72.0, value: 28.0 },
  { lat: 20.0, lng: 71.0, value: 27.6 },
  { lat: 22.0, lng: 69.5, value: 27.2 },
  { lat: 10.0, lng: 72.0, value: 28.2 },
  { lat: 12.0, lng: 72.0, value: 28.5 },
];

// Chlorophyll grid
export const mockChlorophyllData: ChlorophyllPoint[] = [
  { lat: 8.5, lng: 78.5, value: 2.1 },
  { lat: 9.5, lng: 79.0, value: 3.4 },
  { lat: 10.0, lng: 79.5, value: 1.8 },
  { lat: 11.0, lng: 80.0, value: 1.2 },
  { lat: 12.5, lng: 80.5, value: 0.9 },
  { lat: 13.5, lng: 80.2, value: 1.5 },
  { lat: 8.0, lng: 76.5, value: 1.9 },
  { lat: 9.0, lng: 76.0, value: 2.6 },
  { lat: 10.5, lng: 75.5, value: 1.4 },
  { lat: 12.0, lng: 75.0, value: 0.8 },
  { lat: 14.0, lng: 74.0, value: 0.6 },
  { lat: 16.0, lng: 73.5, value: 0.4 },
  { lat: 20.0, lng: 86.0, value: 0.7 },
  { lat: 18.0, lng: 84.0, value: 0.9 },
  { lat: 9.0, lng: 79.5, value: 4.1 },
];

// Safe vessel routes
export const mockRoutes: VesselRoute[] = [
  {
    id: 'RT-001',
    name: 'Chennai → Rameswaram Safe Route',
    type: 'safe',
    waypoints: [[13.1, 80.3], [12.5, 80.1], [11.8, 79.8], [10.9, 79.4], [9.5, 79.1]],
    distance_nm: 180,
    estimated_hours: 22,
    hazards: [],
  },
  {
    id: 'RT-002',
    name: 'Kochi → Lakshadweep Route (Caution)',
    type: 'caution',
    waypoints: [[9.9, 76.3], [10.2, 75.5], [10.5, 74.5], [10.6, 73.5], [10.6, 72.6]],
    distance_nm: 250,
    estimated_hours: 32,
    hazards: ['Moderate wave height (2.5–3.5m)', 'SW monsoon swell'],
  },
];

// Geofence zones
export const mockGeofences: GeofenceZone[] = [
  {
    id: 'GF-001',
    name: 'India–Sri Lanka Maritime Boundary',
    type: 'eez-boundary',
    coordinates: [[[9.0,80.0],[9.5,80.5],[8.5,81.0],[8.0,80.5],[9.0,80.0]]],
    color: '#EF4444',
    description: 'International maritime boundary. Crossing requires special authorization.',
  },
  {
    id: 'GF-002',
    name: 'Gulf of Mannar Marine National Park',
    type: 'protected-marine',
    coordinates: [[[8.6,78.1],[9.0,78.5],[8.7,79.0],[8.3,78.6],[8.6,78.1]]],
    color: '#22C55E',
    description: 'Protected marine biosphere reserve. Fishing prohibited.',
  },
  {
    id: 'GF-003',
    name: 'Navy Exercise Zone — Bay of Bengal',
    type: 'restricted',
    coordinates: [[[14.0,83.0],[15.0,83.5],[15.0,84.5],[14.0,84.5],[14.0,83.0]]],
    color: '#F97316',
    description: 'Active naval exercise zone. Entry prohibited until 2026-08-28.',
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchSSTData(): Promise<SSTPoint[]> {
  await delay(700);
  // TODO: replace with call to /api/sst?date=&region=
  return mockSSTData;
}

export async function fetchChlorophyllData(): Promise<ChlorophyllPoint[]> {
  await delay(700);
  // TODO: replace with call to /api/chlorophyll?date=&region=
  return mockChlorophyllData;
}

export async function fetchRoutes(lat: number, lng: number): Promise<VesselRoute[]> {
  await delay(600);
  // TODO: replace with call to /api/routes/safe?origin_lat=&origin_lng=
  return mockRoutes;
}

export async function fetchGeofences(): Promise<GeofenceZone[]> {
  await delay(400);
  // TODO: replace with call to /api/geofences
  return mockGeofences;
}
