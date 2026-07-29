import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import MyInvoices from './pages/MyInvoices';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Users from './pages/admin/Users';
import Invoices from './pages/admin/Invoices';
import InvoiceDetail from './pages/admin/InvoiceDetail';
import Reports from './pages/admin/Reports';
import Bitacora from './pages/admin/Bitacora';
import Emails from './pages/admin/Emails';
import IntentosLogin from './pages/admin/IntentosLogin';
import Surveys from './pages/admin/Surveys';
// Vendor pages
import VendorDashboard from './pages/vendor/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
        <AuthProvider>
          <CartProvider>
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
          <Route path="/mis-facturas" element={<MyInvoices />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="Administrador"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/productos" element={<ProtectedRoute role={["Administrador","Vendedor"]}><Products /></ProtectedRoute>} />
          {/* Vendor routes */}
          <Route path="/vendor/dashboard" element={<ProtectedRoute role="Vendedor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/productos" element={<ProtectedRoute role={['Vendedor','Administrador']}><Products /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute role="Administrador"><Users /></ProtectedRoute>} />
          <Route path="/admin/facturacion" element={<ProtectedRoute role="Administrador"><Invoices /></ProtectedRoute>} />
          <Route path="/admin/ventas/:id" element={<ProtectedRoute role="Administrador"><InvoiceDetail /></ProtectedRoute>} />
          <Route path="/admin/reportes" element={<ProtectedRoute role="Administrador"><Reports /></ProtectedRoute>} />
          <Route path="/admin/bitacora" element={<ProtectedRoute role="Administrador"><Bitacora /></ProtectedRoute>} />
          <Route path="/admin/intentolog" element={<ProtectedRoute role="Administrador"><IntentosLogin /></ProtectedRoute>} />
          <Route path="/admin/emails" element={<ProtectedRoute role="Administrador"><Emails /></ProtectedRoute>} />
          <Route path="/admin/encuestas" element={<ProtectedRoute role="Administrador"><Surveys /></ProtectedRoute>} />
          <Route path="/admin/configuracion" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </CartProvider>
      </AuthProvider>
        </ConfirmProvider>
    </ToastProvider>
  </BrowserRouter>
  );
}

