import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';

const router = Router();

function sanitizeTestimonial(t) {
  const rating = Number(t?.rating);
  return {
    name: cleanStr(t?.name)?.slice(0, 100) || 'Anonim',
    gameId: cleanStr(t?.gameId)?.slice(0, 100) || '',
    service: cleanStr(t?.service)?.slice(0, 200) || '',
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
    content: cleanStr(t?.content)?.slice(0, 20000) || '',
    date: cleanStr(t?.date)?.slice(0, 40) || new Date().toISOString(),
    featured: t?.featured === true,
    active: t?.active !== false,
    avatar: t?.avatar != null ? cleanStr(t.avatar)?.slice(0, 1000) : null,
  };
}

router.get('/', async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany();
    res.json(testimonials);
  } catch (error) {
    console.error('GET /api/testimonials failed', error);
    res.status(500).json({ message: 'Gagal mengambil data testimonials' });
  }
});

router.put('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Payload testimonials harus berupa array' });
  }
  if (req.body.length > 5000) {
    return res.status(400).json({ message: 'Terlalu banyak testimonial' });
  }
  try {
    // wipe + recreate without interactive transaction (pgbouncer pooler can't
    // hold interactive transactions reliably). Frontend sends full collection.
    await prisma.testimonial.deleteMany({});
    const testimonials = [];
    for (const raw of req.body) {
      const t = sanitizeTestimonial(raw);
      testimonials.push(
        await prisma.testimonial.create({
          data: {
            name: t.name,
            gameId: t.gameId,
            service: t.service,
            rating: t.rating,
            content: t.content,
            date: new Date(t.date),
            featured: t.featured,
            active: t.active,
            avatar: t.avatar,
          },
        })
      );
    }
    res.json(testimonials);
  } catch (error) {
    console.error('PUT /api/testimonials failed', error);
    res.status(500).json({ message: 'Gagal menyimpan data testimonials' });
  }
});

export default router;