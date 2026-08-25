'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LayerControl from '@/components/map/LayerControl';

const OrcaMap = dynamic(() => import('@/components/map/OrcaMap'), { ssr: false });

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col bg-ocean-950">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1001] flex items-center gap-3 px-4 py-3 pointer-events-none">
        <Link href="/app" className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 glass-strong rounded-xl text-sm text-ocean-300 hover:text-teal-300 border border-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </Link>
        <div className="glass-strong rounded-xl px-4 py-2 text-sm font-display font-semibold text-ocean-100 border border-white/5">
          🌊 ORCA — Live Marine Map
        </div>
      </div>

      {/* Full screen map */}
      <div className="flex-1">
        <OrcaMap compact={false} />
      </div>
    </div>
  );
}
