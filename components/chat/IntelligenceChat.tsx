<<<<<<< HEAD
"use client";

import { useState } from 'react';
import { Send, MapPin, Loader2, Globe, Languages, Route as RouteIcon, FileText, BrainCircuit } from 'lucide-react';
import { useAppStore } from '../../lib/store';
=======
import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, Globe, Languages, Route as RouteIcon, FileText, BrainCircuit, Mic, MicOff, AlertTriangle, ChevronDown, Check, ShieldCheck, Compass, Info } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useMapStore } from '../../lib/store/mapStore';
import { useGeolocation } from '../../lib/geo/useGeolocation';
import { LANGUAGES, getSpeechLangCode, getLanguageName, getAllLanguageCodes, type LanguageCode } from '../../lib/languages';
import { apiService, BackendAgentStep } from '../../services/api';
>>>>>>> frontend-changes
import { ExplainModal } from './ExplainModal';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'planning' | 'retrieving' | 'correlating' | 'generating' | 'complete';
<<<<<<< HEAD
  type?: 'text' | 'pfz_card' | 'route_card';
  data?: any;
=======
  type?: 'text' | 'pfz_card' | 'route_card' | 'conflict_card' | 'hazard_card' | 'advisory_card';
  data?: any;
  agentSteps?: { name: string, content: string }[];
>>>>>>> frontend-changes
};

export function IntelligenceChat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
<<<<<<< HEAD
  const [language, setLanguage] = useState('ENG');
  
=======
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Language Selector Dropdown State
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

>>>>>>> frontend-changes
  // Explainable AI Modal State
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainData, setExplainData] = useState<any>(null);

  // Inline Message Expansions (Sources / Reasoning)
  const [expandedMsg, setExpandedMsg] = useState<{ id: string, type: 'sources' | 'reasoning' } | null>(null);

<<<<<<< HEAD
  const { setGlobeTarget, setRoutePath } = useAppStore();
=======
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
>>>>>>> frontend-changes
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'ORCA Intelligence initialized. How can I assist with marine data analysis today?',
      type: 'text',
      status: 'complete'
    }
  ]);

<<<<<<< HEAD
  const submitQuery = (text: string) => {
    if (!text.trim() || isTyping) return;

    const query = text.trim();
    const isRouteQuery = query.toLowerCase().includes('route') || query.toLowerCase().includes('path');
=======
  const submitQuery = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const query = text.trim();
>>>>>>> frontend-changes

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

<<<<<<< HEAD
    // Simulate agent process
=======
>>>>>>> frontend-changes
    const agentMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: agentMsgId,
      role: 'assistant',
      content: '',
      status: 'planning',
      type: 'text'
    }]);

<<<<<<< HEAD
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
=======
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
>>>>>>> frontend-changes
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

<<<<<<< HEAD
  const cycleLanguage = () => {
    const langs = ['ENG', 'HIN', 'TAM', 'BEN'];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
=======
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
>>>>>>> frontend-changes
  };

  return (
    <>
<<<<<<< HEAD
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
=======
      <div className="flex flex-col h-full w-full bg-space-950 border-r border-space-800 flex-shrink-0 relative z-20">
        
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

>>>>>>> frontend-changes
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
<<<<<<< HEAD
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
                          <span>{msg.status === 'generating' ? 'Applying safety geofences...' : (msg.status === 'complete' ? 'Done' : 'Waiting')}</span>
                        </div>
=======
                <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900/90 text-slate-100 px-5 py-3.5 rounded-2xl rounded-tr-xs max-w-[85%] text-sm leading-relaxed border border-cyan-500/20 shadow-lg shadow-cyan-950/30">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full space-y-3">
                  
                  {/* Multi-Agent Orchestration Visualizer */}
                  {msg.status && msg.status !== 'complete' && (
                    <div className="relative overflow-hidden bg-[#040c1d]/90 border border-cyan-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                      <div className="text-xs font-semibold text-cyan-300 mb-2.5 flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin text-teal-400" />
                          <span>ORCA AGENT ORCHESTRATION</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full animate-pulse">
                          PROCESSING
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 text-xs max-h-36 overflow-y-auto pr-1 no-scrollbar">
                        {!msg.agentSteps || msg.agentSteps.length === 0 ? (
                           <div className="text-slate-400 flex items-center gap-2 italic text-[11px]">
                             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                             Initializing satellite agent swarm...
                           </div>
                        ) : (
                           msg.agentSteps.map((step, i) => (
                             <div key={i} className="flex items-start gap-2 text-slate-300 bg-[#020612]/60 border border-slate-800/60 p-2 rounded-xl text-[11px]">
                               <span className="text-teal-400 font-bold font-mono shrink-0">[{step.name}]</span>
                               <span className="text-slate-300 truncate">{step.content}</span>
                             </div>
                           ))
                        )}
>>>>>>> frontend-changes
                      </div>
                    </div>
                  )}

                  {/* Agent Text Content */}
                  {msg.content && (msg.type === 'text' || msg.type === 'pfz_card' || msg.type === 'route_card') && (
<<<<<<< HEAD
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
=======
                    <div className="bg-[#040c1d]/80 border border-slate-800/80 rounded-2xl p-4 text-slate-200 text-sm leading-relaxed shadow-lg backdrop-blur-md">
                      {msg.content}
                      {msg.status === 'complete' && msg.role === 'assistant' && (
                        <>
                          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                            <button 
                              className={`flex items-center gap-1.5 text-[11px] font-medium transition-all px-3 py-1.5 rounded-xl border ${expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30'}`}
                              onClick={() => setExpandedMsg(expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' ? null : { id: msg.id, type: 'sources' })}
                            >
                              <FileText size={13} />
                              Verified Sources
                            </button>
                            <button 
                              className={`flex items-center gap-1.5 text-[11px] font-medium transition-all px-3 py-1.5 rounded-xl border ${expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-sm' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-teal-300 hover:border-teal-500/30'}`}
                              onClick={() => setExpandedMsg(expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' ? null : { id: msg.id, type: 'reasoning' })}
                            >
                              <BrainCircuit size={13} />
                              Agent Reasoning
>>>>>>> frontend-changes
                            </button>
                          </div>

                          {/* Inline Popups */}
                          {expandedMsg?.id === msg.id && expandedMsg?.type === 'sources' && (
<<<<<<< HEAD
                            <div className="mt-2 p-3 bg-space-900/80 border border-cyan-900/30 rounded text-xs text-slate-300 shadow-inner">
                              <span className="font-semibold text-cyan-500 block mb-1">Data Sources Utilized:</span>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>ISRO Oceansat-3 (SST, Chlorophyll-a parameters)</li>
                                <li>INCOIS Ocean State Forecasts</li>
                                <li>NOAA Global Forecast System (GFS)</li>
=======
                            <div className="mt-3 p-3.5 bg-[#020612] border border-cyan-500/30 rounded-xl text-xs text-slate-300 shadow-xl space-y-1.5">
                              <span className="font-semibold text-cyan-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <Check size={13} className="text-cyan-400" /> Data Sources Synthesized:
                              </span>
                              <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                                <li>ISRO Oceansat-3 (SST, Chlorophyll-a parameters)</li>
                                <li>INCOIS Ocean State Forecasts & Warnings</li>
                                <li>NOAA Global Forecast System (GFS) Weather Model</li>
>>>>>>> frontend-changes
                              </ul>
                            </div>
                          )}

                          {expandedMsg?.id === msg.id && expandedMsg?.type === 'reasoning' && (
<<<<<<< HEAD
                            <div className="mt-2 p-3 bg-space-900/80 border border-teal-900/30 rounded text-xs text-slate-300 shadow-inner">
                              <span className="font-semibold text-teal-500 block mb-1">Agentic Reasoning Trace:</span>
                              <div className="space-y-1">
                                <p><span className="text-slate-500">[1]</span> Interpreted intent via PlannerAgent.</p>
                                <p><span className="text-slate-500">[2]</span> DataDiscoveryAgent cross-referenced spatial coordinates with satellite feeds.</p>
                                <p><span className="text-slate-500">[3]</span> OceanAnalyticsAgent applied predictive models to identify correlations.</p>
                                <p><span className="text-slate-500">[4]</span> RiskAssessmentAgent verified safety against prevailing weather patterns.</p>
=======
                            <div className="mt-3 p-3.5 bg-[#020612] border border-teal-500/30 rounded-xl text-xs text-slate-300 shadow-xl space-y-1.5">
                              <span className="font-semibold text-teal-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <BrainCircuit size={13} className="text-teal-400" /> Reasoning Trace:
                              </span>
                              <div className="space-y-1 text-slate-300 text-xs">
                                <p><span className="text-teal-400 font-mono font-bold">[1]</span> PlannerAgent parsed spatial intent & user domain query.</p>
                                <p><span className="text-teal-400 font-mono font-bold">[2]</span> DataDiscoveryAgent retrieved live satellite rasters.</p>
                                <p><span className="text-teal-400 font-mono font-bold">[3]</span> OceanAnalyticsAgent computed thermal/biological gradients.</p>
                                <p><span className="text-teal-400 font-mono font-bold">[4]</span> RiskAssessmentAgent verified safety index & wave vectors.</p>
>>>>>>> frontend-changes
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* PFZ Card */}
                  {msg.type === 'pfz_card' && msg.data && (
<<<<<<< HEAD
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
=======
                    <div className="w-full bg-[#040c1d]/90 border border-white/10 hover:border-cyan-500/40 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold text-sm tracking-wide">
                              {msg.data.id || msg.data.name || 'PFZ Zone Identified'}
                            </div>
                            <div className="text-[11px] text-slate-400">Potential Fishing Zone Assessment</div>
                          </div>
                        </div>
                        <div className="bg-teal-500/15 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                          {msg.data.suitability ?? '--'}% MATCH
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 my-4">
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Safety Index</div>
                           <div className="text-slate-100 text-base font-bold flex items-baseline gap-1">
                             <span className="text-emerald-400">{msg.data.safety ?? '--'}%</span>
                             <span className="text-[10px] font-normal text-slate-400">Optimal</span>
                           </div>
                         </div>
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Sea Temp (SST)</div>
                           <div className="text-slate-100 text-base font-bold">
                             {msg.data.sst ?? '--'}°C
                           </div>
                         </div>
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Chlorophyll-a</div>
                           <div className="text-teal-300 text-base font-bold">
                             {msg.data.chlorophyll ?? '--'}
                           </div>
                         </div>
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Coordinates</div>
                           <div className="text-cyan-300 text-xs font-mono font-semibold mt-1">
                             {msg.data.lat ?? '--'}° N, {msg.data.lon ?? '--'}° E
                           </div>
                         </div>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                         <button 
                           onClick={() => setGlobeTarget({
                             lat: Number(msg.data.lat) || 0, 
                             lon: Number(msg.data.lon) || 0,
                             title: msg.data.name || msg.data.id || 'Unknown',
                             severity: 'info',
                             desc: `Suitability: ${msg.data.suitability ?? '--'}% | Safety: ${msg.data.safety ?? '--'}% | SST: ${msg.data.sst ?? '--'}°C`
                           })}
                           className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                         >
                           <Compass size={14} />
                           View on Map
                         </button>
                         <button 
                           onClick={() => handleWhyThisZone(msg.data)}
                           className="flex-1 py-2.5 px-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-cyan-300 hover:text-cyan-200 text-xs font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                         >
                           <Info size={14} />
                           Why This Zone?
>>>>>>> frontend-changes
                         </button>
                      </div>
                    </div>
                  )}

                  {/* Route Card */}
                  {msg.type === 'route_card' && msg.data && (
<<<<<<< HEAD
                    <div className="mt-3 w-full glass-panel p-5 rounded-md flex flex-col gap-4 shadow-lg border-l-2 border-l-teal-500">
                      
                      <div className="flex justify-between items-center border-b border-space-800 pb-3">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <RouteIcon size={16} className="text-teal-500" />
                          ROUTE OPTIMIZED
                        </div>
                        <div className="tech-mono text-xs font-bold text-amber-500">
=======
                    <div className="w-full bg-[#040c1d]/90 border border-white/10 hover:border-teal-500/40 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                            <RouteIcon size={18} />
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold text-sm tracking-wide">
                              Safe Navigational Route
                            </div>
                            <div className="text-[11px] text-slate-400">Optimized Waypoints</div>
                          </div>
                        </div>
                        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1">
                          <ShieldCheck size={12} />
>>>>>>> frontend-changes
                          HAZARD AVOIDED
                        </div>
                      </div>

<<<<<<< HEAD
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
=======
                      <div className="grid grid-cols-2 gap-3 my-4">
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Total Distance</div>
                           <div className="text-slate-100 text-base font-bold">{msg.data.distance}</div>
                         </div>
                         <div className="bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Est. Transit Time</div>
                           <div className="text-slate-100 text-base font-bold">{msg.data.eta}</div>
                         </div>
                         <div className="col-span-2 bg-[#020612]/80 border border-slate-800/80 p-3 rounded-xl">
                           <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Avoided Danger</div>
                           <div className="text-rose-400 text-xs font-semibold flex items-center gap-1.5">
                             <AlertTriangle size={13} className="shrink-0" />
                             {msg.data.hazard}
                           </div>
                         </div>
                      </div>

                      <div className="pt-1">
                         <button 
                           onClick={() => setRoutePath(msg.data.path)}
                           className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-teal-950/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                         >
                           <RouteIcon size={14} />
                           Plot Route on Interactive Globe
>>>>>>> frontend-changes
                         </button>
                      </div>
                    </div>
                  )}

<<<<<<< HEAD
=======
                  {/* Conflict Card */}
                  {msg.type === 'conflict_card' && msg.data && (
                    <div className="w-full bg-[#040c1d]/90 border border-amber-500/30 hover:border-amber-500/50 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                            <AlertTriangle size={18} />
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold text-sm tracking-wide">
                              Multi-Source Discrepancy
                            </div>
                            <div className="text-[11px] text-slate-400">Conflicting Sensor Evidence</div>
                          </div>
                        </div>
                        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                          REVIEW NEEDED
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                         <div className="p-3.5 bg-[#020612]/90 border border-slate-800/80 rounded-xl space-y-1">
                           <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{msg.data.source1.name}</div>
                           <div className="text-emerald-400 text-xs font-bold">{msg.data.source1.conclusion}</div>
                         </div>
                         <div className="p-3.5 bg-[#020612]/90 border border-slate-800/80 rounded-xl space-y-1">
                           <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{msg.data.source2.name}</div>
                           <div className="text-rose-400 text-xs font-bold">{msg.data.source2.conclusion}</div>
                         </div>
                      </div>

                      <div className="pt-1">
                         <button 
                           onClick={() => { setExplainData(msg.data); setExplainOpen(true); }}
                           className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-950/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                         >
                           <BrainCircuit size={14} />
                           Inspect Conflict Details & Evidence
                         </button>
                      </div>
                    </div>
                  )}

                  {/* Hazard Weather Card */}
                  {msg.type === 'hazard_card' && msg.data && (
                    <div className="w-full bg-[#040c1d]/90 border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold text-sm tracking-wide">
                              {msg.data.status || 'Weather Advisory'}
                            </div>
                            <div className="text-[11px] text-slate-400">Coastal Marine Conditions</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold tracking-wide text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                          COASTAL SAFE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 my-4">
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Wave Height (Hs)</span>
                          <span className="text-emerald-400 font-bold text-base">{msg.data.waveHeight || '1.1 m'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Wind Speed</span>
                          <span className="text-slate-100 font-bold text-base">{msg.data.windSpeed || '11 Kts'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Current Speed</span>
                          <span className="text-cyan-300 font-bold text-base">{msg.data.currentSpeed || '0.6 Kts'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Visibility</span>
                          <span className="text-slate-100 font-bold text-base">{msg.data.visibility || '12.5 KM'}</span>
                        </div>
                      </div>

                      {msg.data.advisory && (
                        <p className="text-xs text-slate-300 bg-[#020612] p-3 rounded-xl border border-slate-800/80 font-normal leading-relaxed">
                          "{msg.data.advisory}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Advisory Overview Card */}
                  {msg.type === 'advisory_card' && msg.data && (
                    <div className="w-full bg-[#040c1d]/90 border border-white/10 hover:border-cyan-500/40 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                            <Globe size={18} />
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold text-sm tracking-wide">
                              {msg.data.title || 'ORCA Satellite Summary'}
                            </div>
                            <div className="text-[11px] text-slate-400">Live Oceanographic Feeds</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold tracking-wide text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 rounded-full">
                          OPERATIONAL
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 my-4">
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">SST Avg</span>
                          <span className="text-slate-100 font-bold text-base">{msg.data.sstAvg || '28.4 °C'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Wind Speed</span>
                          <span className="text-cyan-300 font-bold text-base">{msg.data.windSpeed || '12 Kts'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">Active Sensor Nodes</span>
                          <span className="text-emerald-400 font-bold text-base">{msg.data.activeNodes || '12 NODES'}</span>
                        </div>
                        <div className="bg-[#020612]/80 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block mb-0.5">IMBL Status</span>
                          <span className="text-teal-300 font-bold text-base">{msg.data.imblStatus || 'CLEAR'}</span>
                        </div>
                      </div>

                      {msg.data.recommendation && (
                        <p className="text-xs text-slate-300 bg-[#020612] p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {msg.data.recommendation}
                        </p>
                      )}
                    </div>
                  )}

>>>>>>> frontend-changes
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
<<<<<<< HEAD
              "Cyclone alerts in Bay of Bengal",
=======
              "Show conflicting evidence",
>>>>>>> frontend-changes
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
<<<<<<< HEAD
              className="w-full bg-space-900 border border-space-700 text-white rounded-lg pl-4 pr-12 py-4 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 text-sm shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 text-slate-400 hover:text-cyan-500 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
=======
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
>>>>>>> frontend-changes
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
