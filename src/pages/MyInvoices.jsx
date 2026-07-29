import { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { formatCRC, invoices as mockInvoices } from '../data/mockData';
import { jsPDF } from 'jspdf';

export default function MyInvoices() {
  const { user, invoices } = useContext(AuthContext);
  const [viewing, setViewing] = useState(null);

  // Use burned/mock invoices as source. Admin sees all, clients only their invoices.
  const sourceInvoices = mockInvoices || (invoices || []);
  const myInvoices = (user?.rol === 'Administrador')
    ? sourceInvoices
    : sourceInvoices.filter((inv) => {
      if (!user) return false;
      const invCliente = (inv.cliente || '').toLowerCase();
      const correo = (user.correo || '').toLowerCase();
      const nombre = ((user.nombre || '') + ' ' + (user.apellidos || '')).trim().toLowerCase();
      return invCliente.includes(correo) || invCliente.includes(nombre) || invCliente.includes((user.nombre || '').toLowerCase());
    });

  const exportPdf = (inv) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = 40;
    doc.setFontSize(18);
    doc.text('BellasBoutique - Factura', margin, y);
    y += 28;
    doc.setFontSize(12);
    doc.text(`ID: ${inv.id}`, margin, y); doc.text(`Fecha: ${inv.fecha}`, 400, y);
    y += 18;
    doc.text(`Cliente: ${inv.cliente}`, margin, y);
    y += 18;
    doc.text(`Método: ${inv.metodo}    Estado: ${inv.estado}`, margin, y);
    y += 22;
    doc.setFontSize(13);
    doc.text('Detalle:', margin, y);
    y += 16;
    inv.items.forEach((it) => {
      const line = `${it.producto} x ${it.cantidad}  ${formatCRC(it.precioUnitario)}  -> ${formatCRC(it.total)}`;
      doc.text(line, margin, y);
      y += 14;
      if (y > 740) { doc.addPage(); y = 40; }
    });
    y += 8;
    doc.setFontSize(14);
    doc.text(`Total: ${formatCRC(inv.total)}`, margin, y);
    doc.save(`Factura-${inv.id}.pdf`);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">Mis Facturas</h1>
          <p className="section-subtitle">Aquí puedes ver y descargar tus facturas.</p>
        </div>

        <div className="card">
          {(!myInvoices || myInvoices.length === 0) ? (
            <p>No se encontraron facturas para tu cuenta.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {myInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.id}</td>
                      <td>{inv.fecha}</td>
                      <td>{formatCRC(inv.total)}</td>
                      <td>{inv.estado}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setViewing(inv)}>Ver</button>
                          <button className="btn btn-primary btn-sm" onClick={() => exportPdf(inv)}>Exportar PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {viewing && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
            <div className="card" style={{ width: 560, maxWidth: '95vw' }}>
              <h3 style={{ marginBottom: 8 }}>Factura {viewing.id}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fecha: {viewing.fecha} • Estado: {viewing.estado}</p>
              <div style={{ marginTop: 8, background: 'var(--cream-100)', padding: 12, borderRadius: 6 }}>
                {viewing.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span>{it.producto} × {it.cantidad}</span>
                    <span>{formatCRC(it.total)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span><span>{formatCRC(viewing.total)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline" onClick={() => setViewing(null)}>Cerrar</button>
                <button className="btn btn-primary" onClick={() => exportPdf(viewing)}>Exportar PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
