"use client";

import dynamic from 'next/dynamic';
import { Layers, Crosshair, Thermometer, Wind, ShieldAlert, Route as RouteIcon, XCircle } from 'lucide-react';
import { useAppStore } from '../../lib/store';

const InteractiveGlobe = dynamic(() => import('../3d/InteractiveGlobe').then(mod => mod.InteractiveGlobe), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-space-950 flex items-center justify-center text-space-700 tech-mono text-sm">INITIALIZING SATELLITE LINK...</div>
});

const MarineMap2D = dynamic(() => import('../map/MarineMap2D').then(mod => mod.MarineMap2D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-space-950 flex items-center justify-center text-space-700 tech-mono text-sm">INITIALIZING MAP OVERLAY...</div>
});

export function ContextPanel() {
  const { globeTarget, viewMode, setViewMode, showGeofence, setShowGeofence, routePath, clearRoutePath } = useAppStore();

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-space-950 flex flex-col">
      
      {/* 3D/2D Viewport Layer */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3d' ? <InteractiveGlobe /> : <MarineMap2D />}
      </div>

      {/* Top UI Overlay */}
      <div className="absolute top-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
         <div className="bg-space-950/80 backdrop-blur-md border border-space-800 p-4 rounded-sm pointer-events-auto transition-all">
            <div className="text-white font-medium mb-1 flex items-center gap-2">
              <Crosshair size={16} className="text-cyan-500" />
              GLOBAL OVERVIEW
            </div>
            <div className="text-slate-400 text-xs tech-mono">
              {globeTarget 
                ? `LAT: ${(globeTarget.lat || 0).toFixed(3)}° / LON: ${(globeTarget.lon || 0).toFixed(3)}°`
                : 'LAT: --.—° / LON: --.—°'
              }
            </div>
         </div>

         <div className="flex gap-2 pointer-events-auto bg-space-950/50 p-1 rounded-sm backdrop-blur-md border border-space-800">
            {/* View Modes */}
            <button 
              onClick={() => setViewMode('3d')}
              className={`h-10 px-4 font-medium rounded-sm transition-colors text-sm flex items-center gap-2
                ${viewMode === '3d' ? 'bg-white text-space-950' : 'text-slate-400 hover:text-white'}
              `}
            >
              <Layers size={16} /> 3D GLOBE
            </button>
            <button 
              onClick={() => setViewMode('2d')}
              className={`h-10 px-4 font-medium rounded-sm transition-colors text-sm flex items-center gap-2
                ${viewMode === '2d' ? 'bg-white text-space-950' : 'text-slate-400 hover:text-white'}
              `}
            >
              2D MAP
            </button>
            
            {/* Divider */}
            <div className="w-[1px] h-6 bg-space-800 mx-2 self-center"></div>

            {/* Geofence Toggle */}
            <button 
              onClick={() => setShowGeofence(!showGeofence)}
              className={`h-10 px-4 font-medium rounded-sm transition-colors text-sm flex items-center gap-2
                ${showGeofence ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'}
              `}
              title="Toggle International Maritime Boundary Lines (IMBL)"
            >
              <ShieldAlert size={16} /> IMBL
            </button>
            
            {/* Clear Route */}
            {routePath && (
              <button 
                onClick={clearRoutePath}
                className="h-10 px-4 font-medium rounded-sm transition-colors text-sm flex items-center gap-2 text-slate-400 hover:text-rose-400 hover:bg-space-800"
                title="Clear Active Route"
              >
                <XCircle size={16} /> CLEAR ROUTE
              </button>
            )}
         </div>
      </div>

      {/* Bottom Data Overlay */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-4 pointer-events-none">
         
         {/* Live Metrics Widget */}
         <div className="w-64 glass-panel p-5 rounded-sm pointer-events-auto">
            <h3 className="text-white text-sm font-medium mb-4 flex items-center justify-between border-b border-space-800 pb-2">
              LIVE TELEMETRY
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs tech-mono">
                  <Thermometer size={14} /> SST_AVG
                </div>
                <div className="text-white tech-mono text-sm">
                  {globeTarget ? '28.4°C' : '26.4°C'}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs tech-mono">
                  <Wind size={14} /> WND_SPD
                </div>
                <div className="text-white tech-mono text-sm">
                  {globeTarget ? '12 KTS' : '14 KTS'}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs tech-mono">
                  <Layers size={14} /> ACTIVE_PFZ
                </div>
                <div className="text-white tech-mono text-sm text-teal-500">
                  {globeTarget ? '1 NODE' : '12 NODES'}
                </div>
              </div>
            </div>
         </div>

      </div>

    </div>
  );
}
