'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Database, ShieldAlert, MessageSquare, ChevronRight } from 'lucide-react';

const agents = [
  { icon: Brain, label: 'Planner', sub: 'Intent & Routing', color: '#2DD4BF', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.25)' },
  { icon: Database, label: 'Data Agent', sub: 'Satellite Fetch', color: '#6BAED6', bg: 'rgba(107,174,214,0.08)', border: 'rgba(107,174,214,0.25)' },
  { icon: ShieldAlert, label: 'Risk Agent', sub: 'Hazard Check', color: '#F97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  { icon: MessageSquare, label: 'Response', sub: 'Explainable AI', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
];

const steps = [
  { icon: '🧠', agent: 'Planner', title: 'Query Understanding', desc: 'Classifies intent, extracts location + time context, routes to the right agents.' },
  { icon: '🛰️', agent: 'Data Agent', title: 'Satellite & Sensor Fetch', desc: 'Pulls MODIS SST, Sentinel-3 chlorophyll, IMD NWP forecasts, and INCOIS alerts in parallel.' },
  { icon: '⚠️', agent: 'Risk Agent', title: 'Risk Assessment', desc: 'Cross-references ocean data against active hazards, geofences, and historical patterns.' },
  { icon: '💬', agent: 'Response Agent', title: 'Explainable Answer', desc: 'Synthesizes a clear, evidence-cited response in your language with map visualizations.' },
];

function AgentPipelineViz() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex items-center justify-center gap-0 w-full overflow-x-auto py-2">
      {agents.map((agent, i) => {
        const Icon = agent.icon;
        return (
          <div key={agent.label} className="flex items-center">
            {/* Agent box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl min-w-[100px]"
              style={{ background: agent.bg, border: `1px solid ${agent.border}` }}
            >
              <motion.div
                animate={inView ? {
                  boxShadow: [`0 0 0px ${agent.color}00`, `0 0 16px ${agent.color}60`, `0 0 0px ${agent.color}00`],
                } : {}}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, repeatDelay: 2 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${agent.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: agent.color }} />
              </motion.div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-ocean-200">{agent.label}</p>
                <p className="text-[9px] text-ocean-500">{agent.sub}</p>
              </div>
            </motion.div>

            {/* Arrow connector */}
            {i < agents.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.2 }}
                className="flex items-center mx-1"
              >
                <div className="w-8 h-px bg-gradient-to-r from-teal-400/50 to-teal-400/20" />
                <ChevronRight className="w-3 h-3 text-teal-400/50 -ml-1" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 font-medium text-sm uppercase tracking-widest">How it works</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ocean-100 mt-3">
            Four Agents. One Answer.
          </h2>
          <p className="text-ocean-300 mt-4 max-w-xl mx-auto text-lg">
            Every ORCA response is powered by a collaborative multi-agent pipeline that processes satellite data, forecasts, and risk factors simultaneously.
          </p>
        </motion.div>

        {/* Animated pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 mb-16 overflow-hidden"
        >
          <p className="text-[9px] font-mono text-ocean-600 uppercase tracking-widest text-center mb-4">
            Agent Collaboration Pipeline
          </p>
          <AgentPipelineViz />
          {/* Data stream animation */}
          <div className="mt-4 flex gap-2 justify-center">
            {['MODIS Aqua', 'IMD NWP', 'INCOIS ERDDAP', 'Sentinel-3', 'Coast Guard Feed'].map((src, i) => (
              <motion.span
                key={src}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [0, 0.7, 0] } : {}}
                transition={{ duration: 2.5, delay: 1 + i * 0.4, repeat: Infinity, repeatDelay: 1 }}
                className="text-[9px] px-2 py-1 glass rounded-full text-ocean-400 border border-white/5 whitespace-nowrap"
              >
                {src}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.agent}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              className="relative glass-strong rounded-2xl p-6 border border-white/5 group hover:border-teal-400/20 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-xs font-mono text-ocean-500">0{i + 1}</div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-xs font-mono text-teal-400 mb-1">{step.agent}</div>
              <h3 className="font-display font-semibold text-ocean-100 text-lg mb-2">{step.title}</h3>
              <p className="text-ocean-400 text-sm leading-relaxed">{step.desc}</p>
              {i < 3 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center">
                  <div className="w-2 h-2 border-t-2 border-r-2 border-teal-400/50 rotate-45" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
