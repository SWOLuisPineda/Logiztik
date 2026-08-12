import Link from "next/link";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { SemaforoIndicator } from "./SemaforoIndicator";
import { NivelBadge } from "./NivelBadge";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
  nivelActivo?: string;
}

/**
 * Tarjeta individual de herramienta en el listado.
 * Incluye semáforo visual, nivel badge y link al detalle.
 * Si retirada, muestra razón de retiro inline.
 * Si categoría es null, muestra "Sin categoría".
 */
export function ToolCard({ herramienta, nivelActivo }: ToolCardProps) {
  const { id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro } =
    herramienta;

  const detailHref = nivelActivo
    ? `/catalogo/${id}?nivel=${nivelActivo}`
    : `/catalogo/${id}`;

  return (
    <Link
      href={detailHref}
      className="block rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-[#383838] leading-tight">
            {nombre}
          </h3>
          <NivelBadge nivel={nivelMaximo as NivelClasificacion | null} />
        </div>

        <p className="text-sm text-[#6B7280]">{proveedor}</p>

        <p className="text-sm text-[#6B7280]">
          {categoria ?? "Sin categoría"}
        </p>

        <SemaforoIndicator estado={estado as EstadoHerramienta} />

        {estado === "Retirada" && razonRetiro && (
          <p className="text-sm text-red-600 mt-1">
            Razón: {razonRetiro}
          </p>
        )}
      </div>
    </Link>
  );
}
