import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, ...opts };
    setToasts((t) => [toast, ...t]);
    if (!opts.persistent) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 3500);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast, dismiss, toasts }}>
      {children}
      <div style={{ position: 'fixed', right: 18, top: 18, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, boxShadow: 'var(--shadow-sm)', minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: '0.95rem' }}>{t.message}</div>
              <button onClick={() => dismiss(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
