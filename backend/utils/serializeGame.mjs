// Map Prisma Game (normalized) → frontend Game contract
// (services array, howItWorks/securityNotes statis dari constants)
import { DEFAULT_HOW_IT_WORKS, DEFAULT_SECURITY_NOTES } from '../constants.mjs';

export const serializeGame = (g) => ({
  id: g.slug,
  name: g.name,
  slug: g.slug,
  description: g.description,
  tagline: g.tagline,
  color: g.color,
  accentColor: g.accentColor,
  image: g.image,
  status: g.status,
  waTemplate: g.waTemplate ?? undefined,
  services: (g.services || []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    duration: s.duration,
    price: s.price,
    notes: s.notes ?? undefined,
    category: s.category,
    active: s.active,
    waTemplate: s.waTemplate ?? undefined,
  })),
  howItWorks: DEFAULT_HOW_IT_WORKS,
  securityNotes: DEFAULT_SECURITY_NOTES,
});