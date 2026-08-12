import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { BackButton } from "@/presentation/components/BackButton";

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Genera metadata dinámica con el nombre de la herramienta.
 */
export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);

  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return { title: `${herramienta.nombre} — Catálogo LAG` };
}

/**
 * Página de detalle de herramienta. Server Component.
 * H6: Layout diferenciado según estado (Activa/Condicional vs Retirada).
 */
export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id) || id <= 0) {
    notFound();
  }

  const dto = await getHerramientaByIdHandler.execute(id);

  if (!dto) {
    notFound();
  }

  const isRetirada = dto.estado === "Retirada";

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Banner de advertencia para herramientas retiradas */}
      {isRetirada && (
        <div
          className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4"
          role="alert"
        >
          <svg
            className="h-5 w-5 text-[#DC2626] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#383838]">{dto.nombre}</h1>
        <SemaforoIndicator estado={dto.estado} />
      </div>

      {/* Detail card */}
      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 space-y-4">
        <DetailRow label="Proveedor" value={dto.proveedor} />

        {!isRetirada && (
          <>
            <DetailRow
              label="Categoría"
              value={dto.categoria ?? "Sin categoría"}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#6B7280]">
                Nivel máximo de datos
              </span>
              <NivelBadge nivel={dto.nivelMaximo} />
            </div>
            <DetailRow
              label="DPA"
              value={
                dto.dpa === "No aplica"
                  ? "Información no disponible aún"
                  : dto.dpa
              }
            />
          </>
        )}

        {isRetirada && (
          <>
            <DetailRow
              label="Razón de retiro"
              value={dto.razonRetiro ?? "Sin razón registrada"}
            />
            <DetailRow
              label="Fecha de retiro"
              value={
                dto.retiradaEn
                  ? new Date(dto.retiradaEn).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no registrada"
              }
            />
          </>
        )}

        <hr className="border-[#E2E8E0]" />

        <div className="flex gap-6 text-xs text-[#6B7280]">
          <span>
            Registrada:{" "}
            {new Date(dto.creadoEn).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>
            Actualizada:{" "}
            {new Date(dto.actualizadoEn).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[#6B7280]">{label}</span>
      <span className="text-sm text-[#383838]">{value}</span>
    </div>
  );
}
