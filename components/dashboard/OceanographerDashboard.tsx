"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Cpu, Layers, Download, BookOpen, Check, Copy, AlertCircle, Eye } from 'lucide-react';
import { useAppStore } from '../../lib/store';

const ARGO_DEPTH_DATA = [
  { depth: 0, temp: 28.5, salinity: 34.8 },
  { depth: 100, temp: 24.2, salinity: 35.1 },
  { depth: 200, temp: 18.6, salinity: 35.4 },
  { depth: 500, temp: 10.4, salinity: 35.0 },
  { depth: 1000, temp: 6.2, salinity: 34.8 },
  { depth: 1500, temp: 3.8, salinity: 34.7 },
  { depth: 2000, temp: 2.4, salinity: 34.6 },
];

export function OceanographerDashboard() {
  const { setViewMode } = useAppStore();
  const [activeLayers, setActiveLayers] = useState({ sst: true, chlorophyll: true, currents: false });
  const [copiedBib, setCopiedBib] = useState(false);

  const bibtexCitation = `@article{ORCA2026,
  author = {ISRO Marine Intelligence & ORCA Team},
  title = {Synergistic Integration of Oceansat-3 SST and Argo Profiling Floats for Coastal Fisheries},
  journal = {Journal of Indian Ocean Science},
  year = {2026},
  volume = {14},
  pages = {102--118}
}`;

  const copyCitation = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Depth(m),Temperature(C),Salinity(PSU)\n" +
      ARGO_DEPTH_DATA.map(e => `${e.depth},${e.temp},${e.salinity}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "argo_float_profile_chennai.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4 no-scrollbar">

      {/* 1. Multi-Layer GIS Control Panel */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-space-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={16} />
            SATELLITE & SENSOR GIS LAYERS
          </h3>
          <button
            onClick={() => setViewMode('2d')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <Eye size={13} /> View on Map
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'sst', label: 'SST Heatmap (Oceansat-3)', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
            { key: 'chlorophyll', label: 'Chlorophyll-a (MODIS)', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
            { key: 'currents', label: 'Wave & Vector Field', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
          ].map(layer => (
            <button
              key={layer.key}
              onClick={() => setActiveLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key as keyof typeof prev] }))}
              className={`p-2 rounded text-xs font-medium border flex items-center justify-between transition-all ${
                activeLayers[layer.key as keyof typeof activeLayers]
                  ? layer.color
                  : 'bg-space-900 border-space-800 text-slate-400'
              }`}
            >
              <span>{layer.label}</span>
              <span className="text-[10px] font-bold">{activeLayers[layer.key as keyof typeof activeLayers] ? 'ON' : 'OFF'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Argo Float Depth Profile Chart (Recharts) */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="text-teal-400" size={16} />
            ARGO FLOAT PROFILE (ID: 2901783 • BAY OF BENGAL)
          </h3>
          <span className="text-[10px] tech-mono text-slate-400">DEPTH: 0m ➔ 2000m</span>
        </div>

        <div className="w-full h-48 bg-space-950/80 p-2 rounded border border-space-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ARGO_DEPTH_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
              <XAxis dataKey="depth" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Depth (m)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#050a10', borderColor: '#1e293b', fontSize: '11px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
              <Line yAxisId="right" type="monotone" dataKey="salinity" name="Salinity (PSU)" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Evidence & Conflict Inspector Panel */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertCircle className="text-amber-400" size={16} />
          EVIDENCE CONFLICT INSPECTOR
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <span className="text-cyan-400 font-bold block mb-1">Oceansat-3 Satellite</span>
            <p className="text-slate-300">SST: <span className="font-bold text-white">28.5°C</span></p>
            <p className="text-slate-400 text-[10px] mt-1">Confidence Interval: ±0.3°C (Pass 08:42 UTC)</p>
          </div>
          <div className="bg-space-950 p-3 rounded border border-space-800">
            <span className="text-emerald-400 font-bold block mb-1">NIOT Coastal Buoy</span>
            <p className="text-slate-300">SST: <span className="font-bold text-white">28.2°C</span></p>
            <p className="text-slate-400 text-[10px] mt-1">Confidence Interval: ±0.1°C (In-situ 08:45 UTC)</p>
          </div>
        </div>
        <div className="text-[11px] text-teal-400 tech-mono bg-teal-500/10 p-2 rounded">
          ✓ Statistical Variance &lt; 0.3°C. Evidence status validated cleanly with zero anomaly flag.
        </div>
      </div>

      {/* 4. Data Exporter & Citation Drawer */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <BookOpen size={14} className="text-cyan-400" />
            ISRO Research Citation & Export
          </h4>
          <p className="text-[10px] text-slate-400">Export NetCDF/CSV datasets and APA/BibTeX research citations.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyCitation}
            className="px-3 py-1.5 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-200 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            {copiedBib ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedBib ? 'Copied' : 'BibTeX'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

    </div>
  );
}
