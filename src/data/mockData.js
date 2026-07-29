// ── Products ─────────────────────────────────────────────────────────────────
export const products = [
  {
    id: 1,
    name: 'Vestido Elegante',
    category: 'Ropa',
    supplier: 'Moda CR',
    price: 20000,
    priceUSD: 39.99,
    stock: 15,
    image: 'https://i.pinimg.com/originals/f9/cb/d2/f9cbd28d2ec9e1c6a9b143b28855531d.jpg',
  },
  {
    id: 2,
    name: 'Tacones Negros',
    category: 'Calzado',
    supplier: 'Luxury Shoes',
    price: 15000,
    priceUSD: 69.99,
    stock: 8,
    image: 'https://heraldodemexico.com.mx/u/fotografias/m/2023/8/9/f768x1-781377_781504_141.jpeg',
  },
  {
    id: 3,
    name: 'Bolso Beige',
    category: 'Accesorios',
    supplier: 'Fashion Bags',
    price: 12000,
    priceUSD: 49.99,
    stock: 20,
    image: 'https://i.pinimg.com/736x/69/d7/22/69d722d923e3c8e011dbd884c03f8dc0.jpg',
  },
  {
    id: 4,
    name: 'Blazer Premium',
    category: 'Ropa',
    supplier: 'Elegance Wear',
    price: 24500,
    priceUSD: 59.99,
    stock: 11,
    image: 'https://images-na.ssl-images-amazon.com/images/I/510PHH-eJqL._AC_UL200_SR200,200_.jpg',
  },
];

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = [
  {
    id: 1001,
    nombre: 'Estefany',
    apellidos: 'Martínez',
    correo: 'estefany@bellasboutique.com',
    telefono: '8888-8888',
    direccion: 'San José, Costa Rica',
    rol: 'Administrador',
    estado: 'Activo',
    password: '••••••••',
  },
  {
    id: 1002,
    nombre: 'Ana',
    apellidos: 'López',
    correo: 'ana@bellasboutique.com',
    telefono: '7777-7777',
    direccion: 'Heredia, Costa Rica',
    rol: 'Cliente',
    estado: 'Activo',
    password: '••••••••',
  },
  {
    id: 1003,
    nombre: 'María',
    apellidos: 'Ruiz',
    correo: 'maria@bellasboutique.com',
    telefono: '6666-6666',
    direccion: 'Alajuela, Costa Rica',
    rol: 'Vendedor',
    estado: 'Activo',
    password: '••••••••',
  },
  {
    id: 1004,
    nombre: 'Carlos',
    apellidos: 'Mora',
    correo: 'carlos@bellasboutique.com',
    telefono: '5555-5555',
    direccion: 'Cartago, Costa Rica',
    rol: 'Cliente',
    estado: 'Inactivo',
    password: '••••••••',
  },
];

// ── Invoices ──────────────────────────────────────────────────────────────────
export const invoices = [
  {
    id: 'F00125',
    cliente: 'Ana López',
    producto: 'Vestido Elegante',
    cantidad: 2,
    total: 40000,
    fecha: '16/07/2026',
    estado: 'Pagado',
    metodo: 'Tarjeta',
    items: [
      { producto: 'Vestido Elegante', cantidad: 2, precioUnitario: 20000, total: 40000 },
    ],
  },
  {
    id: 'F00126',
    cliente: 'María Ruiz',
    producto: 'Tacones Nude',
    cantidad: 1,
    total: 15000,
    fecha: '16/07/2026',
    estado: 'Pagado',
    metodo: 'SINPE',
    items: [
      { producto: 'Tacones Nude', cantidad: 1, precioUnitario: 15000, total: 15000 },
    ],
  },
  {
    id: 'F00127',
    cliente: 'Sofía Mora',
    producto: 'Bolso Beige',
    cantidad: 3,
    total: 36000,
    fecha: '15/07/2026',
    estado: 'Pagado',
    metodo: 'Tarjeta',
    items: [
      { producto: 'Bolso Beige', cantidad: 3, precioUnitario: 12000, total: 36000 },
    ],
  },
  {
    id: 'F00128',
    cliente: 'Laura Gómez',
    producto: 'Blazer Premium',
    cantidad: 1,
    total: 24500,
    fecha: '15/07/2026',
    estado: 'Pendiente',
    metodo: 'Transferencia',
    items: [
      { producto: 'Blazer Premium', cantidad: 1, precioUnitario: 24500, total: 24500 },
    ],
  },
];

// ── Dashboard stats ───────────────────────────────────────────────────────────
export const dashboardStats = {
  ventasHoy: 126,
  ventasHoyDelta: '+12%',
  productos: 245,
  clientes: 532,
  ingresos: 2850000,
  productosVendidos: 126,
  ingresosVentas: 2850000,
  lowStock: [
    { name: 'Tacones Nude', stock: 2 },
    { name: 'Blazer Premium', stock: 4 },
    { name: 'Bolso Beige', stock: 5 },
  ],
};

// ── Reports stats ─────────────────────────────────────────────────────────────
export const reportStats = {
  ventasTotales: 350,
  ingresos: 8250000,
  productosVendidos: 420,
  clientes: 180,
  ventasPorMes: [
    { mes: 'Ene', ventas: 40 },
    { mes: 'Feb', ventas: 55 },
    { mes: 'Mar', ventas: 70 },
    { mes: 'Abr', ventas: 65 },
    { mes: 'May', ventas: 80 },
    { mes: 'Jun', ventas: 95 },
    { mes: 'Jul', ventas: 110 },
  ],
};

// ── Current user (logged-in client) ─────────────────────────────────────────
export const currentClient = {
  id: 1001,
  nombre: 'Estefany',
  apellidos: 'Martínez',
  correo: 'cliente@bellasboutique.com',
  telefono: '8888-8888',
  direccion: 'San José, Costa Rica',
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    id: 1,
    pregunta: '¿Cómo realizo una compra?',
    respuesta:
      'Seleccione los productos que desea, agréguelos al carrito y siga los pasos de pago.',
  },
  {
    id: 2,
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Aceptamos Tarjeta de crédito/débito, SINPE Móvil y Transferencia bancaria.',
  },
  {
    id: 3,
    pregunta: '¿Cómo solicito un cambio?',
    respuesta:
      'Puede solicitar un cambio dentro de los 15 días posteriores a la compra contactando soporte.',
  },
  {
    id: 4,
    pregunta: '¿Cuánto tarda el envío?',
    respuesta: 'Los envíos dentro del Gran Área Metropolitana tardan de 1 a 3 días hábiles.',
  },
];

// ── Chat messages ─────────────────────────────────────────────────────────────
export const chatMessages = [
  {
    id: 1,
    sender: 'agent',
    text: '¡Hola! Bienvenido a BellasBoutique. ¿En qué podemos ayudarle hoy?',
    time: '10:30 AM',
  },
  {
    id: 2,
    sender: 'user',
    text: 'Hola, quisiera saber si el Vestido Elegante está disponible en talla M.',
    time: '10:31 AM',
  },
  {
    id: 3,
    sender: 'agent',
    text: 'Sí, contamos con disponibilidad en talla M y también en talla L.',
    time: '10:32 AM',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const formatCRC = (amount) =>
  '₡' + amount.toLocaleString('es-CR');

export const categories = ['Todas las categorías', 'Ropa', 'Calzado', 'Accesorios'];
export const roles = ['Todos los roles', 'Administrador', 'Cliente', 'Vendedor'];
export const paymentMethods = ['Tarjeta', 'SINPE', 'Transferencia'];
export const orderStatuses = ['Todos los estados', 'Pagado', 'Pendiente'];
