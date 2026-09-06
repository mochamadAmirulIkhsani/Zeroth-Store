import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './backend/lib/prisma.mjs';
import adminRoutes from './backend/routes/admin.mjs';
import gamesRoutes from './backend/routes/games.mjs';
import testimonialsRoutes from './backend/routes/testimonials.mjs';
import faqsRoutes from './backend/routes/faqs.mjs';
import settingsRoutes from './backend/routes/settings.mjs';
import statsRoutes from './backend/routes/stats.mjs';
import categoriesRoutes from './backend/routes/categories.mjs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const isProd = process.env.NODE_ENV === 'production';

// Vercel serverless + Railway: reverse proxy → trust X-Forwarded-*.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security headers (helmet). CSP diaktifkan — Vite dev butuh unsafe-inline + ws.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'http://localhost:5173', 'http://localhost:4000'],
        fontSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Global rate limit — default 300 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Terlalu banyak permintaan, coba lagi nanti' },
  })
);

// CORS — hanya origin yang diizinkan. Same-origin (Vercel) tidak butuh CORS.
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({ origin: corsOrigins.length ? corsOrigins : false }));

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Zeroth Store API is running' });
});

// Debug: expose raw DB connection error (masked) — for diagnosing production 500s
app.get('/api/debug/db', async (_req, res) => {
  const mask = (s = '') => s.replace(/:[^:@/]+@/, ':***@').slice(0, 120);
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    res.json({ ok: true, dbUrl: mask(process.env.DATABASE_URL), directUrl: mask(process.env.DIRECT_URL) });
  } catch (e) {
    res.status(500).json({
      ok: false,
      dbUrl: mask(process.env.DATABASE_URL),
      directUrl: mask(process.env.DIRECT_URL),
      error: String(e.message || e).slice(0, 500),
      code: e.code || null,
    });
  }
});

app.use('/api/admin', adminRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/categories', categoriesRoutes);

// Serve built frontend (dist/) in production — Vercel serves it separately via
// vercel.json, Express serves it on Railway/self-host.
if (isProd) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, 'dist')));
  // SPA fallback: react-router routes → index.html
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// 404 + error handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload terlalu besar (max 100kb)' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON tidak valid' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

// Local dev (node server.mjs) / Railway: listen langsung.
// Vercel: import app, tidak listen — Vercel inject handler sendiri.
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
if (!isVercel) {
  async function main() {
    try {
      await prisma.$connect();
      app.listen(PORT, () => {
        console.log(`Zeroth Store API running on http://localhost:${PORT} (${isProd ? 'production' : 'development'})`);
      });
    } catch (error) {
      console.error('Failed to connect to database:', error);
      process.exit(1);
    }
  }
  main();
}

export default app;