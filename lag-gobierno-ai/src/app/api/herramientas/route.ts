import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import { classifyPrismaError } from "@/infrastructure/errors/classify-prisma-error";

/**
 * GET /api/herramientas
 *
 * Lista todas las herramientas con filtros opcionales por nivel, estado y categoría.
 * Thin route: Zod parse → handler.execute → JSON response.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawParams: Record<string, string> = {};
    const nivel = searchParams.get("nivel");
    const estado = searchParams.get("estado");
    const categoria = searchParams.get("categoria");
    if (nivel) rawParams.nivel = nivel;
    if (estado) rawParams.estado = estado;
    if (categoria) rawParams.categoria = categoria;

    const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues
        .map((e: { message: string }) => e.message)
        .join(", ");
      return NextResponse.json(
        {
          error: `Parámetros inválidos: ${fieldErrors}. Valores permitidos — nivel: Publica, Interna, Confidencial, Restringida; estado: Activa, Retirada, Condicional.`,
        },
        { status: 400 }
      );
    }

    const filters = {
      ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel }),
      ...(parsed.data.estado && { estado: parsed.data.estado }),
      ...(parsed.data.categoria && { categoria: parsed.data.categoria }),
    };

    const result = await listHerramientasHandler.execute(filters);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, retryable } = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: "/api/herramientas",
        method: "GET",
        errorCode: "UNKNOWN",
        errorCategory: retryable ? "TRANSIENT" : "PERMANENT",
        message: error instanceof Error ? error.message : String(error),
      })
    );

    return NextResponse.json(
      { error: "Error interno del servidor", retryable },
      { status }
    );
  }
}
