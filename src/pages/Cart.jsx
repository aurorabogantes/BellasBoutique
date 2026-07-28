import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import { formatCRC } from '../data/mockData';

const IVA = 0.13;

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(subtotal * IVA);
  const total = subtotal + iva;

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Mi Carrito</h1>
          <p className="section-subtitle">
            Revise sus productos antes de continuar con el pago.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          {/* Cart items */}
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                        Tu carrito está vacío.
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p style={{ fontWeight: 600 }}>{item.name}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category}</p>
                        </td>
                        <td>{formatCRC(item.price)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ borderRadius: '50%', width: 28, height: 28, padding: 0, background: 'var(--brown-800)', color: 'white' }}
                              onClick={() => updateQty(item.id, item.qty - 1)}
                            >−</button>
                            <span style={{ minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ borderRadius: '50%', width: 28, height: 28, padding: 0, background: 'var(--brown-800)', color: 'white' }}
                              onClick={() => updateQty(item.id, item.qty + 1)}
                            >+</button>
                          </div>
                        </td>
                        <td>{formatCRC(item.price * item.qty)}</td>
                        <td>
                          <button
                            className="icon-btn delete"
                            onClick={() => removeFromCart(item.id)}
                          >🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Resumen</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>{formatCRC(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>IVA (13%)</span>
                <span>{formatCRC(iva)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span>
                  <span>{formatCRC(total)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {['✓ Compra segura', '✓ Envío gratuito', '✓ Pago protegido'].map((t) => (
                <p key={t} style={{ marginBottom: 4 }}>{t}</p>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => navigate('/pago')}
              disabled={cartItems.length === 0}
            >
              Continuar al Pago →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
