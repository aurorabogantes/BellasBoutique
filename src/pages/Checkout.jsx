import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import { formatCRC, paymentMethods } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';

const IVA = 0.13;
const today = new Date().toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, recordInvoice, sendEmail } = useContext(AuthContext);
  const [method, setMethod] = useState('Tarjeta');
  const [confirmed, setConfirmed] = useState(false);
  const [sentEmail, setSentEmail] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewAddress, setPreviewAddress] = useState(user?.direccion || '');

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(subtotal * IVA);
  const total = subtotal + iva;

  const handleConfirm = () => {
    if (cartItems.length === 0) return;
    // open preview modal to allow editing address
    setPreviewAddress(user?.direccion || '');
    setShowPreviewModal(true);
  };

  const handleFinalConfirm = () => {
    // create invoice and send
    const invoice = {
      id: 'F' + Date.now(),
      cliente: (user && (user.nombre || user.correo)) || 'Cliente',
      items: cartItems.map((c) => ({ producto: c.name, cantidad: c.qty, precioUnitario: c.price, total: c.price * c.qty })),
      total,
      fecha: today,
      estado: 'Pagado',
      metodo: method,
      direccion: previewAddress,
    };
    recordInvoice(invoice);
    const emailBody = `Factura ${invoice.id}\nCliente: ${invoice.cliente}\nTotal: ${formatCRC(invoice.total)}\nDirección: ${invoice.direccion}`;
    const emailObj = sendEmail(user?.correo || 'cliente@ejemplo.com', `Confirmación de Compra ${invoice.id}`, emailBody);
    setSentEmail(emailObj);
    setConfirmed(true);
    setShowEmailModal(true);
    setShowPreviewModal(false);
    clearCart();
  };

  if (confirmed) {
    return (
      <>
        <Navbar />
        <div className="page-container" style={{ maxWidth: 500, textAlign: 'center' }}>
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
              ¡Compra confirmada!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Gracias por tu compra. Pronto recibirás tu factura.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>Seguir comprando</button>
              <button className="btn btn-outline" onClick={() => setShowEmailModal(true)}>Ver correo enviado</button>
            </div>
          </div>
        </div>

        {showEmailModal && sentEmail && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div className="card" style={{ width: 520, maxWidth: '95vw' }}>
              <h3 style={{ marginBottom: 8 }}>Correo de Confirmación</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Para: <strong>{sentEmail.to}</strong></p>
              <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', background: 'var(--cream-100)', padding: 12, borderRadius: 6 }}>{sentEmail.body}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline" onClick={() => setShowEmailModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
        {showPreviewModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div className="card" style={{ width: 560, maxWidth: '95vw' }}>
              <h3 style={{ marginBottom: 8 }}>Vista previa - Correo de Confirmación</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Para: <strong>{user?.correo || 'cliente@ejemplo.com'}</strong></p>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Dirección de entrega</label>
                <input className="form-input" value={previewAddress} onChange={(e) => setPreviewAddress(e.target.value)} />
              </div>
              <div style={{ maxHeight: 160, overflowY: 'auto', background: 'var(--cream-100)', padding: 12, borderRadius: 6 }}>
                <p style={{ fontWeight: 700 }}>Detalle de la factura</p>
                {cartItems.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.name} × {c.qty}</span>
                    <span>{formatCRC(c.price * c.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span><span>{formatCRC(total)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline" onClick={() => setShowPreviewModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleFinalConfirm}>Confirmar y enviar correo</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Confirmar Compra</h1>
          <p className="section-subtitle">
            Seleccione el método de pago y revise el detalle de su factura.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
          {/* Payment method */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Método de Pago</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {paymentMethods.map((m) => (
                <label
                  key={m}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    style={{ accentColor: 'var(--brown-800)' }}
                  />
                  {m === 'Tarjeta' && '💳'} {m === 'SINPE' && '📱'} {m === 'Transferencia' && '🏦'} {m}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Estado del Pago
              </p>
              <span className="badge badge-success">✓ Exitoso</span>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                Fecha de Pago
              </p>
              <p style={{ fontSize: '0.875rem' }}>{today}</p>
            </div>
          </div>

          {/* Invoice */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Factura #000125</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Fecha de compra: {today}
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Producto', 'Cantidad', 'Precio'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 0', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 0' }}>{item.name}</td>
                    <td style={{ padding: '10px 0' }}>{item.qty}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>{formatCRC(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span><span>{formatCRC(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>IVA (13%)</span><span>{formatCRC(iva)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span>Total</span><span>{formatCRC(total)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleConfirm}
              disabled={cartItems.length === 0}
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
