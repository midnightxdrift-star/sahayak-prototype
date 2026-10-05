import React, { useEffect, useState } from 'react';

/**
 * Toast - A lightweight, non-intrusive notification that auto-dismisses.
 * Usage: <Toast message="..." type="success|info|warning|error" onClose={() => {}} />
 */
export function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: { bg: 'bg-[#0E3D2F]', icon: '✓', iconBg: 'bg-green-400/20' },
    info: { bg: 'bg-blue-700', icon: 'ℹ', iconBg: 'bg-blue-400/20' },
    warning: { bg: 'bg-amber-600', icon: '⚠', iconBg: 'bg-amber-400/20' },
    error: { bg: 'bg-red-700', icon: '✕', iconBg: 'bg-red-400/20' },
  };
  const s = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-[60px] left-1/2 -translate-x-1/2 z-[999] transition-all duration-300 max-w-[340px] w-[90%] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`${s.bg} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}>
        <div className={`w-7 h-7 rounded-full ${s.iconBg} flex items-center justify-center text-sm font-bold shrink-0`}>
          {s.icon}
        </div>
        <p className="text-[13px] font-medium leading-snug flex-1">{message}</p>
        <button
          type="button"
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          className="text-white/70 hover:text-white text-sm shrink-0"
        >✕</button>
      </div>
    </div>
  );
}

/**
 * BottomSheet - A slide-up modal overlay.
 * Usage: <BottomSheet open={bool} onClose={() => {}} title="..." children={...} />
 */
export function BottomSheet({ open, onClose, title, children, height = 'auto' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-end justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="relative w-full max-w-[390px] bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-[slide-up_0.28s_ease-out]"
        style={{ maxHeight: height === 'auto' ? '85vh' : height }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/**
 * SuccessModal - Displayed after a key user action completes.
 */
export function SuccessModal({ open, onClose, title, message, actionLabel, onAction }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-6" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl text-center animate-[pop-in_0.22s_ease-out]">
        {/* Success animation circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <div className="w-12 h-12 rounded-full bg-[#0E3D2F] flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-snug mb-5">{message}</p>
        {actionLabel && (
          <button
            type="button"
            onClick={onAction || onClose}
            className="w-full bg-[#0E3D2F] text-white font-semibold py-3 rounded-2xl text-sm shadow-sm active:scale-95 transition-all mb-2"
          >
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Close
        </button>
      </div>
      <style>{`
        @keyframes pop-in {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
