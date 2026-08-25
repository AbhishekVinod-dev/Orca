'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/sidebar/Sidebar';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Waves, Map, Bell, Settings, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useAlertStore } from '@/lib/store/alertStore';

const OrcaMap = dynamic(() => import('@/components/map/OrcaMap'), { ssr: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapPanelOpen, setMapPanelOpen] = useState(true);
  const { unreadCount } = useAlertStore();

  return (
    <div className="h-screen flex flex-col bg-ocean-950 overflow-hidden">
      {/* Top bar */}
      <div className="h-12 glass-strong border-b border-white/5 flex items-center px-4 gap-4 shrink-0 z-50">
        <Link href="/" className="flex items-center gap-2 mr-2">
          <div className="w-6 h-6 rounded bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <Waves className="w-3 h-3 text-teal-400" />
          </div>
          <span className="font-display font-bold text-sm gradient-text">ORCA</span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link href="/app" className="px-3 py-1.5 text-xs font-medium text-teal-300 bg-teal-400/10 rounded-lg">
            Chat
          </Link>
          <Link href="/map" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ocean-400 hover:text-ocean-200 rounded-lg hover:bg-white/5 transition-colors">
            <Map className="w-3.5 h-3.5" />
            Map
          </Link>
          <Link href="/alerts" className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ocean-400 hover:text-ocean-200 rounded-lg hover:bg-white/5 transition-colors">
            <Bell className="w-3.5 h-3.5" />
            Alerts
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-alert-critical text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <Link href="/settings" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ocean-400 hover:text-ocean-200 rounded-lg hover:bg-white/5 transition-colors">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setMapPanelOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-ocean-400 hover:text-teal-300 rounded-lg hover:bg-white/5 transition-colors"
            title="Toggle map panel"
          >
            {mapPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span className="hidden sm:inline">Map Panel</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="shrink-0 overflow-hidden border-r border-white/5"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar toggle when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-5 h-12 bg-ocean-800 border border-white/5 rounded-r-lg flex items-center justify-center text-ocean-400 hover:text-teal-300 transition-colors"
          >
            ›
          </button>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </div>

        {/* Map panel */}
        <AnimatePresence initial={false}>
          {mapPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 440, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="shrink-0 border-l border-white/5 overflow-hidden"
            >
              <div className="h-full">
                <OrcaMap compact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
