import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { motion } from 'motion/react';
import {
  MessageCircle, ArrowLeft, Clock, DollarSign, Tag,
  Shield, ChevronDown, ChevronUp, Star, CheckCircle, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWALink, DEFAULT_WA_TEMPLATE } from '../data/gameData';
import type { Service, Game } from '../data/gameData';

const CATEGORY_COLORS: Record<string, string> = {
  Leveling: '#4A90D9',
  Endgame: '#7B5EA7',
  Story: '#F59E0B',
  Farming: '#10B981',
  Build: '#F97316',
  Event: '#EF4444',
  Daily: '#6B7280',
  Exploration: '#2DD4BF',
};

function ServiceCard({ service, game }: { service: Service; game: Game }) {
  const { settings } = useApp();
  const waLink = getWALink(
    game.name,
    service.name,
    settings.whatsappNumber,
    game.waTemplate ?? DEFAULT_WA_TEMPLATE,
    service.price,
    service.duration
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: (CATEGORY_COLORS[service.category] ?? '#6B7280') + '15',
                color: CATEGORY_COLORS[service.category] ?? '#6B7280',
              }}
            >
              {service.category}
            </span>
          </div>
          <h4 className="font-semibold text-[#0A0A0A] leading-snug">{service.name}</h4>
        </div>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>

      {service.notes && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs">{service.notes}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs">{service.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-[#0A0A0A]">{service.price}</span>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-[#2a2a2a] text-white py-2.5 rounded-xl transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm">Order Sekarang</span>
          <span className="sm:hidden text-xs">Order</span>
        </a>
      </div>
    </motion.div>
  );
}

export function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { games, testimonials, settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const game = games.find(g => g.slug === slug);
  if (!game) return <Navigate to="/games" replace />;

  const activeServices = game.services.filter(s => s.active);
  const categories = ['Semua', ...Array.from(new Set(activeServices.map(s => s.category)))];
  const filteredServices = activeCategory === 'Semua'
    ? activeServices
    : activeServices.filter(s => s.category === activeCategory);

  const gameTestimonials = testimonials.filter(t => t.gameId === game.id && t.active);

  const waLink = getWALink(
    game.name,
    'Belum ditentukan',
    settings.whatsappNumber,
    game.waTemplate ?? DEFAULT_WA_TEMPLATE
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: game.color }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <Link to="/games" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Game</span>
            </Link>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {game.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
                    style={{ backgroundColor: game.color }}
                  >
                    {game.status === 'active' ? 'Tersedia' : 'Sementara Tidak Tersedia'}
                  </span>
                </div>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm transition-all flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Tentang {game.name}
              </h2>
              <p className="text-gray-500 leading-relaxed">{game.description}</p>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Daftar Layanan Joki
              </h2>
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    game={game}
                  />
                ))}
              </div>
            </div>

            {/* How It Works */}
            {game.howItWorks && (
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Cara Kerja / Alur Joki
                </h2>
                <div className="relative">
                  {game.howItWorks.map((step, i) => (
                    <div key={i} className="flex gap-4 mb-6 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                          style={{ backgroundColor: game.color + '20', border: `2px solid ${game.color}40` }}
                        >
                          {step.icon}
                        </div>
                        {i < game.howItWorks!.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-100 mt-2" />
                        )}
                      </div>
                      <div className="pb-6 last:pb-0">
                        <p className="text-xs text-gray-400 mb-0.5">Langkah {i + 1}</p>
                        <h4 className="font-semibold text-[#0A0A0A] mb-1">{step.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {game.securityNotes && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold text-[#0A0A0A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Jaminan Keamanan Akun
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {game.securityNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Testimonials */}
            {gameTestimonials.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Testimoni {game.name}
                </h2>
                <div className="space-y-4">
                  {gameTestimonials.slice(0, 4).map(t => (
                    <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-gray-400 text-xs ml-1">{t.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">"{t.content}"</p>
                      <div>
                        <p className="font-medium text-[#0A0A0A] text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.service}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/testimoni" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm mt-4">
                  Lihat lebih banyak testimoni →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Order Card */}
            <div className="sticky top-24 space-y-4">
              <div className="bg-[#0A0A0A] rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Mulai Order Sekarang
                </h3>
                <p className="text-gray-400 text-sm mb-5">
                  Hubungi admin untuk diskusi layanan dan harga terbaik
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm transition-colors w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat via WhatsApp</span>
                </a>
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Respon dalam 5 menit</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Akun dijamin aman</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Garansi pengerjaan</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3">Statistik Layanan</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Total Layanan</span>
                    <span className="font-semibold text-[#0A0A0A] text-sm">{activeServices.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Harga Mulai</span>
                    <span className="font-semibold text-[#0A0A0A] text-sm">{activeServices[0]?.price ?? 'Nego'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Testimoni</span>
                    <span className="font-semibold text-[#0A0A0A] text-sm">{gameTestimonials.length}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}