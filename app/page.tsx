"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, ShieldAlert, Navigation, Network } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function PremiumLandingPage() {
  const [imageError, setImageError] = useState(false);
  const [bgError, setBgError] = useState(false);

  return (
    <div className="w-full bg-[#010613] flex flex-col overflow-x-hidden min-h-screen text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center pl-16 md:pl-32 lg:pl-48">
        
        {/* Full Screen Image Background (Matches the provided image) */}
        <div 
          className="fixed inset-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: bgError ? 'linear-gradient(to bottom, #020B16, #031428)' : 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Add a subtle overlay so text remains readable if the image is too bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010613]/80 via-transparent to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full max-w-xl justify-center py-24">
          
          {/* Logo & ORCA Title - Top Left */}
          <div className="absolute top-16 left-0 flex items-center gap-6">
            {!imageError ? (
              <img 
                src="/logo.png" 
                alt="ORCA Logo" 
                className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <span className="text-cyan-400 font-bold">LOGO</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.4em] text-white">
              ORCA
            </h1>
          </div>

          {/* Stacked Catchphrase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-4 mt-20 mb-16"
          >
            {['O B S E R V E .', 'R E C O R D .', 'C O N S E R V E .', 'A C T .'].map((text, i) => (
              <div key={i} className="text-xl md:text-2xl font-semibold tracking-[0.3em] text-cyan-50/90 drop-shadow-md">
                {text}
              </div>
            ))}
            
            {/* Very thin separator line like in the image */}
            <div className="w-64 h-[1px] bg-gradient-to-r from-cyan-900/50 via-cyan-500/50 to-transparent mt-4">
              <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] relative -top-[2px] left-24"></div>
            </div>
          </motion.div>

          {/* Minimalist Explore Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <Link href="/app">
              <button className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full border border-cyan-700 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  <ArrowRight size={20} className="text-cyan-200 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold tracking-[0.3em] text-cyan-100/70 group-hover:text-white transition-colors">
                  E X P L O R E &nbsp; O R C A
                </span>
              </button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Hidden Capabilities Grid (Scroll down to view) */}
      <section className="relative z-10 w-full py-32 px-8 bg-gradient-to-b from-transparent via-[#010613] to-[#010613] flex justify-center mt-32">
         <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-[#051525]/80 backdrop-blur-md border border-cyan-900/50 p-8 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center mb-6">
                    <Bot size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Conversational AI</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">Interact naturally with marine data and explore scenarios.</p>
               </div>
               <div className="bg-[#051525]/80 backdrop-blur-md border border-teal-900/50 p-8 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-teal-950 flex items-center justify-center mb-6">
                    <Network size={24} className="text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Agent Orchestration</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">Autonomous collaboration between specialized AI agents.</p>
               </div>
               <div className="bg-[#051525]/80 backdrop-blur-md border border-amber-900/50 p-8 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-amber-950 flex items-center justify-center mb-6">
                    <Navigation size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Route Optimization</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">Dynamic spatial-temporal reasoning plots safest routes.</p>
               </div>
               <div className="bg-[#051525]/80 backdrop-blur-md border border-rose-900/50 p-8 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-rose-950 flex items-center justify-center mb-6">
                    <ShieldAlert size={24} className="text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Risk Geofencing</h3>
                  <p className="text-cyan-100/60 text-sm leading-relaxed">Automated boundary compliance and hazard alerts.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
