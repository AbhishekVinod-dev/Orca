"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '../../lib/store';
import { apiService } from '../../services/api';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

function parseDMS(dms: string) {
  if (!dms) return 0;
  const parts = dms.trim().split(' ');
  if (parts.length < 4) return parseFloat(dms) || 0; // fallback if it's already decimal somehow
  const d = parseFloat(parts[0]) || 0;
  const m = parseFloat(parts[1]) || 0;
  const s = parseFloat(parts[2]) || 0;
  const dir = parts[3];
  let dec = d + m / 60 + s / 3600;
  if (dir === 'S' || dir === 'W') dec = -dec;
  return dec;
}

export function MarineMap2D() {
  const { globeTarget, routePath, showGeofence, eezGeoJSON, setEEZGeoJSON, pfzRawData, setPfzRawData } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch dynamic map data from backend
    apiService.getEEZBoundaries().then(data => {
      if (data && !data.error) setEEZGeoJSON(data);
    });
    
    // We initially fetch Kerala as a default demo, but this can be dynamic
    apiService.getRawPFZ("kerala").then(data => {
      if (data && !data.error && data.data && data.data.length > 0) {
        setPfzRawData(data);
      }
    });
  }, [setEEZGeoJSON, setPfzRawData]);

  if (!mounted) return null;

  const defaultCenter = [10.421, 76.912] as [number, number]; // Near Kochi
  const targetPos = globeTarget && globeTarget.lat !== undefined && globeTarget.lon !== undefined 
    ? [Number(globeTarget.lat), Number(globeTarget.lon)] as [number, number] 
    : defaultCenter;

  const pfzRows = pfzRawData?.data?.slice(1) || []; // Skip headers

  return (
    <div className="absolute inset-0 w-full h-full bg-space-950 z-0">
      <MapContainer 
        center={targetPos} 
        zoom={globeTarget ? 8 : 5} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', backgroundColor: '#050A10' }}
        zoomControl={false}
      >
        {/* Esri World Imagery (Satellite) */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Dynamic Target Marker (From Chat) */}
        {globeTarget && (
          <>
            <Circle 
              center={targetPos} 
              radius={50000} 
              pathOptions={{ 
                color: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6', 
                fillColor: globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6', 
                fillOpacity: 0.2,
                weight: 1 
              }} 
            />
            <Circle 
              center={targetPos} 
              radius={2000} 
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

        {/* Dynamic EEZ Boundary */}
        {showGeofence && eezGeoJSON && (
          <GeoJSON 
            data={eezGeoJSON} 
            pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 2 }}
          >
            <Tooltip permanent direction="center" opacity={0.8} className="custom-leaflet-tooltip !bg-transparent !border-none !text-amber-500 !shadow-none !font-bold">
              INDIAN EEZ BOUNDARY
            </Tooltip>
          </GeoJSON>
        )}

        {/* Dynamic PFZ Markers */}
        {pfzRows.map((row: any, idx: number) => {
          const lat = parseDMS(row[5]);
          const lon = parseDMS(row[6]);
          if (lat === 0 || lon === 0) return null;

          return (
            <Circle 
              key={idx}
              center={[lat, lon]}
              radius={3000}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.5,
                weight: 2
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} className="custom-leaflet-tooltip !bg-space-950 !border !border-space-800 !text-white !p-3 !rounded-md">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-teal-400">PFZ: {row[0]}</span>
                  <span className="text-xs text-slate-300">Depth: {row[4]} m</span>
                  <span className="text-xs text-slate-300">Distance: {row[3]} km ({row[1]})</span>
                </div>
              </Tooltip>
            </Circle>
          );
        })}

        {/* Route Optimization Path */}
        {routePath && (
          <Polyline 
            positions={routePath}
            pathOptions={{ color: '#06b6d4', weight: 4, dashArray: '8, 8' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
