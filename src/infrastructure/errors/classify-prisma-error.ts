import { Prisma } from "@prisma/client";

/**
 * Clasifica errores de Prisma en categorías para determinar
 * si el error es reintentable y qué HTTP status code retornar.
 *
 * Categorías:
 * - Transient (503): BD no disponible o timeout → reintentable
 * - Permanent (500): error de datos o query → no reintentable
 * - Configuration (500): credenciales o schema inválido → no reintentable
 */

export interface ClassifiedError {
  status: number;
  retryable: boolean;
  category: "TRANSIENT" | "PERMANENT" | "CONFIGURATION" | "UNKNOWN";
}

const TRANSIENT_CODES = new Set(["P1001", "P1002", "P1008"]);

export function classifyPrismaError(error: unknown): ClassifiedError {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const code = error.errorCode;
    const isTransient = TRANSIENT_CODES.has(code ?? "");
    return {
      status: isTransient ? 503 : 500,
      retryable: isTransient,
      category: isTransient ? "TRANSIENT" : "CONFIGURATION",
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return { status: 500, retryable: false, category: "PERMANENT" };
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Unknown errors could be transient (network) — treat as retryable
    return { status: 503, retryable: true, category: "TRANSIENT" };
  }

  return { status: 500, retryable: false, category: "UNKNOWN" };
}
