import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from './BottomNav';

interface NotificationToastProps {
  onNavigate?: (screen: ScreenType) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onNavigate }) => {
  const { notifications, dismissNotification } = useDelivery();
  const unreadNotifs = notifications.filter(n => !n.read).slice(0, 2);

  if (unreadNotifs.length === 0) return null;

  return (
    <div className="fixed top-18 left-4 right-4 z-50 flex flex-col gap-2 max-w-md mx-auto pointer-events-none">
      {unreadNotifs.map(notif => {
        const isTraffic = notif.type === 'TRAFFIC';
        const isSuccess = notif.type === 'SUCCESS';
        const isSecurity = notif.type === 'SECURITY';

        return (
          <div
            key={notif.id}
            className="pointer-events-auto p-3.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-xl backdrop-blur-md border border-slate-700/60 flex items-start justify-between gap-3 animate-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isTraffic
                    ? 'bg-amber-500/20 text-amber-400'
                    : isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isSecurity
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isTraffic ? 'warning' : isSuccess ? 'task_alt' : isSecurity ? 'security' : 'info'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[13px] text-slate-100 truncate">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[12px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                  {notif.message}
                </p>
                {notif.actionText && notif.actionScreen && (
                  <button
                    onClick={() => {
                      dismissNotification(notif.id);
                      if (onNavigate) onNavigate(notif.actionScreen as ScreenType);
                    }}
                    className="mt-2 text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>{notif.actionText}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
