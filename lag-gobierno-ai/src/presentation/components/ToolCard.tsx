import Link from "next/link";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface ToolCardProps {
  readonly herramienta: HerramientaListItemDto;
  /** Query param ?nivel= activo, para preservarlo en el link al detalle. */
  readonly nivelActivo?: string;
}

/**
 * Tarjeta de herramienta en el listado del catálogo.
 *
 * Server Component — sin interactividad.
 *
 * Patrón "card linkeable":
 * - <article> como contenedor (no <Link>) — HTML válido, permite contenido de bloque
 * - El <Link> vive solo dentro del <h3> con after:absolute after:inset-0
 * - El pseudo-elemento ::after expande el área clickeable a toda la card
 * - El resto del contenido NO está dentro del <a> — evita anidado inválido
 * - Sin aria-label en el <Link>: el texto del <h3> es el nombre accesible del enlace
 *
 * Jerarquía heading:
 * - <section aria-label="Listado..."> en ToolList actúa como h2 implícito
 * - Cada card usa <h3> (nivel correcto dentro del section)
 */
export function ToolCard({ herramienta, nivelActivo }: ToolCardProps) {
  const {
    id,
    nombre,
    proveedor,
    categoria,
    nivelMaximo,
    estado,
    razonRetiro,
  } = herramienta;

  const estaRetirada = estado === "Retirada";

  const href = nivelActivo
    ? `/catalogo/${id}?nivel=${encodeURIComponent(nivelActivo)}`
    : `/catalogo/${id}`;

  return (
    <article
      className={[
        "relative rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6",
        "hover:border-[#86B81C] hover:shadow-md transition-all duration-150",
        // focus-within para que el foco del Link hijo sea visible en la card
        "focus-within:ring-2 focus-within:ring-[#86B81C] focus-within:ring-offset-2",
        estaRetirada ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Cabecera: nombre (link expandido a toda la card) + semáforo */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-[#383838] leading-snug">
          {/*
           * after:absolute after:inset-0 expande el área clickeable del link
           * a toda la surface del <article> sin anidar contenido de bloque en <a>.
           */}
          <Link
            href={href}
            className="hover:text-[#5C8314] transition-colors focus:outline-none after:absolute after:inset-0"
          >
            {nombre}
          </Link>
        </h3>
        {/* SemaforoIndicator fuera del <a> — HTML válido, accesible por separado */}
        <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
          <SemaforoIndicator estado={estado as EstadoHerramienta} />
        </span>
      </div>

      {/* Proveedor */}
      <p className="text-sm text-[#6B7280] mb-3">{proveedor}</p>

      {/* Categoría + Nivel */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#6B7280] bg-[#F5F7F0] rounded-full px-2.5 py-0.5">
          {categoria ?? "Sin categoría"}
        </span>
        <NivelBadge nivel={nivelMaximo as NivelClasificacion | null} />
      </div>

      {/* Razón de retiro — fuera del <a>, HTML válido */}
      {estaRetirada && razonRetiro && (
        <p className="mt-3 text-xs text-red-600 border-t border-red-100 pt-2">
          <span className="font-medium">Motivo de retiro:</span>{" "}
          {razonRetiro}
        </p>
      )}
    </article>
  );
}
