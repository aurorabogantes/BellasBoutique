import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/productos', label: 'Productos', icon: '🏷️' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/facturacion', label: 'Ventas', icon: '🧾' },
  { to: '/admin/reportes', label: 'Reportes', icon: '📈' },
   { to: '/admin/bitacora', label: 'Bitácora', icon: '📚' },
   { to: '/admin/intentolog', label: 'Intentos Login', icon: '🔐' },
   { to: '/admin/emails', label: 'Correos', icon: '✉️' },
   { to: '/admin/encuestas', label: 'Encuestas/Sugerencias', icon: '📝' },
  { to: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>BellasBoutique</h2>
        <p>Panel Administrativo</p>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'admin-nav-item' + (isActive ? ' active' : '')
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-logout">
        <button onClick={() => { if (logout) logout(); else navigate('/'); }}>
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
