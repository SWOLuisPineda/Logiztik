/**
 * Clasificación de errores de Prisma para determinar:
 * - HTTP status code (503 transient vs 500 permanente)
 * - Si el error es reintentable por el usuario
 * - Categoría para logging estructurado
 *
 * Ref: design.md Sección 5 — H4
 */

export interface ClassifiedError {
  status: 503 | 500;
  retryable: boolean;
  errorCode: string;
  errorCategory: "TRANSIENT" | "PERMANENT" | "CONFIGURATION";
}

/** Códigos de Prisma que indican errores transitorios de BD */
const TRANSIENT_CODES = new Set(["P1001", "P1002", "P1008"]);

/**
 * Clasifica un error capturado en un API route handler.
 *
 * - PrismaClientInitializationError con código P1001/P1002/P1008 → transient (503)
 * - PrismaClientKnownRequestError → permanente (500)
 * - Otros → permanente (500)
 */
export function classifyPrismaError(error: unknown): ClassifiedError {
  // Prisma errores de inicialización (BD no alcanzable, timeout)
  if (
    error != null &&
    typeof error === "object" &&
    "errorCode" in error &&
    "name" in error
  ) {
    const prismaError = error as { name: string; errorCode?: string };

    if (prismaError.name === "PrismaClientInitializationError") {
      const code = prismaError.errorCode ?? "UNKNOWN";
      const isTransient = TRANSIENT_CODES.has(code);
      return {
        status: isTransient ? 503 : 500,
        retryable: isTransient,
        errorCode: code,
        errorCategory: isTransient ? "TRANSIENT" : "CONFIGURATION",
      };
    }

    if (prismaError.name === "PrismaClientKnownRequestError") {
      return {
        status: 500,
        retryable: false,
        errorCode: prismaError.errorCode ?? "UNKNOWN",
        errorCategory: "PERMANENT",
      };
    }
  }

  // Error desconocido — tratar como no reintentable
  return {
    status: 500,
    retryable: false,
    errorCode: "UNKNOWN",
    errorCategory: "PERMANENT",
  };
}

/**
 * Log estructurado para errores en API routes.
 * Formato: { timestamp, path, method, errorCode, errorCategory, message }
 *
 * Ref: design.md Sección 5 — Formato de log estructurado
 */
export function logApiError(params: {
  path: string;
  method: string;
  error: unknown;
  classified: ClassifiedError;
}): void {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      path: params.path,
      method: params.method,
      errorCode: params.classified.errorCode,
      errorCategory: params.classified.errorCategory,
      message:
        params.error instanceof Error
          ? params.error.message
          : String(params.error),
    })
  );
}
