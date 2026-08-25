'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Brain, Database, ShieldAlert, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';

const agentIcons = {
  Planner: Brain,
  DataAgent: Database,
  RiskAgent: ShieldAlert,
  ResponseAgent: MessageSquare,
};

const agentColors = {
  Planner: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  DataAgent: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  RiskAgent: 'text-red-400 bg-red-400/10 border-red-400/20',
  ResponseAgent: 'text-green-400 bg-green-400/10 border-green-400/20',
};

export default function AgentPipeline() {
  const { isThinking, currentAgentTrace, activeTraceStep } = useChatStore();

  if (!isThinking && currentAgentTrace.length === 0) return null;

  const agents = ['Planner', 'DataAgent', 'RiskAgent', 'ResponseAgent'] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mx-4 mb-4 glass-strong rounded-xl border border-white/5 p-4"
      >
        <p className="text-[10px] font-mono text-ocean-500 uppercase tracking-widest mb-3">
          ORCA Agent Pipeline · Processing
        </p>
        <div className="flex items-center gap-1.5">
          {agents.map((agent, i) => {
            const Icon = agentIcons[agent];
            const isActive = activeTraceStep === i && isThinking;
            const isDone = activeTraceStep > i;
            const colorClass = agentColors[agent];

            return (
              <div key={agent} className="flex items-center flex-1">
                <motion.div
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-300 ${
                    isActive ? colorClass + ' shadow-lg' : isDone ? 'border-white/10 opacity-70' : 'border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-ocean-600" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-center leading-tight">{agent}</span>
                </motion.div>

                {i < agents.length - 1 && (
                  <motion.div
                    animate={{ opacity: isDone ? 1 : 0.2 }}
                    className="w-3 h-px bg-teal-400 shrink-0"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current action text */}
        {currentAgentTrace[activeTraceStep] && (
          <motion.p
            key={activeTraceStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-[11px] text-ocean-400"
          >
            {currentAgentTrace[activeTraceStep].action} · {currentAgentTrace[activeTraceStep].detail}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
