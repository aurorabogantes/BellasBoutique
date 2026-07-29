import { useContext, useEffect, useState } from 'react';
import VendorLayout from './VendorLayout';
import { AuthContext } from '../../context/AuthContext';

export default function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState({ products: 0, sales: 0, invoices: 0 });

  useEffect(() => {
    try {
      const products = JSON.parse(localStorage.getItem('bb_products')) || [];
      const sales = JSON.parse(localStorage.getItem('bb_sales')) || [];
      const invoices = JSON.parse(localStorage.getItem('bb_invoices')) || [];
      setCounts({ products: products.length, sales: sales.length, invoices: invoices.length });
    } catch { }
  }, []);

  return (
    <VendorLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title">Panel de Vendedor</h1>
          <p className="section-subtitle">Bienvenido, {user?.nombre || 'Vendedor'}.</p>
        </div>
      </div>

      <div className="vendor-stats" style={{ marginTop: 18 }}>
        <div className="vendor-card">
          <div className="label">Productos</div>
          <div className="value">{counts.products}</div>
        </div>
        <div className="vendor-card">
          <div className="label">Ventas</div>
          <div className="value">{counts.sales}</div>
        </div>
        <div className="vendor-card">
          <div className="label">Facturas</div>
          <div className="value">{counts.invoices}</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="btn btn-primary" href="/vendor/productos">Gestionar Productos</a>
          <a className="btn btn-outline" href="/vendor/ventas">Ver Ventas</a>
          <a className="btn btn-outline" href="/vendor/facturas">Ver Facturas</a>
        </div>
      </div>
    </VendorLayout>
  );
}
