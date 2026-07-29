import { useState } from 'react';
import Navbar from '../components/Navbar';
import { faqs } from '../data/mockData';

export default function FAQ() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [sent, setSent] = useState(false);
  const [suggSent, setSuggSent] = useState(false);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Encuesta y Preguntas Frecuentes</h1>
          <p className="section-subtitle">Ayúdenos a mejorar nuestros servicios.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Survey */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Encuesta de Satisfacción</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              ¿Cómo calificaría su experiencia?
            </p>

            {/* Stars */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    background: 'none',
                    border: '1.5px solid var(--border)',
                    borderRadius: '50%',
                    width: 40, height: 40,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    color: n <= (hovered || rating) ? 'var(--warning)' : 'var(--text-muted)',
                    transition: 'color 0.1s',
                  }}
                >★</button>
              ))}
            </div>

            <textarea
              className="form-input"
              placeholder="Escriba sus comentarios..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ resize: 'vertical', marginBottom: 16 }}
            />

            {sent ? (
              <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
                ✓ Encuesta enviada. ¡Gracias!
              </p>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (rating > 0) {
                    const store = JSON.parse(localStorage.getItem('bb_surveys') || '[]');
                    const entry = { id: Date.now(), rating, comment, ts: new Date().toISOString() };
                    store.unshift(entry); localStorage.setItem('bb_surveys', JSON.stringify(store));
                    setSent(true); try { const act = JSON.parse(localStorage.getItem('bb_activity_log')||'[]'); act.unshift({ id: Date.now(), user: { correo: 'anon' }, action: 'Encuesta enviada', meta: { rating }, ts: new Date().toISOString() }); localStorage.setItem('bb_activity_log', JSON.stringify(act)); } catch {}
                  }
                }}
              >
                ✉ Enviar Encuesta
              </button>
            )}
          </div>

          {/* FAQ */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Preguntas Frecuentes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'var(--white)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                    }}
                  >
                    {faq.pregunta}
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                      {openFaq === faq.id ? '▲' : '▼'}
                    </span>
                  </button>
                  {openFaq === faq.id && (
                    <div style={{
                      padding: '10px 16px 14px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      borderTop: '1px solid var(--border)',
                      background: 'var(--cream-100)',
                    }}>
                      {faq.respuesta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestion */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Enviar una sugerencia</h3>
          <textarea
            className="form-input"
            placeholder="Comparta sus ideas para mejorar BellasBoutique..."
            rows={4}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            style={{ resize: 'vertical', marginBottom: 16 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {suggSent ? (
              <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
                ✓ Sugerencia enviada. ¡Gracias!
              </p>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (suggestion.trim()) {
                    const store = JSON.parse(localStorage.getItem('bb_suggestions') || '[]');
                    const entry = { id: Date.now(), text: suggestion.trim(), ts: new Date().toISOString() };
                    store.unshift(entry); localStorage.setItem('bb_suggestions', JSON.stringify(store));
                    setSuggSent(true);
                    try { const act = JSON.parse(localStorage.getItem('bb_activity_log')||'[]'); act.unshift({ id: Date.now(), user: { correo: 'anon' }, action: 'Sugerencia enviada', meta: { text: suggestion.trim() }, ts: new Date().toISOString() }); localStorage.setItem('bb_activity_log', JSON.stringify(act)); } catch {}
                  }
                }}
              >
                ✉ Enviar Sugerencia
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
