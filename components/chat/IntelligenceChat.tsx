"use client";

import { useState } from 'react';
import { Send, MapPin, Loader2, Globe, Languages, Route as RouteIcon, FileText, BrainCircuit } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { ExplainModal } from './ExplainModal';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'planning' | 'retrieving' | 'correlating' | 'generating' | 'complete';
  type?: 'text' | 'pfz_card' | 'route_card';
  data?: any;
};

export function IntelligenceChat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('ENG');
  
  // Explainable AI Modal State
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainData, setExplainData] = useState<any>(null);

  // Inline Message Expansions (Sources / Reasoning)
  const [expandedMsg, setExpandedMsg] = useState<{ id: string, type: 'sources' | 'reasoning' } | null>(null);

  const { setGlobeTarget, setRoutePath } = useAppStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'ORCA Intelligence initialized. How can I assist with marine data analysis today?',
      type: 'text',
      status: 'complete'
    }
  ]);

  const submitQuery = (text: string) => {
    if (!text.trim() || isTyping) return;

    const query = text.trim();
    const isRouteQuery = query.toLowerCase().includes('route') || query.toLowerCase().includes('path');

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate agent process
    const agentMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: agentMsgId,
      role: 'assistant',
      content: '',
      status: 'planning',
      type: 'text'
    }]);

    // Simulate Multi-Agent Transitions
    setTimeout(() => updateMsgStatus(agentMsgId, 'retrieving'), 1000);
    setTimeout(() => updateMsgStatus(agentMsgId, 'correlating'), 2500);
    setTimeout(() => updateMsgStatus(agentMsgId, 'generating'), 4000);
    
    // Final response
    setTimeout(() => {
      if (isRouteQuery) {
        setMessages(prev => prev.map(m => m.id === agentMsgId ? {
          ...m,
          status: 'complete',
          type: 'route_card',
          content: 'Safe route plotted. Avoiding severe cyclonic system in the Bay of Bengal.',
          data: {
            id: 'ROUTE-7A',
            distance: '450 NM',
            eta: '36 Hours',
            hazard: 'Cyclone Warning Zone',
            path: [
              [13.0, 80.2], // Chennai
              [14.5, 82.0], // Waypoint 1 (avoiding hazard)
              [16.5, 84.0], // Waypoint 2
              [17.6, 83.2]  // Vizag
            ]
          }
        } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === agentMsgId ? {
          ...m,
          status: 'complete',
          type: 'pfz_card',
          content: 'Analysis complete. Displaying optimal prime fishing zone data based on SST and Chlorophyll-a convergence.',
          data: {
            id: 'PFZ 04',
            suitability: 87,
            safety: 94,
            sst: 28.4,
            chlorophyll: 'HIGH',
            lat: 10.421,
            lon: 76.912
          }
        } : m));
      }
      setIsTyping(false);
    }, 5500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(input);
  };

  const updateMsgStatus = (id: string, status: Message['status']) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleWhyThisZone = (data: any) => {
    setExplainData(data);
    setExplainOpen(true);
  };

  const cycleLanguage = () => {
    const langs = ['ENG', 'HIN', 'TAM', 'BEN'];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-space-950 border-r border-space-800 lg:w-[450px] xl:w-[500px] flex-shrink-0 relative z-20">
        
        {/* Header with Language Selector */}
        <div className="p-6 border-b border-space-800 flex items-center justify-between">
          <h2 className="text-white font-medium tracking-wide flex items-center gap-2">
            <Globe size={18} className="text-cyan-500" />
            ORCA Intelligence
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={cycleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-space-800 hover:bg-space-700 px-2 py-1 rounded-sm transition-colors"
              title="Regional Language Support"
            >
              <Languages size={14} />
              {language}
            </button>
            <div className="flex items-center gap-2 text-[10px] tech-mono text-cyan-500">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              SAT.LINK ACTIVE
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Message Bubble/Content */}
              {msg.role === 'user' ? (
                <div className="bg-space-800 text-slate-200 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm leading-relaxed shadow-md">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full">
                  
                  {/* Multi-Agent Orchestration Visualizer */}
                  {msg.status && msg.status !== 'complete' && (
                    <div className="flex flex-col gap-2 mb-4 bg-space-900/50 p-4 rounded-md border border-space-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-teal-500" />
                        AGENTIC ORCHESTRATION IN PROGRESS
                      </div>
                      <div className="flex flex-col gap-1.5 text-[11px] tech-mono">
                        <div className={`flex justify-between ${msg.status === 'planning' ? 'text-teal-400 font-bold' : 'text-slate-500'}`}>
                          <span>[PlannerAgent]</span>
                          <span>{msg.status === 'planning' ? 'Decomposing query...' : 'Done'}</span>
                        </div>
                        <div className={`flex justify-between ${(msg.status === 'retrieving' || msg.status === 'planning') ? (msg.status === 'retrieving' ? 'text-teal-400 font-bold' : 'text-slate-600') : 'text-slate-500'}`}>
                          <span>[DataDiscoveryAgent]</span>
                          <span>{msg.status === 'retrieving' ? 'Fetching ISRO SAT Data...' : (msg.status === 'planning' ? 'Waiting' : 'Done')}</span>
                        </div>
                        <div className={`flex justify-between ${(msg.status === 'correlating' || msg.status === 'planning' || msg.status === 'retrieving') ? (msg.status === 'correlating' ? 'text-cyan-400 font-bold' : 'text-slate-600') : 'text-slate-500'}`}>
                          <span>[OceanAnalyticsAgent] & [WeatherAgent]</span>
                          <span>{msg.status === 'correlating' ? 'Fusing spatial models...' : (msg.status !== 'generating' ? 'Waiting' : 'Done')}</span>
                        </div>
                        <div className={`flex justify-between ${msg.status === 'generating' ? 'text-teal-400 font-bold' : 'text-slate-600'}`}>
                          <span>[RiskAssessmentAgent]</span>
                          <span>{msg.status === 'generating' ? 'Applying safety geofences...' : 'Waiting'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agent Text Content */}
                  {msg.content && (msg.type === 'text' || msg.type === 'pfz_card' || msg.type === 'route_card') && (
                    <div className="text-slate-300 text-sm leading-relaxed pr-8">
                      {msg.content}
                      {msg.status === 'complete' && msg.role === 'assistant' && (
                        <>
                          <div className="mt-3 flex gap-2">
                            <button 
                              className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors px-2 py-1 rounded border ${expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' ? 'bg-space-800 border-cyan-500/50 text-cyan-400' : 'bg-space-800/40 border-space-700/50 text-slate-400 hover:text-cyan-400 hover:bg-space-800'}`}
                              onClick={() => setExpandedMsg(expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' ? null : { id: msg.id, type: 'sources' })}
                            >
                              <FileText size={12} />
                              View Sources
                            </button>
                            <button 
                              className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors px-2 py-1 rounded border ${expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' ? 'bg-space-800 border-teal-500/50 text-teal-400' : 'bg-space-800/40 border-space-700/50 text-slate-400 hover:text-teal-400 hover:bg-space-800'}`}
                              onClick={() => setExpandedMsg(expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' ? null : { id: msg.id, type: 'reasoning' })}
                            >
                              <BrainCircuit size={12} />
                              Show Reasoning
                            </button>
                          </div>

                          {/* Inline Popups */}
                          {expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' && (
                            <div className="mt-2 p-3 bg-space-900/80 border border-cyan-900/30 rounded text-xs text-slate-300 shadow-inner">
                              <span className="font-semibold text-cyan-500 block mb-1">Data Sources Utilized:</span>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>ISRO Oceansat-3 (SST, Chlorophyll-a parameters)</li>
                                <li>INCOIS Ocean State Forecasts</li>
                                <li>NOAA Global Forecast System (GFS)</li>
                              </ul>
                            </div>
                          )}

                          {expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' && (
                            <div className="mt-2 p-3 bg-space-900/80 border border-teal-900/30 rounded text-xs text-slate-300 shadow-inner">
                              <span className="font-semibold text-teal-500 block mb-1">Agentic Reasoning Trace:</span>
                              <div className="space-y-1">
                                <p><span className="text-slate-500">[1]</span> Interpreted intent via PlannerAgent.</p>
                                <p><span className="text-slate-500">[2]</span> DataDiscoveryAgent cross-referenced spatial coordinates with satellite feeds.</p>
                                <p><span className="text-slate-500">[3]</span> OceanAnalyticsAgent applied predictive models to identify correlations.</p>
                                <p><span className="text-slate-500">[4]</span> RiskAssessmentAgent verified safety against prevailing weather patterns.</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* PFZ Card */}
                  {msg.type === 'pfz_card' && msg.data && (
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-2 border-l-cyan-500">
                      
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <MapPin size={16} className="text-cyan-500" />
                          {msg.data.id} IDENTIFIED
                        </div>
                        <div className="tech-mono text-xs font-bold text-teal-400">
                          {msg.data.suitability}% MATCH
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">SAFETY INDEX</div>
                           <div className="text-white text-lg font-semibold">{msg.data.safety}%</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">SST</div>
                           <div className="text-white text-lg font-semibold">{msg.data.sst}°C</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">CHLOROPHYLL</div>
                           <div className="text-white text-lg font-semibold text-teal-400">{msg.data.chlorophyll}</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">COORDINATES</div>
                           <div className="text-white text-xs mt-1">{msg.data.lat}° N, {msg.data.lon}° E</div>
                         </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                         <button 
                           onClick={() => setGlobeTarget({
                             lat: msg.data.lat, 
                             lon: msg.data.lon,
                             title: msg.data.id,
                             severity: 'info',
                             desc: `Suitability: ${msg.data.suitability}% | Safety: ${msg.data.safety}% | SST: ${msg.data.sst}°C`
                           })}
                           className="flex-1 py-2 bg-white text-space-950 text-xs font-semibold rounded-sm hover:bg-slate-200 transition-colors shadow-sm"
                         >
                           VIEW ON MAP
                         </button>
                         <button 
                           onClick={() => handleWhyThisZone(msg.data)}
                           className="flex-1 py-2 border border-space-700 text-cyan-400 text-xs font-medium rounded-sm hover:bg-space-800 transition-colors shadow-sm"
                         >
                           WHY THIS ZONE?
                         </button>
                      </div>
                    </div>
                  )}

                  {/* Route Card */}
                  {msg.type === 'route_card' && msg.data && (
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-2 border-l-teal-500">
                      
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <RouteIcon size={16} className="text-teal-500" />
                          ROUTE OPTIMIZED
                        </div>
                        <div className="tech-mono text-xs font-bold text-amber-500">
                          HAZARD AVOIDED
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">DISTANCE</div>
                           <div className="text-white font-semibold">{msg.data.distance}</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">EST. TIME</div>
                           <div className="text-white font-semibold">{msg.data.eta}</div>
                         </div>
                         <div className="col-span-2">
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">AVOIDING</div>
                           <div className="text-rose-400 text-sm font-medium">{msg.data.hazard}</div>
                         </div>
                      </div>

                      <div className="pt-2">
                         <button 
                           onClick={() => setRoutePath(msg.data.path)}
                           className="w-full py-2 bg-teal-600 text-white text-xs font-semibold rounded-sm hover:bg-teal-500 transition-colors shadow-sm"
                         >
                           PLOT ROUTE ON MAP
                         </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-space-800 bg-space-950/80 backdrop-blur-md">
          {/* Predefined Questions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
            {[
              "PFZ near me",
              "Is it safe tomorrow?",
              "Cyclone alerts in Bay of Bengal",
              "Safe route to Vizag",
              "Show global SST anomalies"
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => submitQuery(q)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1.5 bg-space-900 border border-space-700 hover:border-cyan-600 hover:bg-space-800 text-slate-300 text-[11px] rounded-full transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ORCA about marine conditions, routes..."
              className="w-full bg-space-900 border border-space-700 text-white rounded-lg pl-4 pr-12 py-4 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 text-sm shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 text-slate-400 hover:text-cyan-500 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-slate-600 tech-mono flex justify-center items-center gap-2">
            <span>ORCA V2.0 / SATELLITE INTELLIGENCE</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>MULTI-AGENT ARCHITECTURE</span>
          </div>
        </div>
      </div>

      <ExplainModal 
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        data={explainData}
      />
    </>
  );
}
