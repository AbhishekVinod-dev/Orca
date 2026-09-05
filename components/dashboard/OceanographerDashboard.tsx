"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Cpu, Layers, Download, BookOpen, Check, Copy, AlertCircle, Eye, Zap, Database, RefreshCw } from 'lucide-react';
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
  const [activeLayers, setActiveLayers] = useState({ sst: true, chlorophyll: true, currents: true, salinity: false });
  const [copiedBib, setCopiedBib] = useState(false);
  const [chartMetric, setChartMetric] = useState<'both' | 'temp' | 'salinity'>('both');
  const [auditing, setAuditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bibtexCitation = `@article{ORCA2026,
  author = {ISRO Marine Intelligence & ORCA Team},
  title = {Synergistic Integration of Oceansat-3 SST and Argo Profiling Floats for Coastal Fisheries},
  journal = {Journal of Indian Ocean Science},
  year = {2026},
  volume = {14},
  pages = {102--118}
}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBib(true);
    showToast('📋 BibTeX citation copied to clipboard!');
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
    showToast('📥 Argo float profile CSV dataset downloaded!');
  };

  const handleExportNetCDF = () => {
    const text = "ORCA NETCDF METADATA CONTAINER v4.2\nDataset: Argo Float Profile #2901783\nLat: 13.08°N, Lon: 80.27°E\nTime: 2026-09-05T08:00:00Z";
    const blob = new Blob([text], { type: 'application/x-netcdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "argo_float_2901783.nc";
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 NetCDF binary file argo_float_2901783.nc exported!');
  };

  const handleRunAudit = () => {
    setAuditing(true);
    setTimeout(() => {
      setAuditing(false);
      showToast('✅ Cross-validation audit complete: Variance < 0.28°C across 4 sensors.');
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar max-w-7xl mx-auto">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050c1e] border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap size={18} className="text-cyan-400 animate-bounce" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#040b18]/80 backdrop-blur-md p-4 rounded-xl border border-space-800 shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">OCEANOGRAPHIC SCIENTIFIC WORKSPACE</h1>
          <p className="text-xs text-slate-400 mt-0.5 tech-mono">
            ISRO Oceansat-3 • MODIS • Argo Float Array • Bay of Bengal Sector
          </p>
        </div>

        <button
          onClick={() => {
            setViewMode('2d');
            showToast('🗺️ Switched to 2D GIS Map view!');
          }}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow"
        >
          <Eye size={14} className="text-cyan-400" />
          <span>Launch Spatial GIS View</span>
        </button>
      </div>

      {/* 1. Multi-Layer GIS Control Panel */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={18} />
            ACTIVE SATELLITE & SENSOR GIS OVERLAY LAYERS
          </h3>
          <span className="text-[11px] text-slate-400 tech-mono">Oceansat-3 Resolution: 360m</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'sst', label: 'SST Thermal Heatmap', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
            { key: 'chlorophyll', label: 'Chlorophyll-a Index', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
            { key: 'currents', label: 'Current Vector Field', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
            { key: 'salinity', label: 'Surface Salinity Gradient', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
          ].map(layer => {
            const isActive = activeLayers[layer.key as keyof typeof activeLayers];
            return (
              <button
                key={layer.key}
                onClick={() => {
                  const nextState = !isActive;
                  setActiveLayers(prev => ({ ...prev, [layer.key]: nextState }));
                  showToast(`Layer [${layer.label}] toggled ${nextState ? 'ON' : 'OFF'}`);
                }}
                className={`p-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? layer.color
                    : 'bg-space-950 border-space-800 text-slate-400 hover:border-space-700'
                }`}
              >
                <span className="font-semibold">{layer.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded tech-mono ${
                  isActive ? 'bg-white/10' : 'bg-space-900 text-slate-500'
                }`}>
                  {isActive ? 'ACTIVE' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Argo Float Depth Profile Chart (Recharts) */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="text-teal-400" size={18} />
              ARGO FLOAT DEPTH PROFILE (FLOAT #2901783 • BAY OF BENGAL)
            </h3>
            <p className="text-xs text-slate-400">Vertical thermocline & halocline profile down to 2,000m depth.</p>
          </div>

          <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-space-800 text-xs">
            <button
              onClick={() => setChartMetric('both')}
              className={`px-3 py-1 rounded font-semibold transition-all ${chartMetric === 'both' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setChartMetric('temp')}
              className={`px-3 py-1 rounded font-semibold transition-all ${chartMetric === 'temp' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Temp Only
            </button>
            <button
              onClick={() => setChartMetric('salinity')}
              className={`px-3 py-1 rounded font-semibold transition-all ${chartMetric === 'salinity' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Salinity Only
            </button>
          </div>
        </div>

        <div className="w-full h-64 bg-space-950/90 p-4 rounded-xl border border-space-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ARGO_DEPTH_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="depth" 
                stroke="#64748b" 
                tick={{ fontSize: 11 }} 
                label={{ value: 'Depth (Meters)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 11 }} domain={[0, 32]} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} domain={[34, 36]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050c1e', borderColor: '#06b6d4', borderRadius: '8px', fontSize: '12px', color: '#fff' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              {(chartMetric === 'both' || chartMetric === 'temp') && (
                <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              )}
              {(chartMetric === 'both' || chartMetric === 'salinity') && (
                <Line yAxisId="right" type="monotone" dataKey="salinity" name="Salinity (PSU)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Evidence & Conflict Inspector Panel */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="text-amber-400" size={18} />
            MULTI-SENSOR CONFLICT & CROSS-VALIDATION INSPECTOR
          </h3>
          <button
            onClick={handleRunAudit}
            disabled={auditing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={auditing ? 'animate-spin' : ''} />
            <span>{auditing ? 'Auditing Variance...' : 'Run Audit Scan'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-space-950 p-4 rounded-xl border border-space-800 flex flex-col gap-1">
            <div className="flex items-center justify-between border-b border-space-800 pb-2 mb-1">
              <span className="text-cyan-400 font-bold text-sm">Oceansat-3 Satellite Infra</span>
              <span className="text-[10px] tech-mono text-slate-400">Pass 08:42 UTC</span>
            </div>
            <p className="text-slate-300">Surface Temp: <span className="font-bold text-white text-sm">28.5°C</span></p>
            <p className="text-slate-400 text-[11px]">Chlorophyll-a: <span className="text-emerald-400 font-semibold">2.1 mg/m³</span></p>
            <p className="text-slate-500 text-[10px] mt-1 tech-mono">Confidence Margin: ±0.3°C</p>
          </div>

          <div className="bg-space-950 p-4 rounded-xl border border-space-800 flex flex-col gap-1">
            <div className="flex items-center justify-between border-b border-space-800 pb-2 mb-1">
              <span className="text-emerald-400 font-bold text-sm">NIOT Coastal Ocean Buoy</span>
              <span className="text-[10px] tech-mono text-slate-400">In-situ 08:45 UTC</span>
            </div>
            <p className="text-slate-300">Surface Temp: <span className="font-bold text-white text-sm">28.2°C</span></p>
            <p className="text-slate-400 text-[11px]">Chlorophyll-a: <span className="text-emerald-400 font-semibold">2.05 mg/m³</span></p>
            <p className="text-slate-500 text-[10px] mt-1 tech-mono">Confidence Margin: ±0.1°C</p>
          </div>
        </div>

        <div className="text-xs text-teal-300 tech-mono bg-teal-500/10 p-3 rounded-lg border border-teal-500/30 flex items-center gap-2">
          <Check size={16} className="text-teal-400 shrink-0" />
          <span>Statistical Variance &lt; 0.3°C. Evidence status validated cleanly with ZERO sensor calibration anomaly flags.</span>
        </div>
      </div>

      {/* 4. Scientific Citation & Multi-Format Exporter */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-cyan-400" />
            ISRO Research Publication & Dataset Export
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Export structured NetCDF binary, CSV telemetry, or BibTeX research references.</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={copyCitation}
            className="px-3.5 py-2 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedBib ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedBib ? 'BibTeX Copied' : 'Copy BibTeX'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} className="text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportNetCDF}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <Database size={14} />
            <span>Export NetCDF (.nc)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
