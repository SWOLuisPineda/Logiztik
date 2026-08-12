import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  /** H11: Si true, muestra banner de gobernanza sobre los resultados. */
  mostrandoRetiradas?: boolean;
}

/**
 * Grid responsivo de tarjetas de herramientas.
 * 3 columnas en lg, 2 en md, 1 en mobile. Vacío → EmptyState.
 *
 * H11: Cuando se muestran herramientas retiradas, renderiza un banner de advertencia
 * de gobernanza por encima de los resultados.
 */
export function ToolList({ herramientas, mostrandoRetiradas = false }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* H11: Banner de gobernanza cuando se muestran herramientas retiradas */}
      {mostrandoRetiradas && (
        <div
          className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3"
          role="alert"
          aria-label="Advertencia de gobernanza"
        >
          <svg
            className="h-5 w-5 text-[#DC2626] mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos de LAG.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((h) => (
          <ToolCard key={h.id} herramienta={h} />
        ))}
      </div>
    </>
  );
}
