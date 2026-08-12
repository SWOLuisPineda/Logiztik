/**
 * ToolCard — Server Component
 *
 * Tarjeta clickable que muestra el resumen de una herramienta en el catálogo.
 * Muestra nombre, proveedor, categoría, nivel de clasificación y estado (semáforo).
 * Si la herramienta está retirada, muestra la razón de retiro.
 */

import Link from "next/link";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import SemaforoIndicator from "./SemaforoIndicator";
import NivelBadge from "./NivelBadge";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

export default function ToolCard({ herramienta }: ToolCardProps) {
  return (
    <Link
      href={`/catalogo/${herramienta.id}`}
      className="block rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-[#383838]">{herramienta.nombre}</h3>
      <p className="text-sm text-[#6B7280] mt-1">{herramienta.proveedor}</p>
      <p className="text-sm text-[#6B7280] mt-1">
        {herramienta.categoria ?? <span className="italic">Sin categoría</span>}
      </p>
      <div className="flex items-center justify-between mt-4">
        <NivelBadge nivel={herramienta.nivelMaximo} />
        <SemaforoIndicator estado={herramienta.estado as "Activa" | "Retirada" | "Condicional"} />
      </div>
      {herramienta.estado === "Retirada" && herramienta.razonRetiro && (
        <p className="text-sm italic text-[#DC2626] mt-3">
          {herramienta.razonRetiro}
        </p>
      )}
    </Link>
  );
}
