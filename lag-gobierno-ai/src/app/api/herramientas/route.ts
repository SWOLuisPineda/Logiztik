import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";

/**
 * H4: Clasifica errores de Prisma por categoría para determinar retryable.
 * Transient (P1001, P1002, P1008) → 503 + retryable: true
 * Permanente/Config → 500 + retryable: false
 */
function classifyPrismaError(error: unknown): { status: number; retryable: boolean } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return { status: 500, retryable: false };
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const code = error.errorCode;
    const transient = ["P1001", "P1002", "P1008"].includes(code ?? "");
    return { status: transient ? 503 : 500, retryable: transient };
  }
  // Fallback para errores desconocidos
  return { status: 500, retryable: false };
}

/**
 * GET /api/herramientas
 * Thin handler: Zod parse → container handler → JSON response.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawParams: Record<string, string> = {};
  const nivelValue = searchParams.get("nivel");
  const estadoValue = searchParams.get("estado");
  const categoriaValue = searchParams.get("categoria");
  if (nivelValue) rawParams.nivel = nivelValue;
  if (estadoValue) rawParams.estado = estadoValue;
  if (categoriaValue) rawParams.categoria = categoriaValue;

  const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.map((issue) => issue.message).join("; ");
    return NextResponse.json(
      { error: `Parámetro inválido: ${fieldErrors}` },
      { status: 400 }
    );
  }

  try {
    const filters: Record<string, string> = {};
    if (parsed.data.nivel) filters.nivelMaximo = parsed.data.nivel;
    if (parsed.data.estado) filters.estado = parsed.data.estado;
    if (parsed.data.categoria) filters.categoria = parsed.data.categoria;

    const result = await listHerramientasHandler.execute(
      Object.keys(filters).length > 0
        ? (filters as Parameters<typeof listHerramientasHandler.execute>[0])
        : undefined
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const { status, retryable } = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: "/api/herramientas",
        method: "GET",
        errorCode:
          error instanceof Prisma.PrismaClientKnownRequestError
            ? error.code
            : "UNKNOWN",
        errorCategory: retryable ? "TRANSIENT" : "PERMANENT",
        message: error instanceof Error ? error.message : String(error),
      })
    );

    return NextResponse.json(
      { error: "Error interno del servidor", retryable },
      { status }
    );
  }
}
