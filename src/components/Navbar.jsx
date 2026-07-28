import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();

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
      </div>
    </nav>
  );
}
