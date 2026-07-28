import { useState, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { reportStats, formatCRC, products as catalogProducts } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';

const statCards = (s) => [
  { label: 'Ventas Totales', value: s.ventasTotales, icon: '🧾' },
  { label: 'Ingresos', value: formatCRC(s.ingresos), icon: '💵' },
  { label: 'Productos Vendidos', value: s.productosVendidos, icon: '📦' },
  { label: 'Clientes', value: s.clientes, icon: '👥' },
];

export default function Reports() {
  const s = reportStats;
  const { invoices, addActivity } = useContext(AuthContext);
  const [daily, setDaily] = useState(null);
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn btn-primary btn-sm" onClick={() => {
            const sold = (invoices || []).reduce((acc, inv) => acc + (inv.items?.reduce((s,i)=>s+i.cantidad,0)||0), 0);
            const ingresos = (invoices || []).reduce((acc, inv) => acc + (inv.total||0), 0);
            const lowStock = catalogProducts.filter(p => p.stock <= 5).map(p => ({ name: p.name, stock: p.stock }));
            const summary = { productosVendidos: sold, ingresos, lowStock };
            setDaily(summary);
            if (addActivity) addActivity('Generar reporte diario', summary);
          }}>Generar reporte del día</button>
        </div>

        {daily && (
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Reporte generado</h3>
            <p>Cantidad de productos vendidos: <strong>{daily.productosVendidos}</strong></p>
            <p>Ingresos por ventas: <strong>{formatCRC(daily.ingresos)}</strong></p>
            <p>Productos con stock bajo:</p>
            <ul>
              {daily.lowStock.map((p) => <li key={p.name}>{p.name} — {p.stock} unidades</li>)}
            </ul>
          </div>
        )}

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
