import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import { formatCRC, paymentMethods } from '../data/mockData';

const IVA = 0.13;
const today = new Date().toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const [method, setMethod] = useState('Tarjeta');
  const [confirmed, setConfirmed] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(subtotal * IVA);
  const total = subtotal + iva;

  const handleConfirm = () => {
    setConfirmed(true);
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
            <button
              className="btn btn-primary"
              onClick={() => navigate('/catalogo')}
            >
              Seguir comprando
            </button>
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
    </>
  );
}
