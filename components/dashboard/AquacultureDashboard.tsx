"use client";

import React from 'react';
import { Waves, Thermometer, Droplets, AlertOctagon, CloudRain, ShieldCheck, Activity } from 'lucide-react';

export function AquacultureDashboard() {
  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4 no-scrollbar">

      {/* 1. Harmful Algal Bloom (HAB) Alert Widget */}
      <div className="glass-panel p-4 rounded-md border-l-4 border-l-emerald-500 flex items-center justify-between bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <ShieldCheck size={26} className="text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">HARMFUL ALGAL BLOOM (HAB) INDEX: CLEAR</h3>
            <p className="text-xs text-slate-300">Satellite Chlorophyll-a sensors report 0 toxic algae bloom anomalies in coastal fish cage sector.</p>
          </div>
        </div>
        <span className="text-xs font-bold tech-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
          NO BLOOM DETECTED
        </span>
      </div>

      {/* 2. Water Quality & Health Dashboard */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-space-800 pb-2">
          <Activity className="text-cyan-400" size={16} />
          REAL-TIME WATER QUALITY TELEMETRY
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Water Temp', value: '28.1 °C', target: '26 - 30 °C', icon: <Thermometer size={16} className="text-rose-400" />, status: 'Optimal' },
            { label: 'Salinity', value: '34.2 PSU', target: '32 - 36 PSU', icon: <Droplets size={16} className="text-cyan-400" />, status: 'Optimal' },
            { label: 'Dissolved O₂', value: '6.8 mg/L', target: '> 5.0 mg/L', icon: <Waves size={16} className="text-teal-400" />, status: 'Good' },
            { label: 'pH Level', value: '8.1', target: '7.8 - 8.4', icon: <Activity size={16} className="text-emerald-400" />, status: 'Balanced' },
          ].map((metric, i) => (
            <div key={i} className="bg-space-950 p-3 rounded border border-space-800 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 tech-mono">
                <span>{metric.label}</span>
                {metric.icon}
              </div>
              <div className="text-lg font-bold text-white">{metric.value}</div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Target: {metric.target}</span>
                <span className="text-emerald-400 font-bold">{metric.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Storm & Wave Impact 48h Forecast */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CloudRain className="text-blue-400" size={16} />
          48-HOUR WAVE & INFRASTRUCTURE IMPACT FORECAST
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs tech-mono">
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">CURRENT WAVE HEIGHT</div>
            <div className="text-cyan-400 font-bold text-base mt-1">1.1 m</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">Low Structural Stress</div>
          </div>
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">24H PEAK WAVE</div>
            <div className="text-amber-400 font-bold text-base mt-1">1.4 m</div>
            <div className="text-[9px] text-amber-300 mt-0.5">Moderate Cage Sway</div>
          </div>
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">48H PEAK SWELL</div>
            <div className="text-teal-400 font-bold text-base mt-1">1.2 m</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">Safe Operations</div>
          </div>
        </div>
      </div>

    </div>
  );
}
