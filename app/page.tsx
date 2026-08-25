import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import Link from 'next/link';
import { ArrowRight, Waves } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ocean-950">
      <LandingNav />
      <HeroSection />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <FeaturesGrid />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-ocean-700/50 to-transparent" />

      <HowItWorks />

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,53,96,0.5)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ocean-100 mb-6">
            The Ocean is talking.<br />
            <span className="gradient-text">Are you listening?</span>
          </h2>
          <p className="text-ocean-300 text-lg mb-10">
            Join fishermen, coastal authorities, and disaster agencies using ORCA to make evidence-based decisions — not guesses.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-teal-500 hover:bg-teal-400 text-ocean-950 font-bold text-xl rounded-2xl transition-all duration-200 hover:scale-105 pulse-glow"
          >
            Start Asking ORCA
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-ocean-500 text-sm">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-teal-600" />
            <span className="font-display font-semibold text-ocean-400">ORCA</span>
            <span>· Marine Intelligence Platform</span>
          </div>
          <div className="flex gap-6">
            <a href="/app" className="hover:text-teal-400 transition-colors">Platform</a>
            <a href="/map" className="hover:text-teal-400 transition-colors">Live Map</a>
            <a href="/alerts" className="hover:text-teal-400 transition-colors">Alerts</a>
            <a href="/settings" className="hover:text-teal-400 transition-colors">Settings</a>
          </div>
          <span>SIH 2026 · ISRO × Disaster Management</span>
        </div>
      </footer>
    </main>
  );
}
