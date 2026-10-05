import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { useAuth } from '../context/AuthContext';
import { ScreenType } from '../components/BottomNav';

interface ManifestScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ManifestScreen: React.FC<ManifestScreenProps> = ({ onNavigate }) => {
  const { stops, setActiveStopId } = useDelivery();
  const { user } = useAuth();
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const completedCount = stops.filter(s => s.status === 'DELIVERED').length;
  const pendingCount = stops.filter(s => s.status !== 'DELIVERED').length;
  const progressPercent = Math.round((completedCount / stops.length) * 100);

  const filteredStops = stops.filter(stop => {
    if (filterTab === 'COMPLETED') return stop.status === 'DELIVERED';
    if (filterTab === 'PENDING') return stop.status !== 'DELIVERED';
    return true;
  });

  const handleOpenStop = (stopId: string) => {
    setActiveStopId(stopId);
    onNavigate('MAP');
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-md mx-auto px-4 pt-20">
      {/* Top Meta Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {user?.name || 'Michael Chen'}
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {user?.vehicleId?.split(' ')[0] || 'Van 01'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            Active
          </span>
        </div>

        <button
          onClick={() => onNavigate('DIRECTORY')}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline uppercase tracking-wider flex items-center gap-1"
        >
          <span>All Stops</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* Daily Manifest Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 my-2">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Daily Manifest
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Thursday, 2 Oct
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
          </div>
        </div>

        {/* Run Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Run Progress</span>
            <span className="text-slate-900 dark:text-white font-mono font-bold">
              {progressPercent}% Done
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>
              {stops.length} Total Stops • {completedCount} Done • {pendingCount} Left
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 text-xs font-semibold my-2">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterTab === 'ALL'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({stops.length})
        </button>
        <button
          onClick={() => setFilterTab('PENDING')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterTab === 'PENDING'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab('COMPLETED')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filterTab === 'COMPLETED'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Stops List */}
      <div className="space-y-3 mt-2">
        {filteredStops.map(stop => {
          const isDelivered = stop.status === 'DELIVERED';
          const isActive = stop.status === 'ACTIVE';
          const isRescheduled = stop.status === 'RESCHEDULED';

          return (
            <div
              key={stop.id}
              className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-2 border-orange-500 shadow-md p-4 space-y-3'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-2'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    STOP {stop.sequenceNumber.toString().padStart(2, '0')} {stop.orderId}
                  </span>
                </div>

                {isDelivered && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    {stop.completedTime || '09:15 AM'}
                  </span>
                )}

                {isActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 text-[11px] font-bold flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                    ACTIVE / EN ROUTE
                  </span>
                )}

                {isRescheduled && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Rescheduled
                  </span>
                )}

                {stop.status === 'UPCOMING' && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                    • UPCOMING
                  </span>
                )}
              </div>

              {/* Recipient & Address */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {stop.customerName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-orange-500">
                    location_on
                  </span>
                  {stop.address}, {stop.suburb}
                </p>
              </div>

              {/* Window / Estimated arrival */}
              {isActive && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      schedule
                    </span>
                    <span>
                      Window: {stop.deliveryWindow} (Est. arrival {stop.eta})
                    </span>
                  </div>

                  {/* Items badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      {stop.items.length} Items
                    </span>
                    {stop.items.map(item => (
                      <span
                        key={item.id}
                        className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-medium"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>

                  {/* Open Current Stop Button */}
                  <button
                    onClick={() => handleOpenStop(stop.id)}
                    className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Open Current Stop</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              )}

              {!isActive && (
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>{stop.deliveryWindow}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">inventory_2</span>
                    <span>{stop.items.length} Items</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need to Reorder Stops? Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Need to reorder stops?
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Open Planner or Contact Dispatch Lead: Sarah J.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('PLANNER')}
          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
        >
          <span>Planner</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
