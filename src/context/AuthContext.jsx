import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { users as mockUsers, invoices as mockInvoices, products as mockProducts } from '../data/mockData';

export const AuthContext = createContext();

const STORAGE_KEY = 'bb_auth_state';
const ACT_LOG_KEY = 'bb_activity_log';
const INVOICES_KEY = 'bb_invoices';
const SENT_EMAILS_KEY = 'bb_sent_emails';
const USERS_KEY = 'bb_users';
const CLIENTS_KEY = 'bb_clients';

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

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || mockUsers || []; } catch { return mockUsers || []; }
  });

  // ensure clients table exists
  useEffect(() => {
    try { if (!localStorage.getItem(CLIENTS_KEY)) localStorage.setItem(CLIENTS_KEY, JSON.stringify([])); } catch {}
  }, []);

  // helper: sha256 hash password
  const hashPassword = async (pwd) => {
    if (!pwd) return '';
    const enc = new TextEncoder();
    const data = enc.encode(pwd);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const passwordPolicy = (pwd) => {
    if (!pwd) return { ok: false, reason: 'Contraseña vacía' };
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
    const ok = Object.values(checks).every(Boolean);
    return { ok, checks, reason: ok ? null : 'La contraseña no cumple la política de seguridad' };
  };

  const generateStrongPassword = () => {
    const specials = '!@#$%^&*()_-+=~[]{}|;:,.<>?';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const all = upper + lower + numbers + specials;
    const pick = (s) => s[Math.floor(Math.random() * s.length)];
    // ensure at least one of each
    let pw = pick(upper) + pick(lower) + pick(numbers) + pick(specials);
    for (let i = 4; i < 12; i++) pw += pick(all);
    // shuffle
    pw = pw.split('').sort(() => Math.random() - 0.5).join('');
    if (passwordPolicy(pw).ok) return pw;
    return generateStrongPassword();
  };

  // normalize existing users: compute passwordHash for placeholders
  useEffect(() => {
    let mounted = true;
    (async () => {
      const next = await Promise.all((users || []).map(async (u) => {
        if (u.passwordHash) return u;
        const raw = u.password && u.password !== '••••••••' ? u.password : 'Password123!';
        const h = await hashPassword(raw);
        return { ...u, passwordHash: h };
      }));
      if (mounted) {
        setUsers(next);
        try { localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = (id, fields) => {
    (async () => {
      const f = { ...fields };
      if (f.password) {
        // hash password before saving
        try { f.passwordHash = await hashPassword(f.password); } catch {}
        delete f.password;
      }
      const next = (users || []).map((u) => (u.id === id ? { ...u, ...f } : u));
      setUsers(next);
      try { localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
      addActivity('Actualizar usuario', { id, fields: Object.keys(f) });
    })();
  };

  // Session timeout (5 minutes inactivity)
  const TIMEOUT = 5 * 60 * 1000;
  const [lastActive, setLastActive] = useState(Date.now());

  const persist = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(ACT_LOG_KEY, JSON.stringify(activityLog));
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
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

  const login = async ({ correo, password }) => {
    // Basic validation
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      // record failed attempt
      setActivityLog((prev) => {
        const entry = { id: Date.now(), user: { correo }, action: 'Login fallido', meta: { reason: 'Correo inválido' }, ts: new Date().toISOString() };
        const next = [entry, ...prev];
        localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
        return next;
      });
      return { ok: false, error: 'Correo inválido' };
    }
    const found = (users || []).find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (!found) {
      setActivityLog((prev) => {
        const entry = { id: Date.now(), user: { correo }, action: 'Login fallido', meta: { reason: 'Usuario no registrado' }, ts: new Date().toISOString() };
        const next = [entry, ...prev];
        localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
        return next;
      });
      return { ok: false, error: 'Usuario no registrado' };
    }

    // check account active
    if (found.estado && found.estado.toLowerCase() !== 'activo') {
      setActivityLog((prev) => {
        const entry = { id: Date.now(), user: { correo }, action: 'Login fallido', meta: { reason: 'Cuenta inactiva' }, ts: new Date().toISOString() };
        const next = [entry, ...prev];
        localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
        return next;
      });
      return { ok: false, error: 'Cuenta inactiva' };
    }

    const hashed = await hashPassword(password);
    // support mock/legacy users: if a plain `password` exists in the user object
    // or the placeholder '••••••••' is used, allow `Password123!` as default
    const mockPlaceholder = '••••••••';
    const defaultMockPassword = 'Password123!';
    const providedMatchesPlain = found.password && found.password !== mockPlaceholder && found.password === password;
    const providedMatchesDefaultMock = found.password === mockPlaceholder && password === defaultMockPassword;

    if (!found.passwordHash) {
      if (!providedMatchesPlain && !providedMatchesDefaultMock) {
        setActivityLog((prev) => {
          const entry = { id: Date.now(), user: { correo }, action: 'Login fallido', meta: { reason: 'Contraseña incorrecta' }, ts: new Date().toISOString() };
          const next = [entry, ...prev];
          localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
          return next;
        });
        return { ok: false, error: 'Credenciales inválidas' };
      }
    } else {
      if (hashed !== found.passwordHash) {
        setActivityLog((prev) => {
          const entry = { id: Date.now(), user: { correo }, action: 'Login fallido', meta: { reason: 'Contraseña incorrecta' }, ts: new Date().toISOString() };
          const next = [entry, ...prev];
          localStorage.setItem(ACT_LOG_KEY, JSON.stringify(next));
          return next;
        });
        return { ok: false, error: 'Credenciales inválidas' };
      }
    }

    const u = { ...found };
    setUser(u);
    addActivity('Login', { correo: u.correo, rol: u.rol });
    return { ok: true, user: u };
  };

  const register = async (data) => {
    // data: { nombre, apellidos, correo, password, telefono, direccion, cedula, rol }
    if (!data.correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.correo)) return { ok: false, error: 'Correo inválido' };
    const policy = passwordPolicy(data.password);
    if (!policy.ok) return { ok: false, error: policy.reason || 'Contraseña no válida' };
    const exists = (users || []).find((u) => u.correo.toLowerCase() === data.correo.toLowerCase());
    if (exists) return { ok: false, error: 'Usuario ya existe' };
    const h = await hashPassword(data.password);
    const newUser = {
      id: Date.now(),
      nombre: data.nombre || data.correo.split('@')[0],
      apellidos: data.apellidos || '',
      correo: data.correo,
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      rol: 'Cliente',
      estado: 'Activo',
      cedula: data.cedula || '',
      passwordHash: h,
    };
    const next = [newUser, ...users];
    setUsers(next);
    try { localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
    // also add to clients table
    try {
      const clients = JSON.parse(localStorage.getItem(CLIENTS_KEY)) || [];
      clients.unshift({ userId: newUser.id, nombre: newUser.nombre, correo: newUser.correo, telefono: newUser.telefono, direccion: newUser.direccion });
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    } catch {}
    addActivity('Registro de usuario', { correo: newUser.correo, nombre: newUser.nombre });
    return { ok: true, user: newUser };
  };

  const recoverPassword = async (correo) => {
    if (!correo) return { ok: false, error: 'Correo requerido' };
    const found = (users || []).find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (!found) return { ok: false, error: 'Usuario no encontrado' };
    // generate new strong password
    const newPwd = generateStrongPassword();
    const h = await hashPassword(newPwd);
    const next = users.map((u) => (u.correo.toLowerCase() === correo.toLowerCase() ? { ...u, passwordHash: h } : u));
    setUsers(next);
    try { localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
    // send email with new password
    const email = sendEmail(correo, 'Recuperación de contraseña', `Su nueva contraseña es: ${newPwd}`);
    addActivity('Recuperación de contraseña', { correo });
    return { ok: true, email };
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
      // also record individual sales
      try {
        const sales = JSON.parse(localStorage.getItem('bb_sales')) || [];
        const newSales = invoice.items.map((it) => ({
          id: Date.now() + Math.floor(Math.random() * 1000),
          invoiceId: invoice.id,
          producto: it.producto,
          cantidad: it.cantidad,
          precioUnitario: it.precioUnitario,
          total: it.total,
          fecha: invoice.fecha,
          userId: user?.id || null,
        }));
        const merged = [...newSales, ...sales];
        localStorage.setItem('bb_sales', JSON.stringify(merged));
      } catch {}
      return next;
    });
    addActivity('Compra realizada', { invoiceId: invoice.id, total: invoice.total });
  };

  const value = {
    user,
    login,
    register,
    recoverPassword,
    updateUser,
    logout,
    addActivity,
    activityLog,
    invoices,
    recordInvoice,
    sendEmail,
    users,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
