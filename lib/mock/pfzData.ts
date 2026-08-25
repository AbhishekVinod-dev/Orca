// lib/mock/pfzData.ts
// Potential Fishing Zone data — mock GeoJSON polygons
// TODO: replace fetchPFZZones with call to /api/pfz?lat=&lng=&date=

export interface PFZZone {
  id: string;
  name: string;
  confidence: 'high' | 'medium' | 'low';
  confidence_pct: number;
  species: string[];
  sst_range: [number, number]; // °C
  chlorophyll_range: [number, number]; // mg/m³
  depth_range: [number, number]; // meters
  coordinates: [number, number][][]; // polygon rings [lng, lat]
  centroid: [number, number]; // [lat, lng]
  area_km2: number;
  valid_date: string;
  source_satellites: string[];
}

export const mockPFZZones: PFZZone[] = [
  {
    id: 'PFZ-001',
    name: 'Chennai offshore zone',
    confidence: 'high',
    confidence_pct: 87,
    species: ['Indian Mackerel', 'Seer Fish', 'Tuna'],
    sst_range: [28.2, 29.8],
    chlorophyll_range: [0.8, 2.1],
    depth_range: [40, 120],
    coordinates: [[[80.1,13.2],[80.4,13.2],[80.4,13.6],[80.1,13.6],[80.1,13.2]]],
    centroid: [13.4, 80.25],
    area_km2: 1250,
    valid_date: '2026-08-25',
    source_satellites: ['MODIS Aqua', 'VIIRS SNPP'],
  },
  {
    id: 'PFZ-002',
    name: 'Rameswaram fishing ground',
    confidence: 'high',
    confidence_pct: 91,
    species: ['Seer Fish', 'Pomfret', 'Red Snapper'],
    sst_range: [27.5, 29.0],
    chlorophyll_range: [1.2, 3.4],
    depth_range: [20, 80],
    coordinates: [[[78.8,9.2],[79.3,9.2],[79.3,9.8],[78.8,9.8],[78.8,9.2]]],
    centroid: [9.5, 79.05],
    area_km2: 890,
    valid_date: '2026-08-25',
    source_satellites: ['Sentinel-3 OLCI', 'MODIS Terra'],
  },
  {
    id: 'PFZ-003',
    name: 'Vizhinjam offshore sector',
    confidence: 'medium',
    confidence_pct: 72,
    species: ['Indian Mackerel', 'Sardine', 'Anchovy'],
    sst_range: [26.8, 28.5],
    chlorophyll_range: [0.6, 1.8],
    depth_range: [50, 150],
    coordinates: [[[76.7,8.0],[77.2,8.0],[77.2,8.6],[76.7,8.6],[76.7,8.0]]],
    centroid: [8.3, 76.95],
    area_km2: 2100,
    valid_date: '2026-08-25',
    source_satellites: ['MODIS Aqua'],
  },
  {
    id: 'PFZ-004',
    name: 'Veraval offshore zone',
    confidence: 'medium',
    confidence_pct: 68,
    species: ['Bombay Duck', 'Shark', 'Ray'],
    sst_range: [27.0, 29.5],
    chlorophyll_range: [0.4, 1.4],
    depth_range: [30, 100],
    coordinates: [[[69.8,20.5],[70.8,20.5],[70.8,21.3],[69.8,21.3],[69.8,20.5]]],
    centroid: [20.9, 70.3],
    area_km2: 1780,
    valid_date: '2026-08-25',
    source_satellites: ['VIIRS SNPP'],
  },
  {
    id: 'PFZ-005',
    name: 'Paradip deep-water zone',
    confidence: 'low',
    confidence_pct: 54,
    species: ['Tuna', 'Swordfish', 'Marlin'],
    sst_range: [26.5, 28.0],
    chlorophyll_range: [0.3, 0.9],
    depth_range: [200, 500],
    coordinates: [[[86.2,19.5],[87.0,19.5],[87.0,20.2],[86.2,20.2],[86.2,19.5]]],
    centroid: [19.85, 86.6],
    area_km2: 3200,
    valid_date: '2026-08-25',
    source_satellites: ['MODIS Terra', 'Sentinel-3 OLCI'],
  },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function fetchPFZZones(lat: number, lng: number, radiusKm = 2000): Promise<PFZZone[]> {
  await delay(900);
  // TODO: replace with call to /api/pfz?lat=&lng=&radius=&date=
  return mockPFZZones.filter(z => distanceKm(lat, lng, z.centroid[0], z.centroid[1]) <= radiusKm);
}

export async function fetchAllPFZZones(): Promise<PFZZone[]> {
  await delay(800);
  // TODO: replace with call to /api/pfz/all
  return mockPFZZones;
}
