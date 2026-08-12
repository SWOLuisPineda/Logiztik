import { NextRequest, NextResponse } from "next/server";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import { listHerramientasHandler } from "@/infrastructure/container";

/**
 * GET /api/herramientas
 *
 * Lista herramientas con filtros opcionales por nivel y estado.
 * Thin route: Zod parse → handler.execute → JSON response.
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
          error: `Parámetros inválidos: ${fieldErrors.join(". ")}`,
        },
        { status: 400 }
      );
    }

    const hasFilters = parsed.data.nivel || parsed.data.estado;
    const filters = hasFilters
      ? {
          ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel }),
          ...(parsed.data.estado && { estado: parsed.data.estado }),
        }
      : undefined;

    const result = await listHerramientasHandler.execute(filters as Parameters<typeof listHerramientasHandler.execute>[0]);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
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
