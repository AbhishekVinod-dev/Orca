import { create } from 'zustand';
import { ChatMessage, PFZZone, MarineAlert, EvidenceSource, MapLayer, Geofence, VesselRoute, AgentStep } from '../types';
import { INITIAL_CHAT } from '../data/mockData';

interface AppState {
  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  isProcessing: boolean;
  setProcessing: (status: boolean) => void;
  agentSteps: AgentStep[];
  setAgentSteps: (steps: AgentStep[]) => void;
  updateAgentStep: (id: string, status: AgentStep['status'], detail?: string) => void;
  
  // Map
  activeLayers: MapLayer[];
  toggleLayer: (layer: MapLayer) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  
  // Data
  alerts: MarineAlert[];
  setAlerts: (alerts: MarineAlert[]) => void;
  pfzZones: PFZZone[];
  setPfzZones: (zones: PFZZone[]) => void;
  evidence: EvidenceSource[];
  setEvidence: (evidence: EvidenceSource[]) => void;
  geofences: Geofence[];
  setGeofences: (geofences: Geofence[]) => void;
  routes: VesselRoute[];
  setRoutes: (routes: VesselRoute[]) => void;
  
  // Settings
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: INITIAL_CHAT,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  isProcessing: false,
  setProcessing: (status) => set({ isProcessing: status }),
  
  agentSteps: [],
  setAgentSteps: (steps) => set({ agentSteps: steps }),
  updateAgentStep: (id, status, detail) => set((state) => ({
    agentSteps: state.agentSteps.map(step => 
      step.id === id ? { ...step, status, detail: detail || step.detail } : step
    )
  })),

  activeLayers: ['pfz', 'alerts'],
  toggleLayer: (layer) => set((state) => ({
    activeLayers: state.activeLayers.includes(layer)
      ? state.activeLayers.filter(l => l !== layer)
      : [...state.activeLayers, layer]
  })),
  mapCenter: [15.0, 73.0], // Default center (e.g. West Coast India)
  setMapCenter: (center) => set({ mapCenter: center }),

  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  pfzZones: [],
  setPfzZones: (zones) => set({ pfzZones: zones }),
  evidence: [],
  setEvidence: (evidence) => set({ evidence }),
  geofences: [],
  setGeofences: (geofences) => set({ geofences }),
  routes: [],
  setRoutes: (routes) => set({ routes }),

  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
