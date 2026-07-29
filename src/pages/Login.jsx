import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, recoverPassword } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState(null);
  const { showToast } = useContext(ToastContext);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('bb_session_expired');
      if (v) {
        setSessionExpired(true);
        localStorage.removeItem('bb_session_expired');
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ correo: form.email, password: form.password });
    if (!res.ok) {
      setError(res.error || 'Error de login');
      showToast?.(res.error || 'Error de login', { duration: 3500 });
      return;
    }
    // redirect based on role
    const rol = res.user?.rol || (form.email.includes('admin') ? 'Administrador' : 'Cliente');
    if (rol === 'Administrador') navigate('/admin/dashboard');
    else navigate('/catalogo');
  };

  return (
    <div className="login-page">
      {/* Top nav */}
      <header className="login-topnav">
        <div className="login-nav-links">
          <a href="#">INICIO</a>
          <a href="#">MUJER</a>
          <a href="#">CALZADO</a>
          <a href="#">ACCESORIOS</a>
        </div>
        <span className="login-logo-text">BellasBoutique</span>
        <div />
      </header>

      {/* Split body */}
      <div className="login-body">
        {/* Hero */}
        <div className="login-hero">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200"
            alt="Fashion"
            className="login-hero-img"
          />
          <div className="login-hero-overlay">
            <p className="login-hero-tag">NUEVA COLECCIÓN</p>
            <h1 className="login-hero-title">Eleva tu estilo</h1>
            <p className="login-hero-subtitle">
              Descubre ropa, calzado y accesorios exclusivos para cada ocasión.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="login-form-side">
          <div className="login-form-container">
            <h2 className="login-title">Bienvenido</h2>
            <p className="login-subtitle">
              Inicie sesión para acceder al sistema BellasBoutique.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              {sessionExpired && (
                <div style={{ background: '#fff4e5', border: '1px solid #ffd8a8', padding: 12, borderRadius: 6, marginBottom: 12, color: '#663c00', fontWeight: 700 }}>
                  Su sesión expiró por inactividad. Por favor inicie sesión nuevamente.
                </div>
              )}
              {error && <p style={{ color: 'var(--danger)', fontWeight: 700 }}>{error}</p>}
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="login-row">
                <label className="login-check">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  />
                  Recordarme
                </label>
                <a href="#" className="login-forgot" onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const { confirm } = await import('../context/ConfirmContext');
                  } catch {}
                  // use ConfirmContext prompt style
                  const confModule = await import('../context/ConfirmContext');
                  const ctx = confModule.ConfirmContext;
                  // fallback: use window.prompt if context unavailable
                  const email = await new Promise((res) => {
                    // try to use the global Confirm modal by dispatching an input request
                    const ev = new CustomEvent('bb-confirm-prompt', { detail: { prompt: true, callback: res } });
                    window.dispatchEvent(ev);
                    // fallback timeout to prompt
                    setTimeout(() => {
                      const fallback = window.prompt('Ingrese su correo para recuperar la contraseña');
                      res(fallback);
                    }, 300);
                  });
                  if (!email) return;
                  const r = await recoverPassword(email);
                  if (!r.ok) { showToast?.(r.error || 'Error', { duration: 3500 }); return; }
                  showToast?.('Nueva contraseña enviada por correo (simulado)', { duration: 4000 });
                }}>¿Olvidó su contraseña?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Iniciar sesión
              </button>

              <div className="login-divider"><span /></div>

              <button type="button" className="btn btn-outline btn-full">
                Continuar con Google
              </button>

              <p className="login-register">
                ¿No tiene una cuenta?{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('/registro'); }}
                >
                  Registrarse
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

