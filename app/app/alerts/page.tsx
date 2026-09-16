"use client";

import { ShieldAlert, AlertTriangle, Info, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../lib/store';
<<<<<<< HEAD
import { useState } from 'react';

const mockAlerts = [
  { id: 'al-01', title: 'Cyclone Formation Detected', severity: 'critical', time: '10 MINS AGO', desc: 'Low pressure system intensifying in Bay of Bengal. Projected path intersects shipping lanes.', lat: 15.0, lon: 88.0 },
  { id: 'al-02', title: 'High Wave Action', severity: 'warning', time: '2 HOURS AGO', desc: 'Waves exceeding 4.5m detected off the coast of Kerala. Small craft advisory in effect.', lat: 9.5, lon: 75.5 },
  { id: 'al-03', title: 'AIS Anomaly', severity: 'info', time: '5 HOURS AGO', desc: 'Vessel "Ocean Star" deviated from registered corridor.', lat: 5.0, lon: 95.0 },
  { id: 'al-04', title: 'Unregistered Trawler', severity: 'warning', time: '12 HOURS AGO', desc: 'Dark vessel detected crossing into Marine Protected Area near Lakshadweep.', lat: 10.5, lon: 72.5 },
  { id: 'al-05', title: 'Oil Slick Detected', severity: 'critical', time: '1 DAY AGO', desc: 'SAR satellite identified possible crude oil spill spanning 12km in Mumbai High region.', lat: 19.3, lon: 71.3 },
  { id: 'al-06', title: 'Marine Heatwave', severity: 'warning', time: '2 DAYS AGO', desc: 'SST anomalies exceeding +2.5°C persisting. High risk of coral bleaching in the Gulf of Mannar.', lat: 8.8, lon: 79.2 },
];
=======
import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import { MarineAlert } from '../../../types';

// This app's alert-card severities are critical/warning/info; the backend's
// Alert.severity is critical/high/moderate/low (docs/MIGRATION_TRACKER.md
// Contract Parity Gate). Mapped here at the display boundary.
function toCardSeverity(severity: MarineAlert['severity']): 'critical' | 'warning' | 'info' {
  if (severity === 'critical') return 'critical';
  if (severity === 'high' || severity === 'moderate') return 'warning';
  return 'info';
}
>>>>>>> frontend-changes

export default function AlertsPage() {
  const router = useRouter();
  const { setGlobeTarget } = useAppStore();
<<<<<<< HEAD
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleViewOnMap = (alert: any) => {
    setGlobeTarget({
      lat: alert.lat,
      lon: alert.lon,
      title: alert.title,
      severity: alert.severity,
      desc: alert.desc
=======
  const [alerts, setAlerts] = useState<MarineAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAlerts()
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, []);

  const handleViewOnMap = (alert: MarineAlert) => {
    if (!alert.coordinates) return;
    const [lat, lon] = alert.coordinates;
    setGlobeTarget({
      lat,
      lon,
      title: alert.title,
      severity: toCardSeverity(alert.severity),
      desc: alert.description
>>>>>>> frontend-changes
    });
    router.push('/app');
  };

  return (
    <div className="flex-1 h-full flex flex-col px-12 py-10 relative z-10 bg-space-950 overflow-y-auto">
       <div className="flex items-center gap-4 text-rose-500 font-medium mb-8">
         <ShieldAlert size={24} />
         <span>SYSTEM ALERTS</span>
       </div>
       
       <h1 className="text-3xl font-semibold text-white tracking-wide mb-8">Active Hazards & Warnings</h1>
       
<<<<<<< HEAD
       <div className="flex flex-col gap-4 max-w-4xl">
         {alerts.map((alert) => (
           <div key={alert.id} className="glass-panel p-6 rounded-sm border-l-4 border-l-transparent" style={{ borderLeftColor: alert.severity === 'critical' ? '#f43f5e' : alert.severity === 'warning' ? '#f59e0b' : '#3b82f6' }}>
             <div className="flex items-start gap-4">
               
               <div className="mt-1">
                 {alert.severity === 'critical' && <AlertTriangle size={24} className="text-rose-500" />}
                 {alert.severity === 'warning' && <AlertTriangle size={24} className="text-amber-500" />}
                 {alert.severity === 'info' && <Info size={24} className="text-blue-500" />}
               </div>
               
=======
       {loading && <p className="text-slate-500 text-sm">Loading alerts...</p>}

       <div className="flex flex-col gap-4 max-w-4xl">
         {alerts.map((alert) => {
           const cardSeverity = toCardSeverity(alert.severity);
           return (
           <div key={alert.id} className="glass-panel p-6 rounded-sm border-l-4 border-l-transparent" style={{ borderLeftColor: cardSeverity === 'critical' ? '#f43f5e' : cardSeverity === 'warning' ? '#f59e0b' : '#3b82f6' }}>
             <div className="flex items-start gap-4">

               <div className="mt-1">
                 {cardSeverity === 'critical' && <AlertTriangle size={24} className="text-rose-500" />}
                 {cardSeverity === 'warning' && <AlertTriangle size={24} className="text-amber-500" />}
                 {cardSeverity === 'info' && <Info size={24} className="text-blue-500" />}
               </div>

>>>>>>> frontend-changes
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-white font-medium text-lg">{alert.title}</h3>
                   <span className="tech-mono text-xs text-slate-500 flex items-center gap-2">
<<<<<<< HEAD
                     <Bell size={12} /> {alert.time}
                   </span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed">{alert.desc}</p>
                 
                 <div className="mt-4 flex gap-3">
                   <button 
                     onClick={() => handleViewOnMap(alert)}
                     className="px-4 py-2 bg-space-800 text-white text-xs font-medium rounded-sm hover:bg-space-700 transition-colors"
                   >
                     VIEW ON MAP
                   </button>
                   <button 
=======
                     <Bell size={12} /> {new Date(alert.timestamp).toLocaleString()}
                   </span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed">{alert.description}</p>

                 <div className="mt-4 flex gap-3">
                   {alert.coordinates && (
                     <button
                       onClick={() => handleViewOnMap(alert)}
                       className="px-4 py-2 bg-space-800 text-white text-xs font-medium rounded-sm hover:bg-space-700 transition-colors"
                     >
                       VIEW ON MAP
                     </button>
                   )}
                   <button
>>>>>>> frontend-changes
                     onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                     className="px-4 py-2 border border-space-700 text-slate-300 text-xs font-medium rounded-sm hover:bg-space-800 transition-colors"
                   >
                     DISMISS
                   </button>
                 </div>
               </div>
<<<<<<< HEAD
               
             </div>
           </div>
         ))}
=======

             </div>
           </div>
           );
         })}
>>>>>>> frontend-changes
       </div>
    </div>
  );
}
