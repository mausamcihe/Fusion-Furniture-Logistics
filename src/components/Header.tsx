import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDelivery } from '../context/DeliveryContext';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  onOpenEncryptionInspector?: () => void;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showBack = true,
  onOpenEncryptionInspector,
  onOpenChat
}) => {
  const { user, switchRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { telemetry } = useDelivery();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              aria-label="Go Back"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          {/* Fusion Furniture Logo badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] tracking-tight text-orange-600 dark:text-orange-500 leading-none">
                FUSION
              </span>
              <span className="text-[9px] tracking-widest text-slate-500 dark:text-slate-400 font-bold uppercase leading-tight">
                FURNITURE
              </span>
            </div>
            <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>
            <h1 className="font-headline-md text-[17px] text-slate-900 dark:text-slate-100 truncate font-semibold">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Action Icons: TLS lock, Dark Mode, Hotline, Role & Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Real-time Encryption Indicator (Non-intrusive status badge) */}
          <div
            title="TLS 1.3 / AES-256 Telemetry Encrypted"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold select-none"
          >
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span className="hidden sm:inline">Secure</span>
          </div>

          {/* Live Chat with Customer/Dispatch */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              title="Open Live Delivery Chat"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            </button>
          )}

          {/* Dark / Day Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Day Mode (Light)' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Dispatch Hotline Direct Call */}
          <a
            href="tel:+61262000000"
            title="Call Dispatch Lead"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
          </a>

          {/* User Profile / Access Level Toggle Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[12px] shadow-sm hover:ring-2 hover:ring-orange-400 transition-all"
              title={`${user?.name} (${user?.role})`}
            >
              {user?.role === 'ADMIN' ? (
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">person</span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px] text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      user?.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {user?.vehicleId || user?.depot}
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="p-2 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 tracking-wider">
                    Access Level Switching
                  </span>
                  <button
                    onClick={() => { switchRole('DRIVER'); setShowUserMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[12px] flex items-center justify-between transition-colors ${
                      user?.role === 'DRIVER'
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      Driver (Michael Chen)
                    </span>
                    {user?.role === 'DRIVER' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>

                  <button
                    onClick={() => { switchRole('ADMIN'); setShowUserMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[12px] flex items-center justify-between transition-colors ${
                      user?.role === 'ADMIN'
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">shield_person</span>
                      Admin Dispatch (Sarah Jenkins)
                    </span>
                    {user?.role === 'ADMIN' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-1 px-2">
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out Terminal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
