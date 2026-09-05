import { Router } from 'express';
import { prisma } from '../lib/prisma.mjs';
import { verifyToken, requireRole } from '../middleware/auth.mjs';
import { cleanStr } from '../middleware/security.mjs';

const router = Router();

function sanitizeFaq(f) {
  return {
    question: cleanStr(f?.question)?.slice(0, 500) || '',
    answer: cleanStr(f?.answer)?.slice(0, 10000) || '',
    category: cleanStr(f?.category)?.slice(0, 100) || 'Umum',
    gameId: f?.gameId != null ? cleanStr(f.gameId)?.slice(0, 100) : null,
    active: f?.active !== false,
    displayOrder: typeof f?.displayOrder === 'number' ? f.displayOrder : 0,
  };
}

router.get('/', async (_req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(faqs);
  } catch (error) {
    console.error('GET /api/faqs failed', error);
    res.status(500).json({ message: 'Gagal mengambil data FAQs' });
  }
});

router.put('/', verifyToken, requireRole('ADMIN', 'OWNER'), async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Payload FAQs harus berupa array' });
  }
  if (req.body.length > 5000) {
    return res.status(400).json({ message: 'Terlalu banyak FAQ' });
  }
  try {
    // wipe + recreate without interactive transaction (pooler-safe)
    await prisma.fAQ.deleteMany({});
    const faqs = [];
    for (const [index, raw] of req.body.entries()) {
      const f = sanitizeFaq(raw);
      faqs.push(
        await prisma.fAQ.create({
          data: {
            question: f.question,
            answer: f.answer,
            category: f.category,
            gameId: f.gameId,
            active: f.active,
            displayOrder: f.displayOrder ?? index,
          },
        })
      );
    }
    res.json(faqs);
  } catch (error) {
    console.error('PUT /api/faqs failed', error);
    res.status(500).json({ message: 'Gagal menyimpan data FAQs' });
  }
});

export default router;