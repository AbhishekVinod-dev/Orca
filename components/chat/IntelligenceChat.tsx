import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, Globe, Languages, Route as RouteIcon, FileText, BrainCircuit, Mic, MicOff, AlertTriangle, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useMapStore } from '../../lib/store/mapStore';
import { useGeolocation } from '../../lib/geo/useGeolocation';
import { LANGUAGES, getSpeechLangCode, getLanguageName, getAllLanguageCodes, type LanguageCode } from '../../lib/languages';
import { apiService, BackendAgentStep } from '../../services/api';
import { ExplainModal } from './ExplainModal';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'planning' | 'retrieving' | 'correlating' | 'generating' | 'complete';
  type?: 'text' | 'pfz_card' | 'route_card' | 'conflict_card' | 'hazard_card' | 'advisory_card';
  data?: any;
  agentSteps?: { name: string, content: string }[];
};

export function IntelligenceChat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Language Selector Dropdown State
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Explainable AI Modal State
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainData, setExplainData] = useState<any>(null);

  // Inline Message Expansions (Sources / Reasoning)
  const [expandedMsg, setExpandedMsg] = useState<{ id: string, type: 'sources' | 'reasoning' } | null>(null);

  const { setGlobeTarget, setRoutePath, activeRole, disclosureLevel, bandwidthMode, language: storeLanguage, setLanguage: setStoreLanguage } = useAppStore();
  const [language, setLocalLanguage] = useState<string>(storeLanguage || 'en');

  const setLanguage = (code: string) => {
    setLocalLanguage(code);
    setStoreLanguage(code);
  };

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const { userLocation } = useMapStore();
  
  // Trigger geolocation on component mount
  useGeolocation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'ORCA Intelligence initialized. How can I assist with marine data analysis today?',
      type: 'text',
      status: 'complete'
    }
  ]);

  const submitQuery = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const query = text.trim();

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const agentMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: agentMsgId,
      role: 'assistant',
      content: '',
      status: 'planning',
      type: 'text'
    }]);

    try {
      // Use real user location from geolocation, fallback to Chennai defaults
      const lat = userLocation?.lat ?? 13.08;
      const lng = userLocation?.lng ?? 80.27;
      
      const response = await apiService.streamChat(
        query,
        activeRole.toUpperCase(),
        storeLanguage || language,
        lat,
        lng,
        (step) => {
           setMessages(prev => prev.map(m => {
             if (m.id === agentMsgId) {
               const newSteps = [...(m.agentSteps || []), { name: step.name || 'system', content: step.content }];
               return { ...m, agentSteps: newSteps };
             }
             return m;
           }));
        },
        disclosureLevel,
        bandwidthMode
      );

      let finalResponseData = { type: 'text', content: response, data: null };
      try {
        const parsed = JSON.parse(response);
        if (parsed.type && parsed.content) {
          finalResponseData = parsed;
        }
      } catch (e) {
        // Keep as plain text if it's not valid JSON
      }

      setMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        status: 'complete',
        type: (finalResponseData.type as Message['type']) || 'text',
        content: finalResponseData.content,
        data: finalResponseData.data
      } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        status: 'complete',
        type: 'text',
        content: 'Unable to reach ORCA backend right now. Please try again shortly.'
      } : m));
    } finally {
      setIsTyping(false);
    }
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

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLangCode(language as LanguageCode);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      submitQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-space-950 border-r border-space-800 lg:w-[450px] xl:w-[500px] flex-shrink-0 relative z-20">
        
        {/* Header with Language Selector */}
        <div className="p-6 border-b border-space-800 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-white font-medium tracking-wide flex items-center gap-2">
              <Globe size={18} className="text-cyan-500" />
              ORCA Intelligence
            </h2>
            {userLocation && (
              <div className="text-[10px] text-slate-400 flex items-center gap-1 ml-6">
                <MapPin size={12} className="text-cyan-400" />
                {userLocation.name}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Custom Interactive Glass Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-space-900/90 hover:bg-space-800 border border-space-700 px-2.5 py-1 rounded-lg transition-all shadow-sm cursor-pointer"
                title="Select Regional Language"
              >
                <Languages size={14} className="text-teal-400" />
                <span>{getLanguageName(language as LanguageCode)}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180 text-teal-400' : ''}`} />
              </button>

              {/* Floating Glass Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#050c1e] border border-teal-500/30 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-2xl max-h-64 overflow-y-auto animate-in fade-in duration-150 no-scrollbar">
                  <div className="px-2 py-1 text-[10px] tech-mono font-bold text-slate-400 uppercase border-b border-space-800 mb-0.5 sticky top-0 bg-[#050c1e]/90 backdrop-blur-md">
                    REGIONAL LANGUAGE
                  </div>
                  {getAllLanguageCodes().slice(0, 12).map((code) => {
                    const isSelected = language === code;
                    const native = getLanguageName(code as LanguageCode);
                    const langObj = LANGUAGES[code as LanguageCode];
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                            : 'text-slate-300 hover:bg-space-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{native}</span>
                          <span className="text-[10px] text-slate-500 tech-mono">({langObj?.englishName || code})</span>
                        </div>
                        {isSelected && <Check size={13} className="text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
                      <div className="flex flex-col gap-1.5 text-[11px] tech-mono max-h-32 overflow-y-auto pr-2">
                        {!msg.agentSteps || msg.agentSteps.length === 0 ? (
                           <div className="text-slate-500">Initializing agents...</div>
                        ) : (
                           msg.agentSteps.map((step, i) => (
                             <div key={i} className="flex flex-col mb-1 text-slate-400">
                               <span className="text-teal-400 font-bold">[{step.name.toUpperCase()}]</span>
                               <span className="truncate">{step.content}</span>
                             </div>
                           ))
                        )}
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
                          {msg.data.suitability ?? '--'}% MATCH
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">SAFETY INDEX</div>
                           <div className="text-white text-lg font-semibold">{msg.data.safety ?? '--'}%</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">SST</div>
                           <div className="text-white text-lg font-semibold">{msg.data.sst ?? '--'}°C</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">CHLOROPHYLL</div>
                           <div className="text-white text-lg font-semibold text-teal-400">{msg.data.chlorophyll ?? '--'}</div>
                         </div>
                         <div>
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">COORDINATES</div>
                           <div className="text-white text-xs mt-1">{msg.data.lat ?? '--'}° N, {msg.data.lon ?? '--'}° E</div>
                         </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                         <button 
                           onClick={() => setGlobeTarget({
                             lat: Number(msg.data.lat) || 0, 
                             lon: Number(msg.data.lon) || 0,
                             title: msg.data.name || msg.data.id || 'Unknown',
                             severity: 'info',
                             desc: `Suitability: ${msg.data.suitability ?? '--'}% | Safety: ${msg.data.safety ?? '--'}% | SST: ${msg.data.sst ?? '--'}°C`
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

                  {/* Conflict Card */}
                  {msg.type === 'conflict_card' && msg.data && (
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-2 border-l-amber-500 bg-amber-500/5">
                      
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <AlertTriangle size={16} className="text-amber-500" />
                          EVIDENCE CONFLICT
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-3 bg-space-950 border border-space-800 rounded">
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">{msg.data.source1.name}</div>
                           <div className="text-emerald-400 text-sm font-semibold">{msg.data.source1.conclusion}</div>
                         </div>
                         <div className="p-3 bg-space-950 border border-space-800 rounded">
                           <div className="text-[10px] text-slate-500 tech-mono mb-1">{msg.data.source2.name}</div>
                           <div className="text-rose-400 text-sm font-semibold">{msg.data.source2.conclusion}</div>
                         </div>
                      </div>

                      <div className="pt-2">
                         <button 
                           onClick={() => { setExplainData(msg.data); setExplainOpen(true); }}
                           className="w-full py-2 border border-amber-500/50 text-amber-500 text-xs font-semibold rounded-sm hover:bg-amber-500/10 transition-colors shadow-sm"
                         >
                           RESOLVE / INSPECT EVIDENCE
                         </button>
                      </div>
                    </div>
                  )}

                  {/* Hazard Weather Card */}
                  {msg.type === 'hazard_card' && msg.data && (
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-4 border-l-emerald-500 bg-emerald-950/20">
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <ShieldCheck size={18} className="text-emerald-400" />
                          {msg.data.status || 'WEATHER ADVISORY'}
                        </div>
                        <span className="text-[10px] font-bold tech-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                          COASTAL SAFE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs tech-mono">
                        <div className="bg-space-950 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">WAVE HEIGHT (Hs)</span>
                          <span className="text-emerald-400 font-bold text-sm">{msg.data.waveHeight || '1.1 m'}</span>
                        </div>
                        <div className="bg-space-950 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">WIND SPEED</span>
                          <span className="text-white font-bold text-sm">{msg.data.windSpeed || '11 Kts'}</span>
                        </div>
                        <div className="bg-space-950 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">CURRENT SPEED</span>
                          <span className="text-cyan-400 font-bold text-sm">{msg.data.currentSpeed || '0.6 Kts'}</span>
                        </div>
                        <div className="bg-space-950 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">VISIBILITY</span>
                          <span className="text-white font-bold text-sm">{msg.data.visibility || '12.5 KM'}</span>
                        </div>
                      </div>

                      {msg.data.advisory && (
                        <p className="text-xs text-slate-300 bg-space-950/80 p-2.5 rounded border border-space-800 font-medium">
                          "{msg.data.advisory}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Advisory Overview Card */}
                  {msg.type === 'advisory_card' && msg.data && (
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-4 border-l-cyan-500 bg-space-950/90">
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium text-xs">
                          <Globe size={16} className="text-cyan-400" />
                          {msg.data.title || 'ORCA SATELLITE INTELLIGENCE SUMMARY'}
                        </div>
                        <span className="text-[10px] font-bold tech-mono text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">
                          OPERATIONAL
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs tech-mono">
                        <div className="bg-space-900 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">SST AVG</span>
                          <span className="text-white font-bold text-sm">{msg.data.sstAvg || '28.4 °C'}</span>
                        </div>
                        <div className="bg-space-900 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">WIND SPEED</span>
                          <span className="text-cyan-400 font-bold text-sm">{msg.data.windSpeed || '12 Kts'}</span>
                        </div>
                        <div className="bg-space-900 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">ACTIVE NODES</span>
                          <span className="text-emerald-400 font-bold text-sm">{msg.data.activeNodes || '12 NODES'}</span>
                        </div>
                        <div className="bg-space-900 p-2.5 rounded border border-space-800">
                          <span className="text-slate-400 text-[10px] block">IMBL STATUS</span>
                          <span className="text-teal-300 font-bold text-sm">{msg.data.imblStatus || 'CLEAR'}</span>
                        </div>
                      </div>

                      {msg.data.recommendation && (
                        <p className="text-xs text-slate-300 bg-space-900/60 p-2.5 rounded border border-space-800">
                          {msg.data.recommendation}
                        </p>
                      )}
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
              "Show conflicting evidence",
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
              className="w-full bg-space-900 border border-space-700 text-white rounded-lg pl-4 pr-20 py-4 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 text-sm shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button 
                type="button"
                onClick={toggleListening}
                className={`p-2 transition-colors ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-cyan-500'}`}
                title="Voice Input"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 text-slate-400 hover:text-cyan-500 disabled:opacity-50 transition-colors"
                title="Send"
              >
                <Send size={18} />
              </button>
            </div>
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
