import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";
import { classifyPrismaError } from "@/infrastructure/errors/classify-prisma-error";

/**
 * GET /api/herramientas/[id]
 *
 * Detalle de una herramienta específica.
 * Thin route: Zod parse id → handler.execute → 200/404/400/500.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parsed = GetHerramientaParamsSchema.safeParse({ id: params.id });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "El parámetro 'id' debe ser un número entero positivo." },
        { status: 400 }
      );
    }

    const result = await getHerramientaByIdHandler.execute(parsed.data.id);

    if (!result) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, retryable } = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${params.id}`,
        method: "GET",
        errorCode: "UNKNOWN",
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
