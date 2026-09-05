import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const secret = process.env.JWT_SECRET;
if (!secret || secret === 'dev-secret-change-me' || secret === 'change_this_secret_in_production') {
  throw new Error('[FATAL] JWT_SECRET tidak boleh kosong / default. Set di .env dengan nilai acak panjang.');
}
export const JWT_SECRET = secret;

// Lazy singleton — PrismaPg constructor with undefined connectionString throws,
// so we defer instantiation until the first request. Env vars exist at runtime.
let prismaInstance = null;
function getPrisma() {
  if (!prismaInstance) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export function getPrismaClient() {
  return getPrisma();
}

export const prisma = getPrisma();