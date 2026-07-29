import Navbar from '../../components/Navbar';
import { suggestions } from '../../data/mockData';
import { useState, useEffect } from 'react';

export default function SugerenciasAdmin() {
  const [sugs, setSugs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_suggestions')) || suggestions; } catch { return suggestions; }
  });

  useEffect(() => { try { localStorage.setItem('bb_suggestions', JSON.stringify(sugs)); } catch {} }, [sugs]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Sugerencias</h1>
          <p className="section-subtitle">Sugerencias recibidas (quemadas + nuevas).</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sugs.map((s) => (
              <div key={s.id} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{s.id}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{s.ts ? new Date(s.ts).toLocaleString() : ''}</span>
                </div>
                <p style={{ marginTop: 6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
