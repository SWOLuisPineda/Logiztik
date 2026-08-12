import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import SemaforoIndicator from "@/presentation/components/SemaforoIndicator";
import NivelBadge from "@/presentation/components/NivelBadge";
import BackButton from "@/presentation/components/BackButton";

/**
 * ToolDetailPage — Detalle completo de una herramienta.
 *
 * Server Component. Valida id, llama handler, muestra campos + semáforo.
 * Si retirada: banner rojo + razón.
 * Si DPA "No aplica": muestra "Información no disponible aún".
 * Usa React cache() para de-duplicar la query entre generateMetadata y el componente.
 */

const getHerramienta = cache((id: number) =>
  getHerramientaByIdHandler.execute(id)
);

interface ToolDetailPageProps {
  readonly params: { id: string };
  readonly searchParams: { nivel?: string };
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramienta(id);
  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return { title: `${herramienta.nombre} — Catálogo AI LAG` };
}

export default async function ToolDetailPage({
  params,
  searchParams,
}: ToolDetailPageProps) {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    notFound();
  }

  const herramienta = await getHerramienta(id);
  if (!herramienta) {
    notFound();
  }

  const esRetirada = herramienta.estado === "Retirada";
  const nivel = searchParams.nivel ?? null;

  return (
    <div className="space-y-6">
      <BackButton nivel={nivel} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-lag-text-primary">
          {herramienta.nombre}
        </h1>
        <SemaforoIndicator estado={herramienta.estado} />
      </div>

      {/* Banner de advertencia para herramientas retiradas */}
      {esRetirada && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
          {herramienta.razonRetiro && (
            <p className="text-red-600 text-sm mt-1">
              Razón de retiro: {herramienta.razonRetiro}
            </p>
          )}
        </div>
      )}

      {/* Campos de detalle */}
      <div className="rounded-lg bg-white border border-lag-border shadow-sm p-6 space-y-4">
        <DetailField label="Proveedor" value={herramienta.proveedor} />

        {!esRetirada && (
          <>
            <DetailField
              label="Categoría"
              value={herramienta.categoria ?? "Sin categoría"}
            />

            <div>
              <span className="text-sm text-lag-text-secondary block mb-1">
                Nivel máximo de datos
              </span>
              <NivelBadge nivel={herramienta.nivelMaximo} />
            </div>

            <DetailField
              label="Estado de DPA"
              value={
                herramienta.dpa === "No aplica"
                  ? "Información no disponible aún"
                  : herramienta.dpa
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <span className="text-sm text-lag-text-secondary block mb-0.5">
        {label}
      </span>
      <span className="text-base text-lag-text-primary font-medium">
        {value}
      </span>
    </div>
  );
}
