import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import type { HerramientaFilters } from "@/domain/herramienta/herramienta.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawQuery: Record<string, string> = {};

    if (searchParams.has("nivel")) rawQuery.nivel = searchParams.get("nivel")!;
    if (searchParams.has("estado"))
      rawQuery.estado = searchParams.get("estado")!;

    const parsed = ListHerramientasQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      const field = firstError.path[0];
      let message = `Parámetro '${field}' inválido.`;
      if (field === "nivel") {
        message =
          "El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida";
      } else if (field === "estado") {
        message =
          "El parámetro 'estado' debe ser: Activa, Retirada o Condicional";
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const filters: HerramientaFilters = {};
    if (parsed.data.nivel) filters.nivelMaximo = parsed.data.nivel;
    if (parsed.data.estado) filters.estado = parsed.data.estado;

    const result = await listHerramientasHandler.execute(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json(result);
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
