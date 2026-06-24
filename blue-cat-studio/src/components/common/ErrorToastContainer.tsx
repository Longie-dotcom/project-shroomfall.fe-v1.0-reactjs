import React, { useState, useEffect } from 'react';
import { toastBus, type ToastEventData } from '../../api/handlers/error/errorEvent';

export const ErrorToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastEventData[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe((newToast) => {
      setToasts((prev) => {
        if (prev.some((t) => t.error.code === newToast.error.code && t.error.message === newToast.error.message)) {
          return prev;
        }
        return [...prev, newToast];
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const latestToast = toasts[toasts.length - 1];
    
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== latestToast.id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 99999, // 🔝 Max out the priority layer stacking context
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            width: '340px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '14px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative',
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#f87171',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ✕ {toast.error.type || 'Authentication Error'}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>

          <p style={{ color: '#ffffff', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            {toast.error.message || 'Session expired. Please log back in.'}
          </p>

          <span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>
            Code: {toast.error.code || '401'}
          </span>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};