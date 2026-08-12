import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";
import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  showRetiredBanner?: boolean;
}

/**
 * Grid responsivo de herramientas. Si vacío, renderiza EmptyState.
 * H11: Si se están mostrando herramientas retiradas, muestra banner de advertencia.
 */
export function ToolList({ herramientas, showRetiredBanner = false }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {showRetiredBanner && (
        <div
          className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 mb-4"
          role="alert"
        >
          <svg
            className="h-5 w-5 text-[#DC2626] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos
            de LAG.
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
