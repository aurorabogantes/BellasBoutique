import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { reportStats, formatCRC } from '../../data/mockData';

const statCards = (s) => [
  { label: 'Ventas Totales', value: s.ventasTotales, icon: '🧾' },
  { label: 'Ingresos', value: formatCRC(s.ingresos), icon: '💵' },
  { label: 'Productos Vendidos', value: s.productosVendidos, icon: '📦' },
  { label: 'Clientes', value: s.clientes, icon: '👥' },
];

export default function Reports() {
  const s = reportStats;
  const maxVal = Math.max(...s.ventasPorMes.map((v) => v.ventas));

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Reportes</h1>
            <p className="section-subtitle">Estadísticas generales de ventas e ingresos.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-info" style={{ textAlign: 'right' }}>
              <p>Administrador</p>
              <small>admin@bellasboutique.com</small>
            </div>
            <div className="admin-user-avatar">A</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="form-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: 170 }}
            placeholder="Fecha Inicio"
          />
          <input
            className="form-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: 170 }}
            placeholder="Fecha Final"
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-sm">⬇️ Exportar PDF</button>
            <button className="btn btn-primary btn-sm">📊 Exportar Excel</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {statCards(s).map((c) => (
            <div key={c.label} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{c.label}</span>
                <span className="stat-icon">{c.icon}</span>
              </div>
              <p className="stat-value">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Ventas por Mes</h3>
          <div className="bar-chart">
            {s.ventasPorMes.map((item) => (
              <div key={item.mes} className="bar-col">
                <div
                  className="bar"
                  style={{ height: `${(item.ventas / maxVal) * 140}px` }}
                  title={`${item.mes}: ${item.ventas} ventas`}
                />
                <span className="bar-label">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
