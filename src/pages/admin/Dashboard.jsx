import AdminSidebar from '../../components/AdminSidebar';
import { dashboardStats, formatCRC } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const statCards = (s) => [
  { label: 'Ventas Hoy', value: s.ventasHoy, sub: s.ventasHoyDelta, subClass: 'positive', icon: '📈' },
  { label: 'Productos', value: s.productos, sub: 'En catálogo', icon: '📦' },
  { label: 'Clientes', value: s.clientes, sub: 'Registrados', icon: '🛍️' },
  { label: 'Ingresos', value: formatCRC(s.ingresos), sub: 'Hoy', subClass: 'positive', icon: '💰' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const s = dashboardStats;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="section-subtitle">Aquí puedes consultar el estado general de BellasBoutique.</p>
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
          {statCards(s).map((c) => (
            <div key={c.label} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{c.label}</span>
                <span className="stat-icon">{c.icon}</span>
              </div>
              <p className="stat-value">{c.value}</p>
              <p className={`stat-sub ${c.subClass || ''}`}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Daily report */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Reporte Automático del Día</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Información generada automáticamente al finalizar la jornada.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/admin/reportes')}
            >
              Generar Reporte
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ background: 'var(--cream-100)', borderRadius: 'var(--radius)', padding: 18 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Productos vendidos</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.productosVendidos}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: 4 }}>
                ▲ {s.ventasHoyDelta} respecto al día anterior
              </p>
            </div>

            <div style={{ background: 'var(--cream-100)', borderRadius: 'var(--radius)', padding: 18 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Ingresos por ventas</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCRC(s.ingresosVentas)}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Ventas confirmadas</p>
            </div>

            <div style={{ background: 'var(--cream-100)', borderRadius: 'var(--radius)', padding: 18 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Productos con stock bajo</p>
              {s.lowStock.map((p) => (
                <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                  <span>{p.name}</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{p.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
