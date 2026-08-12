import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";
import {
  classifyPrismaError,
  logApiError,
} from "@/infrastructure/errors/classify-prisma-error";

/**
 * GET /api/herramientas/[id]
 *
 * Path param:
 *   id: number — entero positivo
 *
 * Responses:
 *   200 — HerramientaDetailDto (con DPA y timestamps)
 *   400 — { error: string } — id inválido
 *   404 — { error: "Herramienta no encontrada" }
 *   503 — { error: string, retryable: true } — BD no disponible (transient)
 *   500 — { error: string, retryable: false } — error permanente
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;

  const parsed = GetHerramientaParamsSchema.safeParse({ id: rawId });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "El id debe ser un número entero positivo" },
      { status: 400 }
    );
  }

  try {
    const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);

    if (!herramienta) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(herramienta, { status: 200 });
  } catch (error) {
    const classified = classifyPrismaError(error);
    logApiError({
      path: `/api/herramientas/${rawId}`,
      method: "GET",
      error,
      classified,
    });

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        retryable: classified.retryable,
      },
      { status: classified.status }
    );
  }
}
