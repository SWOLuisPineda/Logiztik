import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";

/**
 * GET /api/herramientas
 *
 * Lista todas las herramientas del catálogo con filtros opcionales.
 * Query params: nivel?, estado?, categoria? (Post-MVP)
 *
 * Responses:
 *   200 — { data: HerramientaListItemDto[], count: number }
 *   400 — { error: string } — parámetro inválido
 *   500 — { error: "Error interno del servidor" } — nunca expone detalles internos
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // 1. Parsear query params
  const { searchParams } = request.nextUrl;
  const rawParams = {
    nivel: searchParams.get("nivel") ?? undefined,
    estado: searchParams.get("estado") ?? undefined,
    categoria: searchParams.get("categoria") ?? undefined,
  };

  const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const fieldName = firstIssue?.path[0] ?? "parámetro";
    const mensaje = buildValidationMessage(String(fieldName));
    return NextResponse.json({ error: mensaje }, { status: 400 });
  }

  // 2. Construir filtros para el handler
  // Zod ya validó que nivel/estado son literales válidos del enum.
  // El handler acepta HerramientaFilters pero no importamos ese type de @/domain/
  // porque Presentation no debe depender de Domain. El cast es seguro post-Zod.
  const filters = parsed.data.nivel || parsed.data.estado
    ? {
        ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel as "Publica" | "Interna" | "Confidencial" | "Restringida" }),
        ...(parsed.data.estado && { estado: parsed.data.estado as "Activa" | "Retirada" | "Condicional" }),
      }
    : undefined;

  // 3. Ejecutar handler
  try {
    const result = await listHerramientasHandler.execute(filters);
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildValidationMessage(field: string): string {
  const messages: Record<string, string> = {
    nivel:
      "El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida.",
    estado: "El parámetro 'estado' debe ser: Activa, Retirada o Condicional.",
    categoria:
      "El parámetro 'categoria' debe tener entre 1 y 100 caracteres.",
  };
  return messages[field] ?? `El parámetro '${field}' es inválido.`;
}
