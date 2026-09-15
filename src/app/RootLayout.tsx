import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { useApp } from './context/AppContext';

export function RootLayout() {
  const { isBootstrapped, loadError } = useApp();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Loading state */}
        {!isBootstrapped && (
          <div className="py-6 px-4 text-center text-sm" style={{ background: '#272729', color: 'rgba(255,255,255,0.5)' }}>
            Memuat data...
          </div>
        )}
        {/* Error state */}
        {isBootstrapped && loadError && (
          <div className="py-6 px-4 text-center text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderBottom: '1px solid rgba(239,68,68,0.3)' }}>
            Gagal memuat data ({loadError}). Coba muat ulang halaman. Jika terus terjadi, hubungi admin.
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
