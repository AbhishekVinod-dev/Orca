"use client";

import React, { useState } from 'react';
import { Ship, Route as RouteIcon, Compass, Waves, Navigation, Anchor, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function ShippingDashboard() {
  const { setRoutePath, setGlobeTarget, setViewMode } = useAppStore();
  const [selectedPort, setSelectedPort] = useState('CHENNAI_PORT');

  const handlePlotSafeRoute = () => {
    // Chennai Port -> Vizag Port avoiding swell corridor
    const routeCoordinates: [number, number][] = [
      [13.0827, 80.2707], // Chennai
      [14.2000, 80.8000],
      [16.0000, 81.5000],
      [17.6868, 83.2185]  // Visakhapatnam
    ];
    setRoutePath(routeCoordinates);
    setGlobeTarget({
      lat: 15.0000,
      lon: 81.0000,
      title: 'OPTIMAL MARITIME CORRIDOR',
      severity: 'info',
      desc: 'Route optimized avoiding 3.2m swell corridor off Bay of Bengal'
    });
    setViewMode('2d');
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4 no-scrollbar">

      {/* 1. Safe Route Corridor Planner */}
      <div className="glass-panel p-5 rounded-md border-l-4 border-l-blue-500 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-space-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RouteIcon className="text-blue-400" size={16} />
            SAFE ROUTE CORRIDOR PLANNER
          </h3>
          <button
            onClick={handlePlotSafeRoute}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow"
          >
            <Navigation size={14} />
            Plot Chennai ➔ Vizag Corridor
          </button>
        </div>
        <p className="text-xs text-slate-300">
          Calculates fuel-optimal & weather-safe vessel routing avoiding high swell zones (&gt;2.5m) and military restriction geofences.
        </p>
      </div>

      {/* 2. Sea State & Wave Spectrum Chart */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Waves className="text-cyan-400" size={16} />
          SEA STATE & WAVE SPECTRUM CORRIDOR
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center text-xs tech-mono">
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">SIGNIFICANT WAVE (Hs)</div>
            <div className="text-white font-bold text-base mt-1">1.3 m</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">Slight Sea (Douglas 3)</div>
          </div>
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">SWELL PERIOD (Tp)</div>
            <div className="text-cyan-400 font-bold text-base mt-1">8.4 sec</div>
            <div className="text-[9px] text-slate-300 mt-0.5">Long Swell</div>
          </div>
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">WIND SEA / SWELL</div>
            <div className="text-teal-400 font-bold text-base mt-1">0.8m / 1.1m</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">Favorable Heading</div>
          </div>
        </div>
      </div>

      {/* 3. Port Entrance & Draft Advisory Widget */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Anchor className="text-teal-400" size={16} />
            PORT ENTRANCE & DRAFT ADVISORY WIDGET
          </h3>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="bg-space-900 border border-space-700 text-xs text-white px-2 py-1 rounded focus:outline-none"
          >
            <option value="CHENNAI_PORT">Chennai Port (INMAA)</option>
            <option value="VIZAG_PORT">Visakhapatnam Port (INVTZ)</option>
            <option value="KOCHI_PORT">Kochi Port (INCOK)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs bg-space-950 p-3 rounded border border-space-800">
          <div>
            <div className="text-slate-400 text-[10px] tech-mono">PREDICTED HIGH TIDE</div>
            <div className="text-white font-bold text-sm mt-0.5">+1.2 m (14:30 IST)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] tech-mono">MAX ALLOWABLE DRAFT</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5">14.5 m (Safe Approach)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
