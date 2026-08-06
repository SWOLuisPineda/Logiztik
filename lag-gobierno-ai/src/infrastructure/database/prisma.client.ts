import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

/**
 * Singleton de PrismaClient con adapter libSQL para SQLite.
 *
 * En desarrollo: usa globalThis para evitar múltiples instancias con hot-reload.
 * El path al dev.db se resuelve relativo al cwd (raíz del proyecto).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
