import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from '../components/BottomNav';

interface ManifestPlannerScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ManifestPlannerScreen: React.FC<ManifestPlannerScreenProps> = ({ onNavigate }) => {
  const {
    stops,
    moveStop,
    applySuggestedSwap,
    autoOptimizeRoute,
    trafficSwapApplied
  } = useDelivery();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApplyingNav, setIsApplyingNav] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleApplyNav = () => {
    setIsApplyingNav(true);
    setTimeout(() => {
      setIsApplyingNav(false);
      showToast('Navigation waypoints synced with GPS device');
      setTimeout(() => onNavigate('MAP'), 600);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 p-3 rounded-xl bg-slate-900 text-white shadow-xl flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400 text-[18px]">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
          <span className="text-emerald-400 font-mono">-22 MIN</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Context Subhead */}
        <div className="space-y-1">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Reorder stops or request dispatch route adjustment for optimal fuel and traffic flow.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-orange-600 text-[16px]">alt_route</span>
            <span className="text-[11px]">Live sync with Canberra Central Depot</span>
          </div>
        </div>

        {/* Traffic Obstruction Advisory Banner */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            trafficSwapApplied
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                trafficSwapApplied
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {trafficSwapApplied ? 'check_circle' : 'warning'}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {trafficSwapApplied
                  ? 'Parkes Way Bypass Applied'
                  : 'Traffic Obstruction Alert'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                {trafficSwapApplied
                  ? 'Stop #4 swapped before Stop #3. Saving 22 mins of idling.'
                  : 'Road closure on Parkes Way (+18m delay). Suggested swap: Stop #4 before Stop #3.'}
              </p>
            </div>
          </div>

          {!trafficSwapApplied && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-amber-200/60 dark:border-amber-900/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-white font-semibold">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">bolt</span>
                <span>AI Recommendation Ready</span>
              </div>
              <button
                onClick={() => {
                  applySuggestedSwap();
                  showToast('AI Swap applied (-22 mins)!');
                }}
                className="px-3 py-1 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>Apply Swap</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* Route Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops Left</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
              3 / 5
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Finish</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
              {trafficSwapApplied ? '3:20 PM' : '3:42 PM'}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel Status</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
              84% Full
            </span>
          </div>
        </div>

        {/* Sequence Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            Manifest Sequence
          </span>
          <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
            Tap arrows to reorder
          </span>
        </div>

        {/* Stops Sequence Container */}
        <div className="space-y-2.5">
          {stops.map(stop => {
            const isCompleted = stop.status === 'DELIVERED';
            const isActive = stop.status === 'ACTIVE';

            if (isCompleted) {
              return (
                <div
                  key={stop.id}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 opacity-75 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      lock
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {stop.sequenceNumber.toString().padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                          {stop.customerName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {stop.address} · {stop.suburb}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Delivered
                  </span>
                </div>
              );
            }

            return (
              <div
                key={stop.id}
                className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border transition-all flex items-center justify-between ${
                  isActive
                    ? 'border-orange-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    drag_indicator
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {stop.sequenceNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {stop.customerName}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950 text-orange-600">
                          Active
                        </span>
                      )}
                      {stop.priority === 'HIGH' && !isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                          Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {stop.address}, {stop.suburb}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>Est: {stop.eta}</span>
                      {stop.id === '3' && !trafficSwapApplied && (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          • In Delay Zone
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex flex-col gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => {
                      moveStop(stop.id, 'up');
                      showToast('Stop shifted earlier in route');
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-90 transition-all"
                    title="Move stop earlier"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  <button
                    onClick={() => {
                      moveStop(stop.id, 'down');
                      showToast('Stop shifted later in route');
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-90 transition-all"
                    title="Move stop later"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Route Segment Preview Map Card */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm h-32">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYFGYpJpgZqreWF8XPRBC9_BMmtqVGQgdLxQyQ75oliWJlE8TXmMSDrxBz3AxzuiBitsdHbHfQPem9KPPasXKNb5wTk_nOQre-QjOdHZ7qcMH9h2HuuJos3667FKz8wAJ6TzgB8avWIwfxXWbLOcWcfZwudorP5HNLLF_PwP5oFXH1F6ZZNEo422oAAct-ztNcZjmm7AhTmJwgZHmfdWI46ijtV-bjMrrhCN71CB8crSzWAEogqmlE"
            alt="Telemetry Vector Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3 justify-between text-white">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="material-symbols-outlined text-orange-400 text-[18px]">route</span>
              <span>Telemetry Vector Preview</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white">
              Live Traffic Dynamic
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              autoOptimizeRoute();
              showToast('Route auto-optimized (-14 km / 22 mins)!');
            }}
            className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-orange-500 text-[20px]">
              auto_fix_high
            </span>
            <span>Auto-Optimize Route (Save 14 km / 22 mins)</span>
          </button>

          <button
            onClick={handleApplyNav}
            disabled={isApplyingNav}
            className="w-full min-h-[50px] rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isApplyingNav ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>Recalculating GPS Waypoints...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">navigation</span>
                <span>Apply Sequence &amp; Update Navigation</span>
              </>
            )}
          </button>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">sync</span>
              Notifies Fleet Supervisor in real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
