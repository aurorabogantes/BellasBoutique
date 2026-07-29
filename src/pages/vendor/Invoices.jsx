import VendorLayout from './VendorLayout';
import { useState, useEffect } from 'react';

const loadInvoices = () => { try { return JSON.parse(localStorage.getItem('bb_invoices')) || []; } catch { return []; } };

export default function VendorInvoices() {
  const [invoices, setInvoices] = useState(() => loadInvoices());

  useEffect(() => { try { localStorage.setItem('bb_invoices', JSON.stringify(invoices)); } catch {} }, [invoices]);

  return (
    <VendorLayout>
      <h1 className="section-title">Facturas</h1>
      <p className="section-subtitle">Lista de facturas (quemadas + generadas).</p>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {invoices.map(i => (
                <tr key={i.id}><td>{i.id}</td><td>{i.cliente}</td><td>₡{i.total}</td><td>{i.estado}</td><td>{i.fecha}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
}
