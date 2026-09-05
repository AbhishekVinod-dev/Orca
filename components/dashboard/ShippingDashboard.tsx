"use client";

import React, { useState } from 'react';
import { Ship, Route as RouteIcon, Compass, Waves, Navigation, Anchor, CheckCircle2, Zap, Clock, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../lib/store';

const ROUTE_PRESETS = [
  {
    id: 'CHENNAI_VIZAG',
    name: 'Chennai Port ➔ Visakhapatnam Port',
    distance: '380 NM',
    eta: '22 Hours (at 17.5 Kts)',
    coords: [
      [13.0827, 80.2707],
      [14.2000, 80.8000],
      [16.0000, 81.5000],
      [17.6868, 83.2185]
    ] as [number, number][],
    targetLat: 15.0,
    targetLon: 81.0,
    desc: 'Avoids 3.2m swell corridor off Bay of Bengal central sector.'
  },
  {
    id: 'KOCHI_COLOMBO',
    name: 'Kochi Port ➔ Colombo International Harbor',
    distance: '310 NM',
    eta: '18 Hours (at 17.2 Kts)',
    coords: [
      [9.9312, 76.2673],
      [8.0000, 77.5000],
      [6.9271, 79.8612]
    ] as [number, number][],
    targetLat: 8.0,
    targetLon: 77.5,
    desc: 'Optimized for Gulf of Mannar cross-currents & deep draft.'
  },
  {
    id: 'MUMBAI_GOA',
    name: 'JNP Port Mumbai ➔ Mormugao Port Goa',
    distance: '245 NM',
    eta: '14 Hours (at 17.5 Kts)',
    coords: [
      [18.9500, 72.9500],
      [16.5000, 73.2000],
      [15.4000, 73.8000]
    ] as [number, number][],
    targetLat: 17.0,
    targetLon: 73.0,
    desc: 'Coastal corridor avoiding Konkan shelf fishing concentration.'
  }
];

const PORT_DETAILS: Record<string, { name: string; unlocode: string; highTide: string; maxDraft: string; status: string }> = {
  CHENNAI_PORT: { name: 'Chennai Port', unlocode: 'INMAA', highTide: '+1.2 m (14:30 IST)', maxDraft: '14.5 m (Safe Approach)', status: 'ALL CLEAR' },
  VIZAG_PORT: { name: 'Visakhapatnam Port', unlocode: 'INVTZ', highTide: '+1.5 m (16:15 IST)', maxDraft: '16.1 m (Outer Harbor)', status: 'ALL CLEAR' },
  KOCHI_PORT: { name: 'Kochi Port', unlocode: 'INCOK', highTide: '+0.9 m (12:45 IST)', maxDraft: '13.8 m (Channel Open)', status: 'ALL CLEAR' },
};

export function ShippingDashboard() {
  const { setRoutePath, setGlobeTarget, setViewMode } = useAppStore();
  const [selectedRouteId, setSelectedRouteId] = useState('CHENNAI_VIZAG');
  const [selectedPort, setSelectedPort] = useState('CHENNAI_PORT');
  const [timeHorizon, setTimeHorizon] = useState<'+0h' | '+12h' | '+24h'>('+0h');
  const [berthModalOpen, setBerthModalOpen] = useState(false);
  const [berthCode, setBerthCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRoute = ROUTE_PRESETS.find(r => r.id === selectedRouteId) || ROUTE_PRESETS[0];
  const activePort = PORT_DETAILS[selectedPort] || PORT_DETAILS.CHENNAI_PORT;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePlotSafeRoute = () => {
    setRoutePath(activeRoute.coords);
    setGlobeTarget({
      lat: activeRoute.targetLat,
      lon: activeRoute.targetLon,
      title: activeRoute.name.toUpperCase(),
      severity: 'info',
      desc: `Distance: ${activeRoute.distance} | ETA: ${activeRoute.eta} | ${activeRoute.desc}`
    });
    setViewMode('2d');
    showToast(`🚢 Corridor [${activeRoute.name}] plotted on Spatial Map & 3D Globe!`);
  };

  const handleRequestBerthClearance = () => {
    const code = `BERTH-${new Date().getFullYear()}-${activePort.unlocode}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBerthCode(code);
    setBerthModalOpen(true);
    showToast(`⚓ Port Berthing Clearance requested for ${activePort.name}.`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar max-w-7xl mx-auto">

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050c1e] border border-blue-500/50 text-blue-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap size={18} className="text-blue-400 animate-bounce" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#040b18]/80 backdrop-blur-md p-4 rounded-xl border border-space-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-wide">COMMERCIAL SHIPPING & ROUTING NAVIGATION</h1>
            <span className="bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full tech-mono">
              SOLAS & IMO OPTIMIZED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fuel-optimal weather routing, wave spectrum risk minimization, and port draft clearance.
          </p>
        </div>

        <button
          onClick={handlePlotSafeRoute}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
        >
          <Navigation size={15} />
          <span>Plot Corridor on Map</span>
        </button>
      </div>

      {/* 1. Safe Route Corridor Planner */}
      <div className="bg-[#040c1d] p-5 rounded-xl border-l-4 border-l-blue-500 border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RouteIcon className="text-blue-400" size={18} />
            SAFE VESSEL ROUTE CORRIDOR SELECTION
          </h3>
          <span className="text-[11px] text-slate-400 tech-mono">Weather Engine: ECMWF WAVE-4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROUTE_PRESETS.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-950/40'
                    : 'bg-space-950 border-space-800 hover:border-space-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{route.name}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400">{route.desc}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] tech-mono bg-space-900/80 p-2 rounded-lg border border-space-800">
                  <span>Distance: <strong className="text-white">{route.distance}</strong></span>
                  <span>ETA: <strong className="text-cyan-400">{route.eta}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sea State & Wave Spectrum Corridor */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Waves className="text-cyan-400" size={18} />
            SEA STATE & WAVE SPECTRUM CORRIDOR FORECAST
          </h3>

          <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-space-800 text-xs">
            {(['+0h', '+12h', '+24h'] as const).map(horizon => (
              <button
                key={horizon}
                onClick={() => {
                  setTimeHorizon(horizon);
                  showToast(`Sea State forecast window set to ${horizon}`);
                }}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  timeHorizon === horizon ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {horizon === '+0h' ? 'Now (+0h)' : horizon}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs tech-mono">
          <div className="bg-space-950 p-4 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">SIGNIFICANT WAVE (Hs)</div>
            <div className="text-white font-bold text-lg mt-1">
              {timeHorizon === '+0h' ? '1.3 m' : timeHorizon === '+12h' ? '1.8 m' : '2.1 m'}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Slight Sea (Douglas Scale 3)</div>
          </div>

          <div className="bg-space-950 p-4 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">SWELL PERIOD (Tp)</div>
            <div className="text-cyan-400 font-bold text-lg mt-1">
              {timeHorizon === '+0h' ? '8.4 sec' : timeHorizon === '+12h' ? '9.1 sec' : '10.2 sec'}
            </div>
            <div className="text-[10px] text-slate-300 mt-1">Long Period Open Swell</div>
          </div>

          <div className="bg-space-950 p-4 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">WIND SEA / SWELL RATIO</div>
            <div className="text-teal-400 font-bold text-lg mt-1">0.8m / 1.1m</div>
            <div className="text-[10px] text-emerald-400 mt-1">Favorable Vessel Heading</div>
          </div>
        </div>
      </div>

      {/* 3. Port Entrance & Draft Advisory Widget */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Anchor className="text-teal-400" size={18} />
            PORT ENTRANCE DRAFT & HARBOR ADVISORY
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              className="bg-space-950 border border-space-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
            >
              <option value="CHENNAI_PORT">Chennai Port (INMAA)</option>
              <option value="VIZAG_PORT">Visakhapatnam Port (INVTZ)</option>
              <option value="KOCHI_PORT">Kochi Port (INCOK)</option>
            </select>

            <button
              onClick={handleRequestBerthClearance}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Request Berthing Clearance</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-space-950 p-4 rounded-xl border border-space-800">
          <div>
            <div className="text-slate-400 text-[10px] tech-mono">TARGET PORT HARBOR</div>
            <div className="text-white font-bold text-sm mt-1">{activePort.name} ({activePort.unlocode})</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] tech-mono">PREDICTED HIGH TIDE</div>
            <div className="text-cyan-400 font-bold text-sm mt-1">{activePort.highTide}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] tech-mono">MAX ALLOWABLE DRAFT</div>
            <div className="text-emerald-400 font-bold text-sm mt-1">{activePort.maxDraft}</div>
          </div>
        </div>
      </div>

      {/* Berthing Clearance Token Modal */}
      {berthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#050c1e] border border-cyan-500/40 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-space-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Anchor className="text-teal-400" size={18} />
                Port Berthing Digital Clearance Token
              </h3>
              <button onClick={() => setBerthModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="p-4 bg-space-950 border border-space-800 rounded-xl text-center flex flex-col items-center gap-2">
              <CheckCircle2 size={40} className="text-emerald-400 animate-bounce" />
              <span className="text-xs text-slate-400">Clearance Granted for {activePort.name}</span>
              <div className="text-base font-bold text-teal-300 tech-mono bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/30">
                {berthCode}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Valid for 24 Hours. Transmitted to Vessel VTS & Port Control.</p>
            </div>

            <button
              onClick={() => setBerthModalOpen(false)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
