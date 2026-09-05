import { Link } from 'react-router';
import { MessageCircle, Zap, Instagram, Music2, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { settings, games } = useApp();
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
    { icon: Star, label: '98% Kepuasan Klien' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0A0A0A]">

      {/* ── Top accent line ── */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.5) 30%, rgba(251,191,36,0.8) 50%, rgba(251,191,36,0.5) 70%, transparent 100%)',
      }} />

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <div className="relative py-20 overflow-hidden">
        {/* Massive watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="whitespace-nowrap font-black"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(80px, 18vw, 220px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(251,191,36,0.06)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}
          >
            ZEROTH STORE
          </span>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.07)' }}>
              <motion.span
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-xs text-green-400 font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                Admin Online Sekarang
              </span>
            </div>

            <h2
              className="text-white mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}
            >
              Siap Naik Level?{' '}
              <span style={{ color: '#fbbf24' }}>Order Sekarang.</span>
            </h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Diskusikan kebutuhan joki Anda dengan kami. Aman, cepat, dan harga terjangkau — {settings.operationalHours}.
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-black font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                boxShadow: '0 0 32px rgba(251,191,36,0.25), 0 4px 16px rgba(0,0,0,0.3)',
                fontFamily: 'Space Grotesk, sans-serif',
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
                  <Icon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px mx-4 sm:mx-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

      {/* ══════════════════════════════════════
          MAIN LINKS GRID
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}>
                <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem' }}>
                Zeroth<span className="text-amber-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Platform joki game profesional &amp; terpercaya. Melayani berbagai game gacha &amp; action RPG populer.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
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
                  style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)' }}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4 text-rose-400" />
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
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Space Grotesk' }}>
              Game
            </p>
            <ul className="space-y-3">
              {activeGames.map(game => (
                <li key={game.id}>
                  <Link
                    to={`/games/${game.slug}`}
                    className="group flex items-center gap-2.5 text-sm transition-all duration-150"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = game.color)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
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
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Space Grotesk' }}>
              Navigasi
            </p>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
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
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Space Grotesk' }}>
              Kontak
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>WhatsApp</p>
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
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Jam Operasional</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{settings.operationalHours}</p>
              </div>
              {/* Response time badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mt-1"
                style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <Clock className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-500/80" style={{ fontFamily: 'Space Grotesk' }}>{settings.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{settings.footerText}</p>
          <div className="flex items-center gap-5">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
              Made with ⚡ for gamers
            </span>
            <Link
              to="/admin"
              className="text-xs transition-colors duration-150 hover:text-amber-400"
              style={{ color: 'rgba(255,255,255,0.18)' }}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
