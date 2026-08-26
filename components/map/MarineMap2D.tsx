"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '../../lib/store';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });

// Mock Geofence for Marine Protected Area
const mockIMBLPolygon = [
  [12.0, 80.0],
  [12.5, 81.5],
  [11.5, 82.0],
  [10.0, 81.0],
  [10.5, 79.5]
] as [number, number][];

// Generate 150 mock sensors around India's coast
const generatedSensors = Array.from({ length: 150 }).map((_, i) => {
  // Random lat between 5.0 and 20.0
  const lat = 5.0 + Math.random() * 15.0;
  // Random lon between 68.0 and 90.0 (Arabian Sea to Bay of Bengal)
  const lon = 68.0 + Math.random() * 22.0;
  const types = ['Buoy', 'Glider', 'Station', 'Tsunami Buoy', 'Float'];
  const statuses = ['Active', 'Active', 'Active', 'Warning', 'Offline'];
  
  return {
    id: `S-${Math.floor(Math.random() * 900) + 100}`,
    lat,
    lon,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    temp: (26 + Math.random() * 4).toFixed(1) + '°C'
  };
});

const mockSensors = [
  { id: 'S-01', lat: 10.5, lon: 76.5, type: 'Buoy', status: 'Active', temp: '28.4°C' },
  { id: 'S-02', lat: 10.2, lon: 76.8, type: 'Glider', status: 'Warning', temp: '29.1°C' },
  { id: 'S-03', lat: 11.0, lon: 77.0, type: 'Station', status: 'Active', temp: '27.8°C' },
  { id: 'S-04', lat: 9.8, lon: 76.2, type: 'Buoy', status: 'Offline', temp: 'N/A' },
  { id: 'S-05', lat: 14.1, lon: 81.2, type: 'Tsunami Buoy', status: 'Active', temp: '29.5°C' },
  { id: 'S-06', lat: 8.5, lon: 78.2, type: 'Glider', status: 'Active', temp: '27.1°C' },
  ...generatedSensors // Add the 150 dynamically generated sensors
];

const mockCyclone = { center: [13.5, 83.5] as [number, number], radius: 150000 };
const mockAlgalBloom = { center: [9.5, 75.5] as [number, number], radius: 60000 };
const mockMiningZone = [
  [11.0, 74.0],
  [11.5, 74.5],
  [10.8, 75.0],
  [10.2, 74.5],
] as [number, number][];

export function MarineMap2D() {
  const { globeTarget, routePath, showGeofence } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const defaultCenter = [10.421, 76.912] as [number, number]; // Near Kochi
  const targetPos = globeTarget ? [globeTarget.lat, globeTarget.lon] as [number, number] : defaultCenter;

  return (
    <div className="absolute inset-0 w-full h-full bg-space-950 z-0">
      <MapContainer 
        center={targetPos} 
        zoom={globeTarget ? 8 : 4} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', backgroundColor: '#050A10' }}
        zoomControl={false}
      >
        {/* Esri World Imagery (Satellite) - Free, No API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Dynamic Target Marker */}
        {globeTarget && (
          <>
            <Circle 
              center={targetPos} 
              radius={50000} // 50km radius
              pathOptions={{ 
                color: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6', 
                fillColor: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6', 
                fillOpacity: 0.2,
                weight: 1 
              }} 
            />
            <Circle 
              center={targetPos} 
              radius={2000} // small dot
              pathOptions={{ 
                color: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#06B6D4', 
                fillColor: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#06B6D4', 
                fillOpacity: 1,
                weight: 2 
              }} 
            >
              {globeTarget.title && (
                <Tooltip permanent direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip !bg-space-950 !border !border-space-800 !text-white !p-4 !rounded-md !shadow-2xl">
                   <div className="flex flex-col gap-1 w-56">
                     <span className="font-medium text-sm border-b border-space-800 pb-2 mb-1">{globeTarget.title}</span>
                     {globeTarget.desc && <span className="text-xs text-slate-400 whitespace-normal">{globeTarget.desc}</span>}
                   </div>
                </Tooltip>
              )}
            </Circle>
          </>
        )}

        {/* Mock Sensor Markers */}
        {mockSensors.map((sensor, idx) => (
          <Circle 
            key={idx}
            center={[sensor.lat, sensor.lon]}
            radius={8000}
            pathOptions={{
              color: sensor.status === 'Warning' ? '#f59e0b' : sensor.status === 'Offline' ? '#64748b' : '#06B6D4',
              fillColor: sensor.status === 'Warning' ? '#f59e0b' : sensor.status === 'Offline' ? '#64748b' : '#06B6D4',
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} className="custom-leaflet-tooltip !bg-space-950 !border !border-space-800 !text-white !p-3 !rounded-md">
              <div className="flex flex-col gap-1 w-40">
                <span className="font-bold text-cyan-400">{sensor.id}</span>
                <span className="text-xs text-slate-300">Type: {sensor.type}</span>
                <span className="text-xs text-slate-300">Temp: {sensor.temp}</span>
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* Route Optimization Path */}
        {routePath && (
          <Polyline 
            positions={routePath}
            pathOptions={{ color: '#06b6d4', weight: 4, dashArray: '8, 8' }}
          />
        )}

        {/* Geofencing / IMBL */}
        {showGeofence && (
          <Polygon 
            positions={mockIMBLPolygon} 
            pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.1, weight: 2 }} 
          >
             <Tooltip direction="center" opacity={1} permanent className="custom-leaflet-tooltip !bg-transparent !border-none !text-rose-500 !shadow-none !font-bold">
               RESTRICTED ZONE (IMBL)
             </Tooltip>
          </Polygon>
        )}

        {/* Demo Cyclone Alert */}
        <Circle 
          center={mockCyclone.center} 
          radius={mockCyclone.radius} 
          pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.15, weight: 1, dashArray: '4 4' }} 
        >
          <Tooltip permanent direction="top" offset={[0, -20]} opacity={1} className="custom-leaflet-tooltip !bg-space-950/90 !backdrop-blur-md !border !border-rose-500/50 !text-rose-400 !px-3 !py-1.5 !rounded-md !shadow-xl !font-bold tracking-wide">
             SEVERE CYCLONIC STORM
          </Tooltip>
        </Circle>

        {/* Demo Algal Bloom */}
        <Circle 
          center={mockAlgalBloom.center} 
          radius={mockAlgalBloom.radius} 
          pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2, weight: 0 }} 
        >
          <Tooltip direction="top" opacity={0.9} className="custom-leaflet-tooltip !bg-space-950 !border !border-space-800 !text-teal-400 !p-2 !rounded-md">
             Harmful Algal Bloom Detected
          </Tooltip>
        </Circle>

        {/* Demo Deep Sea Mining Geofence */}
        <Polygon 
          positions={mockMiningZone} 
          pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 2 }} 
        >
           <Tooltip permanent direction="top" opacity={1} className="custom-leaflet-tooltip !bg-space-950/90 !backdrop-blur-md !border !border-amber-500/50 !text-amber-500 !px-3 !py-1.5 !rounded-md !shadow-xl !font-bold tracking-wide">
             AUTHORIZED MINING ZONE
           </Tooltip>
        </Polygon>
      </MapContainer>
    </div>
  );
}
