import { Prisma } from "@prisma/client";

/**
 * Clasificación de errores de Prisma según design.md §5.
 *
 * - Transient: BD no disponible o timeout → reintentable (503)
 * - Permanent: error de datos o query → no reintentable (500)
 * - Configuration: credenciales o schema inválido → no reintentable (500)
 */

export interface PrismaErrorClassification {
  status: number;
  retryable: boolean;
}

const TRANSIENT_CODES = ["P1001", "P1002", "P1008"];

export function classifyPrismaError(error: unknown): PrismaErrorClassification {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Errores de query conocidos — no reintentables
    return { status: 500, retryable: false };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    // BD no alcanzable o credenciales inválidas
    const code = error.errorCode ?? "";
    const transient = TRANSIENT_CODES.includes(code);
    return { status: transient ? 503 : 500, retryable: transient };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    // Panic interno de Prisma — no reintentable
    return { status: 500, retryable: false };
  }

  // Error desconocido — tratar como no reintentable
  return { status: 500, retryable: false };
}
