import { motion } from 'motion/react';
import { MessageCircle, Star, TrendingUp, Shield } from 'lucide-react';

interface HeroSectionProps {
  heroHeadline: string;
  heroSubheadline: string;
  waLink: string;
  stats: { ordersCompleted: number; satisfactionRate: number; activeClients: number };
}

export function HeroSection({ heroHeadline, heroSubheadline, waLink, stats }: HeroSectionProps) {
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
        background: '#faf9f5',
      }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(204,120,92,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* Watermark text */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 flex items-end justify-center overflow-hidden"
        style={{ lineHeight: 0.85 }}
      >
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
            fontWeight: 600,
            fontSize: 'clamp(90px, 19vw, 260px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(20,20,19,0.08)',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          ZEROTH STORE
        </motion.span>
      </div>

      {/* Hero image */}
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
            filter: 'drop-shadow(0 40px 80px rgba(20,20,19,0.35))',
          }}
        />
        {/* Gradient feet fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #faf9f5 30%, transparent)' }}
        />
      </motion.div>

      {/* Left gradient fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #faf9f5 30%, transparent 80%)' }}
      />

      {/* Right gradient fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #faf9f5 15%, transparent 70%)' }}
      />

      {/* Stat cards */}
      <div className="absolute top-10 right-6 sm:right-10 lg:right-16 z-30 flex flex-col gap-3 max-w-[220px]">
        {/* Big stat card */}
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 120 }}
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #e6dfd8',
            boxShadow: '0 8px 40px rgba(20,20,19,0.08)',
          }}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">Order Selesai</p>
          <div className="flex items-end justify-between">
            <div>
              <span
                className="font-bold text-gray-900"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '2rem', lineHeight: 1 }}
              >
                {stats.ordersCompleted.toLocaleString('id-ID')}+
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Klien Puas</p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#cc785c' }}
            >
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        {/* Two smaller side-by-side cards — border-only surface, secondary to flagship */}
        <div className="flex gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: -16, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.85, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="flex-1 rounded-2xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(20,20,19,0.08)',
              boxShadow: 'none',
            }}
          >
            <p className="text-[10px] font-medium text-gray-600 mb-1.5">Win Rate</p>
            <p
              className="font-bold text-gray-900"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.3rem', lineHeight: 1 }}
            >
              {stats.satisfactionRate}%
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">Jaminan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -16, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="flex-1 rounded-2xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(20,20,19,0.08)',
              boxShadow: 'none',
            }}
          >
            <p className="text-[10px] font-medium text-gray-600 mb-1.5">Klien Aktif</p>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(s => (
                <div key={s} className="w-1.5 h-1.5 rounded-full" style={{ background: s <= 4 ? '#cc785c' : 'rgba(204,120,92,0.25)' }} />
              ))}
            </div>
            <p
              className="font-bold text-gray-900"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.3rem', lineHeight: 1 }}
            >
              {stats.activeClients.toLocaleString('id-ID')}+
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">Klien</p>
          </motion.div>
        </div>
      </div>

      {/* Text content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 sm:px-10 lg:px-16 max-w-2xl">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          <span className="text-sm" style={{ color: 'rgba(20,20,19,0.55)', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '12px', fontWeight: 500 }}>
            Joki Game Profesional #1 Indonesia
          </span>
        </motion.div>

        {/* Large headline — multi-line like reference */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(3.2rem, 7vw, 6rem)',
            marginBottom: '1.5rem',
            color: '#141413',
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
                color: i === 1 ? 'transparent' : '#141413',
                ...(i === 1 ? {
                  WebkitTextStroke: '2px #cc785c',
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
          style={{ color: 'rgba(20,20,19,0.55)', fontSize: '1rem', lineHeight: 1.6 }}
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
              <Star key={s} className="w-4 h-4 text-primary fill-primary" />
            ))}
          </div>
          <span className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>
            Dipercaya <span className="text-[#141413] font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{stats.ordersCompleted.toLocaleString('id-ID')}+</span> Klien
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
            { icon: Shield, label: 'Respon Cepat' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(204,120,92,0.06)',
                border: '1px solid rgba(204,120,92,0.18)',
              }}
            >
              <Icon className="w-3 h-3 text-primary" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'rgba(20,20,19,0.6)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA button */}
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
            background: '#cc785c',
            color: '#fff',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.03em',
            padding: '1rem 2.5rem',
            borderRadius: '100px',
            boxShadow: '0 0 40px rgba(204,120,92,0.35), 0 8px 32px rgba(20,20,19,0.15)',
          }}
        >
          <MessageCircle className="w-5 h-5" />
          ORDER SEKARANG
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </motion.div>
    </section>
  );
}