import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { users as initialUsers, roles } from '../../data/mockData';

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos los roles');

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'Todos los roles' || u.rol === roleFilter;
    const matchSearch =
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const setRole = (id, rol) =>
    setUsers(users.map((u) => (u.id === id ? { ...u, rol } : u)));

  const setEstado = (id, estado) =>
    setUsers(users.map((u) => (u.id === id ? { ...u, estado } : u)));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Administración de Usuarios</h1>
            <p className="section-subtitle">Gestione usuarios, estados y roles del sistema.</p>
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
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ width: 200 }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.id}</td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.correo}</td>
                    <td>
                      <select
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                        value={u.rol}
                        onChange={(e) => setRole(u.id, e.target.value)}
                      >
                        {['Administrador', 'Cliente', 'Vendedor'].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-input"
                        style={{
                          padding: '4px 8px', fontSize: '0.8rem', width: 'auto',
                          color: u.estado === 'Activo' ? 'var(--success)' : 'var(--danger)',
                          fontWeight: 600,
                        }}
                        value={u.estado}
                        onChange={(e) => setEstado(u.id, e.target.value)}
                      >
                        {['Activo', 'Inactivo'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn edit" title="Editar">✏️</button>
                        <button
                          className="icon-btn"
                          title={u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                          onClick={() => setEstado(u.id, u.estado === 'Activo' ? 'Inactivo' : 'Activo')}
                        >
                          {u.estado === 'Activo' ? '⏸️' : '▶️'}
                        </button>
                        <button className="icon-btn view" title="Ver perfil">👤</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
