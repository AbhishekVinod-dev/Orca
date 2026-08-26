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
          <div className="absolute top-16 left-0 flex items-center gap-6">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="ORCA Logo" 
                className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full border border-cyan-500/50 flex items-center justify-center">
                <span className="text-cyan-400 font-bold">LOGO</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.4em] text-white">ORCA</h1>
          </div>

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
            <div className="w-64 h-[1px] bg-gradient-to-r from-cyan-900/50 via-cyan-500/50 to-transparent mt-4">
              <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] relative -top-[2px] left-24"></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}>
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

      {/* 2. About ORCA Section (Turtle) */}
      <section className="relative z-10 w-full min-h-screen py-32 px-16 md:px-32 lg:px-48 bg-[#010613] border-t border-cyan-900/20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-xs mb-6 uppercase">About ORCA</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
              Data. Technology. <br/>
              A Better <span className="text-cyan-400">Ocean</span>.
            </h2>
            <p className="text-cyan-100/60 text-lg leading-relaxed mb-12 max-w-lg">
              ORCA is an intelligent ocean monitoring platform that combines real-time data, advanced analytics, and global collaboration to protect marine ecosystems and inspire action.
            </p>
            <button className="flex items-center gap-4 px-8 py-4 border border-cyan-800 rounded-full hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all text-sm tracking-wider">
              Learn More <ChevronRight size={16} />
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
      <section className="relative z-10 w-full py-32 px-8 bg-[#010613] border-t border-cyan-900/20">
         <div className="max-w-7xl mx-auto">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-xs mb-16 text-center uppercase">Features</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
               <div className="bg-[#051525]/40 backdrop-blur-sm border border-cyan-900/40 p-10 rounded-xl hover:border-cyan-500/50 transition-all group">
                  <div className="mb-8 group-hover:scale-110 transition-transform">
                    <Target size={32} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">Smart Monitoring</h3>
                  <p className="text-cyan-100/50 text-sm leading-relaxed">
                    Real-time collection of ocean data using advanced sensors and IoT devices.
                  </p>
               </div>

               <div className="bg-[#051525]/40 backdrop-blur-sm border border-cyan-900/40 p-10 rounded-xl hover:border-cyan-500/50 transition-all group">
                  <div className="mb-8 group-hover:scale-110 transition-transform">
                    <BarChart2 size={32} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">AI-Powered Insights</h3>
                  <p className="text-cyan-100/50 text-sm leading-relaxed">
                    Machine learning models analyze patterns and predict environmental changes.
                  </p>
               </div>

               <div className="bg-[#051525]/40 backdrop-blur-sm border border-cyan-900/40 p-10 rounded-xl hover:border-cyan-500/50 transition-all group">
                  <div className="mb-8 group-hover:scale-110 transition-transform">
                    <Layers size={32} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">Interactive Visuals</h3>
                  <p className="text-cyan-100/50 text-sm leading-relaxed">
                    Explore data through immersive maps, 3D visualizations, and real-time dashboards.
                  </p>
               </div>

               <div className="bg-[#051525]/40 backdrop-blur-sm border border-cyan-900/40 p-10 rounded-xl hover:border-cyan-500/50 transition-all group">
                  <div className="mb-8 group-hover:scale-110 transition-transform">
                    <Users size={32} className="text-cyan-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">Global Collaboration</h3>
                  <p className="text-cyan-100/50 text-sm leading-relaxed">
                    A unified platform for researchers, organizations, and communities to work together.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* 4. Our Impact Section (Whale) */}
      <section className="relative z-10 w-full min-h-screen py-32 px-16 md:px-32 lg:px-48 bg-[#010613] border-t border-cyan-900/20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
          <div className="lg:w-1/2 relative h-[600px] w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
             <div className="absolute inset-0 bg-slate-800" style={{ backgroundImage: 'url(/whale.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          </div>

          <div className="lg:w-1/2">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-xs mb-6 uppercase">Our Impact</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-16">
              Protecting Oceans. <br/>
              Preserving <span className="text-cyan-400">Life</span>.
            </h2>
            
            <div className="grid grid-cols-2 gap-y-16 gap-x-8">
              
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
      <section className="relative z-10 w-full py-32 px-8 bg-[#010613] border-t border-cyan-900/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-xs mb-24 text-center uppercase">How It Works</h4>
           
           <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
             {/* Dashed connector line */}
             <div className="hidden md:block absolute top-8 left-10 right-10 h-[1px] border-b border-dashed border-cyan-900"></div>

             {[
               { num: "01", title: "Collect", desc: "Data is collected from sensors, satellites, and research partners.", icon: <Box size={24} /> },
               { num: "02", title: "Process", desc: "Advanced systems clean and organize data for accurate analysis.", icon: <Cpu size={24} /> },
               { num: "03", title: "Analyze", desc: "AI models detect patterns and generate actionable insights.", icon: <Network size={24} /> },
               { num: "04", title: "Visualize", desc: "Data is transformed into interactive dashboards and maps.", icon: <Layers size={24} /> },
               { num: "05", title: "Act", desc: "Insights drive decisions and real-world actions for ocean protection.", icon: <ShieldCheck size={24} /> }
             ].map((step, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center text-center w-48">
                 <div className="w-16 h-16 rounded-full bg-[#051525] border border-cyan-800 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-400">
                   {step.icon}
                 </div>
                 <div className="text-[10px] text-cyan-500 font-bold mb-2 tracking-widest">{step.num}</div>
                 <h3 className="text-sm font-bold text-white mb-3">{step.title}</h3>
                 <p className="text-[11px] text-cyan-100/50 leading-relaxed px-4">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 6. Join The Mission / Footer CTA */}
      <section className="relative z-10 w-full py-40 px-8 bg-[#051525] flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(/footer-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
         
         <div className="relative z-10 max-w-2xl">
           <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-xs mb-8 uppercase">Join The Mission</h4>
           <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-10">
             Together, we can create <br/>
             a healthier ocean for <span className="text-cyan-400">tomorrow.</span>
           </h2>
           
           <div className="flex justify-center mt-12">
             <button className="flex items-center gap-4 px-8 py-4 border border-cyan-700 bg-[#010613]/50 rounded-full hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-sm tracking-wider backdrop-blur-md">
               Be a Part of ORCA <ArrowRight size={16} />
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
