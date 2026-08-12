import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import type { HerramientaFilters } from "@/domain/herramienta/herramienta.repository";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

/**
 * GET /api/herramientas
 *
 * Lista todas las herramientas con filtros opcionales.
 *
 * Query params:
 *   nivel?    — "Publica" | "Interna" | "Confidencial" | "Restringida"
 *   estado?   — "Activa" | "Retirada" | "Condicional"
 *   categoria? — string (Post-MVP)
 *
 * Respuestas:
 *   200 { data: HerramientaListItemDto[], count: number }
 *   400 { error: string }  — parámetro inválido
 *   500 { error: string }  — error interno (nunca expone detalles)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // --- 1. Parsear y validar query params ---
  const { searchParams } = request.nextUrl;
  const rawParams = Object.fromEntries(searchParams.entries());

  const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    const fieldName = String(firstError?.path[0] ?? "parámetro");
    const validValues: Record<string, string> = {
      nivel: "Publica, Interna, Confidencial o Restringida",
      estado: "Activa, Retirada o Condicional",
    };
    const hint = validValues[String(fieldName)]
      ? ` Valores válidos: ${validValues[String(fieldName)]}.`
      : "";
    return NextResponse.json(
      { error: `El parámetro '${fieldName}' no es válido.${hint}` },
      { status: 400 }
    );
  }

  // --- 2. Construir filtros tipados para el handler ---
  const filters: HerramientaFilters = {};
  if (parsed.data.nivel) {
    filters.nivelMaximo = parsed.data.nivel as NivelClasificacion;
  }
  if (parsed.data.estado) {
    filters.estado = parsed.data.estado as EstadoHerramienta;
  }
  if (parsed.data.categoria) {
    // Post-MVP: categoria filter no está soportado en HerramientaFilters aún.
    // El param se acepta en el schema para compatibilidad futura pero se ignora en MVP.
  }

  // --- 3. Ejecutar handler ---
  try {
    const result = await listHerramientasHandler.execute(
      Object.keys(filters).length > 0 ? filters : undefined
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: "/api/herramientas",
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
