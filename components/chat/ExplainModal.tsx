"use client";

<<<<<<< HEAD
import { X, TrendingUp, AlertTriangle } from 'lucide-react';
=======
import { useState } from 'react';
import { X, TrendingUp, AlertTriangle, FileText, Database, Info } from 'lucide-react';
>>>>>>> frontend-changes
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { day: 'Mon', sst: 29.1, chlorophyll: 1.2 },
  { day: 'Tue', sst: 28.8, chlorophyll: 1.5 },
  { day: 'Wed', sst: 28.5, chlorophyll: 1.8 },
  { day: 'Thu', sst: 28.4, chlorophyll: 2.1 },
  { day: 'Fri', sst: 28.2, chlorophyll: 2.5 },
  { day: 'Sat', sst: 28.4, chlorophyll: 2.8 },
  { day: 'Sun', sst: 28.5, chlorophyll: 2.6 },
];

<<<<<<< HEAD
export function ExplainModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-sm">
      <div className="bg-space-900 border border-space-700 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-space-800 bg-space-950">
          <div className="flex items-center gap-3 text-white font-medium">
            <TrendingUp className="text-cyan-500" size={20} />
            <h2>Explainable AI Analytics: {data?.id || 'Target Zone'}</h2>
=======
export function ExplainModal({ isOpen, onClose, data, defaultTab = 'overview' }: { isOpen: boolean, onClose: () => void, data: any, defaultTab?: 'overview' | 'evidence' | 'methodology' }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'methodology'>(defaultTab);

  if (!isOpen) return null;

  const isConflict = data?.type === 'conflict';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-sm">
      <div className="bg-space-900 border border-space-700 rounded-lg w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-space-800 bg-space-950">
          <div className="flex items-center gap-3 text-white font-medium">
            {isConflict ? <AlertTriangle className="text-amber-500" size={20} /> : <TrendingUp className="text-cyan-500" size={20} />}
            <h2>Explainable AI Analytics: {data?.id || (isConflict ? 'Evidence Conflict Analysis' : 'Target Zone')}</h2>
>>>>>>> frontend-changes
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

<<<<<<< HEAD
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The ORCA Agentic AI system selected this zone based on a multi-factor correlation of satellite Earth Observation data. Over the past 7 days, there has been a steady convergence of optimal Sea Surface Temperature (SST) and high chlorophyll-a concentration, indicating significant phytoplankton bloom and likely pelagic fish aggregation.
          </p>

          {/* Charts */}
          <div className="space-y-6">
            <div className="h-48 w-full bg-space-950 p-4 rounded-md border border-space-800">
              <h3 className="text-xs tech-mono text-slate-500 mb-2">SST vs CHLOROPHYLL TRENDS</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#06b6d4" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="sst" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="SST (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="chlorophyll" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Chl-a (mg/m³)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-3">
             <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
             <div className="text-sm text-slate-300">
               <span className="text-amber-500 font-medium block mb-1">Safety Constraints Considered</span>
               The Ocean Analytics Agent correlated this zone with the Weather Agent's forecast to ensure wave heights remain below 2.5m and no lightning activity is projected in the area for the next 24 hours.
             </div>
          </div>
=======
        {/* Tabs */}
        <div className="flex border-b border-space-800 bg-space-950/50">
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Info size={16} /> Overview
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'evidence' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-800'}`}
            onClick={() => setActiveTab('evidence')}
          >
            <FileText size={16} /> Evidence & Conflicts
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'methodology' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-800'}`}
            onClick={() => setActiveTab('methodology')}
          >
            <Database size={16} /> Methodology
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-slate-300 text-sm leading-relaxed">
                {isConflict 
                  ? "The ORCA Agentic AI system encountered conflicting data sources regarding the suitability and safety of this area. While some predictive models indicate optimal conditions, human-verified reports or secondary environmental feeds suggest otherwise."
                  : "The ORCA Agentic AI system selected this zone based on a multi-factor correlation of satellite Earth Observation data. Over the past 7 days, there has been a steady convergence of optimal Sea Surface Temperature (SST) and high chlorophyll-a concentration, indicating significant phytoplankton bloom and likely pelagic fish aggregation."}
              </p>
              
              {!isConflict && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                   <div className="text-sm text-slate-300">
                     <span className="text-amber-500 font-medium block mb-1">Safety Constraints Considered</span>
                     The Ocean Analytics Agent correlated this zone with the Weather Agent's forecast to ensure wave heights remain below 2.5m and no lightning activity is projected in the area for the next 24 hours.
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Evidence & Conflicts */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-white font-medium mb-4">Source Comparison</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-space-950 p-4 border border-space-700 rounded-md">
                  <div className="text-xs text-slate-500 mb-1 tech-mono">SOURCE 1</div>
                  <div className="text-teal-400 font-semibold mb-2">{isConflict ? data.source1?.name : 'ISRO Oceansat-3'}</div>
                  <div className="text-white mb-2 pb-2 border-b border-space-800">
                    Conclusion: <span className="font-medium text-emerald-400">{isConflict ? data.source1?.conclusion : 'Favorable'}</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {isConflict ? data.source1?.detail : 'High correlation between SST boundaries and phytoplankton density. 95% confidence based on yesterday\'s pass.'}
                  </p>
                </div>
                
                <div className="bg-space-950 p-4 border border-space-700 rounded-md">
                  <div className="text-xs text-slate-500 mb-1 tech-mono">SOURCE 2</div>
                  <div className="text-rose-400 font-semibold mb-2">{isConflict ? data.source2?.name : 'INCOIS Ocean State'}</div>
                  <div className="text-white mb-2 pb-2 border-b border-space-800">
                    Conclusion: <span className={`font-medium ${isConflict ? 'text-rose-400' : 'text-emerald-400'}`}>{isConflict ? data.source2?.conclusion : 'Favorable'}</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {isConflict ? data.source2?.detail : 'Wave models and subsurface temperature gradients align with optimal pelagic conditions.'}
                  </p>
                </div>
              </div>

              {isConflict && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-start gap-3">
                  <Info size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <span className="text-rose-500 font-medium block mb-1">System Recommendation</span>
                    Due to the conflicting evidence, ORCA recommends prioritizing verified human observations or acting with extreme caution. The predictive model may be skewed by anomalous surface data not reflective of subsurface realities.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Methodology */}
          {activeTab === 'methodology' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-white font-medium mb-4">Raw Data & Trend Analysis</h3>
              <div className="h-64 w-full bg-space-950 p-4 rounded-md border border-space-800">
                <h3 className="text-xs tech-mono text-slate-500 mb-4">SST vs CHLOROPHYLL-A TRENDS (LAST 7 DAYS)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#06b6d4" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="sst" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="SST (°C)" />
                    <Line yAxisId="right" type="monotone" dataKey="chlorophyll" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Chl-a (mg/m³)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-slate-400 bg-space-950 p-4 rounded-md border border-space-800 mt-4">
                <p className="mb-2"><strong className="text-slate-300">Algorithm:</strong> Spatio-Temporal Gradient Analysis (STGA)</p>
                <p className="mb-2"><strong className="text-slate-300">Confidence Interval:</strong> ± 0.2°C, ± 0.05 mg/m³</p>
                <p><strong className="text-slate-300">Data Freshness:</strong> Updated 4 hours ago via EOS-06 pass.</p>
              </div>
            </div>
          )}
>>>>>>> frontend-changes
        </div>
        
      </div>
    </div>
  );
}
