"use client";

import { Globe } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveGlobe = dynamic(() => import('../../../components/3d/InteractiveGlobe').then(mod => mod.InteractiveGlobe), {
  ssr: false,
});

export default function GlobePage() {
  return (
    <div className="flex-1 h-full relative overflow-hidden bg-space-950">
       <InteractiveGlobe />
       
       <div className="absolute top-6 left-6 z-10 bg-space-950/80 backdrop-blur-md border border-space-800 p-4 rounded-sm">
          <div className="text-white font-medium mb-1 flex items-center gap-2">
            <Globe size={16} className="text-cyan-500" />
            FULLSCREEN 3D GLOBE
          </div>
          <div className="text-slate-400 text-xs tech-mono">
            CINEMATIC MODE ACTIVE
          </div>
       </div>
    </div>
  );
}
