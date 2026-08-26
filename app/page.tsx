"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Satellite, MessageSquare, Waves, ShieldCheck, Database } from 'lucide-react';

// Prevent SSR for Three.js
const LandingGlobe3D = dynamic(() => import('../components/3d/LandingGlobe3D').then(mod => mod.LandingGlobe3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-space-950 flex items-center justify-center text-space-700 tech-mono text-sm">LOADING ASSETS...</div>
});

export default function PremiumLandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="w-full bg-space-950 flex flex-col overflow-x-hidden">
      


      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center">
        {/* Right side: 3D Globe */}
        <motion.div style={{ opacity }} className="fixed right-0 top-0 w-full lg:w-[60%] h-full z-0 opacity-60 lg:opacity-100 mask-image-fade-left">
          <LandingGlobe3D />
        </motion.div>

        {/* Left side: Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex">
          <div className="max-w-2xl mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                SEE THE OCEAN <br/> 
                <span className="text-slate-400">DIFFERENTLY.</span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg font-normal">
                ORCA combines satellite observation, ocean intelligence, weather data and agentic AI to transform marine data into actionable decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app">
                  <button className="px-8 py-4 bg-white text-space-950 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 rounded-sm">
                    ASK ORCA <ArrowRight size={18} />
                  </button>
                </Link>
                
                <Link href="#intelligence">
                  <button className="px-8 py-4 border border-space-700 text-white font-medium hover:bg-space-800 transition-colors flex items-center justify-center rounded-sm">
                    EXPLORE INTELLIGENCE
                  </button>
                </Link>
              </div>

              {/* Technical readout purely for aesthetic grounding */}
              <div className="mt-20 pt-8 border-t border-space-800 flex gap-12 text-xs tech-mono text-slate-500">
                <div>
                  <div className="text-slate-600 mb-1">SYSTEM STATUS</div>
                  <div className="text-cyan-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    ONLINE & TRACKING
                  </div>
                </div>
                <div>
                  <div className="text-slate-600 mb-1">DATA NODES</div>
                  <div className="text-slate-300">SST, CHL-A, AIS, MET</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Storytelling Sections */}
      <div className="relative z-10 bg-space-950">
        
        {/* Section 1: Satellite Intelligence */}
        <section id="intelligence" className="w-full min-h-screen flex items-center py-24">
           <div className="max-w-7xl mx-auto px-8 w-full">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-4 text-cyan-500 font-medium mb-6">
                  <Satellite size={24} />
                  <span>SATELLITE INTELLIGENCE</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                  From orbit to insight in seconds.
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed mb-12">
                  We process terabytes of raw satellite imagery, radar data, and thermal scans continuously. Our agentic AI structures this chaos into clean, actionable marine intelligence available on command.
                </p>
                
                {/* Minimalist Graphic/Placeholder for data transformation */}
                <div className="w-full h-64 border border-space-800 rounded-sm bg-space-900/50 flex flex-col items-center justify-center gap-4">
                   <div className="flex items-center gap-8 text-slate-500 tech-mono text-sm">
                      <div className="flex flex-col items-center gap-2"><span>RAW_DATA</span><span className="w-2 h-2 bg-slate-700 rounded-full"></span></div>
                      <div className="w-24 h-[1px] bg-gradient-to-r from-slate-800 via-cyan-500 to-slate-800"></div>
                      <div className="flex flex-col items-center gap-2"><span className="text-cyan-500">INTELLIGENCE</span><span className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06B6D4]"></span></div>
                   </div>
                </div>
              </motion.div>
           </div>
        </section>

        {/* Section 2: Ask ORCA */}
        <section className="w-full min-h-screen flex items-center py-24 border-t border-space-800/50">
           <div className="max-w-7xl mx-auto px-8 w-full flex flex-col lg:flex-row gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2"
              >
                <div className="flex items-center gap-4 text-teal-500 font-medium mb-6">
                  <MessageSquare size={24} />
                  <span>CONVERSATIONAL AI</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                  Talk to your data.
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Instead of complex querying languages, simply ask ORCA. The system understands intent, retrieves the exact geospatial layers required, and correlates them instantly.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2 w-full"
              >
                <div className="glass-panel p-8 rounded-sm">
                   <div className="text-slate-300 mb-6">"Where are the safest fishing zones near Kochi today?"</div>
                   <div className="flex items-center gap-3 text-xs tech-mono text-slate-500 mb-4">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                      PLANNING → RETRIEVING → CORRELATING
                   </div>
                   <div className="p-4 bg-space-900 border border-space-800 rounded-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-medium">PFZ 04 IDENTIFIED</span>
                        <span className="text-teal-500 tech-mono text-xs">87% SUITABILITY</span>
                      </div>
                      <div className="flex gap-4 text-xs tech-mono text-slate-400">
                        <div>SST: 28.4°C</div>
                        <div>CHL: HIGH</div>
                        <div>WAVES: 1.2m</div>
                      </div>
                   </div>
                </div>
              </motion.div>
           </div>
        </section>

        {/* Call to action */}
        <section className="w-full py-32 border-t border-space-800/50 flex flex-col items-center justify-center text-center px-8">
           <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
             Ready to deploy?
           </h2>
           <Link href="/app">
              <button className="px-10 py-5 bg-white text-space-950 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 rounded-sm text-lg">
                ENTER WORKSPACE <ArrowRight size={20} />
              </button>
           </Link>
        </section>

      </div>
    </div>
  );
}
