import { motion } from 'motion/react';
import { MessageCircle, Clock, Zap, Instagram, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function KontakPage() {
  const { settings, games } = useApp();

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  return (
    <div className="min-h-screen" style={{ background: '#faf9f5' }}>
      {/* Header */}
      <div className="py-16" style={{ background: '#faf9f5', borderBottom: '1px solid #e6dfd8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-[#f5f0e8] rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ border: '1px solid #e6dfd8' }}>
              <MessageCircle className="w-8 h-8" style={{ color: '#cc785c' }} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Hubungi Kami
            </h1>
            <p className="max-w-lg mx-auto" style={{ color: 'rgba(20,20,19,0.55)' }}>
              Semua transaksi dan diskusi dilakukan via WhatsApp untuk pengalaman yang lebih personal dan fleksibel
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl p-8 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #cc785c 0%, #a9583e 100%)', boxShadow: '0 12px 32px rgba(204,120,92,0.3)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>WhatsApp</h2>
                  <p className="text-white/70 text-sm">Kanal komunikasi utama</p>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                {settings.responseTime}. Admin kami siap membantu Anda mendiskusikan layanan, harga, dan proses joki secara langsung.
              </p>
              <p className="text-2xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                +{settings.whatsappNumber}
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-[#a9583e] font-semibold py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105"
                style={{ background: '#fff' }}
              >
                💬 Mulai Chat Sekarang
              </a>
            </div>

            {/* Operational Hours */}
            <div className="rounded-2xl p-6" style={{ background: '#f5f0e8', border: '1px solid #e6dfd8' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h3 className="font-semibold text-[#141413]">Jam Operasional</h3>
              </div>
              <p className="font-medium" style={{ color: 'rgba(20,20,19,0.7)' }}>{settings.operationalHours}</p>
              <p className="text-sm mt-2" style={{ color: 'rgba(20,20,19,0.45)' }}>{settings.responseTime}</p>
            </div>

            {/* Social Media */}
            {(settings.socialMedia?.instagram || settings.socialMedia?.tiktok || settings.socialMedia?.discord) && (
              <div className="rounded-2xl p-6" style={{ background: '#f5f0e8', border: '1px solid #e6dfd8' }}>
                <h3 className="font-semibold text-[#141413] mb-4">Media Sosial</h3>
                <div className="space-y-3">
                  {settings.socialMedia?.instagram && (
                    <a
                      href={`https://instagram.com/${settings.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition-colors"
                      style={{ color: 'rgba(20,20,19,0.65)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#141413')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(20,20,19,0.65)')}
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm">@{settings.socialMedia.instagram}</span>
                    </a>
                  )}
                  {settings.socialMedia?.discord && (
                    <div className="flex items-center gap-3" style={{ color: 'rgba(20,20,19,0.65)' }}>
                      <span className="w-4 h-4 text-center text-xs">💬</span>
                      <span className="text-sm">{settings.socialMedia.discord}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Why WA */}
            <div>
              <h2 className="text-2xl font-bold text-[#141413] mb-5" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600, letterSpacing: '-0.02em' }}>
                Kenapa via WhatsApp?
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Respon Langsung', desc: 'Chat real-time dengan admin, tidak perlu nunggu email atau form.' },
                  { icon: CheckCircle, title: 'Fleksibel & Personal', desc: 'Diskusi bebas sesuai kebutuhan, harga bisa disesuaikan.' },
                  { icon: Shield, title: 'Terjamin Aman', desc: 'Komunikasi terenkripsi end-to-end di WhatsApp.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(204,120,92,0.1)', border: '1px solid rgba(204,120,92,0.2)' }}>
                      <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#141413] text-sm mb-1">{item.title}</h4>
                      <p className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick order per game */}
            <div>
              <h3 className="font-semibold text-[#141413] mb-4">Order Cepat per Game</h3>
              <div className="grid grid-cols-2 gap-3">
                {games.filter(g => g.status === 'active').map(game => (
                  <a
                    key={game.id}
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Halo Admin! Saya ingin tanya layanan joki ${game.name}.\n\nMohon info lebih lanjut, terima kasih!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 group"
                    style={{ background: '#f5f0e8', border: '1px solid #e6dfd8' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#efe9de'; e.currentTarget.style.borderColor = '#d8cfc2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f0e8'; e.currentTarget.style.borderColor = '#e6dfd8'; }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: game.color }} />
                    <span className="text-xs font-medium line-clamp-1" style={{ color: 'rgba(20,20,19,0.65)' }}>
                      {game.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* SLA box */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(204,120,92,0.06)', border: '1px solid rgba(204,120,92,0.2)' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Garansi Respon Cepat</h4>
                  <p className="text-sm" style={{ color: 'rgba(20,20,19,0.6)' }}>{settings.responseTime}. Jika admin tidak merespons lebih dari 15 menit, coba kirim ulang pesannya.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
