import ToolCard from "./ToolCard";
import EmptyState from "./EmptyState";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

/**
 * ToolList — Grid responsivo de herramientas.
 *
 * Server Component. 3 columnas en lg, 2 en md, 1 en mobile.
 * Si la lista está vacía, renderiza EmptyState.
 * H11: Si el listado contiene herramientas retiradas, muestra banner de advertencia.
 */

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  showRetiredWarning?: boolean;
  currentNivel?: string;
}

export default function ToolList({
  herramientas,
  showRetiredWarning = false,
  currentNivel,
}: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {showRetiredWarning && (
        <div
          className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <svg
            className="h-5 w-5 flex-shrink-0 text-[#DC2626]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm font-medium text-[#DC2626]">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos
            de LAG.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((herramienta) => (
          <ToolCard
            key={herramienta.id}
            herramienta={herramienta}
            currentNivel={currentNivel}
          />
        ))}
      </div>
    </div>
  );
}
