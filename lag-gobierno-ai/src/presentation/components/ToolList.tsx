/**
 * Task 25 — ToolList
 *
 * Grid responsivo de tarjetas de herramientas.
 * Layout: 1 col en mobile, 2 cols en tablet, 3 cols en desktop.
 * Si está vacío, renderiza EmptyState.
 *
 * H11 (design.md): Si el listado contiene herramientas Retiradas, muestra
 * banner de advertencia de gobernanza encima del grid.
 *
 * Server Component — recibe array de herramientas como props.
 */

import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";
import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
}

export function ToolList({ herramientas }: ToolListProps) {
  if (herramientas.length === 0) {
    return (
      <EmptyState
        message="No se encontraron herramientas."
        description="Prueba con otro nivel de clasificación o elimina el filtro."
      />
    );
  }

  const hayRetiradas = herramientas.some((h) => h.estado === "Retirada");

  return (
    <div>
      {/* H11: Banner de gobernanza cuando el listado incluye herramientas retiradas */}
      {hayRetiradas && (
        <div
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          role="alert"
        >
          <svg
            className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos de LAG.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((herramienta) => (
          <ToolCard key={herramienta.id} herramienta={herramienta} />
        ))}
      </div>
    </div>
  );
}
