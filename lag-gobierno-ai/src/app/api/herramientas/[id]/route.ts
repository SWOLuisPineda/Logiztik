import { NextRequest, NextResponse } from "next/server";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parsed = GetHerramientaParamsSchema.safeParse({ id: params.id });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "El parámetro 'id' debe ser un número entero positivo" },
        { status: 400 }
      );
    }

    const result = await getHerramientaByIdHandler.execute(parsed.data.id);

    if (!result) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        path: `/api/herramientas/${params.id}`,
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
