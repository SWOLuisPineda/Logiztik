import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

/**
 * GET /api/herramientas/[id]
 *
 * Retorna el detalle completo de una herramienta por su ID numérico.
 *
 * Respuestas:
 *   200 HerramientaDetailDto   — herramienta encontrada
 *   400 { error: string }      — id no es un entero positivo (ej. "abc", "-1", "0")
 *   404 { error: string }      — herramienta no existe en BD
 *   500 { error: string }      — error interno (nunca expone detalles)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // --- 1. Validar path param con Zod (coerce string → number) ---
  const parsed = GetHerramientaParamsSchema.safeParse({ id: params.id });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message
      ?? "El parámetro 'id' debe ser un número entero positivo";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // --- 2. Ejecutar handler ---
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
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${params.id}`,
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
