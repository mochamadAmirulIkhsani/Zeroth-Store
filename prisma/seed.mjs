import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_GAMES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_SETTINGS,
  INITIAL_STATS,
} from '../src/app/data/gameData.ts';

const prisma = new PrismaClient();

async function seed() {
  // Games + nested services (howItWorks/securityNotes statis di backend/constants.mjs)
  for (const [index, g] of INITIAL_GAMES.entries()) {
    const game = await prisma.game.upsert({
      where: { slug: g.slug },
      update: { name: g.name, tagline: g.tagline, description: g.description, color: g.color, accentColor: g.accentColor, image: g.image, status: g.status, displayOrder: index },
      create: {
        name: g.name,
        slug: g.slug,
        description: g.description,
        tagline: g.tagline,
        color: g.color,
        accentColor: g.accentColor,
        image: g.image,
        status: g.status,
        displayOrder: index,
      },
    });

    // Idempotent nested: wipe + recreate so reseeding never duplicates
    await prisma.service.deleteMany({ where: { gameId: game.id } });
    await prisma.service.createMany({
      data: (g.services || []).map((s, i) => ({
        gameId: game.id,
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: s.price,
        notes: s.notes ?? null,
        category: s.category,
        active: s.active,
        waTemplate: s.waTemplate ?? null,
        displayOrder: i,
      })),
    });
  }

  // Testimonials — wipe + recreate (idempotent: re-running seeds same 35)
  await prisma.testimonial.deleteMany({});
  for (const t of INITIAL_TESTIMONIALS) {
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
        avatar: t.avatar ?? null,
      },
    });
  }

  // FAQs — wipe + recreate (idempotent: re-running seeds same 8)
  await prisma.fAQ.deleteMany({});
  for (const [index, f] of INITIAL_FAQS.entries()) {
    await prisma.fAQ.create({
      data: {
        question: f.question,
        answer: f.answer,
        category: f.category,
        gameId: f.gameId ?? null,
        active: f.active,
        displayOrder: index,
      },
    });
  }

  // Service categories (dinamis, dikelola admin)
  const DEFAULT_CATEGORIES = [
    { name: 'Leveling', color: '#4A90D9' },
    { name: 'Endgame', color: '#7B5EA7' },
    { name: 'Story', color: '#F59E0B' },
    { name: 'Farming', color: '#10B981' },
    { name: 'Build', color: '#F97316' },
    { name: 'Event', color: '#EF4444' },
    { name: 'Daily', color: '#6B7280' },
    { name: 'Exploration', color: '#2DD4BF' },
  ];
  for (const [index, c] of DEFAULT_CATEGORIES.entries()) {
    const slug = c.name.toLowerCase().replace(/\s+/g, '-');
    await prisma.serviceCategory.upsert({
      where: { slug },
      update: { name: c.name, color: c.color, displayOrder: index },
      create: { slug, name: c.name, color: c.color, displayOrder: index },
    });
  }
  console.log('Seeded service categories');

  // Admin user
  const defaultEmail = process.env.ADMIN_EMAIL || 'admin@zeroth.store';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin1234567890';
  const existing = await prisma.user.findUnique({ where: { email: defaultEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME || 'Admin Zeroth',
        email: defaultEmail,
        passwordHash: bcrypt.hashSync(defaultPassword, 10),
        // owner pertama = pemilik; bisa manage user lain (ADMIN/OWNER) via panel
        role: 'OWNER',
      },
    });
    console.log(`Seeded admin user: ${defaultEmail} (OWNER)`);
  } else {
    console.log(`Admin user exists, skipping: ${defaultEmail}`);
  }

  // Settings + Stats singletons
  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...INITIAL_SETTINGS, socialMedia: INITIAL_SETTINGS.socialMedia },
  });
  await prisma.stats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...INITIAL_STATS },
  });
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });