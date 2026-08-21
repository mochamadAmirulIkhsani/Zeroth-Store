import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zeroth2026';
const HASHED_ADMIN_PASSWORD = bcrypt.hashSync(ADMIN_PASSWORD, 10);

app.use(cors());
app.use(express.json());

const mockState = {
  games: [
    {
      id: 'genshin-impact',
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'Open-world action RPG miHoYo dengan dunia Teyvat yang luas.',
      tagline: 'Jelajahi Teyvat Tanpa Batas',
      color: '#4A90D9',
      accentColor: '#E8B84B',
      image: 'https://images.unsplash.com/photo-1768327239603-f5354182ba22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      status: 'active',
      services: [
        { id: 'gi-1', name: 'Adventure Rank (AR) Leveling', description: 'Naik AR dari level berapa saja hingga AR 60.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
        { id: 'gi-2', name: 'Spiral Abyss — Full Clear', description: 'Clear Floor 9/10/11/12 dengan bintang penuh.', duration: '1–2 hari', price: 'Mulai Rp 80.000', category: 'Endgame', active: true },
      ],
      howItWorks: [
        { icon: '💬', title: 'Hubungi WhatsApp', description: 'Klik tombol Order dan buka chat WhatsApp kami' },
        { icon: '🤝', title: 'Diskusi & Deal', description: 'Kami akan mendiskusikan detail layanan dan negosiasi harga' },
        { icon: '🔑', title: 'Berikan Akses', description: 'Berikan akses akun dengan aman sesuai instruksi kami' },
        { icon: '⚡', title: 'Proses Joki', description: 'Tim profesional kami mengerjakan pesanan Anda' },
        { icon: '✅', title: 'Selesai & Laporan', description: 'Laporan lengkap dikirimkan, akun dikembalikan sepenuhnya' },
      ],
      securityNotes: [
        'Akun Anda dijamin aman dan tidak akan diperjualbelikan',
        'Kami tidak menyimpan data login Anda setelah joki selesai',
      ],
    },
    {
      id: 'honkai-star-rail',
      name: 'Honkai: Star Rail',
      slug: 'honkai-star-rail',
      description: 'Turn-based space fantasy RPG dari HoYoverse.',
      tagline: 'Taklukkan Galaksi Bersama Kami',
      color: '#7B5EA7',
      accentColor: '#FFD700',
      image: 'https://images.unsplash.com/photo-1610209204869-4822c0a980da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      status: 'active',
      services: [
        { id: 'hsr-1', name: 'Trailblaze Level Leveling', description: 'Naik Trailblaze Level dengan cepat.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      ],
      howItWorks: [
        { icon: '💬', title: 'Hubungi WhatsApp', description: 'Klik tombol Order dan buka chat WhatsApp kami' },
        { icon: '🤝', title: 'Diskusi & Deal', description: 'Kami akan mendiskusikan detail layanan dan negosiasi harga' },
        { icon: '🔑', title: 'Berikan Akses', description: 'Berikan akses akun dengan aman sesuai instruksi kami' },
        { icon: '⚡', title: 'Proses Joki', description: 'Tim profesional kami mengerjakan pesanan Anda' },
        { icon: '✅', title: 'Selesai & Laporan', description: 'Laporan lengkap dikirimkan, akun dikembalikan sepenuhnya' },
      ],
      securityNotes: [
        'Akun Anda dijamin aman dan tidak akan diperjualbelikan',
        'Kami tidak menyimpan data login Anda setelah joki selesai',
      ],
    },
  ],
  testimonials: [
    { id: 't1', name: 'R*****a', gameId: 'genshin-impact', service: 'Spiral Abyss Full Clear', rating: 5, content: 'Mantap banget!', date: '2026-05-01', featured: true, active: true },
    { id: 't2', name: 'F*****i', gameId: 'honkai-star-rail', service: 'Memory of Chaos', rating: 5, content: 'MoC 12 udah full star!', date: '2026-04-28', featured: true, active: true },
  ],
  faqs: [
    { id: 'f1', question: 'Bagaimana cara order layanan joki?', answer: 'Klik tombol WhatsApp.', category: 'Umum', active: true },
    { id: 'f2', question: 'Apakah aman?', answer: 'Ya, aman.', category: 'Keamanan', active: true },
  ],
  settings: {
    whatsappNumber: '6281234567890',
    heroHeadline: 'Joki Game Profesional & Terpercaya #1 Indonesia',
    heroSubheadline: 'Tim expert siap bantu progression akun game gacha dan action RPG Anda.',
    operationalHours: 'Senin – Minggu, 08.00 – 24.00 WIB',
    responseTime: 'Kami biasanya merespons dalam 5 menit',
    announcement: '',
    footerText: '© 2026 Zeroth Store. Layanan Joki Game Profesional Indonesia.',
    socialMedia: { instagram: '', tiktok: '', discord: '' },
  },
  stats: {
    ordersCompleted: 2847,
    gamesSupported: 6,
    satisfactionRate: 98,
    activeClients: 340,
  },
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Zeroth Store API is running' });
});

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Password wajib diisi' });
  }

  const isValid = await bcrypt.compare(password, HASHED_ADMIN_PASSWORD);

  if (!isValid) {
    return res.status(401).json({ message: 'Password salah' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  return res.json({ token });
});

app.get('/api/games', (_req, res) => {
  res.json(mockState.games);
});

app.get('/api/testimonials', (_req, res) => {
  res.json(mockState.testimonials);
});

app.get('/api/faqs', (_req, res) => {
  res.json(mockState.faqs);
});

app.get('/api/settings', (_req, res) => {
  res.json(mockState.settings);
});

app.get('/api/stats', (_req, res) => {
  res.json(mockState.stats);
});

app.put('/api/settings', verifyToken, (req, res) => {
  mockState.settings = { ...mockState.settings, ...req.body };
  res.json(mockState.settings);
});

app.put('/api/stats', verifyToken, (req, res) => {
  mockState.stats = { ...mockState.stats, ...req.body };
  res.json(mockState.stats);
});

app.listen(PORT, () => {
  console.log(`Zeroth Store API running on http://localhost:${PORT}`);
});
