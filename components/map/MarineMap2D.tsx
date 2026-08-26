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
        {/* Dark Matter CartoDB theme to match aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip !bg-space-950 !border !border-space-800 !text-white !p-4 !rounded-md !shadow-2xl">
                   <div className="flex flex-col gap-1 w-56">
                     <span className="font-medium text-sm border-b border-space-800 pb-2 mb-1">{globeTarget.title}</span>
                     {globeTarget.desc && <span className="text-xs text-slate-400 whitespace-normal">{globeTarget.desc}</span>}
                   </div>
                </Tooltip>
              )}
            </Circle>
          </>
        )}

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
      </MapContainer>
    </div>
  );
}
