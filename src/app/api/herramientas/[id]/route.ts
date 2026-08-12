import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";
import { classifyPrismaError } from "@/infrastructure/errors/classify-prisma-error";

export const dynamic = "force-dynamic";

/**
 * GET /api/herramientas/[id]
 *
 * Detalle de una herramienta específica.
 * Thin route: valida id → handler → 200/404/400/500.
 * H4: Clasifica errores de Prisma y retorna `retryable` flag.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: rawId } = params;

    const parsed = GetHerramientaParamsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "El parámetro 'id' debe ser un número entero positivo" },
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

    return NextResponse.json(result);
  } catch (error: unknown) {
    const classified = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${params.id}`,
        method: "GET",
        errorCategory: classified.category,
        retryable: classified.retryable,
        message: error instanceof Error ? error.message : String(error),
      })
    );

    return NextResponse.json(
      { error: "Error interno del servidor", retryable: classified.retryable },
      { status: classified.status }
    );
  }
}
