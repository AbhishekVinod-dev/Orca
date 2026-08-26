"use client";

import { X, TrendingUp, AlertTriangle } from 'lucide-react';
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
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

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
        </div>
        
      </div>
    </div>
  );
}
