"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Cpu, Globe, Users, Droplet, Thermometer, MapPin, Bell, Fish, ChevronRight, Share2, Layers, Target, Activity, ShieldCheck, Play, Box, Network, Bot, Navigation } from 'lucide-react';
import { useState } from 'react';

export default function PremiumLandingPage() {
  const [bgError, setBgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full flex flex-col overflow-x-hidden min-h-screen text-white font-sans relative bg-[#010613]">
      
      {/* Massive Full-Page Scrolling Background */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          backgroundImage: bgError ? 'linear-gradient(to bottom, #010613, #021124)' : 'url(/full-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9 // Slight dimming to ensure text readability
        }}
      ></div>

      <div className="relative z-10 w-full">
        {/* 1. Hero Section */}
        <section className="w-full h-screen flex flex-col justify-center pl-16 md:pl-32 lg:pl-48">
          <div className="flex flex-col h-full max-w-xl justify-center py-24">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex items-center gap-6 mb-8"
            >
              <img 
                src="/logo.png" 
                alt="ORCA Logo" 
                className="w-20 h-20 object-contain"
              />
              <h1 className="text-3xl font-medium tracking-[0.5em] text-white ml-2 mt-1">O R C A</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-3 mb-12"
            >
              {['O B S E R V E .', 'R E C O R D .', 'C O N S E R V E .', 'A C T .'].map((text, i) => (
                <div key={i} className="text-[11px] md:text-[13px] font-medium tracking-[0.6em] text-cyan-50">
                  {text}
                </div>
              ))}
              <div className="w-48 h-[1px] bg-gradient-to-r from-cyan-400/50 via-cyan-700/40 to-transparent mt-6 relative">
                <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)] absolute -top-[1.5px] left-16"></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}>
              <Link href="/app">
                <button className="flex items-center gap-4 group mt-8">
                  <div className="w-10 h-10 rounded-full border border-cyan-400/50 flex items-center justify-center group-hover:border-cyan-300 group-hover:bg-cyan-900/40 transition-all backdrop-blur-sm">
                    <ArrowRight size={14} className="text-cyan-300 group-hover:text-cyan-100 transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.4em] text-cyan-100 group-hover:text-white transition-colors">
                    E X P L O R E &nbsp; O R C A
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. About ORCA Section (Turtle) */}
        <section className="w-full min-h-[90vh] py-32 px-16 md:px-32 lg:px-48 flex items-center">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-16 items-center justify-between">
            
            <div className="lg:w-1/2">
              <h4 className="text-cyan-400 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase drop-shadow-md">ABOUT ORCA</h4>
              <h2 className="text-3xl md:text-4xl font-normal text-white leading-snug mb-6 drop-shadow-lg">
                Data. Technology. <br/>
                A Better <span className="text-cyan-300 font-semibold">Ocean.</span>
              </h2>
              <p className="text-cyan-50/80 text-sm leading-relaxed mb-10 max-w-sm drop-shadow-md font-medium">
                ORCA is an intelligent ocean monitoring platform that combines real-time data, advanced analytics, and global collaboration to protect marine ecosystems and inspire action.
              </p>
              <button className="flex items-center gap-3 px-6 py-3 border border-cyan-400/50 rounded-full hover:border-cyan-300 hover:bg-cyan-900/30 transition-all text-[11px] text-cyan-50 tracking-wider backdrop-blur-sm">
                Learn More <ChevronRight size={14} className="text-cyan-300" />
              </button>
            </div>

            <div className="lg:w-1/2 relative h-[500px] w-full">
              {/* Floating Glassmorphism Cards (Positioned over the turtle in the background) */}
              <div className="absolute top-8 right-8 bg-[#010613]/40 backdrop-blur-md border border-cyan-400/30 p-3 rounded-lg flex items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Droplet size={16} className="text-cyan-300" />
                <div>
                  <div className="text-[9px] text-cyan-100/80 tracking-wider">Water Quality</div>
                  <div className="text-[11px] font-bold text-white">Excellent</div>
                </div>
              </div>

              <div className="absolute bottom-32 left-8 bg-[#010613]/40 backdrop-blur-md border border-cyan-400/30 p-3 rounded-lg flex items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Thermometer size={16} className="text-cyan-300" />
                <div>
                  <div className="text-[9px] text-cyan-100/80 tracking-wider">Temperature</div>
                  <div className="text-[11px] font-bold text-white">26.4 °C</div>
                </div>
              </div>

              <div className="absolute bottom-8 right-24 bg-[#010613]/40 backdrop-blur-md border border-cyan-400/30 p-3 rounded-lg flex items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <MapPin size={16} className="text-cyan-300" />
                <div>
                  <div className="text-[9px] text-cyan-100/80 tracking-wider">Location</div>
                  <div className="text-[11px] font-bold text-white">Indian Ocean</div>
                </div>
              </div>

              <div className="absolute top-48 right-12 bg-[#010613]/40 backdrop-blur-md border border-cyan-400/30 p-3 rounded-lg flex items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Activity size={16} className="text-cyan-300" />
                <div>
                  <div className="text-[9px] text-cyan-100/80 tracking-wider">Biodiversity</div>
                  <div className="text-[11px] font-bold text-white">Healthy</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Features Section */}
        <section className="relative z-10 w-full py-32 px-8 bg-[#01050e]">
           <div className="max-w-7xl mx-auto">
              <h4 className="text-cyan-400 font-semibold tracking-[0.3em] text-[10px] mb-12 text-center uppercase drop-shadow-md">FEATURES</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-[#020b16] border border-cyan-900/30 p-8 rounded-lg hover:border-cyan-500/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <div className="mb-6 group-hover:scale-105 transition-transform">
                      <Target size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-cyan-50 mb-3">Smart Monitoring</h3>
                    <p className="text-cyan-100/70 text-[11px] leading-relaxed">
                      Real-time collection of ocean data using advanced sensors and IoT devices.
                    </p>
                 </div>

                 <div className="bg-[#020b16] border border-cyan-900/30 p-8 rounded-lg hover:border-cyan-500/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <div className="mb-6 group-hover:scale-105 transition-transform">
                      <BarChart2 size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-cyan-50 mb-3">AI-Powered Insights</h3>
                    <p className="text-cyan-100/70 text-[11px] leading-relaxed">
                      Machine learning models analyze patterns and predict environmental changes.
                    </p>
                 </div>

                 <div className="bg-[#020b16] border border-cyan-900/30 p-8 rounded-lg hover:border-cyan-500/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <div className="mb-6 group-hover:scale-105 transition-transform">
                      <Layers size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-cyan-50 mb-3">Interactive Visuals</h3>
                    <p className="text-cyan-100/70 text-[11px] leading-relaxed">
                      Explore data through immersive maps, 3D visualizations, and real-time dashboards.
                    </p>
                 </div>

                 <div className="bg-[#020b16] border border-cyan-900/30 p-8 rounded-lg hover:border-cyan-500/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <div className="mb-6 group-hover:scale-105 transition-transform">
                      <Users size={24} className="text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[13px] font-semibold text-cyan-50 mb-3">Global Collaboration</h3>
                    <p className="text-cyan-100/70 text-[11px] leading-relaxed">
                      A unified platform for researchers, organizations, and communities to work together.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* 4. Our Impact Section (Whale) */}
        <section className="w-full min-h-[90vh] py-24 px-16 md:px-32 lg:px-48 flex items-center">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-20 items-center justify-between">
            
            <div className="lg:w-1/2 relative h-[500px] w-full">
               {/* Spacer to allow the whale in the background to be visible */}
            </div>

            <div className="lg:w-1/2">
              <h4 className="text-cyan-400 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase drop-shadow-md">OUR IMPACT</h4>
              <h2 className="text-3xl md:text-4xl font-normal text-white leading-snug mb-16 drop-shadow-lg">
                Protecting Oceans. <br/>
                Preserving <span className="text-cyan-300 font-semibold">Life.</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-y-12 gap-x-8 bg-[#010613]/30 backdrop-blur-md p-8 rounded-2xl border border-cyan-900/30">
                <div className="flex items-start gap-4">
                  <div className="mt-1"><Bell size={20} className="text-cyan-400" /></div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">1.2M+</div>
                    <div className="text-[9px] text-cyan-100/70 uppercase tracking-wider font-semibold">Data Points Collected</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1"><Globe size={20} className="text-cyan-400" /></div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">850+</div>
                    <div className="text-[9px] text-cyan-100/70 uppercase tracking-wider font-semibold">Monitoring Stations</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1"><Fish size={20} className="text-cyan-400" /></div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">120+</div>
                    <div className="text-[9px] text-cyan-100/70 uppercase tracking-wider font-semibold">Species Tracked</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1"><Users size={20} className="text-cyan-400" /></div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">30+</div>
                    <div className="text-[9px] text-cyan-100/70 uppercase tracking-wider font-semibold">Research Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works Section */}
        <section className="relative z-10 w-full py-32 px-8 bg-[#01050e] overflow-hidden">
          <div className="max-w-6xl mx-auto">
             <h4 className="text-cyan-400 font-semibold tracking-[0.3em] text-[10px] mb-16 text-center uppercase drop-shadow-md">HOW IT WORKS</h4>
             
             <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 bg-[#010613]/50 backdrop-blur-xl p-12 rounded-3xl border border-cyan-900/30 shadow-2xl">
               {/* Dashed connector line */}
               <div className="hidden md:block absolute top-16 left-16 right-16 h-[1px] border-b border-dashed border-cyan-800/50"></div>

               {[
                 { num: "01", title: "Collect", desc: "Data is collected from sensors and research partners.", icon: <Box size={16} /> },
                 { num: "02", title: "Process", desc: "Advanced systems clean and organize data.", icon: <Cpu size={16} /> },
                 { num: "03", title: "Analyze", desc: "AI models detect patterns and generate insights.", icon: <Network size={16} /> },
                 { num: "04", title: "Visualize", desc: "Interactive dashboards and real-time maps.", icon: <Layers size={16} /> },
                 { num: "05", title: "Act", desc: "Insights drive decisions for ocean protection.", icon: <ShieldCheck size={16} /> }
               ].map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center text-center w-36">
                   <div className="w-10 h-10 rounded-full bg-[#020b16] border border-cyan-700/50 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                     {step.icon}
                   </div>
                   <div className="text-[9px] text-cyan-400 font-bold mb-1 tracking-widest">{step.num}</div>
                   <h3 className="text-[12px] font-semibold text-cyan-50 mb-2">{step.title}</h3>
                   <p className="text-[9px] text-cyan-100/60 leading-relaxed px-2 font-medium">{step.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* 6. Join The Mission / Footer CTA */}
        <section className="w-full pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
           <div className="relative z-10 max-w-xl bg-[#010613]/40 backdrop-blur-lg p-12 rounded-3xl border border-cyan-900/30 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
             <h4 className="text-cyan-400 font-semibold tracking-[0.3em] text-[10px] mb-4 uppercase">JOIN THE MISSION</h4>
             <h2 className="text-2xl md:text-3xl font-normal text-white leading-tight mb-8">
               Together, we can create <br/>
               a healthier ocean for <span className="text-cyan-300 font-semibold">tomorrow.</span>
             </h2>
             
             <div className="flex justify-center mt-8">
               <button className="flex items-center gap-3 px-8 py-3.5 border border-cyan-500/50 bg-cyan-950/40 rounded-full hover:bg-cyan-900/60 hover:border-cyan-400 transition-all text-[11px] tracking-wider text-cyan-50 font-medium">
                 Be a Part of ORCA <ArrowRight size={14} className="text-cyan-400" />
               </button>
             </div>
           </div>
        </section>

        {/* Minimal Footer */}
        <footer className="w-full py-8 px-16 bg-[#010613]/80 backdrop-blur-md border-t border-cyan-900/30 flex flex-col md:flex-row justify-between items-center text-[10px] text-cyan-100/50 tech-mono">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest font-sans drop-shadow-md">
               <img src="/logo.png" alt="ORCA" className="w-5 h-5 object-contain" /> ORCA
            </div>
            <span className="ml-4">© 2026 ORCA. All rights reserved.</span>
          </div>
          
          <div className="flex gap-8 items-center">
            <div className="flex gap-4">
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">TW</span>
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">IN</span>
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">IG</span>
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">YT</span>
            </div>
            <div className="flex gap-6 border-l border-cyan-900/50 pl-8">
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">Terms of Use</span>
               <span className="hover:text-cyan-300 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
