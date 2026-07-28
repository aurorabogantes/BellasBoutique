import { useState } from 'react';
import Navbar from '../components/Navbar';
import { currentClient } from '../data/mockData';

export default function ClientProfile() {
  const [profile, setProfile] = useState({ ...currentClient, password: '' });
  const [saved, setSaved] = useState(false);

  const field = (key, label, type = 'text', disabled = false) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-input"
        type={type}
        value={profile[key]}
        disabled={disabled}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="card">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56,
              background: 'var(--brown-800)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.4rem',
            }}>👤</div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Mi Perfil</h2>
              <p className="section-subtitle">Actualice su información personal.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('id', 'ID', 'text', true)}
              {field('correo', 'Correo electrónico', 'email', true)}
              {field('nombre', 'Nombre')}
              {field('apellidos', 'Apellidos')}
            </div>

            {field('direccion', 'Dirección')}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('telefono', 'Teléfono')}
              {field('password', 'Nueva contraseña', 'password')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              {saved && (
                <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                  ✓ Cambios guardados
                </p>
              )}
              <button type="submit" className="btn btn-primary">
                💾 Guardar Cambios
              </button>
            </div>
          </form>

          {/* Info notice */}
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            background: 'var(--cream-200)',
            border: '1px solid var(--brown-100)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            gap: 12,
          }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🔒</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Información importante</strong>
              <br />
              Por motivos de seguridad, el <strong>ID</strong> y el{' '}
              <strong>correo electrónico</strong> no pueden modificarse, ya que identifican su
              cuenta dentro del sistema. Si necesita cambiar alguno de estos datos, deberá
              contactar al administrador de BellasBoutique.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
