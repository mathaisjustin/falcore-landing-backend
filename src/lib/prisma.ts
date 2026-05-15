import { PrismaClient } from '@prisma/client';

import { PrismaD1 } from '@prisma/adapter-d1';

let prisma: PrismaClient | null =
  null;

export const createPrismaClient = (
  db: D1Database
) => {
  if (!prisma) {
    const adapter =
      new PrismaD1(db);

    prisma = new PrismaClient({
      adapter,
    });
  }

  return prisma;
};