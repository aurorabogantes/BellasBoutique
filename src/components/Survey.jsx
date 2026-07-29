import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatCRC } from '../data/mockData';

export default function Survey({ compact }) {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!rating) return;
    const store = JSON.parse(localStorage.getItem('bb_surveys') || '[]');
    const entry = { id: 'SV' + Date.now(), rating, comment: comment.trim(), user: user?.correo || 'anon', ts: new Date().toISOString() };
    store.unshift(entry);
    localStorage.setItem('bb_surveys', JSON.stringify(store));
    // also save as suggestion if comment present
    if (comment.trim()) {
      const s = JSON.parse(localStorage.getItem('bb_suggestions') || '[]');
      s.unshift({ id: 'SG' + Date.now(), text: comment.trim(), user: user?.correo || 'anon', ts: new Date().toISOString() });
      localStorage.setItem('bb_suggestions', JSON.stringify(s));
    }
    setSent(true);
  };

  if (compact) {
    return (
      <div className="card">
        <h4 style={{ marginBottom: 8 }}>¿Cómo fue tu experiencia?</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3,4,5].map((n) => (
            <button key={n} className="btn-ghost" onClick={() => setRating(n)} style={{ fontSize: 18 }}>{n <= rating ? '★' : '☆'}</button>
          ))}
          <button className="btn btn-primary btn-sm" onClick={submit} disabled={!rating} style={{ marginLeft: 'auto' }}>Enviar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Encuesta de Satisfacción</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} onClick={() => setRating(n)} className="btn-ghost" style={{ fontSize: 20 }}>{n <= rating ? '★' : '☆'}</button>
        ))}
      </div>
      <textarea className="form-input" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentarios o sugerencias..." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        {sent ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓ Enviado</span> : <button className="btn btn-primary" onClick={submit} disabled={!rating}>Enviar encuesta</button>}
      </div>
    </div>
  );
}
