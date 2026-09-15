import { Link } from 'react-router';
import { MessageCircle, Zap, Instagram, Music2, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { settings, games, stats } = useApp();
  const activeGames = games.filter(g => g.status === 'active');
  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Semua Game', href: '/games' },
    { label: 'Testimoni', href: '/testimoni' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Kontak', href: '/kontak' },
  ];

  const trustBadges = [
    { icon: Shield, label: 'Akun Aman & Terjaga' },
    { icon: Clock, label: 'Respon < 5 Menit' },
    { icon: Star, label: `${stats.satisfactionRate}% Kepuasan Klien` },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: '#181715' }}>

      {/* Accent line */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(204,120,92,0.4) 30%, rgba(204,120,92,0.7) 50%, rgba(204,120,92,0.4) 70%, transparent 100%)',
      }} />

      {/* CTA banner */}
      <div className="relative py-12 lg:py-20 overflow-hidden">
        {/* Massive watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="whitespace-nowrap font-black"
            style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
              fontSize: 'clamp(80px, 18vw, 220px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(204,120,92,0.07)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}
          >
            ZEROTH STORE
          </span>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(204,120,92,0.07) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Status pill: real operational hours */}
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(93,184,114,0.3)', background: 'rgba(93,184,114,0.08)' }}>
              <span className="text-xs text-green-400 font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {settings.operationalHours}
              </span>
            </div>

            <h2
              className="text-[#faf9f5] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Siap Naik Level?{' '}
              <span style={{ color: '#e8a55a' }}>Order Sekarang.</span>
            </h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(250,249,245,0.55)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Diskusikan kebutuhan joki Anda dengan kami. Aman, cepat, dan harga terjangkau, {settings.operationalHours}.
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: '#cc785c',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs" style={{ color: 'rgba(250,249,245,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-4 sm:mx-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(250,249,245,0.08), transparent)' }} />

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#252320' }}>
                <Zap className="w-4 h-4" style={{ color: '#faf9f5' }} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[#faf9f5]" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                Zeroth<span className="text-primary">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(250,249,245,0.5)' }}>
              Platform joki game profesional &amp; terpercaya. Melayani berbagai game gacha &amp; action RPG populer.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(93,184,114,0.1)', border: '1px solid rgba(93,184,114,0.2)' }}
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
              </a>
              {settings.socialMedia?.instagram && (
                <a
                  href={`https://instagram.com/${settings.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(204,120,92,0.1)', border: '1px solid rgba(204,120,92,0.2)' }}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" style={{ color: '#e8a55a' }} />
                </a>
              )}
              {settings.socialMedia?.tiktok && (
                <a
                  href={`https://tiktok.com/@${settings.socialMedia.tiktok.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}
                  title="TikTok"
                >
                  <Music2 className="w-4 h-4 text-cyan-400" />
                </a>
              )}
              {settings.socialMedia?.discord && (
                <a
                  href={settings.socialMedia.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}
                  title="Discord"
                >
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                </a>
              )}
            </div>
          </div>

          {/* Game links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(250,249,245,0.3)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Game
            </p>
            <ul className="space-y-3">
              {activeGames.map(game => (
                <li key={game.id}>
                  <Link
                    to={`/games/${game.slug}`}
                    className="group flex items-center gap-2.5 text-sm transition-all duration-150"
                    style={{ color: 'rgba(250,249,245,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = game.color)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,249,245,0.5)')}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-150 group-hover:scale-125"
                      style={{ backgroundColor: game.color, opacity: 0.6 }}
                    />
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(250,249,245,0.3)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Navigasi
            </p>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: 'rgba(250,249,245,0.5)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(250,249,245,0.3)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Kontak
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(250,249,245,0.3)' }}>WhatsApp</p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  +{settings.whatsappNumber}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(250,249,245,0.3)' }}>Jam Operasional</p>
                <p className="text-sm" style={{ color: 'rgba(250,249,245,0.5)' }}>{settings.operationalHours}</p>
              </div>
              {/* Response time badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mt-1"
                style={{ background: 'rgba(204,120,92,0.08)', border: '1px solid rgba(204,120,92,0.2)' }}>
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-xs" style={{ color: '#e8a55a', fontFamily: 'Inter, system-ui, sans-serif' }}>{settings.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(250,249,245,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(250,249,245,0.3)' }}>{settings.footerText}</p>
          <div className="flex items-center gap-5">
            <span className="text-xs" style={{ color: 'rgba(250,249,245,0.2)' }}>
              Made with ⚡ for gamers
            </span>
            <Link
              to="/admin"
              className="text-xs transition-colors duration-150 hover:text-primary"
              style={{ color: 'rgba(250,249,245,0.22)' }}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}