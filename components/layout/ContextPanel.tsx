"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Layers, Crosshair, Thermometer, Wind, ShieldAlert, XCircle, LayoutDashboard, Map as MapIcon } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { FishermanDashboard } from '../dashboard/FishermanDashboard';
import { OceanographerDashboard } from '../dashboard/OceanographerDashboard';
import { PolicymakerDashboard } from '../dashboard/PolicymakerDashboard';
import { AquacultureDashboard } from '../dashboard/AquacultureDashboard';
import { ShippingDashboard } from '../dashboard/ShippingDashboard';

const InteractiveGlobe = dynamic(() => import('../3d/InteractiveGlobe').then(mod => mod.InteractiveGlobe), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-space-950 flex items-center justify-center text-space-700 tech-mono text-sm">INITIALIZING SATELLITE LINK...</div>
});

const MarineMap2D = dynamic(() => import('../map/MarineMap2D').then(mod => mod.MarineMap2D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-space-950 flex items-center justify-center text-space-700 tech-mono text-sm">INITIALIZING MAP OVERLAY...</div>
});

export function ContextPanel() {
  const { globeTarget, viewMode, setViewMode, showGeofence, setShowGeofence, routePath, clearRoutePath, activeRole } = useAppStore();
  const [panelView, setPanelView] = useState<'map' | 'dashboard'>('map');

  const renderDashboard = () => {
    switch (activeRole) {
      case 'fisherman': return <FishermanDashboard />;
      case 'oceanographer': return <OceanographerDashboard />;
      case 'policymaker': return <PolicymakerDashboard />;
      case 'aquaculture': return <AquacultureDashboard />;
      case 'shipping':
      case 'shipment': return <ShippingDashboard />;
      default: return <FishermanDashboard />;
    }
  };

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-space-950 flex flex-col">
      
      {/* View Mode Header: Toggle Map vs Persona Dashboard */}
      <div className="bg-space-900/90 border-b border-space-800 px-4 py-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelView('map')}
            className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
              panelView === 'map' ? 'bg-cyan-500 text-space-950 shadow' : 'text-slate-400 hover:text-white bg-space-950/60'
            }`}
          >
            <MapIcon size={14} /> SPATIAL MAP
          </button>
          <button
            onClick={() => setPanelView('dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
              panelView === 'dashboard' ? 'bg-cyan-500 text-space-950 shadow' : 'text-slate-400 hover:text-white bg-space-950/60'
            }`}
          >
            <LayoutDashboard size={14} /> {activeRole.toUpperCase()} DASHBOARD
          </button>
        </div>

        {panelView === 'map' && (
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setViewMode('3d')}
              className={`h-8 px-3 font-medium rounded transition-colors text-xs flex items-center gap-1.5
                ${viewMode === '3d' ? 'bg-white text-space-950' : 'text-slate-400 hover:text-white bg-space-950/60'}
              `}
            >
              <Layers size={14} /> 3D GLOBE
            </button>
            <button 
              onClick={() => setViewMode('2d')}
              className={`h-8 px-3 font-medium rounded transition-colors text-xs flex items-center gap-1.5
                ${viewMode === '2d' ? 'bg-white text-space-950' : 'text-slate-400 hover:text-white bg-space-950/60'}
              `}
            >
              2D MAP
            </button>
            <button 
              onClick={() => setShowGeofence(!showGeofence)}
              className={`h-8 px-3 font-medium rounded transition-colors text-xs flex items-center gap-1.5
                ${showGeofence ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' : 'text-slate-400 hover:text-white bg-space-950/60'}
              `}
              title="Toggle International Maritime Boundary Lines (IMBL)"
            >
              <ShieldAlert size={14} /> IMBL
            </button>
            {routePath && (
              <button 
                onClick={clearRoutePath}
                className="h-8 px-3 font-medium rounded transition-colors text-xs flex items-center gap-1.5 text-slate-400 hover:text-rose-400 bg-space-950/60"
              >
                <XCircle size={14} /> CLEAR ROUTE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {panelView === 'dashboard' ? (
          <div className="w-full h-full bg-space-950 overflow-y-auto">
            {renderDashboard()}
          </div>
        ) : (
          <>
            {/* 3D/2D Viewport Layer */}
            <div className="absolute inset-0 z-0">
              {viewMode === '3d' ? <InteractiveGlobe /> : <MarineMap2D />}
            </div>

            {/* Top Coordinates Banner */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="bg-space-950/80 backdrop-blur-md border border-space-800 p-3 rounded pointer-events-auto">
                <div className="text-white font-medium text-xs mb-0.5 flex items-center gap-1.5">
                  <Crosshair size={14} className="text-cyan-500" />
                  GLOBAL OVERVIEW
                </div>
                <div className="text-slate-400 text-[11px] tech-mono">
                  {globeTarget 
                    ? `LAT: ${(globeTarget.lat || 0).toFixed(3)}° / LON: ${(globeTarget.lon || 0).toFixed(3)}°`
                    : 'LAT: 13.083° / LON: 80.271°'
                  }
                </div>
              </div>
            </div>

            {/* Bottom Live Telemetry Overlay */}
            <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
              <div className="w-60 glass-panel p-4 rounded pointer-events-auto">
                <h3 className="text-white text-xs font-medium mb-3 flex items-center justify-between border-b border-space-800 pb-1.5">
                  LIVE TELEMETRY
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                </h3>
                <div className="space-y-2.5 text-xs tech-mono">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400"><Thermometer size={13} /> SST_AVG</span>
                    <span className="text-white font-bold">{globeTarget ? '28.4°C' : '26.4°C'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400"><Wind size={13} /> WND_SPD</span>
                    <span className="text-white font-bold">{globeTarget ? '12 KTS' : '14 KTS'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400"><Layers size={13} /> ACTIVE_PFZ</span>
                    <span className="text-teal-400 font-bold">{globeTarget ? '1 NODE' : '12 NODES'}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
