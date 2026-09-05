import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    let settings = await prisma.globalSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          id: 1,
          whatsappNumber: '6281234567890',
          heroHeadline: 'Joki Game Profesional & Terpercaya #1 Indonesia',
          heroSubheadline: '',
          operationalHours: '',
          responseTime: '',
          announcement: '',
          footerText: '',
          socialMedia: {},
        },
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('GET /api/settings failed', error);
    res.status(500).json({ message: 'Gagal mengambil data settings' });
  }
});

router.put('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  const allowed = ['whatsappNumber', 'heroHeadline', 'heroSubheadline', 'operationalHours', 'responseTime', 'announcement', 'footerText', 'socialMedia'];
  const data = {};
  for (const key of allowed) {
    if (key in req.body) {
      if (key === 'socialMedia') {
        if (req.body[key] && typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
          data[key] = req.body[key];
        }
      } else {
        const v = cleanStr(req.body[key]);
        if (v != null) data[key] = v.slice(0, key === 'whatsappNumber' ? 50 : 10000);
      }
    }
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'Tidak ada field valid untuk diubah' });
  }
  try {
    const settings = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    res.json(settings);
  } catch (error) {
    console.error('PUT /api/settings failed', error);
    res.status(500).json({ message: 'Gagal menyimpan data settings' });
  }
});

export default router;