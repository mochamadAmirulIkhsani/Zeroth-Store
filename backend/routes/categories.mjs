import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';

const router = Router();

// GET public — list kategori untuk dropdown & badge warna
router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
    res.json(categories.map(c => ({ id: c.slug, name: c.name, color: c.color })));
  } catch (error) {
    console.error('GET /api/categories failed', error);
    res.status(500).json({ message: 'Gagal mengambil data kategori' });
  }
});

// POST admin — tambah kategori
router.post('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  const name = cleanStr(req.body?.name ?? '');
  const color = cleanStr(req.body?.color ?? '') || '#6B7280';
  if (!name) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi' });
  }
  if (name.length > 100) {
    return res.status(400).json({ message: 'Nama kategori terlalu panjang' });
  }
  const slug = String(name).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!slug) {
    return res.status(400).json({ message: 'Nama kategori tidak valid' });
  }
  try {
    const existing = await prisma.serviceCategory.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ message: 'Kategori sudah ada' });
    }
    const created = await prisma.serviceCategory.create({
      data: {
        slug,
        name,
        color,
        displayOrder: await prisma.serviceCategory.count(),
      },
    });
    res.status(201).json({ id: created.slug, name: created.name, color: created.color });
  } catch (error) {
    console.error('POST /api/categories failed', error);
    res.status(500).json({ message: 'Gagal menambah kategori' });
  }
});

// PUT admin — rename/ubah warna
router.put('/:slug', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  const name = cleanStr(req.body?.name ?? '');
  const color = cleanStr(req.body?.color ?? '');
  const data = {};
  if (name) data.name = name.slice(0, 100);
  if (color) data.color = color.slice(0, 30);
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'Tidak ada field yang diubah' });
  }
  try {
    const updated = await prisma.serviceCategory.update({
      where: { slug: req.params.slug },
      data,
    });
    res.json({ id: updated.slug, name: updated.name, color: updated.color });
  } catch (error) {
    console.error('PUT /api/categories/:slug failed', error);
    res.status(500).json({ message: 'Gagal mengubah kategori' });
  }
});

// DELETE admin — hapus kategori (service dengan kategori ini fallback ke 'Umum')
router.delete('/:slug', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  try {
    // non-transactional: update services dulu, lalu delete
    await prisma.service.updateMany({
      where: { category: req.params.slug },
      data: { category: 'Umum' },
    });
    await prisma.serviceCategory.deleteMany({ where: { slug: req.params.slug } });
    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/categories/:slug failed', error);
    res.status(500).json({ message: 'Gagal menghapus kategori' });
  }
});

export default router;