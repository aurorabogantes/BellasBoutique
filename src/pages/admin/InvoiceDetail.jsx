import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { invoices, formatCRC } from '../../data/mockData';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inv = invoices.find((i) => i.id === id) || invoices[0];

  const subtotal = inv.items.reduce((s, i) => s + i.total, 0);
  const iva = Math.round(subtotal * 0.13);
  const total = subtotal + iva;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Detalle de Factura</h1>
            <p className="section-subtitle">Información completa de la venta.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-info" style={{ textAlign: 'right' }}>
              <p>Administrador</p>
              <small>admin@bellasboutique.com</small>
            </div>
            <div className="admin-user-avatar">A</div>
          </div>
        </div>

        {/* Info + Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Información General</h3>
            {[
              ['🧾', 'Factura', inv.id],
              ['👤', 'Cliente', inv.cliente],
              ['📅', 'Fecha', inv.fecha],
              ['💳', 'Método', inv.metodo],
            ].map(([icon, label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: '0.875rem' }}>
                <span>{icon}</span>
                <span style={{ color: 'var(--text-secondary)', minWidth: 70 }}><strong>{label}:</strong></span>
                <span>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem' }}>
              <span>✅</span>
              <span className={`badge ${inv.estado === 'Pagado' ? 'badge-success' : 'badge-warning'}`}>
                {inv.estado}
              </span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Totales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span><span>{formatCRC(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>IVA (13%)</span><span>{formatCRC(iva)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '2px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
                <span>Total</span><span>{formatCRC(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{item.producto}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatCRC(item.precioUnitario)}</td>
                    <td>{formatCRC(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/facturacion')}>
              ← Regresar
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨️ Imprimir</button>
              <button className="btn btn-primary btn-sm" onClick={() => {
                // export invoice as CSV
                const rows = [['Producto','Cantidad','Precio Unitario','Total']];
                inv.items.forEach(it => rows.push([it.producto, it.cantidad, it.precioUnitario, it.total]));
                rows.push([]);
                rows.push(['Subtotal', formatCRC(subtotal)]);
                rows.push(['IVA', formatCRC(iva)]);
                rows.push(['Total', formatCRC(total)]);
                const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `${inv.id}.csv`; a.click(); URL.revokeObjectURL(url);
              }}>⬇️ Descargar CSV</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
