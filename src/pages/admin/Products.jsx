import { useState, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { products as initialProducts, categories, formatCRC } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';

const emptyProduct = { name: '', category: 'Ropa', supplier: '', priceUSD: '', stock: '' };

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas las categorías');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const filtered = products.filter((p) => {
    const matchCat = category === 'Todas las categorías' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setShowModal(true); };
  

  const { addActivity } = useContext(AuthContext);

  // watch changes to products and log create/update/delete via specific handlers
  const handleDeleteWithLog = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    if (addActivity) addActivity('Eliminar producto', { id });
  };

  const handleSaveWithLog = () => {
    if (editing) {
      setProducts(products.map((p) => (p.id === editing ? { ...p, ...form } : p)));
      if (addActivity) addActivity('Editar producto', { id: editing, name: form.name });
    } else {
      const newP = { ...form, id: Date.now(), price: Math.round(form.priceUSD * 540) };
      setProducts([...products, newP]);
      if (addActivity) addActivity('Crear producto', { id: newP.id, name: newP.name });
    }
    setShowModal(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Gestión de Productos</h1>
            <p className="section-subtitle">Administre el catálogo de BellasBoutique.</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-info" style={{ textAlign: 'right' }}>
              <p>Administrador</p>
              <small>admin@bellasboutique.com</small>
            </div>
            <div className="admin-user-avatar">A</div>
          </div>
        </div>

        <div className="card">
          <div className="filters-bar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="form-input"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ width: 200 }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Nuevo Producto</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Proveedor</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.supplier}</td>
                    <td>${p.priceUSD}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn view" title="Ver">👁️</button>
                        <button className="icon-btn edit" title="Editar" onClick={() => openEdit(p)}>✏️</button>
                        <button className="icon-btn delete" title="Eliminar" onClick={() => handleDeleteWithLog(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
        }}>
          <div className="card" style={{ width: 480, maxWidth: '95vw' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>
              {editing ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['name', 'Nombre'],
                ['supplier', 'Proveedor'],
                ['priceUSD', 'Precio (USD)', 'number'],
                ['stock', 'Stock', 'number'],
              ].map(([key, label, type = 'text']) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input
                    className="form-input"
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Categoría</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['Ropa', 'Calzado', 'Accesorios'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-sm" onClick={handleSaveWithLog}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
