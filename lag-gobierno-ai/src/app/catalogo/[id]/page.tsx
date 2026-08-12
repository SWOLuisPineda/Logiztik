import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { BackButton } from "@/presentation/components/BackButton";
import { HerramientaDetailDto } from "@/application/herramientas/dtos/herramienta-detail.dto";

interface ToolDetailPageProps {
  params: { id: string };
  searchParams: { nivel?: string };
}

/**
 * Cached fetch: React deduplicates this across generateMetadata and the page component.
 */
const getHerramienta = cache(
  async (id: number): Promise<HerramientaDetailDto | null> => {
    return getHerramientaByIdHandler.execute(id);
  }
);

/**
 * Genera metadata dinámica con el nombre de la herramienta.
 */
export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramienta(id);
  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return { title: `${herramienta.nombre} — Catálogo AI LAG` };
}

/**
 * Página de detalle de herramienta.
 * Server Component. Valida id, usa handler de container, notFound() si null.
 * Layout diferenciado según estado (Activa/Condicional vs Retirada — H6).
 */
export default async function ToolDetailPage({ params, searchParams }: ToolDetailPageProps) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    notFound();
  }

  const herramienta = await getHerramienta(id);
  if (!herramienta) {
    notFound();
  }

  const esRetirada = herramienta.estado === "Retirada";

  return (
    <>
      <div className="mb-6">
        <BackButton nivel={searchParams.nivel} />
      </div>

      {/* Banner de advertencia para herramientas retiradas */}
      {esRetirada && (
        <div
          className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3"
          role="alert"
        >
          <svg
            className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#383838]">
            {herramienta.nombre}
          </h1>
          <p className="mt-1 text-[#6B7280]">{herramienta.proveedor}</p>
        </div>
        <SemaforoIndicator estado={herramienta.estado} />
      </div>

      {/* Contenido según estado */}
      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {/* Campos solo para Activa/Condicional */}
          {!esRetirada && (
            <>
              <div>
                <dt className="text-sm font-medium text-[#6B7280]">Categoría</dt>
                <dd className="mt-1 text-[#383838]">
                  {herramienta.categoria ?? "Sin categoría"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-[#6B7280]">
                  Nivel máximo de clasificación
                </dt>
                <dd className="mt-1">
                  <NivelBadge nivel={herramienta.nivelMaximo} />
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-[#6B7280]">DPA</dt>
                <dd className="mt-1 text-[#383838]">
                  {herramienta.dpa === "No aplica"
                    ? "Información no disponible aún"
                    : herramienta.dpa}
                </dd>
              </div>
            </>
          )}

          {/* Campos solo para Retirada (H6) */}
          {esRetirada && (
            <>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-[#6B7280]">
                  Razón de retiro
                </dt>
                <dd className="mt-1 text-[#383838]">
                  {herramienta.razonRetiro ?? "No especificada"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-[#6B7280]">
                  Fecha de retiro
                </dt>
                <dd className="mt-1 text-[#383838]">
                  {herramienta.retiradaEn
                    ? new Date(herramienta.retiradaEn).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Fecha no registrada"}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </>
  );
}
