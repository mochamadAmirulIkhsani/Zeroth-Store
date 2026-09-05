import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router';
import {
  Zap, LayoutDashboard, Gamepad2, Wrench, Star, Settings,
  MessageCircle, LogOut, Menu, X, ChevronRight, HelpCircle, Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/games', icon: Gamepad2, label: 'Manajemen Game' },
  { href: '/admin/services', icon: Wrench, label: 'Layanan' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimoni' },
  { href: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
  { href: '/admin/settings', icon: Settings, label: 'Pengaturan' },
  { href: '/admin/users', icon: Users, label: 'User Admin' },
  { href: '/admin/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
];

export function AdminLayout() {
  const { isAdminLoggedIn, adminLogout, settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const currentNav = NAV.find(n => location.pathname === n.href) ?? NAV[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Zeroth<span className="text-amber-500">Store</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 px-2 py-1.5 bg-amber-500/10 rounded-lg">
            <p className="text-amber-400 text-xs font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? 'bg-amber-500 text-black font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>🔗</span>
            <span>Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">{currentNav.label}</span>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}