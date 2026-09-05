"use client";

import React, { useState } from 'react';
import { ShieldAlert, FileText, Download, AlertTriangle, CheckCircle2, TrendingUp, Anchor, Compass, Zap, ShieldCheck, Radio } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function PolicymakerDashboard() {
  const { setShowGeofence, setViewMode, showGeofence } = useAppStore();
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [patrolDispatched, setPatrolDispatched] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadReport = (format: 'txt' | 'pdf') => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
      const text = `ORCA EXECUTIVE MARINE POLICY BRIEFING\nGenerated: ${new Date().toISOString()}\n\n1. EEZ Security: 3 unregistered foreign trawlers flagged near IMBL Line Sector 4.\n2. Overfishing Threat: Sardinella stocks in Coromandel Bay show high stress.\n3. Monsoon Preparedness: 48h Cyclone Watch active for Bay of Bengal.`;
      const blob = new Blob([text], { type: format === 'pdf' ? 'application/pdf' : 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ORCA_Policy_Briefing_${new Date().toISOString().slice(0,10)}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`📄 Executive Policy Briefing exported in .${format.toUpperCase()} format!`);
    }, 1000);
  };

  const handleDispatchPatrol = () => {
    setPatrolDispatched(true);
    showToast('🚨 Coast Guard Offshore Patrol Vessel (ICGS Varaha) dispatched to IMBL Sector 4!');
    setTimeout(() => setPatrolDispatched(false), 5000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar max-w-7xl mx-auto">

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050c1e] border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap size={18} className="text-rose-400 animate-bounce" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#040b18]/80 backdrop-blur-md p-4 rounded-xl border border-space-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-wide">MARITIME REGULATORY & EEZ POLICY DASHBOARD</h1>
            <span className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full tech-mono">
              LEVEL 4 HIGH ADVISORY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exclusive Economic Zone (EEZ) Governance • IMBL Protection • Sustainable Catch Quotas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadReport('txt')}
            disabled={downloadingReport}
            className="px-3.5 py-2 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow flex items-center gap-1.5"
          >
            <Download size={14} className="text-rose-400" />
            <span>{downloadingReport ? 'Generating...' : 'Export Briefing (.txt)'}</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Briefing Card */}
      <div className="bg-[#040c1d] p-5 rounded-xl border-l-4 border-l-rose-500 border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="text-rose-400" size={18} />
            EXECUTIVE DIRECTIVE BRIEFING (SEPTEMBER 2026 CYCLE)
          </h3>
          <span className="text-[11px] text-slate-400 tech-mono">Author: Joint Maritime Policy Board</span>
        </div>

        <ul className="space-y-3 text-xs text-slate-200">
          <li className="flex items-start gap-3 bg-space-950 p-3.5 rounded-xl border border-space-800">
            <span className="text-rose-400 font-bold text-sm mt-0.5">•</span>
            <div>
              <strong className="text-rose-300 font-bold block mb-0.5">IMBL Boundary Alert (Sector 4):</strong>
              <span>Proximity sensors flagged 2 unlicensed foreign trawlers 4.2 NM inside the 12 NM territorial line. Vessel AIS transponders disabled.</span>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-space-950 p-3.5 rounded-xl border border-space-800">
            <span className="text-amber-400 font-bold text-sm mt-0.5">•</span>
            <div>
              <strong className="text-amber-300 font-bold block mb-0.5">Overfishing Threat Index (Coromandel Coast):</strong>
              <span>Biomass density algorithms report Sardinella stock depletion risk. Recommending a 14-day seasonal purse-seine restriction.</span>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-space-950 p-3.5 rounded-xl border border-space-800">
            <span className="text-teal-400 font-bold text-sm mt-0.5">•</span>
            <div>
              <strong className="text-teal-300 font-bold block mb-0.5">Monsoon Preparedness & Shelter Score:</strong>
              <span>Coastal infrastructure readiness score is 92%. Emergency storm shelters along Tamil Nadu & AP coastline fully provisioned.</span>
            </div>
          </li>
        </ul>
      </div>

      {/* 2. EEZ & MPA Jurisdiction Map Controls */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-space-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="text-amber-400" size={18} />
              MARITIME JURISDICTION & EEZ BOUNDARY ENFORCEMENT
            </h3>
            <p className="text-xs text-slate-400">Control boundary geofences and dispatch enforcement assets.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowGeofence(!showGeofence);
                setViewMode('2d');
                showToast(`IMBL 200 NM Geofence Overlay ${!showGeofence ? 'ENABLED' : 'DISABLED'}`);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer border flex items-center gap-2 ${
                showGeofence
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-900/20 shadow'
                  : 'bg-space-900 text-slate-300 border-space-700 hover:text-white'
              }`}
            >
              <ShieldCheck size={14} className={showGeofence ? 'text-rose-400' : 'text-slate-400'} />
              <span>{showGeofence ? 'IMBL Line: ON' : 'Toggle 200 NM EEZ Line'}</span>
            </button>

            <button
              onClick={handleDispatchPatrol}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow ${
                patrolDispatched
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              <Anchor size={14} />
              <span>{patrolDispatched ? 'Patrol Vessel En Route...' : 'Dispatch Patrol Unit'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs tech-mono">
          <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">TERRITORIAL WATERS</div>
            <div className="text-emerald-400 font-bold text-base mt-1">12 NM</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Full Sovereign Zone</div>
          </div>
          <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">EXCLUSIVE ECON ZONE</div>
            <div className="text-amber-400 font-bold text-base mt-1">200 NM</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Sovereign Resource Rights</div>
          </div>
          <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">ACTIVE PATROL UNITS</div>
            <div className="text-cyan-400 font-bold text-base mt-1">4 OPV CUTTERS</div>
            <div className="text-[9px] text-teal-400 mt-0.5">Patrolling Sector 1 - 4</div>
          </div>
          <div className="bg-space-950 p-3.5 rounded-xl border border-space-800">
            <div className="text-slate-400 text-[10px]">BOUNDARY INCIDENTS</div>
            <div className="text-rose-400 font-bold text-base mt-1">2 UNLICENSED</div>
            <div className="text-[9px] text-rose-300 mt-0.5">AIS Disabled Flags</div>
          </div>
        </div>
      </div>

      {/* 3. IUU & Environmental Risk Gauges */}
      <div className="bg-[#040c1d] p-5 rounded-xl border border-space-800 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center border-b border-space-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-cyan-400" size={18} />
            ENVIRONMENTAL & ILLEGAL FISHING (IUU) RISK METRICS
          </h3>

          <button
            onClick={() => showToast('📻 Advisory notice broadcasted to all Tamil Nadu & AP Coastal Port Authorities.')}
            className="px-3 py-1.5 bg-space-900 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Radio size={13} className="text-cyan-400" />
            <span>Broadcast Port Notice</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Unlicensed Vessel Illegal Fishing (IUU) Risk', score: 28, color: 'bg-emerald-500', status: 'LOW RISK' },
            { label: 'Coastal Shoreline Erosion Hazard', score: 62, color: 'bg-amber-500', status: 'MODERATE RISK' },
            { label: 'Cyclone Corridor Depression Watch', score: 45, color: 'bg-cyan-500', status: 'MONITORED' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 bg-space-950 p-3 rounded-xl border border-space-800">
              <div className="flex justify-between text-xs tech-mono">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="font-bold text-white">{item.status} ({item.score}%)</span>
              </div>
              <div className="w-full h-2.5 bg-space-900 rounded-full overflow-hidden border border-space-800">
                <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${item.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
