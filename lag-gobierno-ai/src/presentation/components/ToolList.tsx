import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";

interface ToolListProps {
  readonly herramientas: HerramientaListItemDto[];
  /** Query param ?nivel= activo, se propaga a cada ToolCard para los links. */
  readonly nivelActivo?: string;
}

/**
 * Grid responsivo de tarjetas de herramientas.
 *
 * Server Component — recibe los datos ya resueltos desde CatalogoPage.
 * Delega el caso vacío a EmptyState.
 */
export function ToolList({ herramientas, nivelActivo }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-label="Listado de herramientas AI autorizadas">
      <p className="text-sm text-[#6B7280] mb-4">
        {herramientas.length}{" "}
        {herramientas.length === 1 ? "herramienta" : "herramientas"} encontradas
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((herramienta) => (
          <li key={herramienta.id}>
            <ToolCard herramienta={herramienta} nivelActivo={nivelActivo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
