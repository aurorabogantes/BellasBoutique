import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { invoices, formatCRC, orderStatuses } from '../../data/mockData';

const statCards = [
  { label: 'Ventas Totales', value: 126, icon: '🧾' },
  { label: 'Ingresos', value: formatCRC(2850000), icon: '💵' },
  { label: 'Ventas Hoy', value: 24, icon: '📅' },
  { label: 'Ventas del Mes', value: 350, icon: '📊' },
];

export default function Invoices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === 'Todos los estados' || inv.estado === statusFilter;
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.cliente.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const badgeClass = (estado) =>
    estado === 'Pagado' ? 'badge badge-success' : 'badge badge-warning';

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Facturación y Ventas</h1>
            <p className="section-subtitle">Historial de ventas y facturas generadas.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-info" style={{ textAlign: 'right' }}>
              <p>Administrador</p>
              <small>admin@bellasboutique.com</small>
            </div>
            <div className="admin-user-avatar">A</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map((c) => (
            <div key={c.label} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{c.label}</span>
                <span className="stat-icon">{c.icon}</span>
              </div>
              <p className="stat-value">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="card">
            <div className="filters-bar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="form-input"
                placeholder="Buscar venta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-outline btn-sm">📅 Fecha</button>
            <select
              className="form-input"
              style={{ width: 200 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {orderStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => {
              // export filtered invoices as CSV
              const rows = [['Factura','Cliente','Producto','Cantidad','Total','Fecha','Estado']];
              filtered.forEach(inv => rows.push([inv.id, inv.cliente, inv.producto, inv.cantidad, inv.total, inv.fecha, inv.estado]));
              const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `invoices_export.csv`; a.click(); URL.revokeObjectURL(url);
            }}>📄 Generar Reporte</button>
            <button className="btn btn-outline btn-sm" onClick={() => {
              // export all filtered as CSV (alias)
              const rows = [['Factura','Cliente','Producto','Cantidad','Total','Fecha','Estado']];
              filtered.forEach(inv => rows.push([inv.id, inv.cliente, inv.producto, inv.cantidad, inv.total, inv.fecha, inv.estado]));
              const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `invoices_list.csv`; a.click(); URL.revokeObjectURL(url);
            }}>⬇️ Exportar CSV</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.id}</td>
                    <td>{inv.cliente}</td>
                    <td>{inv.producto}</td>
                    <td>{inv.cantidad}</td>
                    <td>{formatCRC(inv.total)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{inv.fecha}</td>
                    <td><span className={badgeClass(inv.estado)}>{inv.estado}</span></td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn view"
                          onClick={() => navigate(`/admin/ventas/${inv.id}`)}
                          title="Ver detalle"
                        >👁️</button>
                        <button className="icon-btn" title="Descargar PDF">⬇️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
