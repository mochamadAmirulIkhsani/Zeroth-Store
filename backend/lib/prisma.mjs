import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

const secret = process.env.JWT_SECRET;
if (!secret || secret === 'dev-secret-change-me' || secret === 'change_this_secret_in_production') {
  throw new Error('[FATAL] JWT_SECRET tidak boleh kosong / default. Set di .env dengan nilai acak panjang.');
}
export const JWT_SECRET = secret;