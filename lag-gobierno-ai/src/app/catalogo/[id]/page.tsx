import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import SemaforoIndicator from "@/presentation/components/SemaforoIndicator";
import NivelBadge from "@/presentation/components/NivelBadge";
import BackButton from "@/presentation/components/BackButton";

/**
 * ToolDetailPage — Página de detalle de una herramienta.
 *
 * Server Component. Valida id. Handler de container. notFound() si null.
 * H6: Layout diferenciado según estado (Activa/Condicional vs Retirada).
 */

interface ToolDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);
  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return {
    title: `${herramienta.nombre} — Catálogo AI LAG`,
    description: `Detalle de ${herramienta.nombre} por ${herramienta.proveedor}`,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const id = Number(params.id);

  if (isNaN(id) || id <= 0) {
    return notFound();
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);

  if (!herramienta) {
    return notFound();
  }

  const isRetirada = herramienta.estado === "Retirada";

  return (
    <>
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Banner de advertencia para herramientas retiradas */}
      {isRetirada && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <svg
            className="h-5 w-5 flex-shrink-0 text-[#DC2626]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm font-medium text-[#DC2626]">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#383838]">
          {herramienta.nombre}
        </h1>
        <SemaforoIndicator estado={herramienta.estado} />
      </div>

      <p className="mb-6 text-sm text-[#6B7280]">{herramienta.proveedor}</p>

      {/* Detail card */}
      <div className="rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm">
        <dl className="space-y-4">
          {/* Campos comunes: siempre visibles */}
          <DetailRow label="Nombre" value={herramienta.nombre} />
          <DetailRow label="Proveedor" value={herramienta.proveedor} />

          {/* Campos solo para Activa/Condicional */}
          {!isRetirada && (
            <>
              <div className="flex items-center justify-between py-2 border-b border-[#E2E8E0]">
                <dt className="text-sm font-medium text-[#6B7280]">
                  Categoría
                </dt>
                <dd className="text-sm text-[#383838]">
                  {herramienta.categoria ?? "Sin categoría"}
                </dd>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#E2E8E0]">
                <dt className="text-sm font-medium text-[#6B7280]">
                  Nivel máximo de datos
                </dt>
                <dd>
                  <NivelBadge nivel={herramienta.nivelMaximo} />
                </dd>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#E2E8E0]">
                <dt className="text-sm font-medium text-[#6B7280]">DPA</dt>
                <dd className="text-sm text-[#383838]">
                  {herramienta.dpa === "No aplica"
                    ? "Información no disponible aún"
                    : herramienta.dpa}
                </dd>
              </div>
            </>
          )}

          {/* Campos solo para Retirada */}
          {isRetirada && (
            <>
              <DetailRow
                label="Razón de retiro"
                value={herramienta.razonRetiro ?? "No especificada"}
              />
              <DetailRow
                label="Retirada en"
                value={
                  herramienta.retiradaEn
                    ? new Date(herramienta.retiradaEn).toLocaleDateString("es-CO")
                    : "Fecha no registrada"
                }
              />
            </>
          )}
        </dl>
      </div>
    </>
  );
}

/** Helper para filas de detalle */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#E2E8E0]">
      <dt className="text-sm font-medium text-[#6B7280]">{label}</dt>
      <dd className="text-sm text-[#383838]">{value}</dd>
    </div>
  );
}
