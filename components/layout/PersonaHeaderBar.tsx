"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole, DisclosureLevel } from '../../lib/store';
import { Anchor, ShieldAlert, Cpu, Waves, Ship, Package, Globe, Signal, Sliders, User, LogOut } from 'lucide-react';

const ROLE_METADATA: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  fisherman: { label: 'Fisherman', icon: <Anchor size={14} />, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  oceanographer: { label: 'Oceanographer', icon: <Cpu size={14} />, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  policymaker: { label: 'Policymaker', icon: <ShieldAlert size={14} />, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  aquaculture: { label: 'Aquaculture', icon: <Waves size={14} />, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  shipping: { label: 'Shipping', icon: <Ship size={14} />, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  shipment: { label: 'Shipment', icon: <Package size={14} />, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
};

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'hi', native: 'हिंदी' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'ml', native: 'മലയാളം' },
];

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
    language,
    setLanguage,
    logout
  } = useAppStore();

  const currentRoleMeta = ROLE_METADATA[activeRole] || ROLE_METADATA.fisherman;

  return (
    <header className="w-full bg-space-950/90 backdrop-blur-md border-b border-space-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-30">
      
      {/* 1. Authenticated User Profile Role Badge & Log Out */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold border ${currentRoleMeta.color}`}>
          <User size={14} />
          <span>ROLE: <strong className="uppercase">{currentRoleMeta.label}</strong></span>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
          title="Sign out of current session"
        >
          <LogOut size={13} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Right Controls: Disclosure Level Slider, Regional Language, Low Bandwidth */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* 2. Progressive Disclosure Level Slider (1 - 5) */}
        <div className="flex items-center gap-2 bg-space-900/80 px-3 py-1 rounded border border-space-800">
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
              className="w-24 h-1 accent-cyan-500 cursor-pointer bg-space-700 rounded-lg"
              title={DISCLOSURE_LABELS[disclosureLevel].desc}
            />
          </div>
        </div>

        {/* 3. Regional Language Switcher */}
        <div className="flex items-center gap-1 bg-space-900/80 px-2 py-1 rounded border border-space-800">
          <Globe size={13} className="text-teal-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-space-900 text-white">
                {l.native} ({l.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* 4. Bandwidth Mode Toggle */}
        <button
          onClick={() => setBandwidthMode(bandwidthMode === 'normal' ? 'low' : 'normal')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
            bandwidthMode === 'low'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
              : 'bg-space-900/80 text-slate-400 border-space-800 hover:text-white'
          }`}
          title="Low-Bandwidth Mode optimizes text payload for offshore 2G/GPRS networks"
        >
          <Signal size={13} />
          <span>{bandwidthMode === 'low' ? 'LOW-BW (OFFSHORE)' : 'NORMAL'}</span>
        </button>

      </div>

    </header>
  );
}
