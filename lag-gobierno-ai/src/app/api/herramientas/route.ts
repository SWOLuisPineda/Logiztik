import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import {
  classifyPrismaError,
  logApiError,
} from "@/infrastructure/errors/classify-prisma-error";

/**
 * GET /api/herramientas
 *
 * Query params opcionales:
 *   nivel?: "Publica" | "Interna" | "Confidencial" | "Restringida"
 *   estado?: "Activa" | "Retirada" | "Condicional"
 *
 * Responses:
 *   200 — { data: HerramientaListItemDto[], count: number }
 *   400 — { error: string } — parámetro inválido
 *   503 — { error: string, retryable: true } — BD no disponible (transient)
 *   500 — { error: string, retryable: false } — error permanente
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawParams = {
    nivel: searchParams.get("nivel") ?? undefined,
    estado: searchParams.get("estado") ?? undefined,
  };

  // Validar con Zod
  const parsed = ListHerramientasQuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const fieldName =
      firstIssue?.path[0] != null
        ? String(firstIssue.path[0])
        : "parámetro";
    const valoresValidos =
      fieldName === "nivel"
        ? "Publica, Interna, Confidencial, Restringida"
        : "Activa, Retirada, Condicional";

    return NextResponse.json(
      {
        error: `El parámetro '${fieldName}' es inválido. Valores permitidos: ${valoresValidos}`,
      },
      { status: 400 }
    );
  }

  try {
    const filters = {
      nivelMaximo: parsed.data.nivel as NivelClasificacion | undefined,
      estado: parsed.data.estado as EstadoHerramienta | undefined,
    };

    const result = await listHerramientasHandler.execute(filters);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const classified = classifyPrismaError(error);
    logApiError({
      path: "/api/herramientas",
      method: "GET",
      error,
      classified,
    });

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        retryable: classified.retryable,
      },
      { status: classified.status }
    );
  }
}
