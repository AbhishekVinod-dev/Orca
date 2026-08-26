"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Cpu, Globe, Users, Droplet, Thermometer, MapPin, Bell, Fish, ChevronRight, Share2, Layers, Target, Activity, ShieldCheck, Play, Box, Network, Bot, Navigation } from 'lucide-react';
import { useState } from 'react';

export default function PremiumLandingPage() {
  const [bgError, setBgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full bg-[#010613] flex flex-col overflow-x-hidden min-h-screen text-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center pl-16 md:pl-32 lg:pl-48">
        <div 
          className="fixed inset-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: bgError ? 'linear-gradient(to bottom, #020B16, #031428)' : 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#010613]/90 via-[#010613]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#010613] via-transparent to-transparent h-full"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full max-w-xl justify-center py-24">
          <div className="absolute top-16 left-0 flex items-center gap-4">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="ORCA Logo" 
                className="w-12 h-12 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-[10px]">LOGO</span>
              </div>
            )}
            <h1 className="text-2xl font-medium tracking-[0.5em] text-white ml-2 mt-1">O R C A</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-3 mt-16 mb-12"
          >
            {['O B S E R V E .', 'R E C O R D .', 'C O N S E R V E .', 'A C T .'].map((text, i) => (
              <div key={i} className="text-[11px] md:text-[13px] font-medium tracking-[0.6em] text-slate-300">
                {text}
              </div>
            ))}
            <div className="w-48 h-[1px] bg-gradient-to-r from-cyan-900/40 via-cyan-700/40 to-transparent mt-6 relative">
              <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)] absolute -top-[1.5px] left-16"></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}>
            <Link href="/app">
              <button className="flex items-center gap-4 group mt-8">
                <div className="w-10 h-10 rounded-full border border-cyan-800/50 flex items-center justify-center group-hover:border-cyan-500 group-hover:bg-cyan-900/20 transition-all">
                  <ArrowRight size={14} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <span className="text-[11px] font-bold tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">
                  E X P L O R E &nbsp; O R C A
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. About ORCA Section (Turtle) */}
      <section className="relative z-10 w-full min-h-screen py-32 px-16 md:px-32 lg:px-48 bg-[#010613]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <h4 className="text-cyan-600 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase">ABOUT ORCA</h4>
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-snug mb-6">
              Data. Technology. <br/>
              A Better <span className="text-cyan-400 font-semibold">Ocean.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
              ORCA is an intelligent ocean monitoring platform that combines real-time data, advanced analytics, and global collaboration to protect marine ecosystems and inspire action.
            </p>
            <button className="flex items-center gap-3 px-6 py-3 border border-cyan-900/50 rounded-full hover:border-cyan-600 transition-all text-[11px] text-slate-300 tracking-wider">
              Learn More <ChevronRight size={14} className="text-cyan-500" />
            </button>
          </div>

          <div className="lg:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)] border border-cyan-900/30">
            <div className="absolute inset-0 bg-slate-800" style={{ backgroundImage: 'url(/turtle.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            
            {/* Floating Glassmorphism Cards */}
            <div className="absolute top-8 right-8 bg-[#010613]/60 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg flex items-center gap-4 shadow-lg">
              <Droplet size={18} className="text-cyan-400" />
              <div>
                <div className="text-[10px] text-cyan-200/70 tracking-wider">Water Quality</div>
                <div className="text-xs font-bold text-white">Excellent</div>
              </div>
            </div>

            <div className="absolute bottom-32 left-8 bg-[#010613]/60 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg flex items-center gap-4 shadow-lg">
              <Thermometer size={18} className="text-cyan-400" />
              <div>
                <div className="text-[10px] text-cyan-200/70 tracking-wider">Temperature</div>
                <div className="text-xs font-bold text-white">26.4 °C</div>
              </div>
            </div>

            <div className="absolute bottom-8 right-24 bg-[#010613]/60 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg flex items-center gap-4 shadow-lg">
              <MapPin size={18} className="text-cyan-400" />
              <div>
                <div className="text-[10px] text-cyan-200/70 tracking-wider">Location</div>
                <div className="text-xs font-bold text-white">Indian Ocean</div>
              </div>
            </div>

            <div className="absolute top-48 right-12 bg-[#010613]/60 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg flex items-center gap-4 shadow-lg">
              <Activity size={18} className="text-cyan-400" />
              <div>
                <div className="text-[10px] text-cyan-200/70 tracking-wider">Biodiversity</div>
                <div className="text-xs font-bold text-white">Healthy</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="relative z-10 w-full py-24 px-8 bg-[#010613]">
         <div className="max-w-7xl mx-auto">
            <h4 className="text-cyan-600 font-semibold tracking-[0.3em] text-[10px] mb-12 text-center uppercase">FEATURES</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               
               <div className="bg-[#020b16] border border-[#06182e] p-8 rounded-lg hover:border-cyan-900/50 transition-all group">
                  <div className="mb-6 group-hover:scale-105 transition-transform">
                    <Target size={24} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-200 mb-3">Smart Monitoring</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Real-time collection of ocean data using advanced sensors and IoT devices.
                  </p>
               </div>

               <div className="bg-[#020b16] border border-[#06182e] p-8 rounded-lg hover:border-cyan-900/50 transition-all group">
                  <div className="mb-6 group-hover:scale-105 transition-transform">
                    <BarChart2 size={24} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-200 mb-3">AI-Powered Insights</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Machine learning models analyze patterns and predict environmental changes.
                  </p>
               </div>

               <div className="bg-[#020b16] border border-[#06182e] p-8 rounded-lg hover:border-cyan-900/50 transition-all group">
                  <div className="mb-6 group-hover:scale-105 transition-transform">
                    <Layers size={24} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-200 mb-3">Interactive Visuals</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Explore data through immersive maps, 3D visualizations, and real-time dashboards.
                  </p>
               </div>

               <div className="bg-[#020b16] border border-[#06182e] p-8 rounded-lg hover:border-cyan-900/50 transition-all group">
                  <div className="mb-6 group-hover:scale-105 transition-transform">
                    <Users size={24} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-200 mb-3">Global Collaboration</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    A unified platform for researchers, organizations, and communities to work together.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* 4. Our Impact Section (Whale) */}
      <section className="relative z-10 w-full min-h-screen py-24 px-16 md:px-32 lg:px-48 bg-[#010613]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
          <div className="lg:w-1/2 relative h-[500px] w-full rounded-xl overflow-hidden">
             <div className="absolute inset-0 bg-slate-800" style={{ backgroundImage: 'url(/whale.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          </div>

          <div className="lg:w-1/2">
            <h4 className="text-cyan-600 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase">OUR IMPACT</h4>
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-snug mb-16">
              Protecting Oceans. <br/>
              Preserving <span className="text-cyan-400 font-semibold">Life.</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
              
              <div className="flex items-start gap-4">
                <div className="mt-1"><Bell size={24} className="text-cyan-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">1.2M+</div>
                  <div className="text-xs text-cyan-100/50 uppercase tracking-wider">Data Points Collected</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1"><Globe size={24} className="text-cyan-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">850+</div>
                  <div className="text-xs text-cyan-100/50 uppercase tracking-wider">Monitoring Stations</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1"><Fish size={24} className="text-cyan-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">120+</div>
                  <div className="text-xs text-cyan-100/50 uppercase tracking-wider">Species Tracked</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1"><Users size={24} className="text-cyan-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">30+</div>
                  <div className="text-xs text-cyan-100/50 uppercase tracking-wider">Research Partners</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="relative z-10 w-full py-24 px-8 bg-[#010613] overflow-hidden">
        <div className="max-w-6xl mx-auto">
           <h4 className="text-cyan-600 font-semibold tracking-[0.3em] text-[10px] mb-16 text-center uppercase">HOW IT WORKS</h4>
           
           <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
             {/* Dashed connector line */}
             <div className="hidden md:block absolute top-6 left-10 right-10 h-[1px] border-b border-dashed border-[#06182e]"></div>

             {[
               { num: "01", title: "Collect", desc: "Data is collected from sensors, satellites, and research partners.", icon: <Box size={16} /> },
               { num: "02", title: "Process", desc: "Advanced systems clean and organize data for accurate analysis.", icon: <Cpu size={16} /> },
               { num: "03", title: "Analyze", desc: "AI models detect patterns and generate actionable insights.", icon: <Network size={16} /> },
               { num: "04", title: "Visualize", desc: "Data is transformed into interactive dashboards and maps.", icon: <Layers size={16} /> },
               { num: "05", title: "Act", desc: "Insights drive decisions and real-world actions for ocean protection.", icon: <ShieldCheck size={16} /> }
             ].map((step, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center text-center w-40">
                 <div className="w-12 h-12 rounded-full bg-[#020b16] border border-[#06182e] flex items-center justify-center mb-4 text-cyan-500">
                   {step.icon}
                 </div>
                 <div className="text-[9px] text-cyan-600 font-bold mb-1 tracking-widest">{step.num}</div>
                 <h3 className="text-[13px] font-semibold text-slate-200 mb-2">{step.title}</h3>
                 <p className="text-[10px] text-slate-500 leading-relaxed px-2">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 6. Join The Mission / Footer CTA */}
      <section className="relative z-10 w-full py-32 px-8 bg-[#010817] flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url(/footer-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#010613] via-transparent to-transparent"></div>
         
         <div className="relative z-10 max-w-xl">
           <h4 className="text-cyan-600 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase">JOIN THE MISSION</h4>
           <h2 className="text-2xl md:text-3xl font-normal text-white leading-tight mb-8">
             Together, we can create <br/>
             a healthier ocean for <span className="text-cyan-400 font-semibold">tomorrow.</span>
           </h2>
           
           <div className="flex justify-center mt-8">
             <button className="flex items-center gap-3 px-6 py-3 border border-cyan-800 bg-[#010613]/50 rounded-full hover:bg-cyan-900/30 hover:border-cyan-500 transition-all text-[11px] tracking-wider text-slate-300 backdrop-blur-md">
               Be a Part of ORCA <ArrowRight size={14} className="text-cyan-500" />
             </button>
           </div>
         </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full py-8 px-16 bg-[#010613] border-t border-cyan-900/30 flex flex-col md:flex-row justify-between items-center text-[10px] text-cyan-100/40 tech-mono">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest font-sans">
             <div className="w-4 h-4 rounded-full border border-cyan-500 flex items-center justify-center"><span className="text-[6px] text-cyan-400">O</span></div> ORCA
          </div>
          <span className="ml-4">© 2026 ORCA. All rights reserved.</span>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex gap-4">
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">TW</span>
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">IN</span>
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">IG</span>
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">YT</span>
          </div>
          <div className="flex gap-6 border-l border-cyan-900/50 pl-8">
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">Terms of Use</span>
             <span className="hover:text-cyan-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
