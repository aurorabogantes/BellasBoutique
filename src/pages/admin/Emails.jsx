import AdminSidebar from '../../components/AdminSidebar';
import { useState, useEffect } from 'react';

export default function Emails() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bb_sent_emails')) || [];
      setEmails(stored);
    } catch { setEmails([]); }
  }, []);

  const clearAll = () => {
    if (!confirm('Eliminar todos los correos simulados?')) return;
    localStorage.removeItem('bb_sent_emails');
    setEmails([]);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Correos Enviados (simulado)</h1>
            <p className="section-subtitle">Listado de correos guardados en localStorage.</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-outline btn-sm" onClick={clearAll}>Borrar todos</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {emails.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay correos guardados.</p>
            ) : emails.map((e) => (
              <div key={e.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 700 }}>{e.subject}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Para: {e.to}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(e.ts).toLocaleString()}</div>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{e.body}</pre>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
