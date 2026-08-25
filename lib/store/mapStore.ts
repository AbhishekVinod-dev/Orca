'use client';
// lib/store/mapStore.ts
import { create } from 'zustand';

export type MapLayer = 'pfz' | 'sst' | 'chlorophyll' | 'alerts' | 'routes' | 'geofences';

interface MapState {
  activeLayers: Set<MapLayer>;
  viewport: { lat: number; lng: number; zoom: number };
  userLocation: { lat: number; lng: number; name: string } | null;
  isLocating: boolean;
  selectedZoneId: string | null;

  toggleLayer: (layer: MapLayer) => void;
  setViewport: (lat: number, lng: number, zoom?: number) => void;
  setUserLocation: (loc: { lat: number; lng: number; name: string }) => void;
  setLocating: (val: boolean) => void;
  setSelectedZone: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: new Set(['pfz', 'alerts']),
  viewport: { lat: 10.8, lng: 79.0, zoom: 6 }, // Default: Bay of Bengal / Tamil Nadu coast
  userLocation: null,
  isLocating: false,
  selectedZoneId: null,

  toggleLayer: (layer) => {
    set(s => {
      const next = new Set(s.activeLayers);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return { activeLayers: next };
    });
  },

  setViewport: (lat, lng, zoom = 6) => set({ viewport: { lat, lng, zoom } }),

  setUserLocation: (loc) => set({ userLocation: loc }),

  setLocating: (val) => set({ isLocating: val }),

  setSelectedZone: (id) => set({ selectedZoneId: id }),
}));
