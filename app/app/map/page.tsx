"use client";

import { Map } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center text-center px-8 relative z-10">
       <Map size={48} className="text-space-700 mb-6" />
       <h1 className="text-2xl font-semibold text-white tracking-wide mb-3">High-Resolution Marine Map</h1>
       <p className="text-slate-500 max-w-md">2D geographic analysis and bathymetry data.</p>
       
       <div className="mt-12 flex gap-4 text-xs tech-mono text-slate-600">
         <span className="w-1.5 h-1.5 bg-space-700 rounded-full"></span>
         MODULE OFFLINE
       </div>
    </div>
  );
}
