import React, { createContext, useCallback, useState } from 'react';

export const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [queue, setQueue] = useState([]);

  // listen for global prompt events (used by Login fallback)
  React.useEffect(() => {
    const handler = (e) => {
      try {
        const cb = e?.detail?.callback;
        if (typeof cb !== 'function') return;
        const id = Date.now() + Math.random();
        const item = { id, message: e.detail.message || 'Input', opts: { input: true, placeholder: e.detail.placeholder || '' }, resolve: (val) => cb(val) };
        setQueue((q) => [item, ...q]);
      } catch (err) { /* ignore */ }
    };
    window.addEventListener('bb-confirm-prompt', handler);
    return () => window.removeEventListener('bb-confirm-prompt', handler);
  }, []);

  const confirm = useCallback((message, opts = {}) => new Promise((resolve) => {
    const id = Date.now() + Math.random();
    const item = { id, message, opts, resolve };
    setQueue((q) => [item, ...q]);
  }), []);

  const respond = (id, val) => {
    setQueue((q) => {
      const found = q.find((x) => x.id === id);
      if (found && typeof found.resolve === 'function') found.resolve(val);
      return q.filter((x) => x.id !== id);
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <div>
        {queue.map((q) => (
          <div key={q.id} style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <div style={{ background: 'white', padding: 18, borderRadius: 8, width: 480, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ marginBottom: 12, fontWeight: 700 }}>{q.message}</div>
              {q.opts && q.opts.input ? (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input autoFocus className="form-input" placeholder={q.opts.placeholder || ''} onKeyDown={(e) => { if (e.key === 'Enter') respond(q.id, e.target.value); }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => respond(q.id, null)}>Cancelar</button>
                    <button className="btn btn-primary btn-sm" onClick={() => {
                      const input = document.querySelector('input.form-input');
                      respond(q.id, input ? input.value : null);
                    }}>Enviar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => respond(q.id, false)}>Cancelar</button>
                  <button className="btn btn-primary btn-sm" onClick={() => respond(q.id, true)}>Confirmar</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
