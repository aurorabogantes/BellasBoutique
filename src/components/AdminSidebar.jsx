import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/productos', label: 'Productos', icon: '🏷️' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/facturacion', label: 'Ventas', icon: '🧾' },
  { to: '/admin/reportes', label: 'Reportes', icon: '📈' },
  { to: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

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
        <button onClick={() => navigate('/')}>
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
