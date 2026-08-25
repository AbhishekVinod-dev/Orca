'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '@/lib/store/mapStore';
import { useGeolocation } from '@/lib/geo/useGeolocation';
import { fetchAllPFZZones, PFZZone } from '@/lib/mock/pfzData';
import { fetchAlerts } from '@/lib/mock/alertsData';
import { fetchRoutes, fetchGeofences, VesselRoute, GeofenceZone } from '@/lib/mock/oceanLayerData';
import { Alert } from '@/lib/mock/alertsData';
import LayerControl from './LayerControl';
import { MapPin, Layers } from 'lucide-react';

// Fix default Leaflet icon
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom markers
const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#2DD4BF;border:3px solid white;box-shadow:0 0 12px rgba(45,212,191,0.8)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: '',
});

function alertIcon(severity: string) {
  const colors: Record<string, string> = {
    critical: '#EF4444',
    high: '#F97316',
    moderate: '#EAB308',
    low: '#22C55E',
  };
  const color = colors[severity] || '#EAB308';
  return L.divIcon({
    html: `
      <div style="position:relative;width:24px;height:24px">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.3;animation:alert-pulse 2s ease-out infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: '',
  });
}

// Map viewport controller
function ViewportController() {
  const map = useMap();
  const { viewport } = useMapStore();

  useEffect(() => {
    map.setView([viewport.lat, viewport.lng], viewport.zoom);
  }, [viewport, map]);

  return null;
}

interface OrcaMapProps {
  compact?: boolean;
}

export default function OrcaMap({ compact = false }: OrcaMapProps) {
  useGeolocation();
  const { activeLayers, userLocation } = useMapStore();
  const [pfzZones, setPfzZones] = useState<PFZZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [routes, setRoutes] = useState<VesselRoute[]>([]);
  const [geofences, setGeofences] = useState<GeofenceZone[]>([]);
  const [showLayerControl, setShowLayerControl] = useState(!compact);

  // Load data
  useEffect(() => {
    const lat = userLocation?.lat || 10.8;
    const lng = userLocation?.lng || 79.0;

    if (activeLayers.has('pfz')) {
      fetchAllPFZZones().then(setPfzZones);
    }
    if (activeLayers.has('alerts')) {
      fetchAlerts().then(setAlerts);
    }
    if (activeLayers.has('routes')) {
      fetchRoutes(lat, lng).then(setRoutes);
    }
    if (activeLayers.has('geofences')) {
      fetchGeofences().then(setGeofences);
    }
  }, [activeLayers, userLocation]);

  const pfzColors = { high: '#2DD4BF', medium: '#EAB308', low: '#F97316' };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[10.8, 79.0]}
        zoom={6}
        className="h-full w-full"
        zoomControl={!compact}
        attributionControl={true}
      >
        {/* ESRI World Imagery (satellite) tiles */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri &mdash; Source: Esri, USGS, NOAA'
          maxZoom={19}
        />

        {/* Ocean overlay for depth/nautical feel */}
        <TileLayer
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          opacity={0.4}
          attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a>'
        />

        <ViewportController />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="orca-popup">
              <div className="text-xs">
                <strong className="text-teal-400">Your Location</strong>
                <p>{userLocation.name}</p>
                <p className="text-ocean-400">{userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* PFZ zones */}
        {activeLayers.has('pfz') && pfzZones.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])}
            pathOptions={{
              color: pfzColors[zone.confidence],
              fillColor: pfzColors[zone.confidence],
              fillOpacity: 0.2,
              weight: 2,
              dashArray: zone.confidence === 'low' ? '6,4' : undefined,
            }}
          >
            <Popup>
              <div className="text-xs" style={{ background: '#061929', color: '#E2EAF4', borderRadius: 8, padding: '8px 12px' }}>
                <strong className="text-teal-400">🐟 {zone.name}</strong>
                <p className="mt-1">Confidence: <span style={{ color: pfzColors[zone.confidence] }}>{zone.confidence_pct}%</span></p>
                <p>Species: {zone.species.slice(0, 2).join(', ')}</p>
                <p>SST: {zone.sst_range[0]}–{zone.sst_range[1]}°C</p>
                <p>Source: {zone.source_satellites[0]}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Alert markers */}
        {activeLayers.has('alerts') && alerts.map(alert => (
          <Marker
            key={alert.id}
            position={alert.coordinates}
            icon={alertIcon(alert.severity)}
          >
            <Popup>
              <div className="text-xs" style={{ background: '#061929', color: '#E2EAF4', borderRadius: 8, padding: '8px 12px', maxWidth: 200 }}>
                <strong className="text-amber-400">⚠️ {alert.title}</strong>
                <p className="mt-1 opacity-80">{alert.description.slice(0, 100)}...</p>
                <p className="mt-1 text-red-400">Severity: {alert.severity.toUpperCase()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Safe routes */}
        {activeLayers.has('routes') && routes.map(route => (
          <Polyline
            key={route.id}
            positions={route.waypoints}
            pathOptions={{
              color: route.type === 'safe' ? '#22C55E' : '#F97316',
              weight: 3,
              dashArray: route.type === 'caution' ? '8,5' : undefined,
              opacity: 0.8,
            }}
          >
            <Popup>
              <div className="text-xs" style={{ background: '#061929', color: '#E2EAF4', borderRadius: 8, padding: '8px 12px' }}>
                <strong style={{ color: route.type === 'safe' ? '#22C55E' : '#F97316' }}>
                  {route.type === 'safe' ? '✅' : '⚠️'} {route.name}
                </strong>
                <p>Distance: {route.distance_nm} nm</p>
                <p>ETA: ~{route.estimated_hours}h</p>
                {route.hazards.length > 0 && <p className="text-amber-400">⚠️ {route.hazards[0]}</p>}
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Geofences */}
        {activeLayers.has('geofences') && geofences.map(gf => (
          <Polygon
            key={gf.id}
            positions={gf.coordinates[0] as [number, number][]}
            pathOptions={{
              color: gf.color,
              fillColor: gf.color,
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '8,4',
            }}
          >
            <Popup>
              <div className="text-xs" style={{ background: '#061929', color: '#E2EAF4', borderRadius: 8, padding: '8px 12px', maxWidth: 200 }}>
                <strong style={{ color: gf.color }}>🚫 {gf.name}</strong>
                <p className="mt-1 opacity-80">{gf.description}</p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      {/* Layer control toggle */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowLayerControl(v => !v)}
          className="w-8 h-8 glass-strong rounded-lg flex items-center justify-center text-ocean-300 hover:text-teal-300 border border-white/10 transition-colors"
          title="Toggle layers"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {showLayerControl && (
        <div className="absolute top-14 right-3 z-[1000]">
          <LayerControl />
        </div>
      )}

      {/* Location indicator */}
      {userLocation && (
        <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 glass-strong rounded-lg border border-white/5 text-xs text-ocean-300">
          <MapPin className="w-3 h-3 text-teal-400" />
          <span>{userLocation.name}</span>
        </div>
      )}
    </div>
  );
}
