import Link from "next/link";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

/**
 * Tarjeta individual de herramienta en el listado.
 * Incluye semáforo visual y link al detalle.
 * Si retirada, muestra razón de retiro inline. Null → "Sin categoría".
 */
export function ToolCard({ herramienta }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  return (
    <Link
      href={`/catalogo/${id}`}
      className="block rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 hover:shadow-md hover:border-[#86B81C]/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[#383838] font-semibold text-base leading-tight">
          {nombre}
        </h3>
        <SemaforoIndicator estado={estado} />
      </div>

      <p className="text-[#6B7280] text-sm mb-2">{proveedor}</p>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-xs text-[#6B7280]">
          {categoria ?? "Sin categoría"}
        </span>
        <span className="text-[#E2E8E0]" aria-hidden="true">
          ·
        </span>
        <NivelBadge nivel={nivelMaximo} />
      </div>

      {estado === "Retirada" && razonRetiro && (
        <p className="text-xs text-red-700 bg-red-50 rounded px-2 py-1 mt-2">
          {razonRetiro}
        </p>
      )}
    </Link>
  );
}
