import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from '../components/BottomNav';

interface StopArrivalScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const StopArrivalScreen: React.FC<StopArrivalScreenProps> = ({ onNavigate }) => {
  const { activeStop, toggleItemCheck } = useDelivery();
  const [copied, setCopied] = useState(false);

  const items = activeStop?.items || [];
  const checkedCount = items.filter(i => i.checked).length;
  const allChecked = items.length > 0 && checkedCount === items.length;

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-32 max-w-md mx-auto px-4 pt-20">
      {/* Top Status Pills */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full uppercase tracking-wider font-mono">
          STOP {activeStop?.sequenceNumber} OF 5
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Vehicle Stationary
        </span>
      </div>

      {/* Main Arrival Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 space-y-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              Arrived at Destination
            </span>
          </div>
          <span className="text-slate-400 text-xs font-mono">10:42 AM</span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeStop?.customerName}
          </h2>
          <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-1">
            <span className="material-symbols-outlined text-[16px] text-orange-500 shrink-0 mt-0.5">
              location_on
            </span>
            <p className="leading-snug">
              {activeStop?.address}, {activeStop?.suburb}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`tel:${activeStop?.customerPhone}`}
            className="min-h-[46px] px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-orange-600">call</span>
            <span>Call Customer</span>
          </a>

          <button
            onClick={() => copyCode(activeStop?.gateCode || '#402')}
            className="min-h-[46px] px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">key</span>
            <span>{copied ? `Copied ${activeStop?.gateCode || 'Code'}!` : `Code: ${activeStop?.gateCode || 'None'}`}</span>
          </button>
        </div>
      </div>

      {/* Delivery Instruction Card */}
      <div className="bg-slate-100 dark:bg-slate-800/90 rounded-2xl p-4 mb-4 flex items-start gap-3 border border-slate-200/80 dark:border-slate-700/80">
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5 shadow-xs">
          <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
            Delivery Instruction
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {activeStop?.deliveryInstruction || 'Front door ground level delivery requested.'}
          </p>
        </div>
      </div>

      {/* Items to Offload Checklist */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Items to Offload</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold font-mono">
              {checkedCount}/{items.length} Checked
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Tap to verify offload</span>
        </div>

        <div className="space-y-2">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => activeStop && toggleItemCheck(activeStop.id, item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                item.checked
                  ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-colors shrink-0 ${
                    item.checked ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px]">
                  {item.category === 'mattress' ? 'bed' : 'inventory_2'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Verification Banner */}
        <div
          className={`p-3 rounded-xl flex items-center gap-2.5 transition-all ${
            allChecked
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] shrink-0">
            {allChecked ? 'task_alt' : 'info'}
          </span>
          <p className="text-xs font-semibold leading-tight">
            {allChecked
              ? 'All items verified and ready for customer digital handover.'
              : `${items.length - checkedCount} item(s) remaining to inspect before customer handover.`}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action Panel */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-3 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto space-y-2">
          <button
            onClick={() => onNavigate('HANDOVER')}
            disabled={!allChecked}
            className={`w-full min-h-[50px] rounded-xl text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              allChecked
                ? 'bg-orange-600 hover:bg-orange-500'
                : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Proceed to Handover</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <button
            onClick={() => onNavigate('ISSUE')}
            className="w-full py-1 text-center text-xs text-slate-500 hover:text-red-600 flex items-center justify-center gap-1 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>Having trouble? Report an Issue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
