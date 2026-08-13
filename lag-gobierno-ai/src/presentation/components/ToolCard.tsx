import Link from "next/link";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import SemaforoIndicator from "./SemaforoIndicator";
import NivelBadge from "./NivelBadge";

/**
 * Task 24 — ToolCard
 *
 * Server Component. Tarjeta individual de herramienta en el listado.
 *
 * - Nombre es un link a /catalogo/[id]?nivel=<nivelFiltroActivo> para que
 *   BackButton pueda preservar el filtro al volver.
 * - Si estado === "Retirada": muestra razonRetiro inline con banner de advertencia.
 * - Si categoria === null: muestra "Sin categoría" en texto secundario.
 * - Si nivelMaximo === null: NivelBadge renderiza "Sin clasificar".
 * - estado cast seguro: SemaforoIndicator acepta los mismos 3 valores que el DTO.
 *
 * Dependency Rule: importa solo de @/application/herramientas/dtos/ y
 * de componentes atómicos de @/presentation/components/.
 */

type EstadoHerramienta = "Activa" | "Retirada" | "Condicional";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
  /**
   * Nivel de filtro activo en la URL del catálogo.
   * Se propaga al link de detalle para que BackButton pueda recuperarlo.
   */
  nivelFiltroActivo?: string | null;
}

export default function ToolCard({ herramienta, nivelFiltroActivo }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } = herramienta;

  const esRetirada = estado === "Retirada";

  // Construir href del detalle preservando el filtro activo
  const detailHref = nivelFiltroActivo
    ? `/catalogo/${id}?nivel=${encodeURIComponent(nivelFiltroActivo)}`
    : `/catalogo/${id}`;

  // Cast seguro: el DTO define estado como string, pero solo puede ser uno de 3 valores
  const estadoTyped = (["Activa", "Retirada", "Condicional"].includes(estado)
    ? estado
    : "Activa") as EstadoHerramienta;

  return (
    <article
      className={`rounded-lg bg-white border shadow-sm p-6 flex flex-col gap-4 transition-shadow hover:shadow-md ${
        esRetirada ? "border-red-200 opacity-80" : "border-[#E2E8E0]"
      }`}
    >
      {/* Cabecera: nombre + semáforo */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={detailHref}
          className="text-base font-semibold text-[#383838] hover:text-[#86B81C] transition-colors leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C] focus-visible:ring-offset-1 rounded"
        >
          {nombre}
        </Link>
        <SemaforoIndicator estado={estadoTyped} />
      </div>

      {/* Proveedor */}
      <p className="text-sm text-[#6B7280] -mt-2">
        {proveedor}
      </p>

      {/* Categoría y nivel */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Categoría */}
        <span className="text-xs text-[#6B7280]">
          {categoria ?? "Sin categoría"}
        </span>

        {/* Separador visual */}
        {categoria && (
          <span aria-hidden="true" className="text-[#E2E8E0]">·</span>
        )}

        {/* Nivel máximo */}
        <NivelBadge nivel={nivelMaximo} />
      </div>

      {/* Banner de herramienta retirada — US-05: mensaje de advertencia visible sin navegar al detalle */}
      {esRetirada && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"
        >
          <p className="font-semibold">
            Esta herramienta NO está autorizada. No la utilice con datos de LAG.
          </p>
          {razonRetiro && (
            <p className="mt-1">Motivo: {razonRetiro}</p>
          )}
        </div>
      )}

      {/* Link de detalle accesible en la parte inferior */}
      <div className="mt-auto pt-2 border-t border-[#E2E8E0]">
        <Link
          href={detailHref}
          className="text-xs font-medium text-[#5C8314] hover:text-[#86B81C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C] focus-visible:ring-offset-1 rounded"
          aria-label={`Ver detalle de ${nombre}`}
        >
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
