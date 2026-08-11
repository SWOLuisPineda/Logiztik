import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";

/**
 * Task 16 — GET /api/herramientas
 *
 * Lista herramientas con filtros opcionales por nivel y estado.
 * Responde con { data: HerramientaListItemDto[], count: number }.
 *
 * Query params:
 *   nivel?  — "Publica" | "Interna" | "Confidencial" | "Restringida"
 *   estado? — "Activa" | "Retirada" | "Condicional"
 *
 * Status codes:
 *   200 — OK, data + count
 *   400 — parámetro inválido, mensaje descriptivo por campo
 *   500 — error interno, nunca expone detalles al cliente
 *
 * Dependency Rule: importa handler de @/infrastructure/container.
 * NO importa de @/domain/ — filtros se construyen como objeto literal.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // 1. Extraer query params
  const { searchParams } = request.nextUrl;
  const rawParams = {
    nivel: searchParams.get("nivel") ?? undefined,
    estado: searchParams.get("estado") ?? undefined,
  };

  // 2. Validar con Zod
  const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const fieldName = String(firstIssue?.path[0] ?? "");
    const fieldMessages: Record<string, string> = {
      nivel:
        "El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida.",
      estado: "El parámetro 'estado' debe ser: Activa, Retirada o Condicional.",
    };
    return NextResponse.json(
      { error: fieldMessages[fieldName] ?? firstIssue?.message ?? "Parámetros inválidos." },
      { status: 400 }
    );
  }

  // 3. Construir filtros — objeto literal compatible con HerramientaFilters
  const filters = {
    ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel }),
    ...(parsed.data.estado && { estado: parsed.data.estado }),
  };

  // 4. Ejecutar handler
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
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
