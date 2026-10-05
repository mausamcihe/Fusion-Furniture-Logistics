import React from 'react';
import { useAuth } from '../context/AuthContext';

export type ScreenType =
  | 'SPLASH'
  | 'AUTH'
  | 'MANIFEST'
  | 'MAP'
  | 'ARRIVAL'
  | 'HANDOVER'
  | 'PLANNER'
  | 'ISSUE'
  | 'SUMMARY'
  | 'ARCHIVES'
  | 'DIRECTORY'
  | 'CUSTOMER_TRACKING'
  | 'ADMIN_FLEET';

interface BottomNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onSelectScreen }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const navItems: { screen: ScreenType; label: string; icon: string }[] = [
    { screen: 'MANIFEST', label: "Today's Run", icon: 'local_shipping' },
    { screen: 'MAP', label: 'Route Map', icon: 'map' },
    { screen: 'DIRECTORY', label: 'Directory', icon: 'menu_book' },
    { screen: 'CUSTOMER_TRACKING', label: 'Live Tracking', icon: 'track_changes' },
    { screen: isAdmin ? 'ADMIN_FLEET' : 'SUMMARY', label: isAdmin ? 'Fleet & API' : 'Shift Logs', icon: isAdmin ? 'admin_panel_settings' : 'fact_check' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {navItems.map(item => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onSelectScreen(item.screen)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive
                  ? 'text-orange-600 dark:text-orange-500 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                {item.screen === 'CUSTOMER_TRACKING' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                )}
              </div>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
