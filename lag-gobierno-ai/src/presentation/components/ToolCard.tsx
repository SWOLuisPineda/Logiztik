/**
 * Task 24 — ToolCard
 *
 * Tarjeta individual de herramienta en el grid del catálogo.
 * Incluye: nombre, proveedor, categoría, nivel (badge), semáforo.
 * Si está retirada, muestra razón de retiro inline.
 *
 * Server Component — sin interactividad. Link al detalle es navegación SSR.
 */

import Link from "next/link";
import { NivelBadge } from "./NivelBadge";
import { SemaforoIndicator } from "./SemaforoIndicator";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

interface ToolCardProps {
  herramienta: HerramientaListItemDto;
}

export function ToolCard({ herramienta }: ToolCardProps) {
  return (
    <Link href={`/catalogo/${herramienta.id}`}>
      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
        {/* Header: Nombre + Semáforo */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-[#383838] flex-1 line-clamp-2">
            {herramienta.nombre}
          </h3>
          <div className="flex-shrink-0">
            <SemaforoIndicator
              estado={herramienta.estado}
              showSubtext={false}
            />
          </div>
        </div>

        {/* Proveedor */}
        <p className="text-sm text-[#6B7280] mb-2">{herramienta.proveedor}</p>

        {/* Categoría */}
        <p className="text-xs text-[#6B7280] mb-3">
          <span className="font-medium">Categoría:</span>{" "}
          {herramienta.categoria ?? "Sin categoría"}
        </p>

        {/* Nivel Badge */}
        <div className="mb-3">
          <NivelBadge nivel={herramienta.nivelMaximo} />
        </div>

        {/* Razón de retiro (si aplica) */}
        {herramienta.estado === "Retirada" && herramienta.razonRetiro && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-700">
              <span className="font-medium">Razón de retiro:</span>{" "}
              {herramienta.razonRetiro}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
