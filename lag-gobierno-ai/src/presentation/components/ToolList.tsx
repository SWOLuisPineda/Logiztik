import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";

/**
 * ToolList — Server Component
 *
 * Renderiza el grid de tarjetas de herramientas.
 * Grid responsivo: 1 col (mobile) → 2 cols (md) → 3 cols (lg).
 * Si no hay herramientas, muestra EmptyState.
 *
 * H11: Si filtroEstado incluye "Retirada", renderiza un banner de advertencia
 * de gobernanza por encima de los resultados.
 */

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  /** H11: El filtro de estado activo — si incluye "Retirada", muestra banner */
  filtroEstado?: string;
}

export function ToolList({ herramientas, filtroEstado }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  const mostrarBannerGobernanza = filtroEstado === "Retirada";

  return (
    <section aria-label="Listado de herramientas AI aprobadas">
      {/* H11: Banner de gobernanza */}
      {mostrarBannerGobernanza && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos
            de LAG.
          </p>
        </div>
      )}

      <p className="mb-4 text-sm text-[#6B7280]">
        {herramientas.length}{" "}
        {herramientas.length === 1 ? "herramienta" : "herramientas"}
      </p>
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0"
        role="list"
        aria-label="Herramientas del catálogo"
      >
        {herramientas.map((herramienta) => (
          <li key={herramienta.id}>
            <ToolCard herramienta={herramienta} />
          </li>
        ))}
      </ul>
    </section>
  );
}
