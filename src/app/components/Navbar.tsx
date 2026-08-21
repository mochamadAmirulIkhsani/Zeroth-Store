import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, MessageCircle, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const NAV_LINKS = [
  { label: 'Game', href: '/games' },
  { label: 'Testimoni', href: '/testimoni' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/kontak' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useApp();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <>
      {/* Announcement */}
      {settings.announcement && (
        <div
          className="w-full text-center py-2 px-4 text-xs font-medium"
          style={{
            background: 'linear-gradient(90deg, #fbbf24, #f97316)',
            color: '#000',
          }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black/30 animate-pulse" />
            {settings.announcement}
          </span>
        </div>
      )}

      <nav
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: settings.announcement ? '32px' : '0',
          background: scrolled
            ? 'rgba(8,8,8,0.92)'
            : 'rgba(8,8,8,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0.03)',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Amber top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.6) 50%, transparent 100%)',
            opacity: scrolled ? 1 : 0,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                  boxShadow: '0 0 20px rgba(251,191,36,0.3)',
                }}
              >
                <Zap className="w-4.5 h-4.5 text-black" strokeWidth={2.5} style={{ width: 18, height: 18 }} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-white tracking-tight leading-none"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}
                >
                  ZEROTH<span style={{ color: '#fbbf24' }}>.</span>
                </span>
                <span
                  className="tracking-widest leading-none"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em' }}
                >
                  STORE
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
                  style={{
                    color: isActive(link.href) ? '#fbbf24' : 'rgba(255,255,255,0.55)',
                    background: isActive(link.href) ? 'rgba(251,191,36,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-4 right-4 h-px rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Space Grotesk' }}>Online</span>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                  color: '#000',
                  fontFamily: 'Space Grotesk, sans-serif',
                  boxShadow: '0 0 20px rgba(251,191,36,0.25)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(251,191,36,0.45)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(251,191,36,0.25)'}
              >
                <MessageCircle className="w-4 h-4" />
                Order Sekarang
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: open ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${open ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: open ? '#fbbf24' : 'rgba(255,255,255,0.7)',
              }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={open ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-4 py-4 space-y-1" style={{ background: 'rgba(6,6,6,0.97)' }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-150"
                      style={{
                        background: isActive(link.href) ? 'rgba(251,191,36,0.08)' : 'transparent',
                        color: isActive(link.href) ? '#fbbf24' : 'rgba(255,255,255,0.6)',
                        border: `1px solid ${isActive(link.href) ? 'rgba(251,191,36,0.2)' : 'transparent'}`,
                      }}
                    >
                      <span className="font-medium">{link.label}</span>
                      {isActive(link.href) && <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.2 }}
                  className="pt-3 space-y-2"
                >
                  {/* Online badge */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin sedang online — siap melayani</span>
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold w-full transition-all duration-200 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                      color: '#000',
                      fontFamily: 'Space Grotesk, sans-serif',
                      boxShadow: '0 4px 20px rgba(251,191,36,0.3)',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order via WhatsApp
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div style={{ height: settings.announcement ? '80px' : '64px' }} />
    </>
  );
}
