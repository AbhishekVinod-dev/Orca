"use client";

import React, { useState } from 'react';
import { Waves, Thermometer, Droplets, AlertOctagon, CloudRain, ShieldCheck, Activity, RefreshCw, Zap, Sliders, Anchor, Calendar } from 'lucide-react';

export function AquacultureDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [highSurgeSim, setHighSurgeSim] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState('15 mins ago');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefreshHABScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime('Just now');
      showToast('🛰️ Satellite HAB Scan updated: Zero microcystin toxic bloom detected in coastal cages.');
    }, 1200);
  };

  const handleCalibrateSensors = () => {
    showToast('🔧 Telemetry Buoy #AQ-04 calibrated cleanly (DO: 6.8 mg/L, Salinity: 34.2 PSU).');
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar max-w-7xl mx-auto">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050c1e] border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap size={18} className="text-emerald-400 animate-bounce" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#040c1d]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-wide">AQUACULTURE & MARICULTURE TELEMETRY</h1>
            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full tech-mono">
              TAMIL NADU OFFSHORE CAGE SECTOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cage water quality, Harmful Algal Bloom (HAB) sentinel, and mooring wave tension analytics.
          </p>
        </div>

        <button
          onClick={handleCalibrateSensors}
          className="px-4 py-2 bg-[#020612]/90 hover:bg-space-800 border border-slate-700/60 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <Sliders size={14} className="text-emerald-400" />
          <span>Calibrate Buoy Telemetry</span>
        </button>
      </div>

      {/* 1. Harmful Algal Bloom (HAB) Alert Widget */}
      <div className="bg-[#040c1d]/90 p-6 rounded-2xl border-l-4 border-l-emerald-500 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl shadow-lg">
            <ShieldCheck size={34} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">HARMFUL ALGAL BLOOM (HAB) INDEX: CLEAR</h3>
              <span className="text-[10px] font-bold tech-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                NO BLOOM DETECTED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Oceansat-3 Chlorophyll-a optical sensors confirm zero toxic Karenia brevis / Dinophysis bloom anomalies in mariculture zone.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshHABScan}
          disabled={isScanning}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer flex items-center gap-2 shrink-0 active:scale-[0.98]"
        >
          <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
          <span>{isScanning ? 'Scanning Satellite...' : `Scan HAB (Last: ${lastScanTime})`}</span>
        </button>
      </div>

      {/* 2. Water Quality & Health Dashboard */}
      <div className="bg-[#040c1d]/90 p-6 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="text-cyan-400" size={18} />
            IN-SITU WATER QUALITY & BIOMASS TELEMETRY (CAGE ARRAY #04)
          </h3>
          <span className="text-[11px] text-slate-400 tech-mono">Sensors Online: 6 / 6</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Water Temp', value: '28.1 °C', target: '26 - 30 °C', icon: <Thermometer size={18} className="text-rose-400" />, status: 'Optimal' },
            { label: 'Salinity', value: '34.2 PSU', target: '32 - 36 PSU', icon: <Droplets size={18} className="text-cyan-400" />, status: 'Optimal' },
            { label: 'Dissolved O₂', value: '6.8 mg/L', target: '> 5.0 mg/L', icon: <Waves size={18} className="text-teal-400" />, status: 'Good' },
            { label: 'pH Level', value: '8.1', target: '7.8 - 8.4', icon: <Activity size={18} className="text-emerald-400" />, status: 'Balanced' },
          ].map((metric, i) => (
            <div key={i} className="bg-[#020612]/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400 tech-mono">
                <span>{metric.label}</span>
                {metric.icon}
              </div>
              <div className="text-xl font-bold text-white">{metric.value}</div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>Target: {metric.target}</span>
                <span className="text-emerald-400 font-bold">{metric.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Storm & Wave Impact 48h Forecast & Stress Simulator */}
      <div className="bg-[#040c1d]/90 p-6 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudRain className="text-blue-400" size={18} />
              48-HOUR WAVE & MOORING INFRASTRUCTURE IMPACT FORECAST
            </h3>
            <p className="text-xs text-slate-400">Hydrodynamic cage stress model based on swell period and peak vector currents.</p>
          </div>

          <button
            onClick={() => {
              const next = !highSurgeSim;
              setHighSurgeSim(next);
              showToast(`🌊 High Surge Storm Simulation ${next ? 'ACTIVATED (2.8m Peak Wave)' : 'DEACTIVATED (Normal 1.1m Wave)'}`);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border flex items-center gap-2 shadow-md ${
              highSurgeSim
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow animate-pulse'
                : 'bg-[#020612]/90 text-slate-300 border-slate-700/60 hover:text-white'
            }`}
          >
            <Zap size={14} className={highSurgeSim ? 'text-amber-400' : 'text-slate-400'} />
            <span>{highSurgeSim ? 'Surge Sim: ACTIVE' : 'Simulate Monsoon Storm Surge'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs tech-mono">
          <div className="bg-[#020612]/80 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">CAGE MOORING TENSION</div>
            <div className={`font-bold text-lg mt-1 ${highSurgeSim ? 'text-amber-400' : 'text-emerald-400'}`}>
              {highSurgeSim ? '14.2 kN (HIGH STRESS)' : '4.8 kN (NOMINAL)'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Anchor Line Tension Limit: 25.0 kN</div>
          </div>

          <div className="bg-[#020612]/80 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">NET CAGE DEFORMATION</div>
            <div className={`font-bold text-lg mt-1 ${highSurgeSim ? 'text-rose-400' : 'text-cyan-400'}`}>
              {highSurgeSim ? '18% VOL REDUCTION' : '3% VOL REDUCTION'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Fish Swim Space Adequate</div>
          </div>

          <div className="bg-[#020612]/80 p-4 rounded-xl border border-slate-800/80">
            <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">CAGE TENSION LOAD</div>
            <div className="text-teal-400 font-bold text-lg mt-1">{highSurgeSim ? '88% Stress' : '38% Load'}</div>
            <div className={`text-[10px] font-semibold mt-1 ${highSurgeSim ? 'text-rose-400' : 'text-emerald-400'}`}>
              {highSurgeSim ? 'Limit Operations' : 'Safe Operational Limit'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

