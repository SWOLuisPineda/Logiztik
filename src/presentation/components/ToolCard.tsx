import Link from "next/link";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import SemaforoIndicator from "./SemaforoIndicator";
import NivelBadge from "./NivelBadge";

/**
 * ToolCard — Tarjeta individual de herramienta en el listado.
 *
 * Server Component. Muestra nombre, proveedor, semáforo, nivel badge.
 * Si retirada: muestra razón de retiro inline con estilo advertencia.
 * Si categoría null: muestra "Sin categoría".
 * Link al detalle: /catalogo/[id]
 */

interface ToolCardProps {
  readonly herramienta: HerramientaListItemDto;
  readonly nivel?: string;
}

export default function ToolCard({ herramienta, nivel }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;
  const href = nivel
    ? `/catalogo/${id}?nivel=${encodeURIComponent(nivel)}`
    : `/catalogo/${id}`;

  return (
    <Link
      href={href}
      className="rounded-lg bg-white border border-lag-border shadow-sm p-6 block hover:shadow-md hover:border-brand-primary/40 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-lag-text-primary leading-tight">
          {nombre}
        </h3>
        <SemaforoIndicator estado={estado} />
      </div>

      <p className="text-sm text-lag-text-secondary mb-2">{proveedor}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <NivelBadge nivel={nivelMaximo} />
        <span className="text-xs text-lag-text-secondary">
          {categoria ?? "Sin categoría"}
        </span>
      </div>

      {estado === "Retirada" && razonRetiro && (
        <p className="mt-3 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
          Razón de retiro: {razonRetiro}
        </p>
      )}
    </Link>
  );
}
