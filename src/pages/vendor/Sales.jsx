import VendorLayout from './VendorLayout';
import { useState, useEffect } from 'react';

const loadSales = () => { try { return JSON.parse(localStorage.getItem('bb_sales')) || []; } catch { return []; } };

export default function VendorSales() {
  const [sales, setSales] = useState(() => loadSales());
  useEffect(() => { try { localStorage.setItem('bb_sales', JSON.stringify(sales)); } catch {} }, [sales]);

  return (
    <VendorLayout>
      <h1 className="section-title">Ventas</h1>
      <p className="section-subtitle">Registro de ventas relacionadas.</p>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Factura</th><th>Producto</th><th>Cantidad</th><th>Total</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id}><td>{s.id}</td><td>{s.invoiceId}</td><td>{s.producto}</td><td>{s.cantidad}</td><td>₡{s.total}</td><td>{s.fecha}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
}
