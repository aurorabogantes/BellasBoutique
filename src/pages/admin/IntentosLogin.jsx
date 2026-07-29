import AdminSidebar from '../../components/AdminSidebar';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ConfirmContext } from '../../context/ConfirmContext';

export default function IntentosLogin() {
  const { activityLog, addActivity } = useContext(AuthContext);
  const [filter, setFilter] = useState('Todos');

  const entries = (activityLog || []).filter((e) => e.action && (e.action.toLowerCase().includes('login')));
  const filtered = filter === 'Todos' ? entries : entries.filter((e) => e.action.toLowerCase().includes(filter.toLowerCase()));

  const { confirm } = useContext(ConfirmContext);

  const exportCSV = () => {
    const rows = [['ID','Usuario','Acción','Motivo','Fecha']];
    filtered.forEach((e) => rows.push([e.id, e.user?.correo || '', e.action, JSON.stringify(e.meta||{}), e.ts]));
    const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'intentos_login.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const clear = async () => {
    const ok = await confirm('Eliminar todos los registros de intentos de login?');
    if (!ok) return;
    try { localStorage.setItem('bb_activity_log', JSON.stringify((activityLog||[]).filter((e)=>!e.action.toLowerCase().includes('login')))); } catch {}
    addActivity('Limpiar intentos login');
    window.location.reload();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Intentos de Inicio de Sesión</h1>
            <p className="section-subtitle">Registro de intentos de login (exitosos y fallidos).</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
            <select className="form-input" value={filter} onChange={(e)=>setFilter(e.target.value)}>
              <option>Todos</option>
              <option>Login</option>
              <option>Login fallido</option>
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={exportCSV}>⬇️ Exportar CSV</button>
              <button className="btn btn-danger btn-sm" onClick={clear}>🗑️ Borrar</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Usuario</th><th>Acción</th><th>Meta</th><th>Fecha</th></tr>
              </thead>
              <tbody>
                {filtered.map((e)=> (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{e.id}</td>
                    <td>{e.user?.correo || 'anon'}</td>
                    <td>{e.action}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{JSON.stringify(e.meta||{})}</td>
                    <td style={{ fontSize: '0.85rem' }}>{e.ts}</td>
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
