import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Gamepad2, Wrench, Star, MessageCircle, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminDashboard() {
  const { games, testimonials, faqs, settings, stats } = useApp();

  const activeGames = games.filter(g => g.status === 'active').length;
  const totalServices = games.reduce((sum, g) => sum + g.services.filter(s => s.active).length, 0);
  const activeTestimonials = testimonials.filter(t => t.active).length;
  const activeFaqs = faqs.filter(f => f.active).length;

  const summaryCards = [
    { icon: Gamepad2, label: 'Game Aktif', value: activeGames, color: '#4A90D9', href: '/admin/games' },
    { icon: Wrench, label: 'Total Layanan', value: totalServices, color: '#F97316', href: '/admin/services' },
    { icon: Star, label: 'Testimoni', value: activeTestimonials, color: '#F59E0B', href: '/admin/testimonials' },
    { icon: MessageCircle, label: 'FAQ', value: activeFaqs, color: '#7B5EA7', href: '/admin/settings' },
  ];

  const quickActions = [
    { label: 'Tambah Testimoni', icon: Plus, href: '/admin/testimonials', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Edit Nomor WA', icon: MessageCircle, href: '/admin/whatsapp', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Update Headline', icon: TrendingUp, href: '/admin/settings', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di Admin Panel Zeroth Store</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={card.href}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 block group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: card.color + '15' }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {card.value}
              </div>
              <p className="text-gray-500 text-xs">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Statistik Publik</h2>
            <Link to="/admin/settings" className="text-amber-600 hover:text-amber-700 text-xs flex items-center gap-1">
              Edit <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Order Selesai', value: stats.ordersCompleted.toLocaleString('id-ID') + '+' },
              { label: 'Game Dilayani', value: stats.gamesSupported },
              { label: 'Kepuasan Klien', value: stats.satisfactionRate + '%' },
              { label: 'Klien Aktif', value: stats.activeClients + '+' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 text-sm">{s.label}</span>
                <span className="font-semibold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.href}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:shadow-sm ${action.color}`}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Games Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Status Game</h2>
          <Link to="/admin/games" className="text-amber-600 hover:text-amber-700 text-xs flex items-center gap-1">
            Kelola <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {games.map(game => (
            <div key={game.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: game.color }} />
              <span className="text-sm text-gray-700 flex-1 truncate">{game.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                game.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {game.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <p className="text-amber-700 text-sm">
          <strong>Nomor WhatsApp:</strong> +{settings.whatsappNumber} · 
          <strong className="ml-2">Jam Operasional:</strong> {settings.operationalHours}
        </p>
      </div>
    </div>
  );
}
