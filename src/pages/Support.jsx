import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const services = [
  {
    icon: '⭐',
    title: 'Encuesta de Satisfacción',
    desc: 'Califique su experiencia de compra y ayúdenos a mejorar nuestros servicios.',
    label: 'Responder Encuesta',
    path: '/encuesta-faq',
  },
  {
    icon: '💬',
    title: 'Enviar Sugerencia',
    desc: 'Comparta sus ideas y comentarios para seguir mejorando BellasBoutique.',
    label: 'Enviar Sugerencia',
    path: '/encuesta-faq',
  },
  {
    icon: '❓',
    title: 'Preguntas Frecuentes',
    desc: 'Consulte las dudas más comunes sobre compras, pagos, envíos, devoluciones y cambios.',
    label: 'Ver Preguntas',
    path: '/encuesta-faq',
  },
  {
    icon: '🎧',
    title: 'Chat en Línea',
    desc: 'Converse en tiempo real con uno de nuestros asesores para resolver cualquier consulta sobre productos, pedidos o pagos.',
    label: 'Iniciar Chat',
    path: '/chat',
  },
];

export default function Support() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Centro de Soporte</h1>
          <p className="section-subtitle">¿Cómo podemos ayudarle hoy?</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>
          {services.map((s) => (
            <div key={s.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                width: 48, height: 48,
                background: 'var(--cream-200)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
              }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }}>{s.desc}</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(s.path)}
              >
                {s.label} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
