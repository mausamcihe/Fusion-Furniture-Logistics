import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { loginAsDriver, loginAsAdmin, simulateRfidScan } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'DRIVER' | 'ADMIN'>('DRIVER');
  const [driverId, setDriverId] = useState('DRV-4092');
  const [pin, setPin] = useState('8841');
  const [adminEmail, setAdminEmail] = useState('sarah.jenkins@fusionlogistics.com');
  const [adminPass, setAdminPass] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'DRIVER') {
        const res = await loginAsDriver(driverId, pin, remember);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        const res = await loginAsAdmin(adminEmail, adminPass);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Admin login failed');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRfidScan = async () => {
    setIsLoading(true);
    try {
      await simulateRfidScan();
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 text-on-surface dark:text-white">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto pt-safe flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-orange-600 dark:text-orange-500 tracking-tight leading-none">
            FUSION
          </span>
          <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-bold uppercase">
            FURNITURE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark Mode */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-label-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-blue-200 dark:border-blue-900">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            {activeTab === 'DRIVER' ? 'Driver Portal' : 'Admin Dispatch'}
          </span>
        </div>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-md mx-auto my-auto space-y-4 py-4">
        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('DRIVER')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'DRIVER'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-500 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            Employee / Driver
          </button>
          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ADMIN'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shield_person</span>
            Admin Access Level
          </button>
        </div>

        {/* Card Frame */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
          {/* Terminal Banner */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              DEPOT TERMINAL #04
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              v4.2.1-LIVE
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'DRIVER' ? 'Welcome back, Driver' : 'Central Dispatch Terminal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {activeTab === 'DRIVER'
                ? 'Enter your fleet credentials or Driver ID to authenticate your pre-trip inspection run.'
                : 'Authenticate with administrative credentials for real-time fleet oversight and RESTful API controls.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'DRIVER' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label>Driver ID / Fleet Email</label>
                    <span className="text-[11px] text-slate-400 font-mono">e.g. DRV-8841</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
                      badge
                    </span>
                    <input
                      type="text"
                      value={driverId}
                      onChange={e => setDriverId(e.target.value)}
                      placeholder="DRV-4092 or michael.c@fusionlogistics.com"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label>PIN or Password</label>
                    <button
                      type="button"
                      onClick={() => setPin('8841')}
                      className="text-[11px] text-orange-600 dark:text-orange-400 uppercase font-bold hover:underline"
                    >
                      Autofill Demo PIN
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="admin@fusionlogistics.com"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Security Passkey / 2FA
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
                      key
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Remember Me Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 mt-0.5"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Remember my vehicle &amp; session
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Keeps telematics paired for 14h shift
                </span>
              </div>
            </label>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-xl text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
                activeTab === 'DRIVER'
                  ? 'bg-orange-600 hover:bg-orange-500'
                  : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {activeTab === 'DRIVER' ? 'Sign In & Start Shift' : 'Access Admin Console'}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* RFID / NFC Tap Option */}
          {activeTab === 'DRIVER' && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                <span className="uppercase text-[10px] tracking-wider font-semibold">
                  Or Tap At Gate
                </span>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={handleRfidScan}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left transition-colors active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">contactless</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Scan RFID Badge / NFC Keycard
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Hold badge to top of device
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  sensors
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Floor Dispatch Lead Contact Banner */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                SJ
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900"></span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Floor Dispatch Lead
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Sarah Jenkins (Desk 02)
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                • Available now
              </span>
            </div>
          </div>

          <a
            href="tel:+61262000000"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            Direct Call
          </a>
        </div>
      </div>

      {/* Footer Compliance Text */}
      <div className="w-full text-center pb-safe pt-2">
        <p className="text-[11px] text-slate-400 font-medium">
          DOT Compliance &amp; ELD Telematics Synced · 256-Bit Hardware Security
        </p>
      </div>
    </div>
  );
};
