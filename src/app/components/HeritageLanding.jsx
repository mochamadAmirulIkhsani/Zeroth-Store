import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Clock, Star, Quote, ArrowRight, Eye, Calendar, Award, Shield, Phone, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Zap, Heart, CheckCircle, Globe } from "lucide-react";
import confetti from "canvas-confetti";
import styles from "../styles/Landing.module.css";

/* ─── DATA ─────────────────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  { icon: <MessageCircle size={22} />, num: "01", title: "Konsultasi", desc: "Ceritakan akun dan target Anda" },
  { icon: <CheckCircle size={22} />, num: "02", title: "Deal & Bayar", desc: "Setujui harga, pilih metode bayar" },
  { icon: <Zap size={22} />, num: "03", title: "Eksekusi", desc: "Tim pro kerjakan pesanan Anda" },
  { icon: <Sparkles size={22} />, num: "04", title: "Selesai", desc: "Laporan + akun kembali aman" },
];

const TESTIMONIALS = [
  { id: 1, name: "Riku T.", game: "Genshin Impact", service: "Spiral Abyss", text: "Full star Floor 12! Proses cepat, komunikasi lancar. Recommended banget!", rating: 5 },
  { id: 2, name: "Fitri A.", game: "Honkai: Star Rail", service: "Memory of Chaos", text: "MoC 12 full star! Admin responsif, progress update terus. Worth it!", rating: 5 },
  { id: 3, name: "Dimas O.", game: "Zenless Zone Zero", service: "Shiyu Defense", text: "Clear semua floor! Aman 100%, akun langsung dikembalikan. Top!", rating: 5 },
  { id: 4, name: "Aulia N.", game: "Wuthering Waves", service: "Tower of Adversity", text: "Tower clear! Udah 3x order dan selalu memuaskan. The best!", rating: 5 },
  { id: 5, name: "Sari I.", game: "Genshin Impact", service: "Character Build", text: "Build Neuvillette mantap! Komunikasi enak, sabar njelasin. Top!", rating: 5 },
  { id: 6, name: "Kevin L.", game: "Honkai: Star Rail", service: "Pure Fiction", text: "Max score! Profesional banget, laporan tiap hari. Harga bersahabat!", rating: 5 },
  { id: 7, name: "Putri S.", game: "Arknights: Endfield", service: "Story Mode", text: "Story selesai 3 hari. Admin ngerti lore gamenya. Puas!", rating: 5 },
  { id: 8, name: "Yoga P.", game: "Wuthering Waves", service: "Echo Farming", text: "Echo farming hasilnya bagus! Nanti order lagi buat build lain.", rating: 5 },
];

const GAMES = [
  { slug: "genshin-impact", name: "Genshin Impact", genre: "Action RPG" },
  { slug: "honkai-star-rail", name: "Honkai: Star Rail", genre: "Turn-Based RPG" },
  { slug: "zenless-zone-zero", name: "Zenless Zone Zero", genre: "Action RPG" },
  { slug: "wuthering-waves", name: "Wuthering Waves", genre: "Open World RPG" },
  { slug: "arknights-endfield", name: "Arknights: Endfield", genre: "Strategy RPG" },
];

const FAQS = [
  { q: "Apakah akun saya aman?", a: "Prioritas utama kami. Data login tidak disimpan setelah joki selesai. Metode aman tanpa pelanggaran ToS." },
  { q: "Berapa lama prosesnya?", a: "1–7 hari tergantung layanan. Estimasi waktu jelas saat diskusi via WhatsApp." },
  { q: "Metode pembayaran?", a: "Transfer bank, e-wallet (GoPay, OVO, Dana, ShopeePay), QRIS." },
  { q: "Ada garansi?", a: "Ya! Pengerjaan ulang gratis jika ada kesalahan dari pihak kami." },
];

const STATS_DATA = [
  { icon: <Award size={22} />, number: "2.847+", label: "Pesanan Selesai" },
  { icon: <Globe size={22} />, number: "6", label: "Game Dilayani" },
  { icon: <Heart size={22} />, number: "98%", label: "Tingkat Kepuasan" },
  { icon: <Users size={22} />, number: "340+", label: "Klien Aktif" },
];

function Users(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ─── HOOKS ────────────────────────────────────────────────────────────────── */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealBlock({ children, delay = 0, className = "" }) {
  const [ref, vis] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={vis ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ end, duration = 2000, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useScrollReveal();
  useEffect(() => {
    if (!vis) return;
    const num = parseFloat(end.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setVal(end); return; }
    let start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(p < 1 ? Math.floor(p * num) : num);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, end, duration]);
  return <span ref={ref}>{val.toLocaleString("id-ID")}{suffix}</span>;
}

/* ─── COMPONENT ────────────────────────────────────────────────────────────── */

export default function HeritageLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testiIdx, setTestiIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const faqRefs = useRef([]);

  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, FAQS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestiIdx((i) => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  function fireConfetti() {
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.72 }, colors: ["#D4AF37", "#C9B037", "#FFD700", "#1a1a1a", "#ffffff"] });
  }

  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i);
  }

  return (
    <div className={styles.landingRoot}>
      {/* ═══ NAVIGATION ═══ */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo}>
            <div className={styles.navLogoIcon}>
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className={styles.navLogoText}>ZEROth</span>
          </Link>
          <div className={styles.navLinksDesktop}>
            <a href="#tentang">Tentang</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#games">Games</a>
            <a href="#testimoni">Testimoni</a>
            <a href="#faq">FAQ</a>
            <a href="#kontak" className={styles.navCta}>Pesan Sekarang</a>
          </div>
          <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang</a>
              <a href="#cara-kerja" onClick={() => setMenuOpen(false)}>Cara Kerja</a>
              <a href="#games" onClick={() => setMenuOpen(false)}>Games</a>
              <a href="#testimoni" onClick={() => setMenuOpen(false)}>Testimoni</a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="#kontak" className={styles.navCtaMobile} onClick={() => setMenuOpen(false)}>Pesan Sekarang</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroMasthead}>
          <motion.div
            className={styles.mastheadLine}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.p
            className={styles.mastheadDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Calendar size={13} /> EST. 2026 — VOLUME I
          </motion.p>
          <motion.h1
            className={styles.heroHeadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Joki Game <em>Profesional</em>
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Tim expert siap bantu progression akun game gacha dan action RPG Anda.
            Aman, cepat, dan harga terjangkau.
          </motion.p>
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <a href="#kontak" className={styles.ctaButton} onClick={fireConfetti}>
              <MessageCircle size={18} /> Pesan via WhatsApp
            </a>
            <a href="#tentang" className={styles.secondaryButton}>
              <Eye size={18} /> Lihat Layanan
            </a>
          </motion.div>
          <motion.div
            className={styles.heroStatsBar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatNumber}><CountUp end={2847} suffix="+" /></span>
              <span className={styles.heroStatLabel}>Pesanan</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatNumber}>98%</span>
              <span className={styles.heroStatLabel}>Puas</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatNumber}>24/7</span>
              <span className={styles.heroStatLabel}>Online</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TENTANG ═══ */}
      <section id="tentang" className={styles.section}>
        <div className={styles.sectionInner}>
          <RevealBlock>
            <p className={styles.sectionKicker}>— TENTANG KAMI —</p>
            <h2 className={styles.sectionTitle}>Siapa Kami?</h2>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutPaper}>
                <div className={styles.paperStamp}>
                  <Shield size={18} />
                  <span>TRUSTED</span>
                </div>
                <p className={styles.aboutText}>
                  <strong>ZEROTh</strong> adalah layanan joki game profesional Indonesia. Kami melayani farming, leveling,
                  endgame clear, story completion, dan character building untuk game gacha dan action RPG populer.
                </p>
                <p className={styles.aboutText}>
                  Tim kami terdiri dari pemain berpengalaman yang memahami mekanik game secara mendalam. Setiap pesanan dikerjakan
                  dengan hati-hati, transparan, dan sesuai standar keamanan tertinggi.
                </p>
                <div className={styles.aboutBadges}>
                  <div className={styles.aboutBadge}><Shield size={14} /> 100% Aman</div>
                  <div className={styles.aboutBadge"><Zap size={14} /> Cepat</div>
                  <div className={styles.aboutBadge}><Star size={14} /> Profesional</div>
                </div>
              </div>
              <div className={styles.aboutStats}>
                {STATS_DATA.map((s, i) => (
                  <div key={i} className={styles.aboutStatCard}>
                    <div className={styles.aboutStatIcon}>{s.icon}</div>
                    <div className={styles.aboutStatNum}><CountUp end={parseInt(s.number.replace(/[^0-9]/g, ""))} suffix={s.number.includes("+") ? "+" : s.number.includes("%") ? "%" : ""} /></div>
                    <div className={styles.aboutStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ═══ CARA KERJA ═══ */}
      <section id="cara-kerja" className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <RevealBlock>
            <p className={styles.sectionKicker}>— PROSES —</p>
            <h2 className={styles.sectionTitle}>Cara Kerja</h2>
            <p className={styles.sectionSub}>Empat langkah sederhana untuk akun Anda</p>
          </RevealBlock>
          <div className={styles.processGrid}>
            {HOW_IT_WORKS.map((step, i) => (
              <RevealBlock key={i} delay={i * 0.12}>
                <div className={styles.processCard}>
                  <div className={styles.processNum}>{step.num}</div>
                  <div className={styles.processIcon}>{step.icon}</div>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processDesc}>{step.desc}</p>
                  {i < 3 && <div className={styles.processArrow}><ArrowRight size={16} /></div>}
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GAMES ═══ */}
      <section id="games" className={styles.section}>
        <div className={styles.sectionInner}>
          <RevealBlock>
            <p className={styles.sectionKicker}>— DAPATKAN LAYANAN UNTUK —</p>
            <h2 className={styles.sectionTitle}>Game yang Kami Layani</h2>
            <p className={styles.sectionSub}>Klik untuk melihat layanan lengkap</p>
          </RevealBlock>
          <div className={styles.gamesGrid}>
            {GAMES.map((game, i) => (
              <RevealBlock key={game.slug} delay={i * 0.08}>
                <Link to={`/games/${game.slug}`} className={styles.gameCard} onMouseEnter={fireConfetti}>
                  <div className={styles.gameCardInner}>
                    <h3 className={styles.gameName}>{game.name}</h3>
                    <p className={styles.gameGenre}>{game.genre}</p>
                    <div className={styles.gameCta}>
                      Lihat Layanan <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONI ═══ */}
      <section id="testimoni" className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <RevealBlock>
            <p className={styles.sectionKicker}>— KATA MEREKA —</p>
            <h2 className={styles.sectionTitle}>Testimoni Klien</h2>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <div className={styles.testiCarousel}>
              <button className={styles.testiNav} onClick={() => setTestiIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>
                <ChevronLeft size={20} />
              </button>
              <div className={styles.testiCard}>
                <Quote size={28} className={styles.testiQuote} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testiIdx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className={styles.testiContent}
                  >
                    <p className={styles.testiText}>&ldquo;{TESTIMONIALS[testiIdx].text}&rdquo;</p>
                    <div className={styles.testiStars}>
                      {Array.from({ length: TESTIMONIALS[testiIdx].rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#D4AF37" stroke="none" />
                      ))}
                    </div>
                    <p className={styles.testiName}>{TESTIMONIALS[testiIdx].name}</p>
                    <p className={styles.testiMeta}>{TESTIMONIALS[testiIdx].service} • {TESTIMONIALS[testiIdx].game}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button className={styles.testiNav} onClick={() => setTestiIdx((i) => (i + 1) % TESTIMONIALS.length)}>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className={styles.testiDots}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`${styles.testiDot} ${i === testiIdx ? styles.testiDotActive : ""}`} onClick={() => setTestiIdx(i)} />
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className={styles.section}>
        <div className={styles.sectionInner}>
          <RevealBlock>
            <p className={styles.sectionKicker}>— TANYA JAWAB —</p>
            <h2 className={styles.sectionTitle}>Pertanyaan Umum</h2>
          </RevealBlock>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <RevealBlock key={i} delay={i * 0.08}>
                <div
                  className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}
                  onClick={() => toggleFaq(i)}
                  ref={(el) => (faqRefs.current[i] = el)}
                >
                  <div className={styles.faqQuestion}>
                    <span>{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} className={styles.faqPlus}>+</motion.span>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        className={styles.faqAnswer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="kontak" className={styles.ctaSection}>
        <div className={styles.ctaSectionInner}>
          <RevealBlock>
            <div className={styles.ctaBox}>
              <h2 className={styles.ctaTitle}>Siap Tingkatkan Akun Anda?</h2>
              <p className={styles.ctaSub}>Hubungi kami sekarang untuk konsultasi gratis. Respon cepat, harga transparan.</p>
              <a href="https://wa.me/6281234567890?text=Halo%20Admin!%20Saya%20tertarik%20dengan%20layanan%20joki." className={styles.ctaButton} onClick={fireConfetti}>
                <MessageCircle size={18} /> Chat WhatsApp Sekarang
              </a>
              <div className={styles.ctaTrust}>
                <Clock size={14} /> Respon dalam 5 menit
                <span className={styles.ctaTrustDot}>•</span>
                <Shield size={14} /> 100% Aman & Terjamin
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}><Zap size={16} strokeWidth={2.5} /></div>
                <span>ZEROTh</span>
              </div>
              <p className={styles.footerTagline}>Layanan joki game profesional Indonesia. Aman, cepat, dan terpercaya sejak 2026.</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerCol}>
                <p className={styles.footerColTitle}>Navigasi</p>
                <a href="#tentang">Tentang</a>
                <a href="#cara-kerja">Cara Kerja</a>
                <a href="#games">Games</a>
                <a href="#testimoni">Testimoni</a>
              </div>
              <div className={styles.footerCol}>
                <p className={styles.footerColTitle}>Games Populer</p>
                {GAMES.slice(0, 4).map((g) => (
                  <Link key={g.slug} to={`/games/${g.slug}`}>{g.name}</Link>
                ))}
              </div>
              <div className={styles.footerCol}>
                <p className={styles.footerColTitle}>Kontak</p>
                <a href="https://wa.me/6281234567890"><MessageCircle size={13} /> WhatsApp</a>
                <a href="#"><Globe size={13} /> Instagram</a>
                <a href="#"><Zap size={13} /> TikTok</a>
                <a href="#"><Star size={13} /> Discord</a>
              </div>
            </div>
          </div>
          <div className={styles.footerDivider} />
          <div className={styles.footerBottom}>
            <p>© 2026 ZEROTh. All rights reserved.</p>
            <p className={styles.footerDisclaimer}>Layanan ini bukan afiliasi resmi dari developer game manapun.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
