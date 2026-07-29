import { useState, useEffect, useContext } from 'react';
import VendorLayout from './VendorLayout';
import { categories } from '../../data/mockData';
import { AuthContext } from '../../context/AuthContext';

const loadProducts = () => {
  try { return JSON.parse(localStorage.getItem('bb_products')) || []; } catch { return []; }
};

const emptyProduct = { name: '', category: 'Ropa', supplier: '', priceUSD: '', stock: '' };

export default function VendorProducts() {
  const [products, setProducts] = useState(() => loadProducts());
  useEffect(() => { try { localStorage.setItem('bb_products', JSON.stringify(products)); } catch {} }, [products]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas las categorías');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const filtered = products.filter((p) => {
    // show products owned by this vendor or unassigned
    const owned = !p.ownerId || p.ownerId === user?.id;
    const matchCat = category === 'Todas las categorías' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return owned && matchCat && matchSearch;
  });
  const { addActivity, user } = useContext(AuthContext);

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setShowModal(true); };

  const handleDelete = (id) => { setProducts(products.filter((p) => p.id !== id)); if (addActivity) addActivity('Vendedor eliminar producto', { id, user: user?.correo }); };
  const handleSave = () => {
    if (editing) {
      setProducts(products.map((p) => (p.id === editing ? { ...p, ...form } : p)));
      if (addActivity) addActivity('Vendedor editar producto', { id: editing, name: form.name });
    } else {
      const newP = { ...form, id: Date.now(), price: Math.round(form.priceUSD * 540), ownerId: user?.id };
      setProducts([...products, newP]);
      if (addActivity) addActivity('Vendedor crear producto', { id: newP.id, name: newP.name });
    }
    setShowModal(false);
  };

  return (
    <VendorLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title">Mis Productos</h1>
          <p className="section-subtitle">Gestiona los productos que vendes en BellasBoutique.</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={openAdd}>+ Nuevo Producto</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="filters-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input className="form-input" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-input" style={{ width: 200 }} value={category} onChange={(e) => setCategory(e.target.value)}>
            {['Todas las categorías', ...categories].map((c) => <option key={c}>{c}</option>)}
          </select>
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
                      <button className="icon-btn edit" title="Editar" onClick={() => openEdit(p)}>✏️</button>
                      <button className="icon-btn delete" title="Eliminar" onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: 480, maxWidth: '95vw' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['name','Nombre'], ['supplier','Proveedor'], ['priceUSD','Precio (USD)','number'], ['stock','Stock','number']].map(([key,label,type='text'])=> (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input className="form-input" type={type} value={form[key]} onChange={(e)=> setForm({...form, [key]: e.target.value})} />
                </div>
              ))}
              <div className="form-group">
                <label>Categoría</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                  {['Ropa','Calzado','Accesorios'].map((c)=> <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}
