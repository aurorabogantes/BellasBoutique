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
  const { user, recordInvoice, sendEmail, addActivity, updateInvoiceStatus } = useContext(AuthContext);
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
    // create invoice object (status will be decided by payment simulation)
    const invoice = {
      id: 'F' + Date.now(),
      cliente: (user && (user.nombre || user.correo)) || 'Cliente',
      items: cartItems.map((c) => ({ producto: c.name, cantidad: c.qty, precioUnitario: c.price, total: c.price * c.qty })),
      total,
      fecha: today,
      estado: 'Pendiente',
      metodo: method,
      direccion: previewAddress,
    };

    // simulate payment gateway
    const simulatePayment = async (method) => {
      // small delay to mimic network
      await new Promise((r) => setTimeout(r, 600));
      const rnd = Math.random();
      if (method === 'Tarjeta') {
        if (rnd < 0.8) return 'success';
        if (rnd < 0.95) return 'pending';
        return 'failed';
      }
      if (method === 'SINPE') {
        if (rnd < 0.9) return 'success';
        return 'failed';
      }
      // Transferencia tends to be pending
      if (method === 'Transferencia') {
        if (rnd < 0.25) return 'success';
        return 'pending';
      }
      return 'failed';
    };

    (async () => {
      const result = await simulatePayment(method);
      if (result === 'success') {
        invoice.estado = 'Pagado';
        recordInvoice(invoice);
        const emailBody = `Factura ${invoice.id}\nCliente: ${invoice.cliente}\nTotal: ${formatCRC(invoice.total)}\nDirección: ${invoice.direccion}`;
        const emailObj = sendEmail(user?.correo || 'cliente@ejemplo.com', `Confirmación de Compra ${invoice.id}`, emailBody);
        setSentEmail(emailObj);
        setConfirmed(true);
        setShowEmailModal(true);
        setShowPreviewModal(false);
        clearCart();
      } else if (result === 'failed') {
        invoice.estado = 'Fallido';
        recordInvoice(invoice);
        addActivity && addActivity('Pago fallido', { invoiceId: invoice.id, metodo: method });
        setShowPreviewModal(false);
        // show a simple alert / toast
        try { window.alert('El pago ha fallado. Por favor, intente nuevamente.'); } catch {}
      } else {
        // pending
        invoice.estado = 'Pendiente';
        recordInvoice(invoice);
        addActivity && addActivity('Pago pendiente', { invoiceId: invoice.id, metodo: method });
        setShowPreviewModal(false);
        // show pending screen with option to simulate completion
        setConfirmed(false);
        setShowEmailModal(false);
        // show an information modal by reusing the preview modal state
        setShowPreviewModal(false);
        // store pending id in local state to allow simulation
        setPendingInvoiceId(invoice.id);
        setPendingInvoice(invoice);
      }
    })();
  };

  const [pendingInvoiceId, setPendingInvoiceId] = useState(null);
  const [pendingInvoice, setPendingInvoice] = useState(null);

  const simulateCompletePending = () => {
    if (!pendingInvoiceId) return;
    // update status via context
    updateInvoiceStatus && updateInvoiceStatus(pendingInvoiceId, 'Pagado');
    const updated = { ...pendingInvoice, estado: 'Pagado' };
    const emailObj = sendEmail(user?.correo || 'cliente@ejemplo.com', `Confirmación de Compra ${pendingInvoiceId}`, `Factura ${pendingInvoiceId}\nCliente: ${updated.cliente}\nTotal: ${formatCRC(updated.total)}\nDirección: ${updated.direccion}`);
    setSentEmail(emailObj);
    setConfirmed(true);
    setPendingInvoiceId(null);
    setPendingInvoice(null);
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

  if (pendingInvoiceId) {
    return (
      <>
        <Navbar />
        <div className="page-container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Pago Pendiente</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Su pago está en estado <strong>Pendiente</strong>. Cuando se confirme, recibirá la factura por correo.
            </p>
            <p style={{ fontSize: '0.9rem' }}>ID de la transacción: <strong>{pendingInvoiceId}</strong></p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 18 }}>
              <button className="btn btn-primary" onClick={simulateCompletePending}>Simular pago completado</button>
              <button className="btn btn-outline" onClick={() => navigate('/catalogo')}>Volver al catálogo</button>
            </div>
          </div>
        </div>
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
