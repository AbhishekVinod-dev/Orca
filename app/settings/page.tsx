'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Globe, MapPin, Bell, Eye, Moon, Smartphone,
  Volume2, ChevronRight, Check
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

const regions = [
  'Tamil Nadu', 'Kerala', 'Karnataka', 'Goa', 'Maharashtra',
  'Gujarat', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Lakshadweep', 'Andaman & Nicobar',
];

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-teal-500' : 'bg-ocean-700'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl border border-white/5 overflow-hidden mb-4"
    >
      <div className="px-5 py-3 border-b border-white/5">
        <h2 className="text-xs font-mono uppercase tracking-widest text-ocean-500">{title}</h2>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </motion.div>
  );
}

function SettingRow({ icon: Icon, label, desc, children }: {
  icon: React.ElementType; label: string; desc?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-8 h-8 rounded-lg bg-ocean-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-ocean-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ocean-100">{label}</p>
        {desc && <p className="text-xs text-ocean-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('Tamil Nadu');
  const [largText, setLargeText] = useState(false);
  const [iconFirst, setIconFirst] = useState(false);
  const [alertSound, setAlertSound] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <div className="min-h-screen bg-ocean-950">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/app" className="text-ocean-400 hover:text-teal-300 text-sm transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-display font-bold text-ocean-100 text-xl">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Language */}
        <SettingSection title="Language & Region">
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-4 h-4 text-ocean-400" />
              <p className="text-sm font-medium text-ocean-100">Interface Language</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-2.5 rounded-xl text-center transition-all border ${
                    selectedLang === lang.code
                      ? 'border-teal-400/40 bg-teal-400/10 text-teal-300'
                      : 'border-white/5 text-ocean-400 hover:border-white/10 hover:text-ocean-200'
                  }`}
                >
                  <span className="text-xs font-medium block">{lang.name}</span>
                  <span className="text-[11px] text-ocean-500">{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-4 h-4 text-ocean-400" />
              <p className="text-sm font-medium text-ocean-100">Home Coastal Region</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all border ${
                    selectedRegion === r
                      ? 'border-teal-400/40 bg-teal-400/10 text-teal-300'
                      : 'border-white/5 text-ocean-400 hover:border-white/10'
                  }`}
                >
                  {selectedRegion === r && <Check className="w-3 h-3" />}
                  {r}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* Accessibility */}
        <SettingSection title="Accessibility">
          <SettingRow
            icon={Eye}
            label="Large Text Mode"
            desc="Bigger font size for easier reading — ideal for field use"
          >
            <Toggle checked={largText} onChange={() => setLargeText(v => !v)} />
          </SettingRow>
          <SettingRow
            icon={Smartphone}
            label="Icon-First Mode"
            desc="Show icons prominently — designed for low-literacy / quick-scan use"
          >
            <Toggle checked={iconFirst} onChange={() => setIconFirst(v => !v)} />
          </SettingRow>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications & Alerts">
          <SettingRow
            icon={Bell}
            label="Push Notifications"
            desc="Receive cyclone and high-wave alerts in real-time"
          >
            <Toggle checked={pushNotifs} onChange={() => setPushNotifs(v => !v)} />
          </SettingRow>
          <SettingRow
            icon={Volume2}
            label="Alert Sound"
            desc="Play audio alert for critical and high-severity events"
          >
            <Toggle checked={alertSound} onChange={() => setAlertSound(v => !v)} />
          </SettingRow>
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance">
          <SettingRow
            icon={Moon}
            label="Dark Mode"
            desc="Control-room dark theme (recommended for outdoor use)"
          >
            <Toggle checked={darkMode} onChange={() => setDarkMode(v => !v)} />
          </SettingRow>
        </SettingSection>

        {/* About */}
        <div className="glass-panel rounded-2xl border border-white/5 p-5 text-center">
          <div className="text-3xl mb-2">🌊</div>
          <p className="font-display font-bold text-ocean-200">ORCA v1.0.0</p>
          <p className="text-xs text-ocean-500 mt-1">Marine Intelligence Platform · Smart India Hackathon 2026</p>
          <p className="text-xs text-ocean-600 mt-0.5">ISRO × Disaster Management Theme</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-ocean-500">
            <span>Data: INCOIS · IMD · MODIS · Sentinel-3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
