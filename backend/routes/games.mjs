import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';
import { serializeGame } from '../utils/serializeGame.mjs';

const router = Router();

const includeAll = {
  services: { orderBy: { displayOrder: 'asc' } },
};

// Per-field max length untuk mencegah penyalahgunaan
const MAX_NAME = 200;
const MAX_TEXT = 2000;
const MAX_IMG = 1000;

function sanitizeGame(g) {
  const slug = cleanStr(g.slug)?.slice(0, 100) || '';
  // slug aman: huruf kecil, angka, dash — tolak karakter HTML/dangerous
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return { _invalid: true, _reason: 'Slug hanya boleh huruf kecil, angka, dan dash' };
  }
  return {
    slug,
    name: cleanStr(g.name)?.slice(0, MAX_NAME),
    description: cleanStr(g.description)?.slice(0, 20000),
    tagline: cleanStr(g.tagline)?.slice(0, MAX_TEXT),
    color: cleanStr(g.color)?.slice(0, 30),
    accentColor: cleanStr(g.accentColor)?.slice(0, 30),
    image: cleanStr(g.image)?.slice(0, MAX_IMG),
    status: ['active', 'inactive'].includes(cleanStr(g.status)) ? cleanStr(g.status) : 'active',
    waTemplate: g.waTemplate != null ? cleanStr(g.waTemplate)?.slice(0, 2000) : null,
    displayOrder: typeof g.displayOrder === 'number' ? g.displayOrder : 0,
    services: Array.isArray(g.services) ? g.services.map(sanitizeService) : [],
  };
}

function sanitizeService(s) {
  return {
    name: cleanStr(s?.name)?.slice(0, MAX_NAME) || '',
    description: cleanStr(s?.description)?.slice(0, 20000) || '',
    duration: cleanStr(s?.duration)?.slice(0, 200) || '',
    price: cleanStr(s?.price)?.slice(0, 200) || '',
    notes: s?.notes != null ? cleanStr(s.notes)?.slice(0, 2000) || '' : null,
    category: cleanStr(s?.category)?.slice(0, 100) || 'Umum',
    active: s?.active !== false,
    waTemplate: s?.waTemplate != null ? cleanStr(s.waTemplate)?.slice(0, 2000) : null,
  };
}

router.get('/', async (_req, res) => {
  try {
    const games = await prisma.game.findMany({ include: includeAll });
    res.json(games.map(serializeGame));
  } catch (error) {
    console.error('GET /api/games failed', error);
    res.status(500).json({ message: 'Gagal mengambil data games' });
  }
});

router.put('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Payload games harus berupa array' });
  }
  if (req.body.length > 500) {
    return res.status(400).json({ message: 'Terlalu banyak game dalam satu payload' });
  }
  try {
    const payload = req.body.map(sanitizeGame);
    const invalid = payload.find(g => g._invalid);
    if (invalid) {
      return res.status(400).json({ message: invalid._reason || 'Payload game tidak valid' });
    }
    const slugs = payload.map(g => g.slug).filter(Boolean);

    // Delete games not in the payload (cascade removes their nested rows)
    await prisma.game.deleteMany({ where: { slug: { notIn: slugs } } });

    const games = await Promise.all(
      payload.map(async (g) => {
        if (!g.slug) {
          throw new Error('Game tanpa slug ditolak');
        }
        const game = await prisma.game.upsert({
          where: { slug: g.slug },
          update: {
            name: g.name,
            description: g.description,
            tagline: g.tagline,
            color: g.color,
            accentColor: g.accentColor,
            image: g.image,
            status: g.status,
            waTemplate: g.waTemplate ?? undefined,
            displayOrder: g.displayOrder,
          },
          create: {
            name: g.name,
            slug: g.slug,
            description: g.description,
            tagline: g.tagline,
            color: g.color,
            accentColor: g.accentColor,
            image: g.image,
            status: g.status,
            waTemplate: g.waTemplate ?? undefined,
            displayOrder: g.displayOrder,
          },
        });

        await prisma.service.deleteMany({ where: { gameId: game.id } });
        const svc = g.services.map((s, i) => ({
          gameId: game.id,
          name: s.name,
          description: s.description,
          duration: s.duration,
          price: s.price,
          notes: s.notes,
          category: s.category,
          active: s.active,
          waTemplate: s.waTemplate,
          displayOrder: i,
        }));
        if (svc.length > 0) {
          await prisma.service.createMany({ data: svc });
        }

        return { ...game, services: g.services };
      })
    );
    res.json(games.map(serializeGame));
  } catch (error) {
    console.error('PUT /api/games failed', error);
    res.status(500).json({ message: 'Gagal menyimpan data games' });
  }
});

export default router;