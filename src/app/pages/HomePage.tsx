import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  MessageCircle, ArrowRight, Star, Shield, Zap, Clock,
  ThumbsUp, Award, ChevronDown, ChevronUp, Users, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { SEO } from '../components/SEO';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count.toLocaleString('id-ID')}{suffix}</div>;
}

function SectionLabel({ text, variant = 'outline' }: { text: string; variant?: 'outline' | 'solid' }) {
  return (
    <div
      className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs"
      style={
        variant === 'solid'
          ? { borderColor: '#cc785c', background: '#cc785c', color: '#fff' }
          : { borderColor: 'rgba(204,120,92,0.25)', background: 'rgba(204,120,92,0.06)', color: '#cc785c' }
      }
    >
      <span className="w-1.5 h-1.5 rounded-full" style={variant === 'solid' ? { background: '#fff' } : { background: '#cc785c' }} />
      {text}
    </div>
  );
}

const FAQS_HOME = [
  { q: 'Bagaimana cara order layanan joki?', a: 'Pilih game dan layanan yang Anda inginkan, lalu klik tombol "Order via WhatsApp". Chat akan terbuka otomatis dengan pesan yang sudah terisi.' },
  { q: 'Apakah akun saya aman saat dijoki?', a: 'Keamanan akun adalah prioritas utama kami. Kami tidak menyimpan data login Anda setelah joki selesai dan tidak ada akses yang diberikan ke pihak ketiga.' },
  { q: 'Berapa lama proses joki diselesaikan?', a: 'Durasi bervariasi tergantung layanan. Umumnya 1–7 hari. Admin kami akan memberikan estimasi yang jelas saat diskusi.' },
  { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami menerima transfer bank, e-wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS. Detail saat deal di WhatsApp.' },
  { q: 'Apakah ada garansi jika terjadi masalah?', a: 'Ya! Jika ada kesalahan dari pihak kami, kami memberikan garansi pengerjaan ulang gratis. Hubungi kami segera jika ada kendala.' },
];

export function HomePage() {
  const { settings, games, testimonials, stats } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const featuredTestimonials = testimonials.filter(t => t.featured && t.active);
  const activeGames = games.filter(g => g.status === 'active');

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  return (
    <>
      <SEO
        title="Zeroth Store — Joki Game Profesional & Terpercaya #1 Indonesia"
        description="Joki game profesional untuk Genshin Impact, Honkai Star Rail, Zenless Zone Zero, dan lainnya. Aman, cepat, harga terjangkau. Order via WhatsApp."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Zeroth Store',
          description: 'Platform joki game profesional & terpercaya untuk game gacha dan action RPG.',
          url: 'https://zeroth-store.vercel.app/',
          telephone: '+62 812-3456-7890',
          address: { '@type': 'PostalAddress', addressLocality: 'Malang', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
          openingHours: 'Mo-Su 08:00-24:00',
          priceRange: 'Rp 25.000 - Rp 200.000',
        }}
      />
      <div style={{ background: '#faf9f5' }}>
      {/* HERO */}
      <HeroSection
        heroHeadline={settings.heroHeadline}
        heroSubheadline={settings.heroSubheadline}
        waLink={waLink}
        stats={stats}
      />

      {/* GAME LIST */}
      <section className="py-12 sm:py-24" style={{ background: '#faf9f5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel text="Tersedia Sekarang" />
            <h2 className="text-3xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Game yang Kami Layani
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(20,20,19,0.55)' }}>
              Pilih game favorit Anda dan temukan layanan joki yang sesuai kebutuhan
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {activeGames.map((game, i) => {
              const activeServices = game.services.filter(s => s.active);
              const visibleServices = activeServices.slice(0, 3);
              const extraCount = activeServices.length - visibleServices.length;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4, type: 'spring', stiffness: 80 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link
                    to={`/games/${game.slug}`}
                    className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl relative h-full"
                    style={{
                      background: '#fff',
                      border: '1px solid #e6dfd8',
                      transition: 'border-color 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${game.color}65`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e6dfd8')}
                  >
                    {/* Image — top on mobile, left on sm+ */}
                    <div className="relative w-full h-28 sm:h-auto sm:flex-shrink-0 sm:w-44 overflow-hidden">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Mobile: fade to bottom */}
                      <div className="absolute inset-0 sm:hidden" style={{ background: 'linear-gradient(to top, #ffffff 0%, transparent 55%)' }} />
                      {/* Desktop: fade to right */}
                      <div className="absolute inset-0 hidden sm:block" style={{ background: 'linear-gradient(to right, transparent 40%, #ffffff 100%)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,19,0.25) 0%, transparent 50%)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{ background: `radial-gradient(ellipse at center, ${game.color}, transparent 70%)` }} />
                      {/* Color top bar */}
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: game.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 px-3 py-3 sm:px-5 sm:py-5 flex flex-col justify-between relative z-10">
                      <div>
                        <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: game.color }}
                            />
                            <h3 className="font-bold text-[#141413] leading-tight line-clamp-1"
                              style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', letterSpacing: '-0.01em' }}>
                              {game.name}
                            </h3>
                          </div>
                          <span
                            className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                            style={{
                              backgroundColor: `${game.color}15`,
                              color: game.color,
                              border: `1px solid ${game.color}30`,
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            {activeServices.length}
                          </span>
                        </div>
                        <p className="hidden sm:block text-xs mb-4 leading-relaxed line-clamp-2" style={{ color: 'rgba(20,20,19,0.5)' }}>
                          {game.tagline}
                        </p>
                      </div>

                      <div>
                        {/* Service tags — desktop only */}
                        <div className="hidden sm:block">
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(20,20,19,0.35)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                            Yang Kami Tawarkan
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {visibleServices.map(svc => (
                              <span key={svc.id} className="text-[11px] px-2.5 py-1 rounded-lg"
                                style={{
                                  background: 'rgba(20,20,19,0.04)',
                                  color: 'rgba(20,20,19,0.6)',
                                  border: '1px solid rgba(20,20,19,0.08)',
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                }}>
                                {svc.name}
                              </span>
                            ))}
                            {extraCount > 0 && (
                              <span className="text-[11px] px-2.5 py-1 rounded-lg"
                                style={{
                                  background: `${game.color}10`,
                                  color: game.color,
                                  border: `1px solid ${game.color}25`,
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                }}>
                                +{extraCount} lagi
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 font-semibold transition-all duration-200"
                          style={{ color: game.color, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>
                          <span className="sm:hidden">Detail</span>
                          <span className="hidden sm:inline">Lihat Semua Layanan</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${game.color}80, transparent)` }} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link
              to="/games"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ border: '1px solid #e6dfd8', color: 'rgba(20,20,19,0.6)', background: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,120,92,0.35)'; (e.currentTarget as HTMLElement).style.color = '#cc785c'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e6dfd8'; (e.currentTarget as HTMLElement).style.color = 'rgba(20,20,19,0.6)'; }}
            >
              Lihat Semua Game <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(20,20,19,0.1), transparent)' }} />
      </div>

      {/* WHY US — warm cream editorial band */}
      <section className="py-12 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #faf9f5 0%, #f5f0e8 50%, #faf9f5 100%)' }}>
        {/* Dot-grid texture — gaming-brand rhythm echoing pixel/HUD aesthetic; kept at 4% opacity so it reads as texture, never pattern. Removed only if the brand drops the gaming identity. */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(20,20,19,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(204,120,92,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Kenapa Kami?" />
            <h2 className="text-3xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Mengapa Memilih Zeroth Store?
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(20,20,19,0.55)' }}>
              Bukan sekadar joki, kami adalah mitra gaming profesional Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-auto">
            {/* Card 1: Aman */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-8 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(204,120,92,0.07) 0%, rgba(255,255,255,0.6) 60%)', border: '1px solid rgba(204,120,92,0.2)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,120,92,0.6), transparent)' }} />
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(204,120,92,0.1) 0%, transparent 70%)' }} />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(204,120,92,0.12)', border: '1px solid rgba(204,120,92,0.25)' }}>
                  <Shield className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#141413] mb-2" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>Aman & Terpercaya</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(20,20,19,0.55)' }}>Data akun dijaga ketat. Tidak ada kebocoran informasi klien, dijamin privasi 100%.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 relative z-10 flex-wrap">
                {['Enkripsi Data', 'No Leak', 'Privasi 100%'].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(93,184,114,0.08)', border: '1px solid rgba(93,184,114,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5db872' }} />
                    <span className="text-xs" style={{ color: 'rgba(20,20,19,0.6)' }}>{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Proses Cepat — tall */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-7 flex flex-col cursor-default"
              style={{ background: 'linear-gradient(160deg, rgba(204,120,92,0.06) 0%, rgba(255,255,255,0.7) 65%)', border: '1px solid rgba(204,120,92,0.18)', minHeight: 200 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,120,92,0.6), transparent)' }} />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(204,120,92,0.1) 0%, transparent 70%)' }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: 'rgba(204,120,92,0.12)', border: '1px solid rgba(204,120,92,0.22)' }}>
                <Zap className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#141413] mb-2 relative z-10" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>Proses Cepat</h3>
              <p className="text-sm leading-relaxed mb-auto relative z-10" style={{ color: 'rgba(20,20,19,0.55)' }}>
                Tim berpengalaman mengerjakan pesanan dengan efisien. Estimasi waktu selalu transparan.
              </p>
              <div className="mt-8 space-y-3 relative z-10">
                {[
                  { label: 'Order Diterima', time: '< 5 menit', color: '#cc785c' },
                  { label: 'Proses Dimulai', time: '< 1 jam', color: '#5db872' },
                  { label: 'Selesai', time: '1–7 hari', color: '#e8a55a' },
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 + idx * 0.1 }} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs" style={{ color: 'rgba(20,20,19,0.55)' }}>{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: item.color, fontFamily: 'Inter, system-ui, sans-serif' }}>{item.time}</span>
                  </motion.div>
                ))}
                <div className="mt-2 rounded-full overflow-hidden h-1" style={{ background: 'rgba(20,20,19,0.08)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #cc785c, #5db872, #e8a55a)' }}
                    initial={{ width: '0%' }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.6 }} />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Berpengalaman */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(232,165,90,0.08) 0%, rgba(255,255,255,0.65) 65%)', border: '1px solid rgba(232,165,90,0.2)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,165,90,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,165,90,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(232,165,90,0.12)', border: '1px solid rgba(232,165,90,0.22)' }}>
                <ThumbsUp className="w-6 h-6" style={{ color: '#e8a55a' }} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#141413] mb-2 relative z-10" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, letterSpacing: '-0.01em' }}>Berpengalaman</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(20,20,19,0.55)' }}>
                Tim kami bermain dan memahami setiap game secara mendalam, bukan pemula.
              </p>
            </motion.div>

            {/* Card 4: Harga Terjangkau */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(93,184,114,0.07) 0%, rgba(255,255,255,0.65) 65%)', border: '1px solid rgba(93,184,114,0.2)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(93,184,114,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(93,184,114,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(93,184,114,0.12)', border: '1px solid rgba(93,184,114,0.22)' }}>
                <Award className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#141413] mb-2 relative z-10" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, letterSpacing: '-0.01em' }}>Harga Terjangkau</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(20,20,19,0.55)' }}>
                Harga kompetitif dan bisa dinegosiasikan. Kualitas premium, harga bersahabat.
              </p>
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(93,184,114,0.1)', color: '#5db872', border: '1px solid rgba(93,184,114,0.22)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Nego Friendly
                </span>
              </div>
            </motion.div>

            {/* Card 5: Respon Cepat */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.22 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(204,120,92,0.07) 0%, rgba(255,255,255,0.65) 65%)', border: '1px solid rgba(204,120,92,0.18)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,120,92,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(204,120,92,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(204,120,92,0.12)', border: '1px solid rgba(204,120,92,0.22)' }}>
                <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#141413] mb-2 relative z-10" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, letterSpacing: '-0.01em' }}>Respon Cepat</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(20,20,19,0.55)' }}>
                Admin aktif 16 jam sehari, 7 hari seminggu. Pesan Anda tidak akan terabaikan.
              </p>
            </motion.div>

            {/* Card 6: Ribuan Klien — wide */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.26 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-8 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(204,120,92,0.07) 0%, rgba(255,255,255,0.6) 65%)', border: '1px solid rgba(204,120,92,0.18)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,120,92,0.55), transparent)' }} />
              <div className="absolute -bottom-12 right-0 w-64 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(204,120,92,0.08) 0%, transparent 70%)' }} />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(204,120,92,0.12)', border: '1px solid rgba(204,120,92,0.22)' }}>
                  <Users className="w-7 h-7" style={{ color: '#cc785c' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#141413] mb-1.5" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>Dipercaya Pelanggan Nyata</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(20,20,19,0.55)' }}>
                    {testimonials.filter(t => t.active).length} testimoni dari pelanggan yang sudah merasakan layanan kami. Nama disamarkan demi privasi.
                  </p>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  {[
                    { val: stats.ordersCompleted.toLocaleString('id-ID') + '+', label: 'Klien' },
                    { val: stats.satisfactionRate + '%', label: 'Kepuasan' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="font-bold" style={{ color: '#cc785c', fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, fontSize: '1.8rem' }}>{s.val}</p>
                      <p className="text-xs" style={{ color: 'rgba(20,20,19,0.4)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(20,20,19,0.1), transparent)' }} />
      </div>

      {/* STATS */}
      <section className="py-12 sm:py-24" style={{ background: '#faf9f5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Angka Bicara" variant="solid" />
            <h2 className="text-3xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Zeroth Store dalam Angka
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(20,20,19,0.55)' }}>
              Kepercayaan ribuan klien dibuktikan lewat hasil nyata
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Order Selesai', value: stats.ordersCompleted, suffix: '+', color: '#cc785c' },
              { label: 'Game Dilayani', value: stats.gamesSupported, suffix: '', color: '#e8a55a' },
              { label: 'Tingkat Kepuasan', value: stats.satisfactionRate, suffix: '%', color: '#5db872' },
              { label: 'Klien Aktif', value: stats.activeClients, suffix: '+', color: '#a9583e' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid #e6dfd8' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}55, transparent)` }} />
                <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", color: stat.color, fontWeight: 600 }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(20,20,19,0.5)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(20,20,19,0.1), transparent)' }} />
      </div>

      {/* TESTIMONIALS */}
      {featuredTestimonials.length > 0 && (
        <section className="py-12 sm:py-24 overflow-hidden" style={{ background: '#181715' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel text="Testimoni Klien" />
              <h2 className="text-3xl font-bold text-[#faf9f5] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
                Kata Mereka yang Sudah Order
              </h2>
              <p style={{ color: 'rgba(250,249,245,0.5)' }}>Ribuan klien puas telah mempercayakan akun mereka kepada kami</p>
            </motion.div>
          </div>
          <div className="relative">
            <TestimonialsCarousel testimonials={featuredTestimonials} games={games} dark />
          </div>
          <div className="text-center mt-10">
            <Link
              to="/testimoni"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ border: '1px solid rgba(250,249,245,0.12)', color: 'rgba(250,249,245,0.6)', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,120,92,0.4)'; (e.currentTarget as HTMLElement).style.color = '#cc785c'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,249,245,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(250,249,245,0.6)'; }}
            >
              Lihat Semua Testimoni <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(20,20,19,0.1), transparent)' }} />
      </div>

      {/* FAQ */}
      <section className="py-12 sm:py-24" style={{ background: '#faf9f5' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="FAQ" />
            <h2 className="text-3xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Pertanyaan yang Sering Ditanya
            </h2>
            <p style={{ color: 'rgba(20,20,19,0.55)' }}>Temukan jawaban atas pertanyaan umum tentang layanan kami</p>
          </motion.div>
          <div className="space-y-3">
            {FAQS_HOME.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: openFaq === i ? 'rgba(204,120,92,0.05)' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${openFaq === i ? 'rgba(204,120,92,0.3)' : '#e6dfd8'}`,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {openFaq === i && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(204,120,92,0.5), transparent)' }} />
                )}
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-sm" style={{ color: openFaq === i ? '#cc785c' : '#141413', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: openFaq === i ? 'rgba(204,120,92,0.15)' : 'rgba(20,20,19,0.05)' }}>
                    {openFaq === i
                      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
                      : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(20,20,19,0.4)' }} />}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(20,20,19,0.6)' }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ border: '1px solid #e6dfd8', color: 'rgba(20,20,19,0.6)', background: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,120,92,0.35)'; (e.currentTarget as HTMLElement).style.color = '#cc785c'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e6dfd8'; (e.currentTarget as HTMLElement).style.color = 'rgba(20,20,19,0.6)'; }}
            >
              Lihat FAQ Lengkap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}