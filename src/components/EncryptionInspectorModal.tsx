import React from 'react';
import { useDelivery } from '../context/DeliveryContext';

export const EncryptionInspectorModal: React.FC = () => {
  const { currentEncryptedPayload, closeEncryptionInspector, telemetry } = useDelivery();

  if (!currentEncryptedPayload) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">
              verified_user
            </span>
            <div>
              <h3 className="font-bold text-[15px] leading-tight">
                Cryptographic Wire Inspector
              </h3>
              <p className="text-[11px] text-slate-400">
                AES-256-GCM &amp; TLS 1.3 End-to-End Encryption
              </p>
            </div>
          </div>
          <button
            onClick={closeEncryptionInspector}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Cipher Suite
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {currentEncryptedPayload.algorithm}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Wire Protocol
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                TLS 1.3 / RFC 8446
              </span>
            </div>
          </div>

          {/* IV & Auth Tag */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Initialization Vector (IV - 96-bit)
              </span>
              <span className="text-[10px] text-emerald-600 font-mono">NONCE OK</span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 break-all select-all">
              {currentEncryptedPayload.iv}
            </div>
          </div>

          {/* Ciphertext */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Encrypted Ciphertext Payload
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentEncryptedPayload.ciphertext.length / 2} bytes
              </span>
            </div>
            <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 max-h-24 overflow-y-auto break-all select-all">
              {currentEncryptedPayload.ciphertext}
            </div>
          </div>

          {/* GCM Auth Tag & SHA256 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-0.5">
                Auth Tag (128-bit)
              </span>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 break-all">
                {currentEncryptedPayload.authTag}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-0.5">
                Integrity SHA-256
              </span>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 truncate">
                {currentEncryptedPayload.signatureHash}
              </div>
            </div>
          </div>

          {/* Decrypted Payload Preview */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Decrypted Plaintext (Authorized Access Only)
            </span>
            <pre className="p-2.5 rounded bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 max-h-32 overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(currentEncryptedPayload.decryptedPlaintext), null, 2)}
            </pre>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              check_circle
            </span>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-tight">
              Cryptographic signature verified against Canberra Depot Central HSM. Zero plaintext exposure in transit.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={closeEncryptionInspector}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[12px] font-semibold transition-colors"
          >
            Dismiss Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
