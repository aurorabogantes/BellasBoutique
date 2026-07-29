import VendorSidebar from '../../components/VendorSidebar';

export default function VendorLayout({ children }) {
  return (
    <div className="vendor-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <VendorSidebar />
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
