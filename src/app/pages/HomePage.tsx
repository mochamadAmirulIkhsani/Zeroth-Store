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

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs"
      style={{ borderColor: 'rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.06)', color: '#fbbf24' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
    <div style={{ background: '#0A0A0A' }}>
      {/* HERO */}
      <HeroSection
        heroHeadline={settings.heroHeadline}
        heroSubheadline={settings.heroSubheadline}
        waLink={waLink}
      />

      {/* GAME LIST */}
      <section className="py-24" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel text="Tersedia Sekarang" />
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Game yang Kami Layani
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'border-color 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${game.color}45`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
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
                      <div className="absolute inset-0 sm:hidden" style={{ background: 'linear-gradient(to top, #111 0%, transparent 55%)' }} />
                      {/* Desktop: fade to right */}
                      <div className="absolute inset-0 hidden sm:block" style={{ background: 'linear-gradient(to right, transparent 40%, #111 100%)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
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
                            <motion.div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: game.color }}
                              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.35, 1] }}
                              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <h3 className="font-bold text-white leading-tight line-clamp-1"
                              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(0.72rem, 2.5vw, 1.05rem)' }}>
                              {game.name}
                            </h3>
                          </div>
                          <span
                            className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                            style={{
                              backgroundColor: `${game.color}15`,
                              color: game.color,
                              border: `1px solid ${game.color}30`,
                              fontFamily: 'Space Grotesk',
                            }}
                          >
                            {activeServices.length}
                          </span>
                        </div>
                        <p className="hidden sm:block text-xs mb-4 leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
                          {game.tagline}
                        </p>
                      </div>

                      <div>
                        {/* Service tags — desktop only */}
                        <div className="hidden sm:block">
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Space Grotesk' }}>
                            Yang Kami Tawarkan
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {visibleServices.map(svc => (
                              <span key={svc.id} className="text-[11px] px-2.5 py-1 rounded-lg"
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  color: 'rgba(255,255,255,0.6)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  fontFamily: 'Plus Jakarta Sans, sans-serif',
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
                                  fontFamily: 'Space Grotesk',
                                }}>
                                +{extraCount} lagi
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 font-semibold transition-all duration-200"
                          style={{ color: game.color, fontFamily: 'Space Grotesk', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>
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
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fbbf24'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Lihat Semua Game <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
      </div>

      {/* WHY US */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d0d10 0%, #0a0a0a 50%, #0d0a0d 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Kenapa Kami?" />
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mengapa Memilih Zeroth Store?
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Bukan sekadar joki — kami adalah mitra gaming profesional Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-auto">
            {/* Card 1: Aman */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-8 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(15,15,20,0.95) 60%)', border: '1px solid rgba(251,191,36,0.2)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)' }} />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
                  <Shield className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk', fontSize: '1.15rem' }}>Aman & Terpercaya</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>Data akun dijaga ketat. Tidak ada kebocoran informasi klien, dijamin privasi 100%.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 relative z-10 flex-wrap">
                {['Enkripsi Data', 'No Leak', 'Privasi 100%'].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Proses Cepat — tall */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-7 flex flex-col cursor-default"
              style={{ background: 'linear-gradient(160deg, rgba(96,165,250,0.08) 0%, rgba(10,10,15,0.97) 65%)', border: '1px solid rgba(96,165,250,0.2)', minHeight: 200 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)' }} />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)' }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.22)' }}>
                <Zap className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-white mb-2 relative z-10" style={{ fontFamily: 'Space Grotesk', fontSize: '1.15rem' }}>Proses Cepat</h3>
              <p className="text-sm leading-relaxed mb-auto relative z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Tim berpengalaman mengerjakan pesanan dengan efisien. Estimasi waktu selalu transparan.
              </p>
              <div className="mt-8 space-y-3 relative z-10">
                {[
                  { label: 'Order Diterima', time: '< 5 menit', color: '#60a5fa' },
                  { label: 'Proses Dimulai', time: '< 1 jam', color: '#34d399' },
                  { label: 'Selesai', time: '1–7 hari', color: '#fbbf24' },
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 + idx * 0.1 }} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: item.color, fontFamily: 'Space Grotesk' }}>{item.time}</span>
                  </motion.div>
                ))}
                <div className="mt-2 rounded-full overflow-hidden h-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #60a5fa, #34d399, #fbbf24)' }}
                    initial={{ width: '0%' }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.6 }} />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Berpengalaman */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(12,10,18,0.97) 65%)', border: '1px solid rgba(167,139,250,0.2)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.22)' }}>
                <ThumbsUp className="w-6 h-6" style={{ color: '#a78bfa' }} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-white mb-2 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>Berpengalaman</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Tim kami bermain dan memahami setiap game secara mendalam, bukan pemula.
              </p>
            </motion.div>

            {/* Card 4: Harga Terjangkau */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(10,14,12,0.97) 65%)', border: '1px solid rgba(52,211,153,0.18)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.22)' }}>
                <Award className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-white mb-2 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>Harga Terjangkau</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Harga kompetitif dan bisa dinegosiasikan. Kualitas premium, harga bersahabat.
              </p>
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)', fontFamily: 'Space Grotesk' }}>
                  Nego Friendly
                </span>
              </div>
            </motion.div>

            {/* Card 5: Respon Cepat */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.22 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(14,10,8,0.97) 65%)', border: '1px solid rgba(249,115,22,0.18)', minHeight: 160 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.55), transparent)' }} />
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.22)' }}>
                <Clock className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-white mb-2 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>Respon Cepat</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Admin aktif 16 jam sehari, 7 hari seminggu. Pesan Anda tidak akan terabaikan.
              </p>
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
                <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Online</span>
              </div>
            </motion.div>

            {/* Card 6: Ribuan Klien — wide */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.26 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl p-5 sm:p-8 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(251,113,133,0.07) 0%, rgba(14,10,12,0.97) 65%)', border: '1px solid rgba(251,113,133,0.18)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.55), transparent)' }} />
              <div className="absolute -bottom-12 right-0 w-64 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.08) 0%, transparent 70%)' }} />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(251,113,133,0.12)', border: '1px solid rgba(251,113,133,0.22)' }}>
                  <Users className="w-7 h-7" style={{ color: '#fb7185' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1.5" style={{ fontFamily: 'Space Grotesk', fontSize: '1.15rem' }}>Ribuan Klien Puas</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Sudah dipercaya ribuan klien. Testimoni nyata dari pengguna yang puas dengan hasil kerja tim kami.
                  </p>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  {[{ val: '5K+', label: 'Klien' }, { val: '98%', label: 'Kepuasan' }].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="font-bold" style={{ color: '#fb7185', fontFamily: 'Space Grotesk', fontSize: '1.6rem' }}>{s.val}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
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
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
      </div>

      {/* STATS */}
      <section className="py-24" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Angka Bicara" />
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Zeroth Store dalam Angka
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Kepercayaan ribuan klien dibuktikan lewat hasil nyata
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Order Selesai', value: stats.ordersCompleted, suffix: '+', color: '#fbbf24' },
              { label: 'Game Dilayani', value: stats.gamesSupported, suffix: '', color: '#60a5fa' },
              { label: 'Tingkat Kepuasan', value: stats.satisfactionRate, suffix: '%', color: '#34d399' },
              { label: 'Klien Aktif', value: stats.activeClients, suffix: '+', color: '#fb7185' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)` }} />
                <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
      </div>

      {/* TESTIMONIALS */}
      {featuredTestimonials.length > 0 && (
        <section className="py-24 overflow-hidden" style={{ background: '#0A0A0A' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel text="Testimoni Klien" />
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Kata Mereka yang Sudah Order
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Ribuan klien puas telah mempercayakan akun mereka kepada kami</p>
            </motion.div>
          </div>
          <div className="relative">
            <TestimonialsCarousel testimonials={featuredTestimonials} games={games} dark />
          </div>
          <div className="text-center mt-10">
            <Link
              to="/testimoni"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fbbf24'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Lihat Semua Testimoni <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
      </div>

      {/* FAQ */}
      <section className="py-24" style={{ background: 'linear-gradient(160deg, #0d0d10 0%, #0a0a0a 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="FAQ" />
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Pertanyaan yang Sering Ditanya
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Temukan jawaban atas pertanyaan umum tentang layanan kami</p>
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
                  background: openFaq === i ? 'rgba(251,191,36,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${openFaq === i ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {openFaq === i && (
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
                )}
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-sm" style={{ color: openFaq === i ? '#fbbf24' : 'rgba(255,255,255,0.8)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: openFaq === i ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)' }}>
                    {openFaq === i
                      ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                      : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fbbf24'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Lihat FAQ Lengkap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
