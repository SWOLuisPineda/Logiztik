import Link from "next/link";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";

/**
 * ToolCard — Server Component
 *
 * Tarjeta individual de herramienta en el listado del catálogo.
 * Muestra: nombre, proveedor, categoría, nivel, semáforo.
 * Si la herramienta está retirada, muestra la razón de retiro inline.
 *
 * Props: HerramientaListItemDto (solo tipos de Application — Dependency Rule)
 */

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

export function ToolCard({ herramienta }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  const estaRetirada = estado === "Retirada";

  return (
    <article
      className={`rounded-lg bg-white border shadow-sm p-6 flex flex-col gap-3 transition-shadow hover:shadow-md ${
        estaRetirada ? "border-red-200 opacity-80" : "border-[#E2E8E0]"
      }`}
      aria-label={`Herramienta: ${nombre}`}
    >
      {/* Encabezado: semáforo + nombre */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/catalogo/${id}`}
          className="group flex-1 min-w-0"
          aria-label={`Ver detalle de ${nombre}`}
        >
          <h2 className="text-base font-semibold text-[#383838] group-hover:text-[#5C8314] transition-colors truncate">
            {nombre}
          </h2>
        </Link>
        <SemaforoIndicator estado={estado} size="sm" />
      </div>

      {/* Proveedor */}
      <p className="text-sm text-[#6B7280] truncate">
        <span className="sr-only">Proveedor: </span>
        {proveedor}
      </p>

      {/* Categoría */}
      <p className="text-sm text-[#383838]">
        <span className="font-medium">Categoría:</span>{" "}
        <span className={categoria ? "" : "text-[#6B7280] italic"}>
          {categoria ?? "Sin categoría"}
        </span>
      </p>

      {/* Nivel máximo */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#383838]">Nivel:</span>
        <NivelBadge nivel={nivelMaximo} />
      </div>

      {/* Razón de retiro — solo si está retirada */}
      {estaRetirada && razonRetiro && (
        <div
          role="note"
          className="mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-2"
        >
          <p className="text-xs font-medium text-red-700">Motivo de retiro:</p>
          <p className="text-xs text-red-600 mt-0.5">{razonRetiro}</p>
        </div>
      )}

      {/* Footer: link de detalle */}
      <div className="mt-auto pt-2 border-t border-[#E2E8E0]">
        <Link
          href={`/catalogo/${id}`}
          className="text-xs font-medium text-[#5C8314] hover:text-[#383838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-1 rounded"
          tabIndex={-1}
          aria-hidden="true"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
