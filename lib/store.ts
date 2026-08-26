import { create } from 'zustand';

export type GlobeTarget = {
  lat: number;
  lon: number;
  title?: string;
  severity?: string;
  desc?: string;
};

type AppState = {
  globeTarget: GlobeTarget | null;
  setGlobeTarget: (target: GlobeTarget) => void;
  clearGlobeTarget: () => void;
  viewMode: '3d' | '2d';
  setViewMode: (mode: '3d' | '2d') => void;
  
  routePath: [number, number][] | null;
  setRoutePath: (path: [number, number][]) => void;
  clearRoutePath: () => void;
  
  showGeofence: boolean;
  setShowGeofence: (show: boolean) => void;
  
  isLoggedIn: boolean;
  login: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  globeTarget: null,
  setGlobeTarget: (target) => set({ globeTarget: target, viewMode: '3d' }), // Auto-switch to map view
  clearGlobeTarget: () => set({ globeTarget: null }),
  
  viewMode: '3d',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  routePath: null,
  setRoutePath: (path) => set({ routePath: path }),
  clearRoutePath: () => set({ routePath: null }),
  
  showGeofence: false,
  setShowGeofence: (show) => set({ showGeofence: show }),
  
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
}));
