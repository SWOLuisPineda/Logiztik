import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { BackButton } from "@/presentation/components/BackButton";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface ToolDetailPageProps {
  params: { id: string };
  searchParams: { nivel?: string };
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);
  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return { title: `${herramienta.nombre} — Catálogo LAG` };
}

/**
 * ToolDetailPage — Server Component.
 * Valida id, llama handler del container, notFound() si null.
 * Layout diferenciado: Activa/Condicional vs Retirada (según design.md H6).
 * Pasa searchParams.nivel a BackButton para preservar el filtro al volver.
 */
export default async function ToolDetailPage({ params, searchParams }: ToolDetailPageProps) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);
  if (!herramienta) {
    notFound();
  }

  const esRetirada = herramienta.estado === "Retirada";

  return (
    <div>
      <div className="mb-6">
        <BackButton nivel={searchParams.nivel} />
      </div>

      {/* Banner de advertencia para herramientas retiradas */}
      {esRetirada && (
        <div
          className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6"
          role="alert"
        >
          <p className="text-red-700 font-medium">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6">
        {/* Nombre */}
        <h1 className="text-2xl font-bold text-[#383838] mb-4">
          {herramienta.nombre}
        </h1>

        {/* Proveedor */}
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-[#6B7280]">Proveedor</dt>
            <dd className="text-[#383838]">{herramienta.proveedor}</dd>
          </div>

          {/* Estado — siempre visible */}
          <div>
            <dt className="text-sm font-medium text-[#6B7280]">Estado</dt>
            <dd>
              <SemaforoIndicator
                estado={herramienta.estado as EstadoHerramienta}
              />
            </dd>
          </div>

          {/* Campos solo para Activa/Condicional */}
          {!esRetirada && (
            <>
              <div>
                <dt className="text-sm font-medium text-[#6B7280]">
                  Categoría
                </dt>
                <dd className="text-[#383838]">
                  {herramienta.categoria ?? "Sin categoría"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-[#6B7280]">
                  Nivel máximo de clasificación
                </dt>
                <dd>
                  <NivelBadge
                    nivel={herramienta.nivelMaximo as NivelClasificacion | null}
                  />
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-[#6B7280]">DPA</dt>
                <dd className="text-[#383838]">
                  {herramienta.dpa === "No aplica"
                    ? "Información no disponible aún"
                    : herramienta.dpa}
                </dd>
              </div>
            </>
          )}

          {/* Campos solo para Retirada */}
          {esRetirada && herramienta.razonRetiro && (
            <div>
              <dt className="text-sm font-medium text-[#6B7280]">
                Razón de retiro
              </dt>
              <dd className="text-red-600">{herramienta.razonRetiro}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
