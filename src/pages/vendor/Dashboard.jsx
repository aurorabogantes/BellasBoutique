import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function VendorDashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: 24 }}>
      <h1>Panel de Vendedor</h1>
      <p>Bienvenido, {user?.nombre || 'Vendedor'}.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <Link to="/vendor/productos" className="btn btn-primary">Gestionar Productos</Link>
        <Link to="/catalogo" className="btn btn-outline">Ver Catálogo</Link>
      </div>
    </div>
  );
}
