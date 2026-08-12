import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

/**
 * GET /api/herramientas/[id]
 *
 * Retorna el detalle completo de una herramienta por su ID.
 *
 * Responses:
 *   200 — HerramientaDetailDto (con DPA + timestamps ISO)
 *   400 — { error: string } — id no es entero positivo
 *   404 — { error: "Herramienta no encontrada" }
 *   500 — { error: "Error interno del servidor" }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1. Resolver params (Next.js 15 — params es Promise)
  const { id: rawId } = await params;

  // 2. Validar y coercionar id
  const parsed = GetHerramientaParamsSchema.safeParse({ id: rawId });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "El parámetro 'id' debe ser un número entero positivo." },
      { status: 400 }
    );
  }

  const { id } = parsed.data;

  // 3. Ejecutar handler
  try {
    const herramienta = await getHerramientaByIdHandler.execute(id);

    if (!herramienta) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(herramienta, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${id}`,
        method: "GET",
        message: error instanceof Error ? error.message : String(error),
      })
    );
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
