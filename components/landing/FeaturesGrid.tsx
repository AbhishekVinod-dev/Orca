'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🐟',
    title: 'Potential Fishing Zones',
    desc: 'Daily satellite-derived PFZ advisories with species predictions, confidence scoring, and optimal fishing windows — powered by MODIS and Sentinel-3.',
    tag: 'Fishermen',
    gradient: 'from-teal-500/10 to-ocean-800/40',
  },
  {
    icon: '🌊',
    title: 'Sea Safety Intelligence',
    desc: 'Real-time wave height, wind speed, sea state, and weather forecasts. AI-computed safety scores with go/no-go decisions for any coastal region.',
    tag: 'Safety',
    gradient: 'from-blue-500/10 to-ocean-800/40',
  },
  {
    icon: '🌀',
    title: 'Cyclone & Storm Alerts',
    desc: 'Live cyclone tracks from IMD RSMC, predictive impact zones, storm surge estimates, and evacuation guidance for coastal communities.',
    tag: 'Disaster Management',
    gradient: 'from-red-500/10 to-ocean-800/40',
  },
  {
    icon: '🛰️',
    title: 'SST & Chlorophyll Maps',
    desc: 'Animated satellite heat maps for sea surface temperature and chlorophyll-a concentration — the two key indicators of productive fishing grounds.',
    tag: 'Researchers',
    gradient: 'from-purple-500/10 to-ocean-800/40',
  },
  {
    icon: '🗺️',
    title: 'Safe Route Optimization',
    desc: 'AI-computed safe vessel routes avoiding cyclone paths, high-wave zones, and restricted areas — updated every 6 hours with latest forecast data.',
    tag: 'Navigation',
    gradient: 'from-green-500/10 to-ocean-800/40',
  },
  {
    icon: '📍',
    title: 'Geofence Alerts',
    desc: 'Real-time proximity alerts for international maritime boundaries, protected marine areas, and naval exercise zones — preventing costly violations.',
    tag: 'Coastal Authorities',
    gradient: 'from-amber-500/10 to-ocean-800/40',
  },
];

const stakeholders = ['Fishermen', 'Coastal Authorities', 'Disaster Agencies', 'Researchers', 'Coast Guard', 'Port Authorities'];

export default function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 px-4 relative" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 font-medium text-sm uppercase tracking-widest">Intelligence Modules</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ocean-100 mt-3">
            Everything the Ocean Tells You
          </h2>
          <p className="text-ocean-300 mt-4 max-w-xl mx-auto text-lg">
            Six evidence-based intelligence layers, unified in one conversational interface.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${feat.gradient} border border-white/5 hover:border-teal-400/20 transition-all duration-300 group cursor-pointer`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <span className="text-xs font-mono text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
                {feat.tag}
              </span>
              <h3 className="font-display font-semibold text-ocean-100 text-xl mt-3 mb-2">
                {feat.title}
              </h3>
              <p className="text-ocean-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stakeholder badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-ocean-400 text-sm mb-4">Built for every marine stakeholder</p>
          <div className="flex flex-wrap justify-center gap-3">
            {stakeholders.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="px-4 py-2 glass rounded-full text-sm text-ocean-200 border border-white/5 hover:border-teal-400/30 transition-colors"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
