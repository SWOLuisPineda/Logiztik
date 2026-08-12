/**
 * ToolList — Server Component
 *
 * Renderiza un grid responsivo de ToolCards.
 * Si la lista está vacía, muestra el EmptyState.
 * Si hay herramientas retiradas, muestra un banner de advertencia (H11).
 */

import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import ToolCard from "./ToolCard";
import EmptyState from "./EmptyState";

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
}

export default function ToolList({ herramientas }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  const hayRetiradas = herramientas.some((h) => h.estado === "Retirada");

  return (
    <div className="space-y-4">
      {hayRetiradas && (
        <div
          className="bg-red-50 border border-[#DC2626] rounded-lg p-4 flex items-start gap-3"
          role="alert"
        >
          <span className="text-[#DC2626] text-lg" aria-hidden="true">⚠️</span>
          <p className="text-sm text-[#DC2626] font-medium">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos de LAG.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((h) => (
          <ToolCard key={h.id} herramienta={h} />
        ))}
      </div>
    </div>
  );
}
