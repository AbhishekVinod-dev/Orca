"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Anchor, 
  Navigation, 
  Radio, 
  Fish, 
  CheckCircle2, 
  CloudDownload, 
  RefreshCw, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  Zap,
  PhoneCall
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface PFZZone {
  id: string;
  species: string;
  bearing: string;
  lat: number;
  lon: number;
  sst: number;
  chlorophyll: number;
  match: number;
  depth: string;
}

const PFZ_ZONES: PFZZone[] = [
  { id: 'PFZ-ALPHA', species: 'Sardinella (Oil Sardine)', bearing: '12 km NE', lat: 13.15, lon: 80.35, sst: 28.2, chlorophyll: 2.1, match: 94, depth: '18 - 25 m' },
  { id: 'PFZ-BRAVO', species: 'Thunnus (Yellowfin Tuna)', bearing: '24 km E', lat: 13.08, lon: 80.48, sst: 27.9, chlorophyll: 1.8, match: 88, depth: '45 - 60 m' },
  { id: 'PFZ-CHARLIE', species: 'Scomberomorus (Seer Fish)', bearing: '18 km SE', lat: 12.95, lon: 80.41, sst: 28.0, chlorophyll: 2.4, match: 91, depth: '30 - 40 m' },
];

const FISH_MARKET_PRICES = [
  { name: 'Sardinella (Oil Sardine)', price: '₹145/kg', trend: '+4%', isUp: true },
  { name: 'Yellowfin Tuna', price: '₹290/kg', trend: '+6%', isUp: true },
  { name: 'Indian Mackerel', price: '₹185/kg', trend: '-2%', isUp: false },
  { name: 'Seer Fish (King Mackerel)', price: '₹420/kg', trend: '+8%', isUp: true },
];

export function FishermanDashboard() {
  const { setGlobeTarget, setRoutePath, setViewMode } = useAppStore();
  const [catchModalOpen, setCatchModalOpen] = useState(false);
  const [catchSuccess, setCatchSuccess] = useState(false);
  const [species, setSpecies] = useState('Sardinella');
  const [weightKg, setWeightKg] = useState('150');
  const [vesselName, setVesselName] = useState('Kadal Kani-04');
  
  // Interactive UI state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('10 mins ago');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefreshWeatherData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
      showToast('⚡ Oceanographic telemetry re-synced from Oceansat-3 & NIOT buoy!');
    }, 1000);
  };

  const handleNavigateToZone = (zone: PFZZone) => {
    setGlobeTarget({
      lat: zone.lat,
      lon: zone.lon,
      title: `${zone.id} - ${zone.species}`,
      severity: 'info',
      desc: `Bearing: ${zone.bearing} | SST: ${zone.sst}°C | Chlorophyll: ${zone.chlorophyll} mg/m³`
    });
    setRoutePath([[13.0827, 80.2707], [zone.lat, zone.lon]]);
    setViewMode('2d');
    showToast(`🗺️ Navigation route set to ${zone.id} (${zone.bearing})! Map centered.`);
  };

  const handleLogCatch = (e: React.FormEvent) => {
    e.preventDefault();
    setCatchSuccess(true);
    setTimeout(() => {
      setCatchSuccess(false);
      setCatchModalOpen(false);
      showToast(`✅ Catch of ${weightKg}kg ${species} submitted to ISRO validation database.`);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar max-w-7xl mx-auto">

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050c1e] border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap size={18} className="text-cyan-400 animate-bounce" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#040b18]/80 backdrop-blur-md p-4 rounded-xl border border-space-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-wide">FISHERMAN OCEANIC ADVISORY</h1>
            <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full tech-mono">
              CHENNAI HARBOUR SECTOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <MapPin size={12} className="text-cyan-400" />
            Coromandel Coast • Sector 04 (13.0827°N, 80.2707°E)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshWeatherData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow"
          >
            <RefreshCw size={13} className={`text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Sync Live Telemetry'}</span>
          </button>

          <button
            onClick={() => {
              setAudioPlaying(!audioPlaying);
              showToast(audioPlaying ? 'Audio bulletin paused.' : '🔊 Playing coastal weather audio bulletin in Tamil/English...');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow ${
              audioPlaying 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse' 
                : 'bg-space-900 border-space-700 text-slate-300 hover:text-white'
            }`}
          >
            {audioPlaying ? <VolumeX size={14} /> : <Volume2 size={14} className="text-amber-400" />}
            <span>{audioPlaying ? 'Mute Bulletin' : 'Voice Bulletin'}</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Safety Status Banner */}
      <div className="p-5 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-[#031510] to-[#040e1a] text-emerald-100 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl">
              <ShieldCheck size={32} className="text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide text-white">✅ SAFE TO SAIL — OPTIMAL SEAFARING CONDITIONS</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded tech-mono border border-emerald-500/40">
                  FLAG 0 (GREEN)
                </span>
              </div>
              <p className="text-xs text-slate-300 tech-mono mt-0.5">
                COROMANDEL & BAY OF BENGAL COASTAL WATERS (0 - 30 NM)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-space-950/80 px-3 py-1.5 rounded-lg border border-teal-500/30 text-xs text-teal-300 tech-mono">
            <CloudDownload size={14} className="text-teal-400" />
            <span>Cache: {lastUpdated} • Low-BW Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-space-950/70 p-3.5 rounded-lg border border-space-800/80 text-xs tech-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">WAVE HEIGHT (Hs)</span>
            <span className="text-emerald-400 font-bold text-sm">1.1 m (Knee High)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SURFACE WIND</span>
            <span className="text-white font-bold text-sm">11 Kts (East-Northeast)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">CURRENT SPEED</span>
            <span className="text-cyan-400 font-bold text-sm">0.6 Knots (Southerly)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">VISIBILITY</span>
            <span className="text-white font-bold text-sm">12.5 KM (Clear Sky)</span>
          </div>
        </div>
      </div>

      {/* 2. Potential Fishing Zones (PFZ) Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Fish size={18} className="text-cyan-400" />
              POTENTIAL FISHING ZONES (PFZ) — HIGH CONFIDENCE NODES
            </h3>
            <p className="text-xs text-slate-400">Generated from Oceansat-3 SST & Chlorophyll-a thermal front convergence models.</p>
          </div>

          <button
            onClick={() => setCatchModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Anchor size={15} />
            Log Ground-Truth Catch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PFZ_ZONES.map((zone) => (
            <div 
              key={zone.id} 
              className="bg-[#040c1d] border border-space-800 hover:border-cyan-500/40 p-4 rounded-xl flex flex-col justify-between gap-4 transition-all shadow-md hover:shadow-cyan-900/10 group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-space-800/80 pb-2">
                  <span className="font-bold text-white text-sm tracking-wide">{zone.id}</span>
                  <span className="text-xs font-bold text-teal-300 tech-mono bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full">
                    {zone.match}% SPECIES MATCH
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Target Species:</span>{' '}
                  <span className="font-semibold text-cyan-300">{zone.species}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] tech-mono bg-space-950/80 p-2.5 rounded-lg border border-space-800">
                  <div>Distance: <span className="text-white font-bold">{zone.bearing}</span></div>
                  <div>SST: <span className="text-white font-bold">{zone.sst}°C</span></div>
                  <div>Chl-a: <span className="text-emerald-400 font-bold">{zone.chlorophyll} mg/m³</span></div>
                  <div>Target Depth: <span className="text-amber-300 font-bold">{zone.depth}</span></div>
                </div>
              </div>

              <button
                onClick={() => handleNavigateToZone(zone)}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow cursor-pointer group-hover:bg-cyan-500"
              >
                <Navigation size={14} />
                NAVIGATE TO ZONE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fish Market Economics & Emergency SOS Bar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fish Harbour Prices Card */}
        <div className="md:col-span-2 bg-[#040c1d] border border-space-800 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              LIVE CHENNAI FISH HARBOUR LANDING PRICES
            </h3>
            <span className="text-[10px] text-slate-400 tech-mono">Updated today 06:00 IST</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FISH_MARKET_PRICES.map((item, idx) => (
              <div key={idx} className="bg-space-950/80 p-3 rounded-lg border border-space-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 line-clamp-1">{item.name}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-bold text-white">{item.price}</span>
                  <span className={`text-[10px] font-bold tech-mono ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coastal Guard Emergency Distress Link */}
        <div className="bg-[#040c1d] border border-space-800 p-4 rounded-xl flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-space-800 pb-2">
              <PhoneCall size={16} className="text-rose-400" />
              COAST GUARD DISTRESS RADIO
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Instant satellite-relayed emergency beacon to Indian Coast Guard Chennai Maritime Rescue Coordination Centre (MRCC).
            </p>
          </div>

          <button
            onClick={() => showToast('🚨 TEST DISTRESS SIGNAL: Coast Guard MRCC link verified. Signal strong (VHF Ch 16).')}
            className="w-full py-2 bg-rose-600/20 border border-rose-500/50 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Radio size={14} className="animate-pulse text-rose-400" />
            TEST DISTRESS CHANNEL (VHF 16)
          </button>
        </div>
      </div>

      {/* 4. Ground-Truth Catch Logging Modal */}
      {catchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#050c1e] border border-cyan-500/40 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-space-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Fish className="text-teal-400" size={18} />
                Submit Ground-Truth Catch Validation
              </h3>
              <button
                onClick={() => setCatchModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {catchSuccess ? (
              <div className="py-8 text-center text-emerald-400 flex flex-col items-center gap-3">
                <CheckCircle2 size={48} className="animate-bounce" />
                <p className="font-bold text-base">Catch Observation Recorded!</p>
                <p className="text-xs text-slate-300 max-w-xs">
                  Thank you! Your feedback continuously tunes ISRO Oceansat-3 PFZ predictive accuracy algorithms.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogCatch} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Vessel / Boat Identifier</label>
                  <input
                    type="text"
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 tech-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Observed Target Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Sardinella">Sardinella (Oil Sardine)</option>
                    <option value="Rastrelliger">Rastrelliger (Indian Mackerel)</option>
                    <option value="Thunnus">Thunnus (Yellowfin Tuna)</option>
                    <option value="Scomberomorus">Scomberomorus (Seer Fish)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Estimated Total Catch Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 tech-mono"
                    placeholder="e.g. 150"
                    required
                  />
                </div>

                <div className="bg-space-950/60 p-2.5 rounded-lg border border-space-800 text-[10px] text-slate-400 tech-mono">
                  GPS Position: 13.150°N, 80.350°E (Auto-captured via GPS)
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-space-800">
                  <button
                    type="button"
                    onClick={() => setCatchModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white bg-space-900 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md cursor-pointer"
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

