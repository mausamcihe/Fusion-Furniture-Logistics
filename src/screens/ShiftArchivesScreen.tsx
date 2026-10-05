import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { ShiftLog } from '../types';
import { ScreenType } from '../components/BottomNav';

interface ShiftArchivesScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ShiftArchivesScreen: React.FC<ShiftArchivesScreenProps> = ({ onNavigate }) => {
  const { shiftLogs } = useDelivery();
  const [selectedFilter, setSelectedFilter] = useState<'7d' | 'month' | 'all'>('7d');
  const [selectedShift, setSelectedShift] = useState<ShiftLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleExport = () => {
    showToast('Full verified PDF manifest emailed to logged-in driver');
  };

  const handleDownloadReceipt = () => {
    setSelectedShift(null);
    setTimeout(() => {
      showToast('Shift run receipt & POD log exported successfully');
    }, 300);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedFilter('7d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedFilter === '7d'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            Last 7 Days
          </button>
          <button
            onClick={() => setSelectedFilter('month')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedFilter === 'month'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All-Time (2024)
          </button>
        </div>

        {/* Metrics Summary Strip (Tactical Operational Bento) */}
        <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col p-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Past Runs</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                14
              </span>
              <span className="text-[11px] text-slate-400">shifts</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +2 w/w
            </span>
          </div>

          <div className="flex flex-col p-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Delivered</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                78
              </span>
              <span className="text-[11px] text-slate-400">pkgs</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              100% sync
            </span>
          </div>

          <div className="flex flex-col p-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">On-Time</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                99.1
              </span>
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-bold">%</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Tier 1
            </span>
          </div>
        </div>

        {/* Active Route Telemetry Mini Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-orange-600 shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                Assigned Van: <span className="font-bold">VAN-01 (Ford Transit)</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Depot: SE Metro Distribution Center
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Active
          </span>
        </div>

        {/* Shift Run List Section Header */}
        <div className="flex items-center justify-between pt-1 px-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Archived Shift Logs</h2>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            TAP TO INSPECT
          </span>
        </div>

        {/* Shift Cards List */}
        <div className="space-y-3">
          {shiftLogs.map(log => {
            const isRescheduled = log.status === '1 Rescheduled';
            return (
              <div
                key={log.id}
                onClick={() => setSelectedShift(log)}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border transition-all cursor-pointer space-y-2 relative overflow-hidden active:scale-[0.99] ${
                  isRescheduled
                    ? 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {log.id === 'SR-8921' && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                        Yesterday
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {log.displayDate}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isRescheduled
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRescheduled ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                    {log.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {log.stopsCompleted} Stops ({log.stopsTotal} Done)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {log.vehicle.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {log.duration}
                    </span>
                  </div>
                </div>

                {isRescheduled && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">
                      info
                    </span>
                    <span className="truncate">{log.notes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <span>View Manifest &amp; PODs</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">ID: #{log.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Route Archival Snapshot Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-[20px]">route</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Zone Footprint
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">478.2 Total Miles</span>
          </div>

          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYFGYpJpgZqreWF8XPRBC9_BMmtqVGQgdLxQyQ75oliWJlE8TXmMSDrxBz3AxzuiBitsdHbHfQPem9KPPasXKNb5wTk_nOQre-QjOdHZ7qcMH9h2HuuJos3667FKz8wAJ6TzgB8avWIwfxXWbLOcWcfZwudorP5HNLLF_PwP5oFXH1F6ZZNEo422oAAct-ztNcZjmm7AhTmJwgZHmfdWI46ijtV-bjMrrhCN71CB8crSzWAEogqmlE"
              alt="Zone Footprint Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Geofenced Zone 4-B audited</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Anchor */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={handleExport}
            className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            <span>Export / Email Verified Manifest</span>
          </button>
          <p className="text-center text-[11px] text-slate-400">
            Includes verified timestamps, GPS coordinates &amp; customer digital PODs.
          </p>
        </div>
      </div>

      {/* Slide-out Run Inspection Drawer */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom duration-300">
            {/* Grabber */}
            <div className="w-full flex justify-center pb-1">
              <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            </div>

            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                  Dispatch Audit Preview
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedShift.displayDate}
                </h3>
                <span className="text-xs text-slate-400">{selectedShift.depot}</span>
              </div>
              <button
                onClick={() => setSelectedShift(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Total Odo Mileage
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {selectedShift.mileage}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                  Route efficiency: 98%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Signed PODs
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {selectedShift.podsCount} Validated
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  E-Sign &amp; Photos OK
                </span>
              </div>
            </div>

            {/* Details Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle Unit</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedShift.vehicle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Run Time</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {selectedShift.duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Delivery Status</span>
                <span className="font-bold text-emerald-600">
                  {selectedShift.stopsCompleted} / {selectedShift.stopsTotal} Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shift Flag / Note</span>
                <span className="text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px]">
                  {selectedShift.notes}
                </span>
              </div>
            </div>

            {/* POD Samples */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Captured POD Samples
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEAUlGNKG3Wo4gEB8nOU9CjBZIpO9tPiHY8yAETLuPGAXUsN4HTpuvAMe9bCNgyhe72z2hHlXfjDYDH_NgdHUapuJcIoPXzcDmx_2OPCdL4ccsIy4Y2iiYmLGOydxTZm7H-AmPw4EqO-Jj9FbWG5wUnCeXNglnJCPPPzkfJX1d8nrf6dgTlzv2GU9djD7tpLhxOwo_pFWAFrcLHN7-NXfaurroRCp-HCZmTp3qhNUJot7T91-Y7Zd6"
                    alt="Doorstep POD"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9io9JPDsF14ff3FU3Rxrz1zOOudZn5aglREF8OiJYCWHb8_kdpzu6faCyvR8fpXWP_cmSojRrmCtLwN_3yTGrRTeYFjNfX-JPlmA7cxSxLZ107uB_z5FGLNtM3LeinjqR91TswXTIysT89BdjUi1szpxmBQ0hr5eHHfOsmcfx3X866Y9dCjWRxSdL_y98vReVA-l4fFIjB0bZ6FSTeIhDYUUZIFDWn3ZkN-ni-Oi8qsdqNiT1QhqZ"
                    alt="Loading dock POD"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-[24px]">signature</span>
                  <span className="text-[10px] font-mono mt-0.5">E-Sign #6</span>
                </div>
              </div>
            </div>

            {/* Actions in drawer */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Export Shift Receipt &amp; Fuel Slip</span>
              </button>
              <button
                onClick={() => setSelectedShift(null)}
                className="w-full h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Dismiss Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
