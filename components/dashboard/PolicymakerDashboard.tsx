"use client";

import React, { useState } from 'react';
import { ShieldAlert, FileText, Download, AlertTriangle, CheckCircle2, TrendingUp, Anchor, Compass } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function PolicymakerDashboard() {
  const { setShowGeofence, setViewMode } = useAppStore();
  const [downloadingReport, setDownloadingReport] = useState(false);

  const handleDownloadReport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
      const text = "ORCA MARINE POLICY EXECUTIVE BRIEFING - SEPTEMBER 2026\n\n1. EEZ Security: 3 unregistered foreign trawlers flagged near IMBL Line Sector 4.\n2. Overfishing Threat: Sardinella stocks in Coromandel Bay show high stress.\n3. Monsoon Preparedness: 48h Cyclone Watch active for Bay of Bengal.";
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "ORCA_Executive_Briefing_Report.txt";
      a.click();
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4 no-scrollbar">

      {/* 1. Executive Briefing Card */}
      <div className="glass-panel p-5 rounded-md border-l-4 border-l-rose-500 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-space-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="text-rose-400" size={16} />
            EXECUTIVE POLICY BRIEFING (REGULATORY & EEZ BRIEF)
          </h3>
          <button
            onClick={handleDownloadReport}
            disabled={downloadingReport}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow disabled:opacity-50"
          >
            <Download size={13} />
            {downloadingReport ? 'Generating PDF...' : 'Download Report'}
          </button>
        </div>

        <ul className="space-y-2 text-xs text-slate-200">
          <li className="flex items-start gap-2 bg-space-950/60 p-2.5 rounded border border-space-800">
            <span className="text-rose-400 font-bold">•</span>
            <span><strong className="text-rose-300">IMBL Boundary Alert:</strong> Proximity monitoring flagged 2 unlicensed foreign vessels 4.2 NM from the 12 NM territorial boundary.</span>
          </li>
          <li className="flex items-start gap-2 bg-space-950/60 p-2.5 rounded border border-space-800">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong className="text-amber-300">Overfishing Threat Index:</strong> Coromandel Sector 3 sardine stock density requires 14-day seasonal trawling restriction.</span>
          </li>
          <li className="flex items-start gap-2 bg-space-950/60 p-2.5 rounded border border-space-800">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong className="text-teal-300">Monsoon Protection Advisory:</strong> Coastal infrastructure preparedness score is 92% ahead of predicted Bay of Bengal depression.</span>
          </li>
        </ul>
      </div>

      {/* 2. EEZ & MPA Jurisdiction Map Controls */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-amber-400" size={16} />
            EEZ & MARITIME BOUNDARY JURISDICTION (IMBL)
          </h3>
          <button
            onClick={() => {
              setShowGeofence(true);
              setViewMode('2d');
            }}
            className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold rounded transition-colors"
          >
            Highlight 200 NM EEZ Line
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs tech-mono">
          <div className="bg-space-950 p-2.5 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">TERRITORIAL WATERS</div>
            <div className="text-emerald-400 font-bold text-sm">12 NM</div>
          </div>
          <div className="bg-space-950 p-2.5 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">EXCLUSIVE ECON ZONE</div>
            <div className="text-amber-400 font-bold text-sm">200 NM</div>
          </div>
          <div className="bg-space-950 p-2.5 rounded border border-space-800">
            <div className="text-slate-400 text-[10px]">BOUNDARY INCIDENTS</div>
            <div className="text-rose-400 font-bold text-sm">0 ACTIVE</div>
          </div>
        </div>
      </div>

      {/* 3. IUU & Environmental Risk Heatmap Index */}
      <div className="glass-panel p-4 rounded-md border border-space-800 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-cyan-400" size={16} />
          ENVIRONMENTAL & ILLEGAL FISHING (IUU) THREAT GAUGES
        </h3>

        <div className="space-y-3">
          {[
            { label: 'Unlicensed Vessel IUU Risk', score: 28, color: 'bg-emerald-500', status: 'LOW' },
            { label: 'Coastal Erosion Hazard', score: 62, color: 'bg-amber-500', status: 'MODERATE' },
            { label: 'Cyclone Corridor Threat', score: 45, color: 'bg-cyan-500', status: 'MONITORED' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs tech-mono">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-bold text-white">{item.status} ({item.score}%)</span>
              </div>
              <div className="w-full h-2 bg-space-950 rounded-full overflow-hidden border border-space-800">
                <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
