/**
 * Task 17 — GET /api/herramientas/[id]
 *
 * Route handler thin: valida path param → handler → JSON.
 * NO instancia repositorios. Importa handler del container.
 *
 * Dependency Rule: Presentation → Application (via container).
 */

import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

interface RouteContext {
  params: { id: string };
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  // 1. Validar path param id — coerce string → number + int + positive
  const parsed = GetHerramientaParamsSchema.safeParse({ id: context.params.id });
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0];
    return NextResponse.json(
      {
        error:
          firstError?.message ??
          "El parámetro 'id' debe ser un número entero positivo.",
        code: "INVALID_PARAM",
      },
      { status: 400 },
    );
  }

  // 2. Ejecutar handler
  try {
    const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);

    // null → herramienta no existe → 404
    if (!herramienta) {
      return NextResponse.json(
        { error: "Herramienta no encontrada", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(herramienta, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${context.params.id}`,
        method: "GET",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
