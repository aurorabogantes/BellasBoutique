import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login({ correo: form.email, password: form.password });
    if (!res.ok) {
      setError(res.error || 'Error de login');
      return;
    }
    // redirect based on role inference
    if (form.email.includes('admin')) navigate('/admin/dashboard');
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
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80"
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
                <a href="#" className="login-forgot">¿Olvidó su contraseña?</a>
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

