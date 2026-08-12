import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  nivelActivo?: string;
}

/**
 * Grid responsivo de tarjetas de herramientas.
 * 3 columnas en lg, 2 en md, 1 en mobile.
 * Si el array está vacío, renderiza EmptyState.
 */
export function ToolList({ herramientas, nivelActivo }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {herramientas.map((herramienta) => (
        <ToolCard key={herramienta.id} herramienta={herramienta} nivelActivo={nivelActivo} />
      ))}
    </div>
  );
}
