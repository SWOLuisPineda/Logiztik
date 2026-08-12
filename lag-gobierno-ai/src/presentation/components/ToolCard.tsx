import Link from "next/link";
import SemaforoIndicator from "./SemaforoIndicator";
import NivelBadge from "./NivelBadge";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

/**
 * ToolCard — Tarjeta individual de herramienta en el listado.
 *
 * Server Component. Incluye semáforo visual y link al detalle.
 * Si retirada, muestra razón de retiro inline.
 * Nulls: categoria null → "Sin categoría".
 */

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
  currentNivel?: string;
}

export default function ToolCard({ herramienta, currentNivel }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  const detailHref = currentNivel
    ? `/catalogo/${id}?nivel=${currentNivel}`
    : `/catalogo/${id}`;

  return (
    <Link
      href={detailHref}
      className="block rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
      aria-label={`Ver detalle de ${nombre}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-[#383838] line-clamp-2">
          {nombre}
        </h3>
        <SemaforoIndicator estado={estado} />
      </div>

      <p className="text-sm text-[#6B7280] mb-2">{proveedor}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-[#6B7280]">
          {categoria ?? "Sin categoría"}
        </span>
        <span className="text-[#6B7280]" aria-hidden="true">
          ·
        </span>
        <NivelBadge nivel={nivelMaximo} />
      </div>

      {estado === "Retirada" && razonRetiro && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1">
          {razonRetiro}
        </p>
      )}
    </Link>
  );
}
