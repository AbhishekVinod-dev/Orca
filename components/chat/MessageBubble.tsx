'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/lib/store/chatStore';
import { AgentStep } from '@/lib/mock/chatResponses';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, Loader2, Waves } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

function AgentBadge({ agent }: { agent: AgentStep['agent'] }) {
  const colors: Record<AgentStep['agent'], string> = {
    Planner: 'text-teal-300 bg-teal-400/10 border-teal-400/20',
    DataAgent: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
    RiskAgent: 'text-red-300 bg-red-400/10 border-red-400/20',
    ResponseAgent: 'text-green-300 bg-green-400/10 border-green-400/20',
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colors[agent]}`}>
      {agent}
    </span>
  );
}

function StreamingText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        // Stream faster: 4 chars per tick
        const chunk = text.slice(idx.current, idx.current + 4);
        setDisplayed(prev => prev + chunk);
        idx.current += 4;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <div className="prose prose-invert prose-sm max-w-none text-ocean-100 [&>p]:mb-3 [&>h2]:text-teal-300 [&>h2]:font-display [&>hr]:border-white/10 [&>table]:text-xs [&>ul]:text-ocean-200">
      <ReactMarkdown>{displayed}</ReactMarkdown>
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-teal-400 animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [traceExpanded, setTraceExpanded] = useState(false);
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm
        ${isUser
          ? 'bg-ocean-700 border border-ocean-600 text-ocean-200'
          : 'bg-teal-500/20 border border-teal-400/30 text-teal-400'
        }`}
      >
        {isUser ? '👤' : <Waves className="w-4 h-4" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message content */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-ocean-700 text-ocean-100 rounded-tr-sm border border-ocean-600'
              : 'glass-strong rounded-tl-sm border border-white/5'
            }`}
        >
          {isUser ? (
            <p className="text-ocean-100">{message.content}</p>
          ) : message.isStreaming ? (
            <StreamingText text={message.content} />
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-ocean-100 [&>p]:mb-3 [&>h2]:text-teal-300 [&>h2]:font-display [&>hr]:border-white/10 [&>table]:text-xs [&>ul]:text-ocean-200">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Chart if relatedData has chartData */}
        {!isUser && message.relatedData?.chartData && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full glass-strong rounded-xl p-3 border border-white/5"
          >
            <p className="text-[10px] text-ocean-400 mb-2 font-mono uppercase tracking-wider">Data Visualization</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={message.relatedData.chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#6BAED6' }} />
                <YAxis tick={{ fontSize: 9, fill: '#6BAED6' }} />
                <Tooltip
                  contentStyle={{ background: '#061929', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#2DD4BF' }}
                />
                <Bar dataKey="value" fill="#2DD4BF" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Agent trace accordion */}
        {!isUser && message.agentTrace && message.agentTrace.length > 0 && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <button
              onClick={() => setTraceExpanded(v => !v)}
              className="flex items-center gap-2 text-[11px] text-ocean-500 hover:text-teal-400 transition-colors py-1"
            >
              {traceExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Agent reasoning trace · {message.agentTrace.length} steps
            </button>

            <AnimatePresence>
              {traceExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-xl border border-white/5 p-3 flex flex-col gap-2">
                    {message.agentTrace.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-0.5 shrink-0">
                          {step.status === 'done' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-ocean-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <AgentBadge agent={step.agent} />
                            <span className="text-[10px] text-ocean-300 font-medium">{step.action}</span>
                            <span className="text-[10px] text-ocean-600 ml-auto">{step.duration_ms}ms</span>
                          </div>
                          <p className="text-[10px] text-ocean-500 leading-relaxed">{step.detail}</p>
                          {step.sources && step.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {step.sources.map(src => (
                                <span key={src} className="text-[9px] px-1.5 py-0.5 bg-ocean-800 text-ocean-400 rounded-full">
                                  {src}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-ocean-600">
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
