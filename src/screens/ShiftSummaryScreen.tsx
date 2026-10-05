import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { useAuth } from '../context/AuthContext';
import { ScreenType } from '../components/BottomNav';

interface ShiftSummaryScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ShiftSummaryScreen: React.FC<ShiftSummaryScreenProps> = ({ onNavigate }) => {
  const { stops, depotChecked, toggleDepotCheck, clockOutShift, isShiftCompleted } = useDelivery();
  const { user } = useAuth();
  const [isClockingOut, setIsClockingOut] = useState(false);

  const deliveredCount = stops.filter(s => s.status === 'DELIVERED').length;
  const rescheduledCount = stops.filter(s => s.status === 'RESCHEDULED').length;

  const handleClockOut = () => {
    setIsClockingOut(true);
    setTimeout(() => {
      setIsClockingOut(false);
      clockOutShift();
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      <div className="space-y-4">
        {/* Celebration / Completion Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Celebration Badge with Vehicle mini-indicator */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[28px]">task_alt</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Great job, {user?.name.split(' ')[0] || 'Michael'}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 justify-center">
            <span>Today's run is completed</span>
            <span>•</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              Thursday, 2 Oct
            </span>
          </p>
        </div>

        {/* 3-Card Key Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 flex flex-col items-center text-center border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Stops</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
              {stops.length}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Total Route</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 flex flex-col items-center text-center border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Delivered</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">
              {deliveredCount}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {Math.round((deliveredCount / stops.length) * 100)}% Done
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 flex flex-col items-center text-center border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-amber-600">Rescheduled</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono mt-0.5">
              {rescheduledCount || 1}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="text-[10px] text-amber-600 font-semibold">Access Issue</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Depot Return Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-[20px]">warehouse</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Van 01 · Depot Bay 4
                </h3>
                <p className="text-[11px] text-slate-500">Assigned Parking &amp; Handover</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              BAY-04
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 flex items-center justify-between border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[16px]">speed</span>
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  42,891 mi
                </p>
                <p className="text-[10px] text-slate-400">End Shift Odometer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined text-[16px]">local_gas_station</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  78% Full
                </p>
                <p className="text-[10px] text-slate-400">Fuel Level</p>
              </div>
            </div>
          </div>

          {/* Interactive Checklist Toggle */}
          <button
            type="button"
            onClick={toggleDepotCheck}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  depotChecked ? 'text-emerald-500' : 'text-slate-400'
                }`}
              >
                {depotChecked ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Van returned &amp; fuel checked
              </span>
            </div>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                depotChecked
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
              }`}
            >
              {depotChecked ? 'Verified' : 'Pending'}
            </span>
          </button>
        </div>

        {/* Deliveries Breakdown Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">
                fact_check
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Deliveries Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">5 Stops</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Stop 1 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    #1 Sarah Johnson
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">14 Barrier St, Fyshwick</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  Delivered
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">09:42 AM</span>
              </div>
            </div>

            {/* Stop 2 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    #2 Marcus Brody
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">74 Denison St, Deakin</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  Delivered
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">11:15 AM</span>
              </div>
            </div>

            {/* Stop 3 - Rescheduled notice */}
            <div className="p-3.5 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">event_repeat</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    #3 James Wilson · DLV-1049
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 truncate">
                    Gate lock broken / Scaffolding obstruction
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                  Rescheduled
                </span>
                <span className="block text-[10px] text-amber-600 font-mono mt-0.5">01:05 PM</span>
              </div>
            </div>

            {/* Stop 4 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    #4 Olivia Martin
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">12 Eyre St, Kingston</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  Delivered
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">02:30 PM</span>
              </div>
            </div>

            {/* Stop 5 */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    #5 Daniel Smith
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">28 Stuart St, Griffith</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  Delivered
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">03:54 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleClockOut}
            disabled={isClockingOut || isShiftCompleted}
            className={`w-full h-12 rounded-xl text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
              isShiftCompleted
                ? 'bg-emerald-600'
                : 'bg-orange-600 hover:bg-orange-500'
            }`}
          >
            {isClockingOut ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>Clocking Out &amp; Syncing Depot...</span>
              </>
            ) : isShiftCompleted ? (
              <>
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Shift Closed · Depot Handover Completed</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">timer_off</span>
                <span>Clock Out &amp; Finish Shift</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ARCHIVES')}
            className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-slate-500 text-[18px]">history</span>
            <span>View Run History &amp; Archived Shift Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
