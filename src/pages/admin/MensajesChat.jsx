import Navbar from '../../components/Navbar';
import { mensajesChat } from '../../data/mockData';
import { useState, useEffect } from 'react';

export default function MensajesChatAdmin() {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_chat_messages')) || mensajesChat; } catch { return mensajesChat; }
  });

  useEffect(() => { try { localStorage.setItem('bb_chat_messages', JSON.stringify(messages)); } catch {} }, [messages]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Mensajes Chat (MensajesChat)</h1>
          <p className="section-subtitle">Mensajes quemados y recibidos por el chat en línea.</p>
        </div>

        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Remitente</th>
                  <th>Mensaje</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td style={{ padding: 8 }}>{m.id}</td>
                    <td style={{ padding: 8 }}>{m.sender}</td>
                    <td style={{ padding: 8 }}>{m.text}</td>
                    <td style={{ padding: 8 }}>{m.time || m.ts || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
