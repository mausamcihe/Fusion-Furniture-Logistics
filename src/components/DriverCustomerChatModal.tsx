import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';

interface DriverCustomerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverCustomerChatModal: React.FC<DriverCustomerChatModalProps> = ({
  isOpen,
  onClose
}) => {
  const { chatMessages, sendChatMessage, activeStop } = useDelivery();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim(), 'DRIVER');
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    sendChatMessage(text, 'DRIVER');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[85vh] sm:h-[600px]">
        {/* Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 relative">
              <img
                src={activeStop?.customerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={activeStop?.customerName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[14px] leading-tight">
                  {activeStop?.customerName}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-semibold">
                  Stop #{activeStop?.sequenceNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Order #{activeStop?.orderId} · {activeStop?.address}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Live Delivery Status Ribbon */}
        <div className="px-3.5 py-1.5 bg-orange-50 dark:bg-orange-950/40 border-b border-orange-200/50 dark:border-orange-800/40 flex items-center justify-between text-[11px] text-orange-800 dark:text-orange-300">
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Live ETA: {activeStop?.eta || '11:15 AM'} (8 mins away)
          </span>
          <a href={`tel:${activeStop?.customerPhone}`} className="font-bold flex items-center gap-0.5 hover:underline">
            <span className="material-symbols-outlined text-[14px]">call</span>
            Call Customer
          </a>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
          {chatMessages.map(msg => {
            const isMe = msg.sender === 'DRIVER';
            const isDispatch = msg.sender === 'DISPATCH';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 font-medium mb-0.5 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-[13px] shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-orange-600 text-white rounded-br-xs'
                      : isDispatch
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 rounded-bl-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Canned Responses */}
        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleQuickSend('Arriving in roughly 5 minutes at front!')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Arriving in 5 mins
          </button>
          <button
            onClick={() => handleQuickSend('At Rear Dock B. Ready to offload King Bed.')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            At Rear Dock B
          </button>
          <button
            onClick={() => handleQuickSend('Could you buzz intercom #12 for building access?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Please buzz #12
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type message to recipient..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-all disabled:opacity-50"
            disabled={!inputText.trim()}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
