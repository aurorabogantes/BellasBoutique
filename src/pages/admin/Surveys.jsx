import AdminSidebar from '../../components/AdminSidebar';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ConfirmContext } from '../../context/ConfirmContext';

export default function Surveys() {
  const { addActivity } = useContext(AuthContext);
  const surveys = JSON.parse(localStorage.getItem('bb_surveys') || '[]');
  const suggestions = JSON.parse(localStorage.getItem('bb_suggestions') || '[]');

  const { confirm } = useContext(ConfirmContext);

  const exportCSV = (items, name) => {
    const rows = [['ID','Tipo','Detalle','Fecha']];
    items.forEach(i => rows.push([i.id, i.type || name, JSON.stringify(i.payload||{}), i.ts]));
    const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const clearAll = async () => {
    const ok = await confirm('Borrar encuestas y sugerencias?');
    if (!ok) return;
    localStorage.removeItem('bb_surveys'); localStorage.removeItem('bb_suggestions'); addActivity('Limpiar encuestas y sugerencias'); window.location.reload();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Encuestas y Sugerencias</h1>
            <p className="section-subtitle">Ver feedback de usuarios.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <button className="btn btn-outline btn-sm" onClick={() => exportCSV(surveys, 'encuestas')}>⬇️ Exportar Encuestas</button>
          <button className="btn btn-outline btn-sm" onClick={() => exportCSV(suggestions, 'sugerencias')}>⬇️ Exportar Sugerencias</button>
          <button className="btn btn-danger btn-sm" onClick={clearAll}>🗑️ Borrar Todo</button>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <h3>Encuestas</h3>
          {surveys.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No hay encuestas.</p> : (
            <ul>
              {surveys.map(s => <li key={s.id}>{s.rating} ★ — {s.comment} — <small>{s.ts}</small></li>)}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Sugerencias</h3>
          {suggestions.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No hay sugerencias.</p> : (
            <ul>
              {suggestions.map(s => <li key={s.id}>{s.text} — <small>{s.ts}</small></li>)}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
