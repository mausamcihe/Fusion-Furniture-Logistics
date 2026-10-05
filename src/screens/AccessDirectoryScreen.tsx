import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { DeliveryStop } from '../types';
import { ScreenType } from '../components/BottomNav';

interface AccessDirectoryScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const AccessDirectoryScreen: React.FC<AccessDirectoryScreenProps> = ({ onNavigate }) => {
  const { stops, setActiveStopId } = useDelivery();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gate' | 'dock' | 'concierge'>('all');
  const [expandedStops, setExpandedStops] = useState<Record<string, boolean>>({ '1': false, '2': false, '4': false, '5': false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${text} to clipboard`);
  };

  const toggleExpand = (stopId: string) => {
    setExpandedStops(prev => ({ ...prev, [stopId]: !prev[stopId] }));
  };

  const toggleExpandAll = () => {
    const areAllExpanded = Object.values(expandedStops).every(Boolean);
    const newState: Record<string, boolean> = {};
    stops.forEach(s => { newState[s.id] = !areAllExpanded; });
    setExpandedStops(newState);
  };

  // Filter remaining stops (excluding Stop 3 which is highlighted at top)
  const remainingStops = stops.filter(s => s.id !== '3').filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.customerName.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.suburb.toLowerCase().includes(q) ||
      (s.gateCode && s.gateCode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-orange-400 text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Search Bar & Filters */}
        <div className="bg-slate-100 dark:bg-slate-800/90 rounded-2xl p-3 space-y-2 border border-slate-200 dark:border-slate-700">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customer, address, or gate code..."
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full uppercase transition-all shrink-0 ${
                filterType === 'all'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Stops
            </button>
            <button
              onClick={() => setFilterType('gate')}
              className={`px-3 py-1 rounded-full uppercase transition-all shrink-0 ${
                filterType === 'gate'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              Gate Codes
            </button>
            <button
              onClick={() => setFilterType('dock')}
              className={`px-3 py-1 rounded-full uppercase transition-all shrink-0 ${
                filterType === 'dock'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              Docks &amp; Bays
            </button>
            <button
              onClick={() => setFilterType('concierge')}
              className={`px-3 py-1 rounded-full uppercase transition-all shrink-0 ${
                filterType === 'concierge'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              Desk Security
            </button>
          </div>
        </div>

        {/* Active Stop Highlight Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          {/* Orange Accent Bar */}
          <div className="h-1.5 w-full bg-orange-600"></div>

          <div className="p-4 space-y-3.5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[11px] font-bold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                  Active Stop 03
                </span>
                <span className="text-xs text-slate-400 font-mono">ETA 11:24 AM</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                Priority High
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                James Wilson
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-orange-500">
                  location_on
                </span>
                42 Constitution Ave, Canberra ACT
              </p>
            </div>

            {/* Rapid Access Codes Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Gate Entry Code
                  </span>
                  <span className="material-symbols-outlined text-[16px]">pin</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    #402
                  </span>
                  <button
                    onClick={() => copyToClipboard('#402')}
                    className="h-8 px-2 rounded-lg bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase flex items-center gap-1 shadow-2xs border border-slate-200 dark:border-slate-600 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Key Box 14B</span>
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    9921
                  </span>
                  <button
                    onClick={() => copyToClipboard('9921')}
                    className="h-8 px-2 rounded-lg bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase flex items-center gap-1 shadow-2xs border border-slate-200 dark:border-slate-600 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Directives */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-start gap-2.5 border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">doorbell</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Intercom / Buzzer Instructions
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                    Ring buzzer <strong className="font-bold">12</strong> then press{' '}
                    <strong className="font-bold">#</strong>. Elevator physical key required on 2nd
                    level.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-start gap-2.5 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-amber-600 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">
                    Loading Bay Directives
                  </span>
                  <p className="mt-0.5 leading-snug">
                    Rear alleyway dock clearance <strong className="font-bold">3.2m</strong>. Authorized double parking for 20m with hazard lights active.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                    DK
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Building Concierge
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">
                      David K.
                    </span>
                  </div>
                </div>

                <a
                  href="tel:+61262000000"
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>Direct</span>
                </a>
              </div>
            </div>

            {/* Gate Reference Photo */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-32">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfeBYMlpd7y-dgtnvceBo8gVet5RhT5rEIGetzs6Me6_ZWNUvvYzBf_oZYjSOYUpVKGMoPm1i76dZllpnIWS1-4GDf95UtP-kAqV2p_l1x36y4DlkbAGlFGVBI8LnBX7vTdW-brHGIOdFcBxd98BzgqozI71pmum-GKZx2H3B-Nw167VCjGCl0qCtV9_ldDms4WJzZmxlOp_L6byqEwkJyB_22ua162PtyNZsnt1PevGWzOgq73FX8"
                alt="Rear delivery gate"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                <span>Rear Delivery Gate Reference</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Remaining Stops
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold font-mono">
              {remainingStops.length} stops
            </span>
          </div>
          <button
            onClick={toggleExpandAll}
            className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider hover:underline"
          >
            {Object.values(expandedStops).every(Boolean) ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Stops Directory Accordion List */}
        <div className="space-y-2">
          {remainingStops.map(stop => {
            const isExpanded = !!expandedStops[stop.id];
            return (
              <div
                key={stop.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(stop.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                      {stop.sequenceNumber.toString().padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {stop.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {stop.address}, {stop.suburb}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {stop.gateCode && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-bold font-mono">
                        {stop.gateCode}
                      </span>
                    )}
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform text-[20px] ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[10px] uppercase font-bold">Delivery Protocol</span>
                        <span className="material-symbols-outlined text-[16px] text-emerald-500">
                          lock_open
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">
                        {stop.intercomNote || 'Proceed with standard handover.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Window: {stop.deliveryWindow}
                      </span>
                      {stop.gateCode && (
                        <button
                          onClick={() => copyToClipboard(stop.gateCode!)}
                          className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          <span>Copy Code</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
