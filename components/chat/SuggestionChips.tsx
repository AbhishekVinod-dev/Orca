'use client';
import { motion } from 'framer-motion';
import { Fish, Wind, AlertTriangle, Navigation, Thermometer, Anchor } from 'lucide-react';

const chips = [
  { icon: Fish, label: 'PFZ near me', query: 'Where are the best fishing zones near me today?' },
  { icon: Wind, label: 'Safe tomorrow?', query: 'Is it safe to fish tomorrow in the Bay of Bengal?' },
  { icon: AlertTriangle, label: 'Cyclone alerts', query: 'What are the current cyclone warnings in India?' },
  { icon: Navigation, label: 'Safe route', query: 'Find me a safe route from Chennai to Rameswaram' },
  { icon: Thermometer, label: 'SST & Chlorophyll', query: 'Show me sea surface temperature and chlorophyll hotspots' },
  { icon: Anchor, label: 'Geofence check', query: 'Are there any maritime boundary restrictions near Palk Strait?' },
];

interface SuggestionChipsProps {
  onSelect: (query: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-6 py-8"
    >
      {/* ORCA branding */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center float-anim">
          <span className="text-3xl">🌊</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-ocean-100">How can I help?</h2>
        <p className="text-ocean-400 text-sm mt-1">Ask anything about sea conditions, fishing zones, or safety</p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {chips.map((chip, i) => (
          <motion.button
            key={chip.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => onSelect(chip.query)}
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/5 hover:border-teal-400/30 text-ocean-200 hover:text-teal-300 text-sm font-medium transition-all duration-200 hover:scale-105 group"
          >
            <chip.icon className="w-4 h-4 text-teal-500 group-hover:text-teal-400 transition-colors" />
            {chip.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
