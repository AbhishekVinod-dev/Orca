import { MOCK_PFZ, MOCK_ALERTS, MOCK_EVIDENCE, MOCK_GEOFENCES, MOCK_ROUTES } from '../data/mockData';
import { PFZZone, MarineAlert, EvidenceSource, Geofence, VesselRoute } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  getPFZ: async (): Promise<PFZZone[]> => {
    await delay(600);
    return MOCK_PFZ;
  },
  
  getAlerts: async (): Promise<MarineAlert[]> => {
    await delay(500);
    return MOCK_ALERTS;
  },
  
  getEvidence: async (): Promise<EvidenceSource[]> => {
    await delay(800);
    return MOCK_EVIDENCE;
  },
  
  getGeofences: async (): Promise<Geofence[]> => {
    await delay(400);
    return MOCK_GEOFENCES;
  },
  
  getRoutes: async (): Promise<VesselRoute[]> => {
    await delay(700);
    return MOCK_ROUTES;
  },
  
  // Simulating a chat response that takes some time to 'think'
  sendChatMessage: async (message: string): Promise<string> => {
    await delay(2500);
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('pfz') || lowerMsg.includes('fish')) {
      return "I have located several Potential Fishing Zones (PFZ) near your current map center. I've highlighted them on the map. Zone Alpha has the highest suitability based on current SST and chlorophyll levels.";
    }
    
    if (lowerMsg.includes('safe') || lowerMsg.includes('cyclone') || lowerMsg.includes('weather')) {
      return "There is a severe cyclone warning in the Bay of Bengal, and high waves predicted off the Arabian Sea Coast. I recommend staying in harbor or sticking to the designated safe coastal routes.";
    }
    
    if (lowerMsg.includes('route')) {
      return "I've overlaid a safe coastal route on the map avoiding the restricted naval exercise geofence.";
    }
    
    return "I am analyzing the latest marine intelligence. Based on current satellite and oceanographic data, conditions are normal, but please review the map and alerts panel for specific localized advisories.";
  }
};
