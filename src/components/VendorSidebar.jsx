import { NavLink } from 'react-router-dom';

export default function VendorSidebar() {
  return (
    <aside className="vendor-sidebar">
      <div className="vendor-logo">V</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <NavLink to="/vendor/dashboard" className={({isActive})=> isActive? 'side-link active':'side-link'}>Panel</NavLink>
        <NavLink to="/vendor/productos" className={({isActive})=> isActive? 'side-link active':'side-link'}>Mis Productos</NavLink>
        <NavLink to="/vendor/ventas" className={({isActive})=> isActive? 'side-link active':'side-link'}>Ventas</NavLink>
        <NavLink to="/vendor/facturas" className={({isActive})=> isActive? 'side-link active':'side-link'}>Facturas</NavLink>
        <NavLink to="/catalogo" className="side-link">Ver catálogo</NavLink>
      </nav>
    </aside>
  );
}
