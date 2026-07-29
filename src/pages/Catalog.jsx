import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { products, categories, formatCRC } from '../data/mockData';
import Survey from '../components/Survey';
import { CartContext } from '../context/CartContext';

export default function Catalog() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addToCart, cartItems } = useContext(CartContext);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('cat') || 'Todas las categorías');

  const filtered = products.filter((p) => {
    const matchCat = category === 'Todas las categorías' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Nueva Colección</h1>
          <p className="section-subtitle">
            Descubre ropa, calzado y accesorios para cada ocasión.
          </p>
        </div>

        {/* Filters */}
        <div className="filters-bar" style={{ marginBottom: 28 }}>
          <div className="search-wrapper" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>
          <select
            className="form-input"
            style={{ width: 200 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((product) => (
            <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 240, overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 18px 20px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                  {product.category}
                </p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                  {formatCRC(product.price)}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Stock disponible: {product.stock}
                </p>
                <button
                  className="btn btn-primary btn-full btn-sm"
                  onClick={() => { addToCart(product); }}
                >
                  🛒 Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Survey compact={true} />
        </div>
      </div>
    </>
  );
}
