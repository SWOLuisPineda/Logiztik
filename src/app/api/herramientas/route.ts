import { NextRequest, NextResponse } from "next/server";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import { classifyPrismaError } from "@/infrastructure/errors/classify-prisma-error";

export const dynamic = "force-dynamic";

/**
 * GET /api/herramientas
 *
 * Lista herramientas con filtros opcionales por nivel y estado.
 * Thin route: parsea → handler → JSON.
 * H4: Clasifica errores de Prisma y retorna `retryable` flag.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const rawParams = Object.fromEntries(searchParams.entries());

    const parsed = ListHerramientasQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      return NextResponse.json(
        { error: `Parámetro inválido. ${fieldErrors}` },
        { status: 400 }
      );
    }

    const filters = {
      ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel }),
      ...(parsed.data.estado && { estado: parsed.data.estado }),
    };

    const result = await listHerramientasHandler.execute(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const classified = classifyPrismaError(error);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: "/api/herramientas",
        method: "GET",
        errorCategory: classified.category,
        retryable: classified.retryable,
        message: error instanceof Error ? error.message : String(error),
      })
    );

    return NextResponse.json(
      { error: "Error interno del servidor", retryable: classified.retryable },
      { status: classified.status }
    );
  }
}
