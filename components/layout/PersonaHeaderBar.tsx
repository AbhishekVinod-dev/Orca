import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole, DisclosureLevel } from '../../lib/store';
import { Anchor, ShieldAlert, Cpu, Waves, Ship, Globe, Signal, Sliders, User, LogOut, ChevronDown, Check } from 'lucide-react';

const ROLE_METADATA: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  fisherman: { label: 'Fisherman', icon: <Anchor size={14} />, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  oceanographer: { label: 'Oceanographer', icon: <Cpu size={14} />, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  policymaker: { label: 'Policymaker', icon: <ShieldAlert size={14} />, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  aquaculture: { label: 'Aquaculture', icon: <Waves size={14} />, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  shipping: { label: 'Shipping', icon: <Ship size={14} />, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
};

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
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

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const currentRoleMeta = ROLE_METADATA[activeRole] || ROLE_METADATA.fisherman;
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-space-950/90 backdrop-blur-md border-b border-space-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-30">
      
      {/* 1. Authenticated User Profile Role Badge & Log Out */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${currentRoleMeta.color}`}>
          <User size={14} />
          <span>ROLE: <strong className="uppercase">{currentRoleMeta.label}</strong></span>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer"
          title="Sign out of current session"
        >
          <LogOut size={13} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Right Controls: Disclosure Level Slider, Custom Glass Language Dropdown, Low Bandwidth */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* 2. Progressive Disclosure Level Slider (1 - 5) */}
        <div className="flex items-center gap-2 bg-space-900/80 px-3 py-1.5 rounded-lg border border-space-800 shadow-sm">
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

        {/* 3. Custom Glass Regional Language Selector Button & Popover */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 bg-space-900/90 hover:bg-space-800 border border-space-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Globe size={14} className="text-teal-400" />
            <span>{currentLang.native}</span>
            <span className="text-[10px] text-slate-400 tech-mono">({currentLang.code.toUpperCase()})</span>
            <ChevronDown size={13} className={`text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180 text-teal-400' : ''}`} />
          </button>

          {/* Floating Glass Dropdown Menu */}
          {langDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#050c1e] border border-teal-500/30 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-2xl animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[10px] tech-mono font-bold text-slate-400 uppercase border-b border-space-800 mb-0.5">
                REGIONAL LANGUAGE
              </div>
              {LANGUAGES.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                        : 'text-slate-300 hover:bg-space-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.native}</span>
                      <span className="text-[10px] text-slate-500 tech-mono">({l.code.toUpperCase()})</span>
                    </div>
                    {isSelected && <Check size={13} className="text-teal-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Bandwidth Mode Toggle */}
        <button
          onClick={() => setBandwidthMode(bandwidthMode === 'normal' ? 'low' : 'normal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
            bandwidthMode === 'low'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
              : 'bg-space-900/80 text-slate-400 border-space-800 hover:text-white hover:bg-space-800'
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
