import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="navbar-nav">
          <li><Link to="/catalogo">Inicio</Link></li>
          <li><Link to="/catalogo?cat=Ropa">Mujer</Link></li>
          <li><Link to="/catalogo?cat=Calzado">Calzado</Link></li>
          <li><Link to="/catalogo?cat=Accesorios">Accesorios</Link></li>
        </ul>
      </div>

      <Link to="/catalogo" className="navbar-logo">
        BellasBoutique
        <span>FASHION • SHOES • ACCESSORIES</span>
      </Link>

      <div className="navbar-actions">
        <button className="navbar-icon" title="Buscar">🔍</button>
        <button className="navbar-icon" title="Favoritos">🤍</button>
        <button className="navbar-icon" title="Carrito" onClick={() => navigate('/carrito')}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="navbar-icon" title="Perfil" onClick={() => navigate('/perfil')}>👤</button>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9rem' }}>{user.nombre || user.correo}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => logout()}>Cerrar sesión</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>Ingresar</button>
          </div>
        )}
      </div>
    </nav>
  );
}
