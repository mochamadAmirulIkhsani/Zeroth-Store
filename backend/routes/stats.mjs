import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    let stats = await prisma.stats.findUnique({ where: { id: 1 } });
    if (!stats) {
      stats = await prisma.stats.create({
        data: {
          id: 1,
          ordersCompleted: 2847,
          gamesSupported: 6,
          satisfactionRate: 98,
          activeClients: 340,
        },
      });
    }
    res.json(stats);
  } catch (error) {
    console.error('GET /api/stats failed', error);
    res.status(500).json({ message: 'Gagal mengambil data stats' });
  }
});

router.put('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  const allowed = ['ordersCompleted', 'gamesSupported', 'satisfactionRate', 'activeClients'];
  const data = {};
  for (const key of allowed) {
    if (key in req.body) {
      const value = Number(req.body[key]);
      if (Number.isFinite(value)) data[key] = value;
    }
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'Tidak ada field valid untuk diubah' });
  }
  try {
    const stats = await prisma.stats.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    res.json(stats);
  } catch (error) {
    console.error('PUT /api/stats failed', error);
    res.status(500).json({ message: 'Gagal menyimpan data stats' });
  }
});

export default router;