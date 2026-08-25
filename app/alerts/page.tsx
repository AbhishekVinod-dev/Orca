'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAlerts } from '@/lib/mock/alertsData';
import { Alert } from '@/lib/mock/alertsData';
import { useAlertStore } from '@/lib/store/alertStore';
import {
  AlertTriangle, Waves, Zap, Wind, Eye, MapPin,
  Clock, Filter, Bell, X, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500', dot: '#EF4444' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500', dot: '#F97316' },
  moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500', dot: '#EAB308' },
  low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', badge: 'bg-green-500', dot: '#22C55E' },
};

const typeIcons: Record<string, React.ElementType> = {
  cyclone: Waves,
  lightning: Zap,
  'high-wave': Waves,
  geofence: MapPin,
  fog: Eye,
  wind: Wind,
};

function AlertCard({ alert, index }: { alert: Alert; index: number }) {
  const config = severityConfig[alert.severity];
  const Icon = typeIcons[alert.type] || AlertTriangle;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative glass-panel rounded-2xl border ${config.border} ${config.bg} overflow-hidden`}
    >
      {/* Severity pulse dot */}
      <div
        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
        style={{ background: config.dot, boxShadow: `0 0 8px ${config.dot}` }}
      />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white ${config.badge}`}>
                {alert.severity}
              </span>
              <span className="text-[10px] text-ocean-500 font-mono">{alert.type.toUpperCase()}</span>
              <span className="text-[10px] text-ocean-600 ml-auto">{alert.source}</span>
            </div>

            <h3 className={`font-display font-semibold text-base ${config.color} mb-1`}>
              {alert.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-ocean-400 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {alert.region}
              </span>
              {alert.distance && (
                <span className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {alert.distance} km away
                </span>
              )}
            </div>

            <p className={`text-sm text-ocean-300 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
              {alert.description}
            </p>

            {alert.description.length > 120 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className={`text-xs ${config.color} mt-1 hover:underline`}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}

            {/* Data pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {alert.windSpeed && (
                <span className="text-[11px] px-2 py-1 glass rounded-lg text-ocean-300">
                  💨 {alert.windSpeed} km/h
                </span>
              )}
              {alert.waveHeight && (
                <span className="text-[11px] px-2 py-1 glass rounded-lg text-ocean-300">
                  🌊 {alert.waveHeight}m waves
                </span>
              )}
              {alert.affectedZones.slice(0, 2).map(z => (
                <span key={z} className="text-[11px] px-2 py-1 glass rounded-lg text-ocean-400">
                  📍 {z}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
          <Clock className="w-3 h-3 text-ocean-600" />
          <span className="text-[11px] text-ocean-500">
            Issued: {new Date(alert.issuedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
          <span className="text-[11px] text-ocean-600 ml-auto">
            Expires: {new Date(alert.expiresAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Toast({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  const config = severityConfig[alert.severity];

  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      className={`glass-strong border ${config.border} rounded-xl p-4 max-w-sm shadow-2xl`}
    >
      <div className="flex items-start gap-3">
        <Bell className={`w-4 h-4 mt-0.5 ${config.color} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold ${config.color}`}>NEW ALERT</p>
          <p className="text-sm text-ocean-200 font-medium truncate">{alert.title}</p>
          <p className="text-xs text-ocean-400 mt-0.5">{alert.region}</p>
        </div>
        <button onClick={onDismiss} className="text-ocean-500 hover:text-ocean-300">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function AlertsPage() {
  const { alerts, setAlerts, filter, setFilter, getFilteredAlerts, toastQueue, addToast, dismissToast } = useAlertStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts().then(data => {
      setAlerts(data);
      setLoading(false);
      // Show a toast for the most critical alert
      const critical = data.find(a => a.severity === 'critical');
      if (critical) {
        setTimeout(() => addToast(critical), 1500);
      }
    });
  }, [setAlerts, addToast]);

  const filtered = getFilteredAlerts();
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="min-h-screen bg-ocean-950">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-ocean-400 hover:text-teal-300 text-sm transition-colors">← ORCA</Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h1 className="font-display font-bold text-ocean-100 text-xl">Alerts & Advisories</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {criticalCount > 0 && (
              <span className="text-xs px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full">
                {criticalCount} CRITICAL
              </span>
            )}
            {highCount > 0 && (
              <span className="text-xs px-2 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full">
                {highCount} HIGH
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2 text-ocean-400 text-sm">
            <Filter className="w-4 h-4" />
            Filter:
          </div>
          {(['all', 'critical', 'high', 'moderate', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilter({ severity: sev })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filter.severity === sev
                  ? 'border-teal-400/40 bg-teal-400/10 text-teal-300'
                  : 'border-white/5 text-ocean-400 hover:border-white/10 hover:text-ocean-200'
              }`}
            >
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-xs text-ocean-500">{filtered.length} alerts</span>
        </motion.div>

        {/* Alerts grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((alert, i) => (
                <AlertCard key={alert.id} alert={alert} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 text-ocean-500">
            <span className="text-4xl block mb-3">✅</span>
            <p className="text-lg font-medium text-ocean-400">No alerts match your filter</p>
            <p className="text-sm mt-1">All clear for selected severity and region</p>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toastQueue.slice(0, 2).map((toast) => (
            <Toast key={toast.id} alert={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
