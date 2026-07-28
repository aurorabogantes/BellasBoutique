import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const validate = (password) => ({
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '', cedula: '', nombre: '', apellidos: '',
    correo: '', telefono: '', rol: '', direccion: '',
    password: '', confirm: '',
  });

  const checks = validate(form.password);
  const { addActivity } = useContext(AuthContext);

  const { showToast } = useContext(ToastContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validations
    if (!form.correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo)) return showToast?.('Correo inválido', { duration: 3500 });
    if (form.password.length < 8) return showToast?.('Contraseña demasiado corta', { duration: 3500 });
    if (form.password !== form.confirm) return showToast?.('Las contraseñas no coinciden', { duration: 3500 });
    if (addActivity) addActivity('Registro de usuario', { correo: form.correo, nombre: form.nombre });
    showToast?.('Cuenta creada. Inicia sesión.', { duration: 3000 });
    navigate('/');
  };

  const field = (key, placeholder, type = 'text') => (
    <input
      className="form-input"
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="card">
          <div className="page-header">
            <h1 className="section-title">Crear una Cuenta</h1>
            <p className="section-subtitle">
              Complete la información para registrarse en BellasBoutique.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">{field('id', 'ID')}</div>
              <div className="form-group">{field('cedula', 'Cédula')}</div>
              <div className="form-group">{field('nombre', 'Nombre')}</div>
              <div className="form-group">{field('apellidos', 'Apellidos')}</div>
            </div>

            <div className="form-group">{field('correo', 'Correo electrónico', 'email')}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">{field('telefono', 'Teléfono')}</div>
              <div className="form-group">
                <select
                  className="form-input"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="">Seleccione un Rol</option>
                  <option>Administrador</option>
                  <option>Cliente</option>
                  <option>Vendedor</option>
                </select>
              </div>
            </div>

            <div className="form-group">{field('direccion', 'Dirección')}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">{field('password', 'Contraseña', 'password')}</div>
              <div className="form-group">{field('confirm', 'Confirmar contraseña', 'password')}</div>
            </div>

            {/* Password strength */}
            <div style={{
              background: 'var(--cream-200)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10 }}>
                Seguridad de la contraseña
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                {[
                  [checks.upper, 'Una letra mayúscula'],
                  [checks.lower, 'Una letra minúscula'],
                  [checks.number, 'Un número'],
                  [checks.special, 'Un carácter especial'],
                ].map(([ok, label]) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '0.82rem',
                      color: ok ? 'var(--info)' : 'var(--warning)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {ok ? '✓' : '•'} {label}
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4 }}>
              Crear Cuenta
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              ¿Ya tiene una cuenta?{' '}
              <a
                href="#"
                style={{ color: 'var(--brown-700)', fontWeight: 600 }}
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
              >
                Iniciar sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
