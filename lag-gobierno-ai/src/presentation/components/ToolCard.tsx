import Link from "next/link";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

/**
 * Tarjeta individual de herramienta en el listado.
 * Incluye semáforo, badge de nivel, y link al detalle.
 * Si retirada, muestra razón de retiro inline.
 *
 * Accesibilidad: La card usa un link principal con aria-label descriptivo.
 * Internal content has z-10 to sit above the pseudo-element overlay.
 */
export function ToolCard({ herramienta }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  return (
    <article className="relative rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 h-full transition-shadow hover:shadow-md">
      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-bold text-[#383838] leading-tight">
          <Link
            href={`/catalogo/${id}`}
            className="after:absolute after:inset-0 after:z-0 hover:text-[#5C8314] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C]/50 focus:ring-offset-2 rounded"
            aria-label={`Ver detalle de ${nombre} — ${estado}`}
          >
            {nombre}
          </Link>
        </h3>
        <SemaforoIndicator estado={estado} />
      </div>

      <div className="relative z-10">
        <p className="text-sm text-[#6B7280] mb-3">{proveedor}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#6B7280]">
            {categoria ?? "Sin categoría"}
          </span>
          <NivelBadge nivel={nivelMaximo} />
        </div>

        {estado === "Retirada" && razonRetiro && (
          <p className="mt-3 text-sm text-[#DC2626] border-t border-[#E2E8E0] pt-3">
            Razón de retiro: {razonRetiro}
          </p>
        )}
      </div>
    </article>
  );
}
