import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { prisma, JWT_SECRET } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';

const router = Router();

// Minimum password length
const MIN_PASSWORD_LEN = 8;
// Email simple validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Brute-force protection: max 10 percobaan / 15 menit per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi 15 menit lagi.' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  const cleanEmail = cleanStr(email).toLowerCase();
  const cleanPassword = cleanStr(password);
  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isValid = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('POST /api/admin/login failed', error);
    return res.status(500).json({ message: 'Gagal login' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }
    // Re-check role dari DB (bukan dari token) — token role bisa stale
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('GET /api/admin/me failed', error);
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
});

// ── User management (OWNER only) ──────────────────────────────────

// List all admin users (no password hash)
router.get('/users', verifyToken, requireRole('OWNER'), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.json(users);
  } catch (error) {
    console.error('GET /api/admin/users failed', error);
    return res.status(500).json({ message: 'Gagal mengambil daftar user' });
  }
});

// Create a new admin user
router.post('/users', verifyToken, requireRole('OWNER'), async (req, res) => {
  const { name, email, password, role } = req.body || {};

  const cleanName = cleanStr(name);
  const cleanEmail = cleanStr(email)?.toLowerCase();
  const cleanPassword = cleanStr(password);
  const cleanRole = cleanStr(role);

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ message: 'Format email tidak valid' });
  }
  if (cleanPassword.length < MIN_PASSWORD_LEN) {
    return res.status(400).json({ message: `Password minimal ${MIN_PASSWORD_LEN} karakter` });
  }
  if (cleanRole !== 'ADMIN' && cleanRole !== 'OWNER') {
    return res.status(400).json({ message: 'Role harus ADMIN atau OWNER' });
  }
  if (cleanName.length > 100) {
    return res.status(400).json({ message: 'Nama terlalu panjang (max 100 char)' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash: bcrypt.hashSync(cleanPassword, 10),
        role: cleanRole,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error('POST /api/admin/users failed', error);
    return res.status(500).json({ message: 'Gagal menambah user' });
  }
});

// Change own password (any authenticated admin)
router.put('/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  const cleanCurrent = cleanStr(currentPassword);
  const cleanNew = cleanStr(newPassword);

  if (!cleanCurrent || !cleanNew) {
    return res.status(400).json({ message: 'Password lama dan baru wajib diisi' });
  }
  if (cleanNew.length < MIN_PASSWORD_LEN) {
    return res.status(400).json({ message: `Password baru minimal ${MIN_PASSWORD_LEN} karakter` });
  }
  if (cleanNew === cleanCurrent) {
    return res.status(400).json({ message: 'Password baru harus berbeda dari password lama' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }
    const isValid = await bcrypt.compare(cleanCurrent, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Password lama salah' });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: bcrypt.hashSync(cleanNew, 10) },
    });
    return res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('PUT /api/admin/password failed', error);
    return res.status(500).json({ message: 'Gagal mengubah password' });
  }
});

// Delete a user (OWNER only) — sanitize: cannot delete self, cannot delete last OWNER
router.delete('/users/:id', verifyToken, requireRole('OWNER'), async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user.sub) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri' });
    }
    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    // Prevent removing the last OWNER (lockout protection)
    if (target.role === 'OWNER') {
      const ownerCount = await prisma.user.count({ where: { role: 'OWNER' } });
      if (ownerCount <= 1) {
        return res.status(400).json({ message: 'Tidak bisa menghapus OWNER terakhir' });
      }
    }
    await prisma.user.delete({ where: { id: targetId } });
    return res.json({ message: 'User dihapus' });
  } catch (error) {
    console.error('DELETE /api/admin/users/:id failed', error);
    return res.status(500).json({ message: 'Gagal menghapus user' });
  }
});

export default router;