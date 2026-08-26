"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, ShieldAlert, Navigation, Layers, Network } from 'lucide-react';

// Prevent SSR for Three.js
const LandingGlobe3D = dynamic(() => import('../components/3d/LandingGlobe3D').then(mod => mod.LandingGlobe3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent flex items-center justify-center text-cyan-500 tech-mono text-sm font-bold tracking-widest">INITIALIZING ORCA...</div>
});

export default function PremiumLandingPage() {
  return (
    <div className="w-full bg-transparent flex flex-col overflow-x-hidden min-h-screen text-white">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center">
        
        {/* Deep Ocean 3D Background */}
        <div className="fixed inset-0 w-full h-full z-0 opacity-80 pointer-events-none">
          <LandingGlobe3D />
        </div>
        
        {/* Overlay gradient for depth */}
        <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-b from-[#020b14]/50 via-transparent to-[#020b14] pointer-events-none"></div>

        {/* Massive ORCA Title */}
        <div className="relative z-10 w-full px-4 flex flex-col items-center justify-center text-center mt-[-10vh]">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[15vw] md:text-[20vw] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-cyan-400 to-teal-800 drop-shadow-[0_0_80px_rgba(6,182,212,0.6)] select-none"
          >
            ORCA
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 mt-4"
          >
            <p className="text-xl md:text-3xl font-medium tracking-wide text-cyan-50 max-w-3xl drop-shadow-md">
              Agentic Marine Intelligence Platform
            </p>
            
            <p className="text-sm md:text-lg text-cyan-200/80 max-w-2xl font-light mb-8">
              Transforming raw satellite telemetry and oceanographic data into conversational, autonomous, and explainable insights.
            </p>

            <Link href="/app">
              <button className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#020b14] font-extrabold tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                ENTER WORKSPACE <ArrowRight size={24} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="relative z-10 w-full py-32 px-8 bg-gradient-to-b from-transparent to-[#020b14] flex justify-center">
         <div className="max-w-7xl w-full">
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Core Capabilities</h2>
              <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
               {/* Card 1 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                 className="bg-[#051525]/80 backdrop-blur-md border border-cyan-900/50 p-8 rounded-xl hover:border-cyan-500/50 hover:bg-[#071d33]/90 transition-all group shadow-lg"
               >
                  <div className="w-14 h-14 rounded-full bg-cyan-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Bot size={28} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Conversational AI</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">
                    Interact naturally with marine data. Ask questions, explore scenarios in multiple regional languages, and receive synthesized insights instantly.
                  </p>
               </motion.div>

               {/* Card 2 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                 className="bg-[#051525]/80 backdrop-blur-md border border-teal-900/50 p-8 rounded-xl hover:border-teal-500/50 hover:bg-[#071d33]/90 transition-all group shadow-lg"
               >
                  <div className="w-14 h-14 rounded-full bg-teal-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Network size={28} className="text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Agentic Orchestration</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">
                    Autonomous collaboration between specialized AI agents (Weather, Ocean Analytics, Geospatial) to decompose complex queries and execute plans.
                  </p>
               </motion.div>

               {/* Card 3 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                 className="bg-[#051525]/80 backdrop-blur-md border border-amber-900/50 p-8 rounded-xl hover:border-amber-500/50 hover:bg-[#071d33]/90 transition-all group shadow-lg"
               >
                  <div className="w-14 h-14 rounded-full bg-amber-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Navigation size={28} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Route Optimization</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">
                    Dynamic spatial-temporal reasoning plots the safest navigation routes, proactively avoiding severe weather patterns and high wave actions.
                  </p>
               </motion.div>

               {/* Card 4 */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
                 className="bg-[#051525]/80 backdrop-blur-md border border-rose-900/50 p-8 rounded-xl hover:border-rose-500/50 hover:bg-[#071d33]/90 transition-all group shadow-lg"
               >
                  <div className="w-14 h-14 rounded-full bg-rose-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldAlert size={28} className="text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Risk Geofencing</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">
                    Automated boundary compliance and hazard alerts for Marine Protected Areas (MPAs) and International Maritime Boundary Lines (IMBL).
                  </p>
               </motion.div>

            </div>

         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-cyan-700/50 text-xs tech-mono bg-[#020b14]">
        ORCA AGENTIC PLATFORM V2.0 // SATELLITE INTELLIGENCE
      </footer>

    </div>
  );
}
