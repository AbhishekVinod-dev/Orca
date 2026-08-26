"use client";

import { MessageSquare, Clock, MapPin } from 'lucide-react';

const mockConversations = [
  { id: 'cv-101', title: 'Kochi Port Logistics & Weather', date: '2023-11-20', location: 'Kochi, India', status: 'archived' },
  { id: 'cv-102', title: 'PFZ Analysis - Block 4A', date: '2023-11-19', location: 'Arabian Sea', status: 'archived' },
  { id: 'cv-103', title: 'Vessel Traffic Anomaly', date: '2023-11-15', location: 'Bay of Bengal', status: 'flagged' },
];

export default function ConversationsPage() {
  return (
    <div className="flex-1 h-full flex flex-col px-12 py-10 relative z-10 bg-space-950">
       <div className="flex items-center gap-4 text-cyan-500 font-medium mb-8">
         <MessageSquare size={24} />
         <span>CONVERSATION ARCHIVES</span>
       </div>
       
       <h1 className="text-3xl font-semibold text-white tracking-wide mb-8">Past Intelligence Briefings</h1>
       
       <div className="flex flex-col gap-4 max-w-4xl">
         {mockConversations.map((conv) => (
           <div key={conv.id} className="glass-panel p-6 rounded-sm flex items-center justify-between cursor-pointer hover:bg-space-900 transition-colors group">
             <div className="flex flex-col gap-2">
               <h3 className="text-white font-medium text-lg group-hover:text-cyan-400 transition-colors">{conv.title}</h3>
               <div className="flex items-center gap-6 text-slate-400 text-sm">
                 <div className="flex items-center gap-2 tech-mono text-xs">
                   <Clock size={14} />
                   {conv.date}
                 </div>
                 <div className="flex items-center gap-2 tech-mono text-xs">
                   <MapPin size={14} />
                   {conv.location}
                 </div>
               </div>
             </div>
             
             <div>
               <span className={`px-3 py-1 rounded-full text-xs font-medium tech-mono border ${
                 conv.status === 'flagged' 
                   ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                   : 'bg-space-800 text-slate-300 border-space-700'
               }`}>
                 {conv.status.toUpperCase()}
               </span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
