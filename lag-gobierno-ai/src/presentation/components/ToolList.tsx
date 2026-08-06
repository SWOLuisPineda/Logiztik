import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import ToolCard from "./ToolCard";
import EmptyState from "./EmptyState";

/**
 * Task 25 — ToolList
 *
 * Server Component. Grid responsivo de tarjetas de herramientas.
 *
 * - Grid: 1 col mobile → 2 col tablet → 3 col desktop.
 * - Array vacío → renderiza EmptyState.
 * - Si hay filtro activo y estado incluye "Retirada": muestra banner de
 *   advertencia de gobernanza (design.md §H11).
 * - nivelFiltroActivo se propaga a cada ToolCard para que el link al detalle
 *   preserve el filtro y BackButton pueda recuperarlo.
 *
 * Dependency Rule: importa solo de @/application/herramientas/dtos/ y
 * componentes atómicos de @/presentation/components/.
 */

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
  /**
   * Nivel de filtro activo. Se propaga a ToolCard → link detalle → BackButton.
   */
  nivelFiltroActivo?: string | null;
  /**
   * Estado de filtro activo. Si incluye "Retirada" se muestra banner de
   * advertencia de gobernanza.
   */
  estadoFiltroActivo?: string | null;
}

export default function ToolList({
  herramientas,
  nivelFiltroActivo,
  estadoFiltroActivo,
}: ToolListProps) {
  if (herramientas.length === 0) {
    return (
      <EmptyState
        mensaje={
          nivelFiltroActivo
            ? `No hay herramientas autorizadas para el nivel "${nivelFiltroActivo}".`
            : "No hay herramientas registradas actualmente."
        }
      />
    );
  }

  const mostrarBannerRetiradas =
    estadoFiltroActivo === "Retirada" ||
    herramientas.every((h) => h.estado === "Retirada");

  return (
    <section aria-label="Listado de herramientas AI">
      {/* Banner de advertencia de gobernanza (design.md §H11) */}
      {mostrarBannerRetiradas && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p>
            <strong>Estás viendo herramientas NO autorizadas.</strong>{" "}
            No deben usarse con datos de LAG.
          </p>
        </div>
      )}

      {/* Contador de resultados */}
      <p className="mb-4 text-sm text-[#6B7280]" aria-live="polite">
        {herramientas.length === 1
          ? "1 herramienta encontrada"
          : `${herramientas.length} herramientas encontradas`}
      </p>

      {/* Grid responsivo: 1 → 2 → 3 columnas */}
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-label="Herramientas"
      >
        {herramientas.map((herramienta) => (
          <li key={herramienta.id}>
            <ToolCard
              herramienta={herramienta}
              nivelFiltroActivo={nivelFiltroActivo}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
