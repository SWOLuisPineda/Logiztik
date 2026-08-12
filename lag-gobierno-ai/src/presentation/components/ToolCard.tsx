import Link from "next/link";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";

/**
 * ToolCard — Server Component
 *
 * Tarjeta individual de herramienta en el grid del catálogo.
 * - Link al detalle (/catalogo/[id])
 * - Semáforo visual de estado
 * - Badge de nivel de clasificación (null → "Sin clasificar")
 * - Categoría null → "Sin categoría"
 * - Herramienta Retirada → muestra razón de retiro inline con borde/fondo rojo
 *
 * Restricción de tipos: estado y nivelMaximo del DTO son `string | null`
 * (el DTO de Application no importa los value objects del Domain).
 * Se hace cast seguro en render — los valores válidos provienen de la BD
 * y ya fueron validados por el mapper de Infrastructure.
 */

type EstadoHerramienta = "Activa" | "Condicional" | "Retirada";
type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

export function ToolCard({ herramienta }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  const estaRetirada = estado === "Retirada";

  return (
    <article
      className={[
        "flex flex-col rounded-lg border bg-white shadow-sm p-6 transition-shadow hover:shadow-md",
        estaRetirada ? "border-red-200" : "border-[#E2E8E0]",
      ].join(" ")}
      aria-label={`Herramienta: ${nombre}`}
    >
      {/* ── Cabecera: nombre + semáforo ───────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/catalogo/${id}`}
          className="flex-1 min-w-0 text-base font-semibold text-[#383838] hover:text-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-1 rounded transition-colors line-clamp-2"
          aria-label={`Ver detalle de ${nombre}`}
        >
          {nombre}
        </Link>
        <div className="shrink-0 mt-0.5">
          <SemaforoIndicator estado={estado as EstadoHerramienta} />
        </div>
      </div>

      {/* ── Proveedor + categoría ─────────────────────────────────────── */}
      <div className="mt-3 space-y-1">
        <p className="text-sm text-[#6B7280]">
          <span className="font-medium text-[#383838]">Proveedor:</span>{" "}
          {proveedor}
        </p>
        <p className="text-sm text-[#6B7280]">
          <span className="font-medium text-[#383838]">Categoría:</span>{" "}
          {categoria ?? (
            <span className="italic text-gray-400">Sin categoría</span>
          )}
        </p>
      </div>

      {/* ── Nivel de clasificación ────────────────────────────────────── */}
      <div className="mt-4">
        <NivelBadge nivel={nivelMaximo as NivelClasificacion | null} />
      </div>

      {/* ── Razón de retiro (solo si Retirada) ───────────────────────── */}
      {estaRetirada && razonRetiro && (
        <div
          className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2"
          role="note"
          aria-label="Razón de retiro"
        >
          <p className="text-xs font-medium text-red-700 mb-0.5">
            Razón de retiro
          </p>
          <p className="text-xs text-red-600 line-clamp-3">{razonRetiro}</p>
        </div>
      )}

      {/* ── Link "Ver detalle" al pie ─────────────────────────────────── */}
      <div className="mt-auto pt-4">
        <Link
          href={`/catalogo/${id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#5C8314] hover:text-[#383838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-1 rounded"
          tabIndex={-1}
          aria-hidden="true"
        >
          Ver detalle
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
