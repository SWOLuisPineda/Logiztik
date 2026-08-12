import { NextRequest, NextResponse } from "next/server";
import {
  ListHerramientasQuerySchema,
  type ParsedHerramientaFilters,
} from "@/presentation/validations/herramienta.validation";
import { listHerramientasHandler } from "@/infrastructure/container";

/**
 * GET /api/herramientas
 * Lista herramientas con filtros opcionales por nivel y estado.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery: Record<string, string> = {};
    const nivel = searchParams.get("nivel");
    const estado = searchParams.get("estado");
    if (nivel) rawQuery.nivel = nivel;
    if (estado) rawQuery.estado = estado;

    const parsed = ListHerramientasQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          error: `Parámetros inválidos: ${fieldErrors.join(", ")}. Valores permitidos — nivel: Publica, Interna, Confidencial, Restringida; estado: Activa, Retirada, Condicional`,
        },
        { status: 400 }
      );
    }

    const filters: ParsedHerramientaFilters = {};
    if (parsed.data.nivel) filters.nivelMaximo = parsed.data.nivel;
    if (parsed.data.estado) filters.estado = parsed.data.estado;

    const result = await listHerramientasHandler.execute(filters);

    return NextResponse.json({ data: result.data, count: result.count });
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
