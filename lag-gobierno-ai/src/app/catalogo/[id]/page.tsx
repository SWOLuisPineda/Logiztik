import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { BackButton } from "@/presentation/components/BackButton";

/**
 * ToolDetailPage — Server Component
 *
 * Página de detalle de una herramienta.
 * Valida el ID. Si no existe → notFound().
 * Layout diferenciado según estado: Activa/Condicional vs Retirada (H6 del design).
 */

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId) || numericId <= 0) {
    return { title: "Herramienta no encontrada" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(numericId);

  if (!herramienta) {
    return { title: "Herramienta no encontrada" };
  }

  return {
    title: herramienta.nombre,
    description: `Detalle de ${herramienta.nombre} (${herramienta.proveedor}) en el catálogo de herramientas AI de LAG.`,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  // Validación: ID no numérico o no positivo
  if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
    notFound();
  }

  const herramienta = await getHerramientaByIdHandler.execute(numericId);

  if (!herramienta) {
    notFound();
  }

  const estaRetirada = herramienta.estado === "Retirada";

  return (
    <>
      {/* Navegación */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Banner de advertencia — solo herramientas retiradas */}
      {estaRetirada && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      {/* Header: nombre + semáforo */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-[#383838]">
          {herramienta.nombre}
        </h1>
        <SemaforoIndicator estado={herramienta.estado} />
      </div>

      {/* Proveedor */}
      <p className="text-base text-[#6B7280] mb-6">{herramienta.proveedor}</p>

      {/* Detalle */}
      <div className="rounded-lg border border-[#E2E8E0] bg-white p-6 space-y-4">
        {/* Campos para Activa/Condicional */}
        {!estaRetirada && (
          <>
            {/* Categoría */}
            <DetailRow label="Categoría">
              <span className={herramienta.categoria ? "" : "text-[#6B7280] italic"}>
                {herramienta.categoria ?? "Sin categoría"}
              </span>
            </DetailRow>

            {/* Nivel máximo */}
            <DetailRow label="Nivel máximo de datos">
              <NivelBadge nivel={herramienta.nivelMaximo} />
            </DetailRow>

            {/* DPA */}
            <DetailRow label="DPA (Acuerdo de protección de datos)">
              <span
                className={
                  herramienta.dpa === "Vigente"
                    ? "text-[#5C8314] font-medium"
                    : "text-[#6B7280] italic"
                }
              >
                {herramienta.dpa === "No aplica"
                  ? "Información no disponible aún"
                  : herramienta.dpa}
              </span>
            </DetailRow>
          </>
        )}

        {/* Campos para Retirada */}
        {estaRetirada && (
          <>
            {/* Razón de retiro */}
            <DetailRow label="Razón de retiro">
              <span className="text-red-700 font-medium">
                {herramienta.razonRetiro ?? "No especificada"}
              </span>
            </DetailRow>

            {/* H6: retiradaEn — diferido post-MVP (no hay campo en schema real).
                El dato no existe en la fuente. Cuando el CRUD admin exista,
                registrará la fecha al momento del retiro.
                Por ahora mostramos "Fecha no registrada". */}
            <DetailRow label="Fecha de retiro">
              <span className="text-[#6B7280] italic">
                {herramienta.retiradaEn
                  ? new Date(herramienta.retiradaEn).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no registrada"}
              </span>
            </DetailRow>
          </>
        )}
      </div>
    </>
  );
}

/**
 * Componente auxiliar para filas de detalle (label: valor).
 * Mantiene consistencia visual sin repetir Tailwind en cada campo.
 */
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <dt className="text-sm font-medium text-[#383838] sm:w-56 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-[#383838]">{children}</dd>
    </div>
  );
}
