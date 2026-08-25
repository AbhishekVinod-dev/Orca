'use client';
// lib/store/alertStore.ts
import { create } from 'zustand';
import { Alert } from '@/lib/mock/alertsData';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  toastQueue: Alert[];
  filter: { type: string; severity: string; region: string };

  setAlerts: (alerts: Alert[]) => void;
  markAllRead: () => void;
  addToast: (alert: Alert) => void;
  dismissToast: () => void;
  setFilter: (filter: Partial<AlertState['filter']>) => void;
  getFilteredAlerts: () => Alert[];
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  unreadCount: 0,
  toastQueue: [],
  filter: { type: 'all', severity: 'all', region: 'all' },

  setAlerts: (alerts) => set({ alerts, unreadCount: alerts.length }),

  markAllRead: () => set({ unreadCount: 0 }),

  addToast: (alert) => set(s => ({ toastQueue: [...s.toastQueue, alert] })),

  dismissToast: () => set(s => ({ toastQueue: s.toastQueue.slice(1) })),

  setFilter: (filter) => set(s => ({ filter: { ...s.filter, ...filter } })),

  getFilteredAlerts: () => {
    const { alerts, filter } = get();
    return alerts.filter(a => {
      if (filter.type !== 'all' && a.type !== filter.type) return false;
      if (filter.severity !== 'all' && a.severity !== filter.severity) return false;
      if (filter.region !== 'all' && !a.region.toLowerCase().includes(filter.region.toLowerCase())) return false;
      return true;
    });
  },
}));
