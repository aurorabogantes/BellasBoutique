import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { chatMessages } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';

export default function Chat() {
  const navigate = useNavigate();
  const { addActivity } = useContext(AuthContext);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_chat_messages')) || chatMessages; } catch { return chatMessages; }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    try { localStorage.setItem('bb_chat_messages', JSON.stringify(messages)); } catch {}
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInput('');
    if (addActivity) addActivity('Enviar mensaje chat', { text: newMsg.text });
    // Auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'agent',
          text: '¡Gracias por contactarnos! Un momento mientras revisamos su consulta.',
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 24px',
            borderBottom: '1px solid var(--border)',
          }}>
            <button
              className="btn-ghost"
              onClick={() => navigate('/soporte')}
              style={{ fontSize: '1.1rem', marginRight: 4 }}
            >←</button>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--brown-800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.1rem',
            }}>🎧</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Chat en Línea</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Converse con uno de nuestros asesores.
              </p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Asesor BellasBoutique</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--success)' }}>● En línea</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            height: 360,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--cream-100)',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '65%',
                  background: msg.sender === 'user' ? 'var(--brown-800)' : 'var(--white)',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                  borderRadius: msg.sender === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{msg.text}</p>
                  <p style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            gap: 12,
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--white)',
          }}>
            <input
              className="form-input"
              placeholder="Escriba su mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: '10px 14px' }}
              onClick={send}
            >
              ✉
            </button>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 24px',
            background: 'var(--cream-200)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            <span>Horario de atención · Lunes a Viernes • 8:00 a.m. - 6:00 p.m.</span>
            <span>
              Tiempo promedio de respuesta{' '}
              <strong style={{ color: 'var(--success)' }}>Menos de 5 minutos</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
