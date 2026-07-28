import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './index.css';

// Client pages
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Support from './pages/Support';
import Chat from './pages/Chat';
import FAQ from './pages/FAQ';
import ClientProfile from './pages/ClientProfile';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Users from './pages/admin/Users';
import Invoices from './pages/admin/Invoices';
import InvoiceDetail from './pages/admin/InvoiceDetail';
import Reports from './pages/admin/Reports';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Client */}
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/pago" element={<Checkout />} />
          <Route path="/soporte" element={<Support />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/encuesta-faq" element={<FAQ />} />
          <Route path="/perfil" element={<ClientProfile />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/productos" element={<Products />} />
          <Route path="/admin/usuarios" element={<Users />} />
          <Route path="/admin/facturacion" element={<Invoices />} />
          <Route path="/admin/ventas/:id" element={<InvoiceDetail />} />
          <Route path="/admin/reportes" element={<Reports />} />
          <Route path="/admin/configuracion" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

