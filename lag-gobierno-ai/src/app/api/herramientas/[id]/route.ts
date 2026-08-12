import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

/**
 * H4: Clasifica errores de Prisma por categoría para determinar retryable.
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
  return { status: 500, retryable: false };
}

/**
 * GET /api/herramientas/[id]
 * Thin handler: Zod parse → container handler → 200/404/400/500.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const parsed = GetHerramientaParamsSchema.safeParse({ id: resolvedParams.id });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "El parámetro 'id' debe ser un número entero positivo" },
      { status: 400 }
    );
  }

  try {
    const result = await getHerramientaByIdHandler.execute(parsed.data.id);

    if (!result) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const { status, retryable } = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${resolvedParams.id}`,
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
