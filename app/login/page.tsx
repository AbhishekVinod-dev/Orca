"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../lib/store';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login();
      router.push('/app');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#010613] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-space-900 border border-cyan-900/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Shield className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wider mb-2">ORCA TERMINAL</h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase tech-mono">Secure Access Required</p>
        </div>

        <div className="glass-panel p-8 rounded-xl border border-space-800 shadow-2xl relative overflow-hidden">
          {/* Top glowing line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider tech-mono">Operative ID / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-space-900/50 border border-space-700 text-white text-sm rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
                  placeholder="Enter credentials"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider tech-mono">Security Passkey</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-space-900/50 border border-space-700 text-white text-sm rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              AUTHENTICATE <ArrowRight size={16} />
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest tech-mono">
            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
          </p>
        </div>
      </div>
    </div>
  );
}
