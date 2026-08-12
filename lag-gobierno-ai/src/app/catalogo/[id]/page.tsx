/**
 * Task 31 — ToolDetailPage
 *
 * Página de detalle de una herramienta individual.
 * Server Component — fetcha datos via handler.
 *
 * Layout ramificado según estado (H6 del design.md):
 * - Activa/Condicional: muestra categoría, nivel, DPA
 * - Retirada: banner rojo de advertencia, sin categoría ni nivel
 *
 * Dependency Rule: Importa handler de @/infrastructure/container.
 */

import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { BackButton } from "@/presentation/components/BackButton";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { formatDpaLabel } from "@/lib/utils/format-dpa-label";

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps & { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id) || id <= 0) {
    return { title: "Herramienta no encontrada" };
  }

  try {
    const herramienta = await getHerramientaByIdHandler.execute(id);
    if (!herramienta) {
      return { title: "Herramienta no encontrada" };
    }

    return {
      title: `${herramienta.nombre} — Catálogo de Herramientas AI`,
      description: `${herramienta.proveedor} - Estado: ${herramienta.estado}`,
    };
  } catch {
    return { title: "Herramienta no encontrada" };
  }
}

export default async function ToolDetailPage({
  params,
}: ToolDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validar ID
  if (isNaN(id) || id <= 0) {
    notFound();
  }

  // Fetchar datos
  const herramienta = await getHerramientaByIdHandler.execute(id);
  if (!herramienta) {
    notFound();
  }

  const estaRetirada = herramienta.estado === "Retirada";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <BackButton />

      {/* Banner de advertencia si está retirada */}
      {estaRetirada && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2 className="font-semibold text-red-800">
                Esta herramienta NO está autorizada para uso en LAG.
              </h2>
              <p className="text-sm text-red-700 mt-1">
                Fue retirada del catálogo de herramientas aprobadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-[#383838]">{herramienta.nombre}</h1>
        <p className="text-lg text-[#6B7280]">Proveedor: {herramienta.proveedor}</p>
      </div>

      {/* Estado y Semáforo */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-medium text-[#6B7280] mb-1">Estado:</p>
          <SemaforoIndicator estado={herramienta.estado} />
        </div>
      </div>

      {/* Contenido ramificado por estado */}
      {!estaRetirada ? (
        /* Layout para Activa/Condicional */
        <div className="space-y-6 p-6 bg-[#F5F7F0] rounded-lg">
          {/* Categoría */}
          <div>
            <p className="text-sm font-medium text-[#6B7280] mb-2">Categoría:</p>
            <p className="text-base text-[#383838]">
              {herramienta.categoria ?? "Sin categoría"}
            </p>
          </div>

          {/* Nivel de Clasificación */}
          <div>
            <p className="text-sm font-medium text-[#6B7280] mb-2">
              Nivel máximo de clasificación:
            </p>
            <NivelBadge nivel={herramienta.nivelMaximo} />
          </div>

          {/* DPA */}
          <div>
            <p className="text-sm font-medium text-[#6B7280] mb-2">
              Estado DPA:
            </p>
            <p className="text-base text-[#383838]">
              {formatDpaLabel(herramienta.dpa)}
            </p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Creada:
              </p>
              <p className="text-sm text-[#383838]">
                {new Date(herramienta.creadoEn).toLocaleDateString("es-ES")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Actualizada:
              </p>
              <p className="text-sm text-[#383838]">
                {new Date(herramienta.actualizadoEn).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Layout para Retirada */
        <div className="space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
          {/* Razón de retiro */}
          {herramienta.razonRetiro && (
            <div>
              <p className="text-sm font-medium text-red-700 mb-2">
                Razón de retiro:
              </p>
              <p className="text-sm text-red-700">{herramienta.razonRetiro}</p>
            </div>
          )}

          {/* Fecha de actualización (cuando fue retirada) */}
          <div>
            <p className="text-sm font-medium text-red-700 mb-1">
              Actualizada:
            </p>
            <p className="text-sm text-red-700">
              {new Date(herramienta.actualizadoEn).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
