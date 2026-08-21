import { motion } from 'motion/react';
import { MessageCircle, Star, TrendingUp, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  heroHeadline: string;
  heroSubheadline: string;
  waLink: string;
}

export function HeroSection({ heroHeadline, heroSubheadline, waLink }: HeroSectionProps) {
  const words = heroHeadline.split(' ');
  // Split words into 2-3 line chunks for large heading
  const line1 = words.slice(0, 2).join(' ');
  const line2 = words.slice(2, 4).join(' ');
  const line3 = words.slice(4).join(' ');

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100svh',
        background: '#0A0A0A',
      }}
    >
      {/* ── Subtle noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* ── LARGE WATERMARK TEXT — bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 flex items-end justify-center overflow-hidden"
        style={{ lineHeight: 0.85 }}
      >
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(80px, 18vw, 240px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.07)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          ZEROTH STORE
        </motion.span>
      </div>

      {/* ── HERO IMAGE — center, full height ── */}
      <motion.div
        className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
      >
        <img
          src="https://images.unsplash.com/photo-1650765815224-0f64358de0b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnYW1lciUyMHBsYXlpbmclMjBzZXR1cCUyMGRhcmslMjBuZW9uJTIwcmdifGVufDF8fHx8MTc3ODU1NDUxOXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Gaming Hero"
          className="h-full w-auto max-w-none object-cover object-top"
          style={{
            maxHeight: '92vh',
            filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))',
          }}
        />
        {/* Gradient feet fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0A0A0A 30%, transparent)' }}
        />
      </motion.div>

      {/* ── LEFT gradient fade ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #0A0A0A 30%, transparent 80%)' }}
      />

      {/* ── RIGHT gradient fade ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #0A0A0A 15%, transparent 70%)' }}
      />

      {/* ── TOP-RIGHT STAT CARDS ── */}
      <div className="absolute top-10 right-6 sm:right-10 lg:right-16 z-30 flex flex-col gap-3 max-w-[220px]">
        {/* Big stat card */}
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 120 }}
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          }}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">Order Selesai</p>
          <div className="flex items-end justify-between">
            <div>
              <span
                className="font-bold text-gray-900"
                style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', lineHeight: 1 }}
              >
                5K+
              </span>
              <p className="text-xs text-gray-400 mt-0.5">Klien Puas</p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
            >
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        {/* Two smaller side-by-side cards */}
        <div className="flex gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: -16, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.85, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="flex-1 rounded-2xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.96)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <p className="text-[10px] font-medium text-gray-500 mb-1.5">Win Rate</p>
            <p
              className="font-bold text-gray-900"
              style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', lineHeight: 1 }}
            >
              98%
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Jaminan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -16, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="flex-1 rounded-2xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.96)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <p className="text-[10px] font-medium text-gray-500 mb-1.5">Selesai</p>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(s => (
                <div key={s} className="w-1.5 h-1.5 rounded-full" style={{ background: s <= 4 ? '#fbbf24' : 'rgba(251,191,36,0.25)' }} />
              ))}
            </div>
            <p
              className="font-bold text-gray-900"
              style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', lineHeight: 1 }}
            >
              1–7
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Hari Kerja</p>
          </motion.div>
        </div>
      </div>

      {/* ── LEFT TEXT CONTENT ── */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 sm:px-10 lg:px-16 max-w-2xl">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-0.5 h-4 bg-amber-400 rounded-full" />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Joki Game Profesional #1 Indonesia
          </span>
        </motion.div>

        {/* Large headline — multi-line like reference */}
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
            marginBottom: '1.5rem',
          }}
        >
          {[line1, line2, line3].filter(Boolean).map((line, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.1, ease: 'easeOut' }}
              style={{
                color: i === 1 ? 'transparent' : '#ffffff',
                ...(i === 1 ? {
                  WebkitTextStroke: '2px #fbbf24',
                } : {}),
              }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mb-8 max-w-sm"
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', lineHeight: 1.6 }}
        >
          {heroSubheadline}
        </motion.p>

        {/* Star rating row */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Dipercaya <span className="text-white font-semibold" style={{ fontFamily: 'Space Grotesk' }}>5.000+</span> Klien
          </span>
        </motion.div>

        {/* Trust badges row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="flex flex-wrap gap-2"
        >
          {[
            { icon: Shield, label: 'Akun Aman' },
            { icon: Zap, label: 'Respon Cepat' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Icon className="w-3 h-3 text-amber-400" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── BOTTOM CTA BUTTON — centered ── */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 z-30 flex justify-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
      >
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
            color: '#000',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.03em',
            padding: '1rem 2.5rem',
            borderRadius: '100px',
            boxShadow: '0 0 40px rgba(251,191,36,0.35), 0 8px 32px rgba(249,115,22,0.25)',
          }}
        >
          <MessageCircle className="w-5 h-5" />
          ORDER SEKARANG
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </motion.div>

      {/* ── Live order notification — floats above CTA ── */}
      <motion.div
        className="absolute z-30 flex justify-center"
        style={{ bottom: '6.5rem', left: 0, right: 0 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-full"
          style={{
            background: 'rgba(15,15,15,0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
            Order baru masuk · 2 detik yang lalu
          </span>
        </div>
      </motion.div>
    </section>
  );
}
