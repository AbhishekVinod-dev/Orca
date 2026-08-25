'use client';
import { motion } from 'framer-motion';
import { useMapStore, MapLayer } from '@/lib/store/mapStore';
import { Fish, Thermometer, Leaf, AlertTriangle, Navigation, Shield } from 'lucide-react';

const layers: { id: MapLayer; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { id: 'pfz', label: 'PFZ Zones', icon: Fish, color: '#2DD4BF', desc: 'Potential Fishing Zones' },
  { id: 'sst', label: 'SST Layer', icon: Thermometer, color: '#F97316', desc: 'Sea Surface Temperature' },
  { id: 'chlorophyll', label: 'Chlorophyll', icon: Leaf, color: '#22C55E', desc: 'Chlorophyll-a Concentration' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: '#EF4444', desc: 'Active Hazard Alerts' },
  { id: 'routes', label: 'Safe Routes', icon: Navigation, color: '#6BAED6', desc: 'Safe Vessel Routes' },
  { id: 'geofences', label: 'Geofences', icon: Shield, color: '#EAB308', desc: 'Restricted Zones' },
];

export default function LayerControl() {
  const { activeLayers, toggleLayer } = useMapStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-strong border border-white/10 rounded-xl p-3 min-w-[160px]"
    >
      <p className="text-[9px] font-mono text-ocean-500 uppercase tracking-widest mb-2">Map Layers</p>
      <div className="flex flex-col gap-1">
        {layers.map((layer) => {
          const active = activeLayers.has(layer.id);
          const Icon = layer.icon;
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all duration-200 w-full ${
                active
                  ? 'text-ocean-100 bg-white/5'
                  : 'text-ocean-500 hover:text-ocean-300 hover:bg-white/5'
              }`}
            >
              {/* Toggle indicator */}
              <motion.div
                animate={{ opacity: active ? 1 : 0.3 }}
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: active ? layer.color : '#334155' }}
              />
              <Icon className="w-3 h-3 shrink-0" style={{ color: active ? layer.color : undefined }} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium truncate block">{layer.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
