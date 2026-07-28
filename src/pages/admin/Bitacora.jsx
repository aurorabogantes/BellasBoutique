import { useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { AuthContext } from '../../context/AuthContext';

export default function Bitacora() {
  const { activityLog } = useContext(AuthContext);

  const exportCSV = () => {
    const rows = [['ts','user','rol','action','meta']];
    activityLog.forEach((r) => rows.push([r.ts, r.user?.correo || '', r.user?.rol || '', r.action, JSON.stringify(r.meta || {})]));
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bitacora.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Bitácora de Actividades</h1>
            <p className="section-subtitle">Registro de acciones de usuarios y administradores.</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={exportCSV}>Exportar CSV</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Detalle</th></tr>
              </thead>
              <tbody>
                {activityLog.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(r.ts).toLocaleString()}</td>
                    <td>{r.user?.correo}</td>
                    <td>{r.user?.rol}</td>
                    <td style={{ fontWeight: 600 }}>{r.action}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{JSON.stringify(r.meta || {})}</td>
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
