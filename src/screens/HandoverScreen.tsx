import React, { useRef, useState, useEffect } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { DeliveryStop } from '../types';
import { ScreenType } from '../components/BottomNav';

interface HandoverScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({ onNavigate }) => {
  const { activeStop, completeHandover } = useDelivery();
  const [recipientName, setRecipientName] = useState(activeStop?.customerName || 'James Wilson');
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedNextStop, setCompletedNextStop] = useState<DeliveryStop | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (activeStop?.customerName) {
      setRecipientName(activeStop.customerName);
    }
  }, [activeStop?.customerName]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const samplePhotoUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEAUlGNKG3Wo4gEB8nOU9CjBZIpO9tPiHY8yAETLuPGAXUsN4HTpuvAMe9bCNgyhe72z2hHlXfjDYDH_NgdHUapuJcIoPXzcDmx_2OPCdL4ccsIy4Y2iiYmLGOydxTZm7H-AmPw4EqO-Jj9FbWG5wUnCeXNglnJCPPPzkfJX1d8nrf6dgTlzv2GU9djD7tpLhxOwo_pFWAFrcLHN7-NXfaurroRCp-HCZmTp3qhNUJot7T91-Y7Zd6';

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Auto-countdown after completion to smoothly advance to next stop navigation
  useEffect(() => {
    if (!completedNextStop) return;
    if (countdown <= 0) {
      onNavigate('MAP');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [completedNextStop, countdown, onNavigate]);

  const handleConfirm = async () => {
    if (!activeStop) return;
    setIsSubmitting(true);
    try {
      const res = await completeHandover(
        activeStop.id,
        'SIGNATURE_DATA_CAPTURED',
        samplePhotoUrl,
        recipientName
      );

      if (res.nextStop) {
        setCompletedNextStop(res.nextStop);
        setCountdown(3);
      } else {
        // If no more stops, go to shift summary
        onNavigate('SUMMARY');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      {/* Auto-Routing Transition Overlay */}
      {completedNextStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
            {/* Animated Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[36px]">task_alt</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Stop Completed &amp; Verified
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Handover Successful!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Digital POD encrypted &amp; synced with Canberra Depot.
              </p>
            </div>

            {/* Next Stop Card */}
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-500/60 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                  Next Active Delivery
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-200/60 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200">
                  {completedNextStop.orderId}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {completedNextStop.customerName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-orange-500">
                    location_on
                  </span>
                  {completedNextStop.address}, {completedNextStop.suburb}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Window: {completedNextStop.deliveryWindow}</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {completedNextStop.items.length} Packages
                </span>
              </div>
            </div>

            {/* Countdown and Action */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigate('MAP')}
                className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Start Navigation to Stop #{completedNextStop.sequenceNumber}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <p className="text-[11px] text-slate-400 font-mono">
                Auto-starting live GPS route in {countdown}s...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div>
          <span className="text-[11px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
            Proof of Delivery · Handover
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Signature &amp; POD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Order #{activeStop?.orderId} · {activeStop?.customerName} ({activeStop?.address})
          </p>
        </div>

        {/* Recipient Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Recipient Received By:
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
            <span>Identity matched with manifest delivery sheet</span>
          </div>
        </div>

        {/* Interactive E-Signature Pad */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-orange-500">draw</span>
              Customer E-Signature
            </span>
            <button
              onClick={clearSignature}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase"
            >
              Clear Canvas
            </button>
          </div>

          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden h-36 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={350}
              height={144}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
            {!hasSignature && (
              <span className="absolute text-xs text-slate-400 pointer-events-none select-none">
                Sign with finger or stylus inside box
              </span>
            )}
          </div>
        </div>

        {/* Photo Evidence Capture */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-blue-500">photo_camera</span>
              Photo of Delivered Furniture
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">1 Photo Attached</span>
          </div>

          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src={samplePhotoUrl}
              alt="Delivered package"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">task_alt</span>
                <span>POD_{activeStop?.orderId}_CANBERRA.JPG</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">AEST Synced</span>
            </div>
          </div>
        </div>

        {/* Verified Proof Notice */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">
            verified
          </span>
          <div className="text-xs text-emerald-900 dark:text-emerald-300 leading-snug">
            <p className="font-bold text-emerald-800 dark:text-emerald-300">Verified Proof of Delivery</p>
            <p className="text-[11px] opacity-80 mt-0.5 text-emerald-700 dark:text-emerald-400">
              Authorizing will mark Stop #{activeStop?.sequenceNumber} ({activeStop?.orderId}) as Completed and automatically advance route navigation to your next customer.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full min-h-[52px] rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              <span>Completing &amp; Advancing Route...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Authorize Delivery &amp; Move to Next Stop</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
