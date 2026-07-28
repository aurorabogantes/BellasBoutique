import React, { createContext, useEffect, useState, useCallback } from 'react';
import { users as mockUsers, invoices as mockInvoices, products as mockProducts } from '../data/mockData';

export const AuthContext = createContext();

const STORAGE_KEY = 'bb_auth_state';
const ACT_LOG_KEY = 'bb_activity_log';
const INVOICES_KEY = 'bb_invoices';
const SENT_EMAILS_KEY = 'bb_sent_emails';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch { return null; }
  });

  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ACT_LOG_KEY)) || []; } catch { return []; }
  });

  const [invoices, setInvoices] = useState(() => {
    try { return JSON.parse(localStorage.getItem(INVOICES_KEY)) || mockInvoices || []; } catch { return mockInvoices || []; }
  });

  // Session timeout (5 minutes inactivity)
  const TIMEOUT = 5 * 60 * 1000;
  const [lastActive, setLastActive] = useState(Date.now());

  const persist = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(ACT_LOG_KEY, JSON.stringify(activityLog));
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  }, [user, activityLog, invoices]);

  useEffect(() => { persist(); }, [persist]);

  useEffect(() => {
    const handleActivity = () => setLastActive(Date.now());
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      if (Date.now() - lastActive > TIMEOUT) {
        // auto logout
        addActivity('Auto-logout por inactividad');
        logout();
      }
    }, 2000);
    return () => clearInterval(id);
  }, [lastActive, user]);

  const addActivity = (action, meta = {}) => {
    const entry = {
      id: Date.now(),
      user: user ? { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } : { correo: 'anon' },
      action,
      meta,
      ts: new Date().toISOString(),
    };
    setActivityLog((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
      return next;
    });
  };

  const login = ({ correo, password }) => {
    // Basic validation
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return { ok: false, error: 'Correo inválido' };

    // try to find user in mock users
    const found = mockUsers.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    const u = found ? { ...found } : { id: Date.now(), nombre: correo.split('@')[0], correo, rol: correo.includes('admin') ? 'Administrador' : 'Cliente' };

    setUser(u);
    addActivity('Login', { correo: u.correo, rol: u.rol });
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    addActivity('Logout');
    try { window.location.href = '/'; } catch { /* ignore */ }
  };

  const sendEmail = (to, subject, body) => {
    const email = { id: Date.now(), to, subject, body, ts: new Date().toISOString() };
    try {
      const prev = JSON.parse(localStorage.getItem(SENT_EMAILS_KEY)) || [];
      const next = [email, ...prev];
      localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(next));
    } catch {}
    addActivity('Enviar correo', { to, subject });
    return email;
  };

  const recordInvoice = (invoice) => {
    setInvoices((prev) => {
      const next = [invoice, ...prev];
      localStorage.setItem(INVOICES_KEY, JSON.stringify(next));
      return next;
    });
    addActivity('Compra realizada', { invoiceId: invoice.id, total: invoice.total });
  };

  const value = {
    user,
    login,
    logout,
    addActivity,
    activityLog,
    invoices,
    recordInvoice,
    sendEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
