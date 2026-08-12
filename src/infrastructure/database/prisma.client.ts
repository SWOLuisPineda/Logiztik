import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";
import fs from "node:fs";

/**
 * Singleton de PrismaClient con adapter libSQL para SQLite.
 *
 * Resolución del path de la BD (en orden de prioridad):
 * 1. DATABASE_URL del entorno (.env o env de producción)
 * 2. Fallback: path absoluto a prisma/dev.db (desarrollo sin .env)
 *
 * Next.js carga .env automáticamente, por lo que DATABASE_URL siempre
 * está disponible en runtime tanto para prisma CLI como para la app.
 *
 * En desarrollo: usa globalThis para evitar múltiples instancias con hot-reload.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    // Si es un path relativo (file:./...), resolverlo a absoluto desde cwd
    const envUrl = process.env.DATABASE_URL;
    if (envUrl.startsWith("file:./") || envUrl.startsWith("file:prisma/")) {
      const relativePath = envUrl.replace("file:", "");
      const absolutePath = path.resolve(process.cwd(), relativePath);
      return `file:${absolutePath}`;
    }
    return envUrl;
  }

  // Fallback: path absoluto al archivo de BD de desarrollo
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  return `file:${dbPath}`;
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();

  // Verificar que el archivo existe en desarrollo (evitar error críptico)
  if (url.startsWith("file:") && process.env.NODE_ENV !== "production") {
    const filePath = url.replace("file:", "");
    if (!fs.existsSync(filePath)) {
      console.error(
        `[prisma.client] ERROR: Base de datos no encontrada en: ${filePath}\n` +
          `Ejecuta: npm run db:seed (o npx prisma migrate dev) para crearla.`
      );
    }
  }

  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
