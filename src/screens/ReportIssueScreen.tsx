import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from '../components/BottomNav';

interface ReportIssueScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ReportIssueScreen: React.FC<ReportIssueScreenProps> = ({ onNavigate }) => {
  const { activeStop, reportIssue } = useDelivery();
  const [selectedReason, setSelectedReason] = useState<string>('Access Blocked / Gate Locked');
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [driverNote, setDriverNote] = useState<string>('Scaffolding blocking service elevator entrance.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const samplePhotoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ONbWr1xM2CsgwL8Ax80UbT7NR-xE2tn8gEaoq1cpee_IG8KoxqkJpGUC08EaCz-1lMXXik2pUJPruYNyFJ49LrYi_Tp539U5QVKRUrT3pddJA-aRXAKAKAfcDNvIcUNvemSzYHGCr9ruC8rRLNT9kwwJkfGKLvQI7ZDU2TMduk8vJj3aHYWPNd1FvJatuyd9esjqNHeE-IFnlP-1axUBDRnnG2-hZ4jlqWXYZM_FLv1WAqRxNYXR';

  const reasons = [
    { id: 'unavailable', label: 'Customer Unavailable', icon: 'notifications_paused' },
    { id: 'blocked', label: 'Access Blocked / Gate Locked', icon: 'lock_open' },
    { id: 'damaged', label: 'Damaged Item', icon: 'inventory_2' },
    { id: 'refused', label: 'Customer Refused Delivery', icon: 'front_hand' },
    { id: 'hazard', label: 'Safety / Weather Hazard', icon: 'warning' },
    { id: 'other', label: 'Other Reason', icon: 'edit_note' }
  ];

  const handleSubmit = async () => {
    if (!activeStop) return;
    setIsSubmitting(true);
    try {
      await reportIssue(
        activeStop.id,
        selectedReason,
        driverNote,
        hasPhoto ? samplePhotoUrl : undefined
      );
      setTimeout(() => {
        onNavigate('MANIFEST');
      }, 700);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      <div className="space-y-4">
        {/* Mission Context Strip */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activeStop?.customerName}{' '}
                <span className="text-[11px] text-slate-400 font-normal">
                  · {activeStop?.orderId}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {activeStop?.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Active Stop
          </div>
        </div>

        {/* Section Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            What happened?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select the reason for this delivery issue
          </p>
        </div>

        {/* Reasons Grid (6 cards) */}
        <div className="grid grid-cols-2 gap-2.5">
          {reasons.map(r => {
            const isSelected = selectedReason === r.label;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReason(r.label)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'bg-orange-50/60 dark:bg-orange-950/40 border-orange-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs mt-2 leading-tight ${
                    isSelected
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'font-medium text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photo Evidence Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-500 text-[18px]">
                verified
              </span>
              Photo Evidence
            </span>
            <span className="text-[11px] text-slate-400">Recommended</span>
          </div>

          {!hasPhoto ? (
            <div
              onClick={() => setHasPhoto(true)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 mb-2 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">photo_camera</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Tap to take photo of blocked access
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Helps customer support re-route or reschedule quickly
              </p>
            </div>
          ) : (
            <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800">
              <img
                src={samplePhotoUrl}
                alt="Blocked access photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">
                    check_circle
                  </span>
                  <span>IMG_1049_ACCESS.JPG</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasPhoto(false)}
                  className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Driver Note Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Driver Note (Optional)
            </label>
            <div className="relative rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5">
              <textarea
                value={driverNote}
                onChange={e => setDriverNote(e.target.value.slice(0, 150))}
                rows={2}
                placeholder="Add specific details (e.g. gate code failed, construction on site)..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none"
              />
              <div className="flex justify-end text-[10px] text-slate-400 font-mono">
                {driverNote.length} / 150
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Action Notice */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-blue-500 text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-snug">
            Submitting will mark stop #3 as{' '}
            <strong className="text-slate-900 dark:text-white font-bold">Pending Resolution</strong>.
            You will automatically be prompted to proceed to Stop #4.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full min-h-[50px] rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>Dispatching Notice to Sarah J...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                <span>Submit Issue &amp; Notify Dispatch</span>
              </>
            )}
          </button>

          <a
            href="tel:+61262000000"
            className="w-full min-h-[46px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-slate-500 text-[18px]">
              phone_forwarded
            </span>
            <span>Call Dispatcher Directly (Sarah J.)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
