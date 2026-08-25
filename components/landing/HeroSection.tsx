'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Waves } from 'lucide-react';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  const words = ['Ocean', 'Intelligence,', 'Reimagined.'];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80"
        >
          <source
            src="https://www.pexels.com/download/video/1093662/"
            type="video/mp4"
          />
        </video>
        {/* Ocean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/60 via-ocean-900/40 to-ocean-950" />
        {/* Radial glow at center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,53,96,0.4)_0%,transparent_70%)]" />
      </div>

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-teal-400/30 text-teal-300 text-sm font-medium"
        >
          <Waves className="w-4 h-4" />
          <span>Smart India Hackathon 2026 · ISRO × Disaster Management</span>
        </motion.div>

        {/* Main headline — word-by-word reveal */}
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight mb-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            {/* ORCA logo text */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="gradient-text"
            >
              ORCA
            </motion.span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-ocean-100"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 text-ocean-200 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Agentic AI marine intelligence for fishermen, coastal authorities & disaster agencies.
          Ask anything — get satellite-backed answers in seconds.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/app"
            className="pulse-glow relative group flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-ocean-950 font-bold rounded-xl text-lg transition-all duration-200 hover:scale-105"
          >
            Ask ORCA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2 px-8 py-4 glass border border-white/10 text-ocean-100 hover:border-teal-400/40 rounded-xl text-lg font-medium transition-all duration-200 hover:scale-105"
          >
            <Waves className="w-5 h-5 text-teal-400" />
            Live Map
          </Link>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-ocean-300"
        >
          {[
            { label: 'PFZ Accuracy', value: '89%' },
            { label: 'Alert Sources', value: 'IMD + INCOIS' },
            { label: 'Languages', value: '8 Indian' },
            { label: 'Satellite Data', value: 'MODIS · Sentinel-3' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 px-4 py-2 glass rounded-lg border border-white/5"
            >
              <span className="text-teal-300 font-bold text-base">{stat.value}</span>
              <span className="text-ocean-400 text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-ocean-400 text-xs"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-0.5 h-8 bg-gradient-to-b from-teal-400 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
