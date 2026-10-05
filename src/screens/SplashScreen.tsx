import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-orange-50/50 via-surface to-surface dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 text-on-surface dark:text-white select-none">
      {/* Top Status Header */}
      <div className="w-full flex items-center justify-between pt-safe text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FL-NET CONNECTED
        </span>
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          TLS 1.3 SECURE
        </span>
      </div>

      {/* Center Branding & Progress */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        <div className="flex flex-col items-center mb-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-orange-600 dark:text-orange-500">
            FUSION
          </h1>
          <span className="text-lg font-bold tracking-[0.3em] text-slate-900 dark:text-white -mt-1">
            FURNITURE
          </span>
        </div>

        <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-4 mb-8">
          Driver Mobile Suite · Fleet Network
        </p>

        {/* Route Optimization Box */}
        <div className="w-full bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-orange-500 animate-spin">
                sync
              </span>
              Route optimization completed.
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-mono">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="mt-6 text-xs text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-wider font-semibold"
        >
          Skip Launch Sequence &rarr;
        </button>
      </div>

      {/* Bottom Terminal Footer */}
      <div className="w-full flex flex-col items-center gap-2 pb-safe text-xs text-slate-500 dark:text-slate-400">
        <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Terminal: <strong className="text-slate-700 dark:text-slate-200">FL-AU-409 · Canberra Depot 01</strong>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>v4.18.2-prod</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            Geofence Locked
          </span>
        </div>
      </div>
    </div>
  );
};
