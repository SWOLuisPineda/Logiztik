import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

/**
 * Task 17 — GET /api/herramientas/[id]
 *
 * Retorna el detalle completo de una herramienta por su ID.
 * Responde con HerramientaDetailDto (incluye dpa, creadoEn, actualizadoEn en ISO 8601).
 *
 * Status codes:
 *   200 — herramienta encontrada
 *   400 — id inválido (no numérico, cero, negativo)
 *   404 — herramienta no encontrada
 *   500 — error interno, nunca expone detalles al cliente
 *
 * Dependency Rule: importa handler de @/infrastructure/container.
 * No instancia repositorios directamente.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1. Resolver params (Next.js 15: params es una Promise)
  const resolvedParams = await params;

  // 2. Validar path param con Zod
  const parsed = GetHerramientaParamsSchema.safeParse({ id: resolvedParams.id });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "El parámetro 'id' debe ser un número entero positivo." },
      { status: 400 }
    );
  }

  // 3. Ejecutar handler
  try {
    const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);

    if (!herramienta) {
      return NextResponse.json(
        { error: "Herramienta no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(herramienta, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${resolvedParams.id}`,
        method: "GET",
        message: error instanceof Error ? error.message : String(error),
      })
    );
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
