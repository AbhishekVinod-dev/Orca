import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole, DisclosureLevel } from '../../lib/store';
import { Anchor, ShieldAlert, Cpu, Waves, Ship, Signal, Sliders, User, LogOut, Compass, ShieldCheck, Route as RouteIcon, Navigation } from 'lucide-react';

const ROLE_METADATA: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  fisherman: { label: 'Fisherman', icon: <Anchor size={14} />, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  oceanographer: { label: 'Oceanographer', icon: <Cpu size={14} />, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  policymaker: { label: 'Policymaker', icon: <ShieldAlert size={14} />, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  aquaculture: { label: 'Aquaculture', icon: <Waves size={14} />, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  shipping: { label: 'Shipping', icon: <Ship size={14} />, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
};

const DISCLOSURE_LABELS: Record<DisclosureLevel, { short: string; desc: string }> = {
  1: { short: 'L1: Simple', desc: 'Direct plain advice' },
  2: { short: 'L2: Why', desc: 'Reasoning included' },
  3: { short: 'L3: Evidence', desc: 'Multi-source signals' },
  4: { short: 'L4: Scientific', desc: 'Statistical confidence' },
  5: { short: 'L5: Raw Data', desc: 'Unfiltered sensor telemetry' },
};

export function PersonaHeaderBar() {
  const router = useRouter();
  const {
    activeRole,
    disclosureLevel,
    setDisclosureLevel,
    bandwidthMode,
    setBandwidthMode,
    setGlobeTarget,
    setRoutePath,
    showGeofence,
    setShowGeofence,
    setViewMode,
    logout
  } = useAppStore();

  const currentRoleMeta = ROLE_METADATA[activeRole] || ROLE_METADATA.fisherman;

  return (
    <header className="w-full bg-space-950/90 backdrop-blur-md border-b border-space-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-30">
      
      {/* 1. Authenticated User Profile Role Badge & Log Out */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${currentRoleMeta.color}`}>
          <User size={14} />
          <span>ROLE: <strong className="uppercase">{currentRoleMeta.label}</strong></span>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer"
          title="Sign out of current session"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>

      {/* 2. 1-CLICK QUICK ACTION WORKFLOW BAR */}
      <div className="hidden xl:flex items-center gap-1.5 bg-[#020612]/90 border border-cyan-500/30 p-1 rounded-2xl shadow-inner">
        <span className="text-[10px] font-bold text-cyan-400 px-2 tracking-wider uppercase font-mono">1-Click Actions:</span>
        
        <button
          onClick={() => {
            setGlobeTarget({
              lat: 13.0827,
              lon: 80.2707,
              title: "Chennai PFZ Alpha",
              severity: "info",
              desc: "1-Click Telemetry Focus: High-Yield Chlorophyll Convergence Zone (94% Match)"
            });
            setViewMode('2d');
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 rounded-xl text-[11px] font-medium transition-all"
        >
          <Compass size={12} />
          <span>Quick PFZ</span>
        </button>

        <button
          onClick={() => {
            setGlobeTarget({
              lat: 13.0,
              lon: 80.4,
              title: "Coromandel Coastal Safety",
              severity: "warning",
              desc: "1-Click Safety Check: Wave Height 1.1m, Wind 11 Kts. Green Flag Coastal Safe."
            });
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-[11px] font-medium transition-all"
        >
          <ShieldCheck size={12} />
          <span>Safety Check</span>
        </button>

        <button
          onClick={() => {
            setRoutePath([[13.0827, 80.2707], [14.5, 81.2], [17.6868, 83.2185]]);
            setViewMode('2d');
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-teal-500/15 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 rounded-xl text-[11px] font-medium transition-all"
        >
          <RouteIcon size={12} />
          <span>Plot Route</span>
        </button>

        <button
          onClick={() => setShowGeofence(!showGeofence)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${
            showGeofence 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <ShieldAlert size={12} />
          <span>IMBL: {showGeofence ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Right Controls: Disclosure Level Slider & Low Bandwidth */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

        {/* Progressive Disclosure Level Slider (1 - 5) */}
        <div className="flex items-center gap-2 bg-space-900/80 px-3 py-1.5 rounded-xl border border-space-800 shadow-sm">
          <Sliders size={13} className="text-cyan-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 tech-mono">
              <span>DISCLOSURE</span>
              <span className="text-cyan-400 font-bold">{DISCLOSURE_LABELS[disclosureLevel].short}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={disclosureLevel}
              onChange={(e) => setDisclosureLevel(Number(e.target.value) as DisclosureLevel)}
              className="w-20 sm:w-24 h-1 accent-cyan-500 cursor-pointer bg-space-700 rounded-lg"
              title={DISCLOSURE_LABELS[disclosureLevel].desc}
            />
          </div>
        </div>

        {/* Bandwidth Mode Toggle */}
        <button
          onClick={() => setBandwidthMode(bandwidthMode === 'normal' ? 'low' : 'normal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
            bandwidthMode === 'low'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
              : 'bg-space-900/80 text-slate-400 border-space-800 hover:text-white hover:bg-space-800'
          }`}
          title="Low-Bandwidth Mode optimizes text payload for offshore 2G/GPRS networks"
        >
          <Signal size={13} />
          <span className="hidden sm:inline">{bandwidthMode === 'low' ? 'LOW-BW (OFFSHORE)' : 'NORMAL'}</span>
        </button>

      </div>

    </header>
  );
}
