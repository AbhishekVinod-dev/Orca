"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Cpu, Globe, Users, Droplet, Thermometer, MapPin, Bell, Fish, Layers, Target, ShieldCheck, Box, Network, Activity } from 'lucide-react';
import { useState } from 'react';

export default function PremiumLandingPage() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full flex flex-col overflow-x-hidden min-h-screen font-sans bg-[#010613]">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section 
        className="w-full h-screen relative flex flex-col justify-center pl-12 md:pl-24 lg:pl-32"
        style={{
          backgroundImage: 'url(/Hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#010613]/90 via-[#010613]/30 to-transparent"></div> {/* Dark gradient on left for text readability */}

        <div className="relative z-10 flex flex-col max-w-xl">
          {/* Logo Text Only */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-medium tracking-[0.5em] text-white">O R C A</h1>
          </motion.div>

          {/* Catchphrase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-3 mb-10"
          >
            <div className="text-[12px] md:text-[14px] font-medium tracking-[0.6em] text-gray-300">O B S E R V E .</div>
            <div className="text-[12px] md:text-[14px] font-medium tracking-[0.6em] text-gray-300">R E C O R D .</div>
            <div className="text-[12px] md:text-[14px] font-medium tracking-[0.6em] text-gray-300">C O N S E R V E .</div>
            <div className="text-[12px] md:text-[14px] font-medium tracking-[0.6em] text-cyan-400">A C T .</div>
            
            {/* Subtle glow line */}
            <div className="w-64 h-[1px] bg-gradient-to-r from-cyan-400/50 via-cyan-800/30 to-transparent mt-6 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            </div>
          </motion.div>

          {/* Explore Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}>
            <Link href="/app">
              <button className="flex items-center gap-4 group mt-4">
                <div className="w-10 h-10 rounded-full border border-cyan-500/50 flex items-center justify-center group-hover:border-cyan-300 group-hover:bg-cyan-900/40 transition-all backdrop-blur-sm">
                  <ArrowRight size={14} className="text-cyan-400 group-hover:text-cyan-200 transition-colors" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-300 group-hover:text-white transition-colors">
                  E X P L O R E &nbsp; O R C A
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= 2. ABOUT ORCA (Turtle) ================= */}
      <section className="w-full py-32 px-8 md:px-24 bg-[#010916] relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img src="/turtle.png" alt="Sea Turtle" className="w-full h-full object-cover object-right opacity-80" />
          {/* Gradients to blend the image seamlessly into the section background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010916] via-[#010916]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#010613] via-transparent to-[#010613]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:w-5/12">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-[10px] mb-4 uppercase">ABOUT ORCA</h4>
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight mb-6">
              Data. Technology.<br/>
              A Better <span className="text-cyan-400 font-normal">Ocean.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm">
              ORCA is an intelligent ocean monitoring platform that combines real-time data, advanced analytics, and collaboration to protect marine ecosystems and inspire action.
            </p>
            <a href="#features">
              <button className="flex items-center gap-6 px-6 py-3 border border-cyan-800 rounded-full hover:border-cyan-400 hover:bg-cyan-900/20 transition-all text-[11px] text-gray-300 tracking-wider cursor-pointer">
                Learn More <ArrowRight size={14} className="text-cyan-500" />
              </button>
            </a>
          </div>

          {/* Right Turtle Space for Cards */}
          <div className="lg:w-7/12 relative min-h-[500px] md:min-h-[700px] w-full">
            
            {/* Floating Glass Cards */}
            <div className="absolute top-10 right-20 bg-[#010613]/70 backdrop-blur-md border border-cyan-800/60 py-2 px-4 rounded-lg flex items-center gap-3">
              <Droplet size={14} className="text-cyan-400" />
              <div>
                <div className="text-[8px] text-gray-400 tracking-wider">Water Quality</div>
                <div className="text-[10px] font-medium text-white">Excellent</div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-[#010613]/70 backdrop-blur-md border border-cyan-800/60 py-2 px-4 rounded-lg flex items-center gap-3">
              <Thermometer size={14} className="text-cyan-400" />
              <div>
                <div className="text-[8px] text-gray-400 tracking-wider">Temperature</div>
                <div className="text-[10px] font-medium text-white">22.4 °C</div>
              </div>
            </div>

            <div className="absolute bottom-16 right-10 bg-[#010613]/70 backdrop-blur-md border border-cyan-800/60 py-2 px-4 rounded-lg flex items-center gap-3">
              <Activity size={14} className="text-cyan-400" />
              <div>
                <div className="text-[8px] text-gray-400 tracking-wider">Biodiversity</div>
                <div className="text-[10px] font-medium text-white">Healthy</div>
              </div>
            </div>

            <div className="absolute -bottom-10 left-1/4 bg-[#010613]/70 backdrop-blur-md border border-cyan-800/60 py-2 px-4 rounded-lg flex items-center gap-3">
              <MapPin size={14} className="text-cyan-400" />
              <div>
                <div className="text-[8px] text-gray-400 tracking-wider">Location</div>
                <div className="text-[10px] font-medium text-white">Indian Ocean</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURES ================= */}
      <section id="features" className="w-full py-24 px-8 bg-[#010613]">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-cyan-500 font-semibold tracking-[0.3em] text-[10px] mb-16 text-center uppercase">FEATURES</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-cyan-900/50 p-8 rounded-xl hover:border-cyan-600 transition-colors bg-transparent">
              <Target size={24} className="text-cyan-500 mb-6" strokeWidth={1} />
              <h3 className="text-[13px] font-medium text-white mb-3">Smart Monitoring</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">Real-time collection of ocean data using advanced sensors and IoT devices.</p>
            </div>
            
            <div className="border border-cyan-900/50 p-8 rounded-xl hover:border-cyan-600 transition-colors bg-transparent">
              <BarChart2 size={24} className="text-cyan-500 mb-6" strokeWidth={1} />
              <h3 className="text-[13px] font-medium text-white mb-3">AI-Powered Insights</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">Machine learning models analyze patterns and predict environmental changes.</p>
            </div>
            
            <div className="border border-cyan-900/50 p-8 rounded-xl hover:border-cyan-600 transition-colors bg-transparent">
              <Layers size={24} className="text-cyan-500 mb-6" strokeWidth={1} />
              <h3 className="text-[13px] font-medium text-white mb-3">Interactive Visuals</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">Explore data through immersive maps, 3D visualizations, and real-time dashboards.</p>
            </div>
            
            <div className="border border-cyan-900/50 p-8 rounded-xl hover:border-cyan-600 transition-colors bg-transparent">
              <Users size={24} className="text-cyan-500 mb-6" strokeWidth={1} />
              <h3 className="text-[13px] font-medium text-white mb-3">Global Collaboration</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">A unified platform for researchers, organizations, and communities to work together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. OUR IMPACT (Whale) ================= */}
      <section className="w-full py-32 px-8 md:px-24 bg-[#010916] relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img src="/whale.png" alt="Humpback Whale" className="w-full h-full object-cover object-left opacity-80" />
          {/* Gradients to blend the image seamlessly into the section background */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#010916] via-[#010916]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#010613] via-transparent to-[#010613]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
          
          {/* Left Whale Space for Balance */}
          <div className="lg:w-1/2 relative min-h-[500px] md:min-h-[700px] w-full">
          </div>

          {/* Right Text & Stats Grid */}
          <div className="lg:w-1/2 relative z-10 pl-0 lg:pl-10">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-[10px] mb-4 uppercase">OUR IMPACT</h4>
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight mb-16">
              Protecting Oceans.<br/>
              Preserving <span className="text-cyan-400 font-normal">Life.</span>
            </h2>
            
            {/* Real 2x2 Grid with Dividing Lines */}
            <div className="grid grid-cols-2 relative">
              {/* Divider Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-900/40"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-900/40"></div>

              {/* Items */}
              <div className="flex items-center gap-5 p-8 pl-0">
                <Bell size={24} className="text-cyan-500" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-normal text-white mb-1">1.2M+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Data Points Collected</div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-8 pr-0 pl-12">
                <Globe size={24} className="text-cyan-500" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-normal text-white mb-1">850+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Monitoring Stations</div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-8 pl-0">
                <Fish size={24} className="text-cyan-500" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-normal text-white mb-1">120+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Species Tracked</div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-8 pr-0 pl-12">
                <Users size={24} className="text-cyan-500" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-normal text-white mb-1">30+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wide">Research Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. HOW IT WORKS ================= */}
      <section className="w-full py-32 px-8 bg-[#010613]">
        <div className="max-w-6xl mx-auto">
          <h4 className="text-cyan-500 font-semibold tracking-[0.3em] text-[10px] mb-20 text-center uppercase">HOW IT WORKS</h4>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4 px-4 md:px-12">
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-7 left-24 right-24 h-[1px] border-b border-dashed border-cyan-800/50"></div>

            {[
              { num: "01", title: "Collect", desc: "Data is collected from sensors, satellites, and research partners.", icon: <Box size={16} /> },
              { num: "02", title: "Process", desc: "Advanced systems clean and organize data for accurate analysis.", icon: <Cpu size={16} /> },
              { num: "03", title: "Analyze", desc: "AI models detect patterns and generate actionable insights.", icon: <Network size={16} /> },
              { num: "04", title: "Visualize", desc: "Data is transformed into interactive dashboards and maps.", icon: <Layers size={16} /> },
              { num: "05", title: "Act", desc: "Insights drive decisions and real-world actions for ocean protection.", icon: <ShieldCheck size={16} /> }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center w-full md:w-36">
                <div className="w-14 h-14 rounded-full bg-[#010613] border border-cyan-700 flex items-center justify-center mb-6 text-cyan-400">
                  {step.icon}
                </div>
                <div className="text-[9px] text-cyan-500 font-semibold mb-2 tracking-widest">{step.num}</div>
                <h3 className="text-[13px] font-medium text-white mb-2">{step.title}</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed font-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. JOIN THE MISSION & FOOTER ================= */}
      <div 
        className="w-full flex flex-col relative overflow-hidden"
        style={{
          backgroundImage: 'url(/footer-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full bg-[#010613]/50 backdrop-blur-sm"> {/* Darken seabed image slightly */}
          
          <section className="w-full pt-32 pb-24 px-8 flex flex-col items-center justify-center text-center relative z-10">
            <h4 className="text-cyan-500 font-semibold tracking-[0.2em] text-[10px] mb-6 uppercase">JOIN THE MISSION</h4>
            <h2 className="text-2xl md:text-4xl font-light text-white leading-tight mb-12 max-w-2xl">
              Together, we can create <br/>
              a healthier ocean for <span className="text-cyan-400 font-normal">tomorrow.</span>
            </h2>
            
            <Link href="/app">
              <button className="flex items-center gap-4 px-8 py-3 border border-cyan-600 rounded-full hover:bg-cyan-900/40 transition-all text-[11px] tracking-wider text-white bg-[#010613]/60 backdrop-blur-md cursor-pointer">
                Be a Part of ORCA <ArrowRight size={14} className="text-cyan-500" />
              </button>
            </Link>
          </section>

          {/* Minimal Footer */}
          <footer className="w-full py-8 px-12 md:px-24 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 relative z-10">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="flex items-center gap-2 text-white font-medium text-sm tracking-widest">
                <img src="/logo.png" alt="ORCA" className="w-5 h-5 object-contain" /> ORCA
              </div>
              <span className="ml-4">© 2026 ORCA. All rights reserved.</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex gap-6">
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">TW</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">IN</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">IG</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">YT</span>
              </div>
              <div className="hidden md:block w-[1px] h-3 bg-gray-700"></div>
              <div className="flex gap-6">
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Terms of Use</span>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">Contact</span>
              </div>
            </div>
          </footer>

        </div>
      </div>

    </div>
  );
}
