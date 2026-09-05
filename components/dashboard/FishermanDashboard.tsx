"use client";

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Anchor, Navigation, Mic, Radio, Fish, CheckCircle2, CloudDownload } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function FishermanDashboard() {
  const { setGlobeTarget, setRoutePath } = useAppStore();
  const [catchModalOpen, setCatchModalOpen] = useState(false);
  const [catchSuccess, setCatchSuccess] = useState(false);
  const [species, setSpecies] = useState('Sardinella');
  const [weightKg, setWeightKg] = useState('150');

  // Simulated safety status (Safe to Sail)
  const [safetyStatus] = useState<'safe' | 'caution' | 'danger'>('safe');

  const handleLogCatch = (e: React.FormEvent) => {
    e.preventDefault();
    setCatchSuccess(true);
    setTimeout(() => {
      setCatchSuccess(false);
      setCatchModalOpen(false);
    }, 1800);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4 no-scrollbar">

      {/* 1. Hero Safety Status Banner */}
      <div className={`p-5 rounded-lg border flex flex-col gap-3 shadow-xl transition-all ${
        safetyStatus === 'safe'
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
          : safetyStatus === 'caution'
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
          : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {safetyStatus === 'safe' && <ShieldCheck size={28} className="text-emerald-400 animate-pulse" />}
            {safetyStatus === 'caution' && <AlertTriangle size={28} className="text-amber-400 animate-bounce" />}
            {safetyStatus === 'danger' && <XCircle size={28} className="text-rose-500 animate-ping" />}
            <div>
              <h2 className="text-xl font-bold tracking-wide">
                {safetyStatus === 'safe' && '✅ SAFE TO SAIL'}
                {safetyStatus === 'caution' && '⚠️ CAUTION: HIGH SWELL'}
                {safetyStatus === 'danger' && '🛑 DANGER: DO NOT SAIL'}
              </h2>
              <p className="text-xs text-slate-300 tech-mono">CHENNAI & COROMANDEL COASTAL SECTOR</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-space-900/80 px-2.5 py-1 rounded text-[11px] text-teal-400 border border-teal-500/30 tech-mono">
            <CloudDownload size={14} />
            <span>20m ago • Offline Cache Ready</span>
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed bg-space-950/50 p-3 rounded border border-space-800">
          "Wave height is knee-high (1.1m). Wind is gentle from East (11 kts). Conditions are optimal for coastal gillnetting near Chennai sector today."
        </p>
      </div>

      {/* 2. PFZ Quick Fishing Zone Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Fish size={16} className="text-cyan-400" />
            POTENTIAL FISHING ZONES (PFZ) NEAR YOU
          </h3>
          <button
            onClick={() => setCatchModalOpen(true)}
            className="text-xs px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded transition-colors flex items-center gap-1.5 shadow"
          >
            <Anchor size={14} />
            Log Ground-Truth Catch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'PFZ-ALPHA', species: 'Sardinella / Mackerel', bearing: '12 km NE', lat: 13.15, lon: 80.35, sst: 28.2, chlorophyll: 2.1, match: 94 },
            { id: 'PFZ-BRAVO', species: 'Tuna / Seer Fish', bearing: '24 km E', lat: 13.08, lon: 80.48, sst: 27.9, chlorophyll: 1.8, match: 88 }
          ].map((zone) => (
            <div key={zone.id} className="glass-panel p-4 rounded-md border-l-4 border-l-cyan-500 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{zone.id}</span>
                <span className="text-xs font-bold text-teal-400 tech-mono bg-teal-500/10 px-2 py-0.5 rounded">{zone.match}% MATCH</span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-400">Target Fish:</span> <span className="font-semibold text-cyan-300">{zone.species}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] tech-mono bg-space-950/60 p-2 rounded">
                <div>Distance: <span className="text-white font-bold">{zone.bearing}</span></div>
                <div>SST: <span className="text-white font-bold">{zone.sst}°C</span></div>
                <div>Chlorophyll: <span className="text-white font-bold">{zone.chlorophyll} mg/m³</span></div>
                <div>GPS: <span className="text-white font-bold">{zone.lat}°N</span></div>
              </div>
              <button
                onClick={() => {
                  setGlobeTarget({
                    lat: zone.lat,
                    lon: zone.lon,
                    title: zone.id,
                    severity: 'info',
                    desc: `Target: ${zone.species} | Bearing: ${zone.bearing} | Match: ${zone.match}%`
                  });
                  setRoutePath([[13.0827, 80.2707], [zone.lat, zone.lon]]);
                }}
                className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Navigation size={14} />
                NAVIGATE TO ZONE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Ground-Truth Catch Logging Modal */}
      {catchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-950 border border-space-800 p-6 rounded-lg max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-space-800 pb-3">
              <Fish className="text-teal-400" size={18} />
              Submit Ground-Truth Catch Observation
            </h3>

            {catchSuccess ? (
              <div className="p-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 size={40} />
                <p className="font-bold text-sm">Catch Observation Logged!</p>
                <p className="text-xs text-slate-400">Thank you for validating ISRO PFZ satellite models.</p>
              </div>
            ) : (
              <form onSubmit={handleLogCatch} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Observed Fish Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-space-900 border border-space-700 text-white text-xs rounded p-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Sardinella">Sardinella (Oil Sardine)</option>
                    <option value="Rastrelliger">Rastrelliger (Indian Mackerel)</option>
                    <option value="Thunnus">Thunnus (Yellowfin Tuna)</option>
                    <option value="Scomberomorus">Scomberomorus (Seer Fish)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Estimated Catch Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-space-900 border border-space-700 text-white text-xs rounded p-2 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 150"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCatchModalOpen(false)}
                    className="px-4 py-1.5 text-xs text-slate-400 hover:text-white bg-space-900 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded"
                  >
                    Submit Catch Record
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
