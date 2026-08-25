'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Bell, Map, LayoutDashboard, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/map', label: 'Map' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <Waves className="w-4 h-4 text-teal-400" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">ORCA</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ocean-300 hover:text-teal-300 text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/alerts"
            className="flex items-center gap-1.5 text-sm text-ocean-300 hover:text-teal-300 transition-colors px-3 py-2"
          >
            <Bell className="w-4 h-4" />
            <span className="relative">
              Alerts
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-alert-critical rounded-full" />
            </span>
          </Link>
          <Link
            href="/app"
            className="flex items-center gap-2 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-ocean-950 font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105"
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Platform
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden text-ocean-200 p-2"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5 px-4 py-4 flex flex-col gap-3"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-ocean-200 text-base py-2"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/app"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 text-ocean-950 font-bold rounded-xl"
            >
              Open Platform
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
