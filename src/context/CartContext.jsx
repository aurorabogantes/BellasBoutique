import { createContext, useState, useContext } from 'react';
import { products as catalogProducts } from '../data/mockData';
import { AuthContext } from './AuthContext';
import { ToastContext } from './ToastContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const authCtx = useContext(AuthContext);
  const { user } = authCtx;

  const initialCart = () => {
    try {
      const key = user ? `bb_cart_${user.id}` : 'bb_cart_anon';
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && Array.isArray(saved)) return saved;
    } catch {}
    return [
      { id: 1, name: 'Vestido Elegante', category: 'Ropa', price: 20000, qty: 1 },
      { id: 2, name: 'Tacones Nude', category: 'Calzado', price: 15000, qty: 2 },
      { id: 3, name: 'Bolso Beige', category: 'Accesorios', price: 12000, qty: 1 },
    ];
  };

  const [cartItems, setCartItems] = useState(initialCart);

  const { showToast } = useContext(ToastContext);

  const addToCart = (product) => {
    const existing = cartItems.find((i) => i.id === product.id);
    const catalogItem = catalogProducts.find((p) => p.id === product.id) || product;
    const currentQty = existing ? existing.qty : 0;
    if (currentQty + 1 > (catalogItem.stock || 9999)) {
      // cannot add beyond stock
      if (showToast) showToast('Stock insuficiente para este producto.', { duration: 4000 });
      try { if (authCtx && authCtx.addActivity) authCtx.addActivity('Intento añadir al carrito - stock insuficiente', { productId: product.id }); } catch {}
      return false;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, category: product.category, price: product.price, qty: 1 }];
    });
    return true;
  };

  const addToCartLogged = (product) => {
    const ok = addToCart(product);
    try { if (ok && authCtx && authCtx.addActivity) authCtx.addActivity('Añadir al carrito', { productId: product.id, name: product.name }); } catch {}
    return ok;
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    try { if (authCtx && authCtx.addActivity) authCtx.addActivity('Actualizar cantidad carrito', { id, qty }); } catch {}
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => {
      try { if (authCtx && authCtx.addActivity) authCtx.addActivity('Eliminar del carrito', { id }); } catch {}
      return prev.filter((i) => i.id !== id);
    });

  const clearCart = () => setCartItems([]);

  const clearCartLogged = () => { try { if (authCtx && authCtx.addActivity) authCtx.addActivity('Vaciar carrito'); } catch {} ; setCartItems([]); };

  // persist cart per user
  useEffect(() => {
    try {
      const key = user ? `bb_cart_${user.id}` : 'bb_cart_anon';
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, user]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart: addToCartLogged, updateQty, removeFromCart, clearCart: clearCartLogged }}>
      {children}
    </CartContext.Provider>
  );
}
