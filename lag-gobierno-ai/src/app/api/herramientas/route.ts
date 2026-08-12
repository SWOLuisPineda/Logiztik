/**
 * Task 16 — GET /api/herramientas
 *
 * Route handler thin: parsea query params → handler → JSON.
 * NO instancia repositorios. Importa handler del container.
 *
 * Dependency Rule: Presentation → Application (via container).
 */

import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import type { HerramientaFilters } from "@/domain/herramienta/herramienta.repository";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // 1. Extraer query params
  const { searchParams } = request.nextUrl;
  const rawQuery = {
    nivel: searchParams.get("nivel") ?? undefined,
    estado: searchParams.get("estado") ?? undefined,
  };

  // 2. Validar con Zod — 400 descriptivo si falla
  const parsed = ListHerramientasQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0];
    return NextResponse.json(
      {
        error:
          firstError?.message ??
          "Parámetro inválido. Valores permitidos para 'nivel': Publica, Interna, Confidencial, Restringida.",
        code: "INVALID_PARAM",
      },
      { status: 400 },
    );
  }

  // 3. Traducir: query param `nivel` → dominio `nivelMaximo`
  const filters: HerramientaFilters = {};
  if (parsed.data.nivel) {
    filters.nivelMaximo = parsed.data.nivel as NivelClasificacion;
  }
  if (parsed.data.estado) {
    filters.estado = parsed.data.estado as EstadoHerramienta;
  }

  // 4. Ejecutar handler
  try {
    const result = await listHerramientasHandler.execute(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: "/api/herramientas",
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
