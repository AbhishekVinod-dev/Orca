"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '../../lib/store';
import { 
  Command, 
  MessageSquare, 
  Globe, 
  Map, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode, setViewMode } = useAppStore();

  const navItems = [
    { id: 'command', icon: Command, label: 'Command', href: '/app' },
    { id: 'conversations', icon: MessageSquare, label: 'Conversations', href: '/app/conversations' },
    { id: 'globe', icon: Globe, label: '3D Globe', href: '/app' },
    { id: 'map', icon: Map, label: 'Marine Map', href: '/app' },
    { id: 'alerts', icon: ShieldAlert, label: 'Alerts', href: '/app/alerts' },
  ];

  return (
    <aside className="w-16 lg:w-20 h-full border-r border-space-800 bg-space-950 flex flex-col items-center py-6 flex-shrink-0 z-50">
      {/* Logo */}
      <Link href="/" className="mb-12 font-bold text-lg tracking-widest text-white hover:text-cyan-500 transition-colors">
        O.
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-col gap-6 w-full items-center flex-1">
        {navItems.map((item) => {
          // Determine if active based on pathname AND viewMode for the map/globe
          let isActive = pathname === item.href;
          if (item.id === 'globe') isActive = pathname === '/app' && viewMode === '3d';
          if (item.id === 'map') isActive = pathname === '/app' && viewMode === '2d';
          if (item.id === 'command') isActive = pathname === '/app' && viewMode === '3d'; // Default workspace highlight
          
          const Icon = item.icon;
          
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            if (item.id === 'globe') {
              setViewMode('3d');
              router.push('/app');
            } else if (item.id === 'map') {
              setViewMode('2d');
              router.push('/app');
            } else {
              router.push(item.href);
            }
          };
          
          return (
            <button 
              key={item.id}
              onClick={handleClick}
              className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors group
                ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
              `}
              title={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -left-3 lg:-left-5 w-1 h-6 bg-cyan-500 rounded-r-full" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-space-800 text-white text-xs px-3 py-1.5 rounded-sm whitespace-nowrap transition-opacity z-50 shadow-lg border border-space-700 font-medium">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <Link 
        href="/app/settings"
        className="text-slate-500 hover:text-slate-300 transition-colors mt-auto group relative flex items-center justify-center w-10 h-10"
        title="Settings"
      >
        <Settings size={20} strokeWidth={2} />
        <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-space-800 text-white text-xs px-3 py-1.5 rounded-sm whitespace-nowrap transition-opacity z-50 shadow-lg border border-space-700 font-medium">
          Settings
        </div>
      </Link>
    </aside>
  );
}
