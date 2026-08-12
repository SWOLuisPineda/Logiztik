import { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import { ToolCard } from "./ToolCard";
import { EmptyState } from "./EmptyState";

/**
 * ToolList — Server Component
 *
 * Grid responsivo de tarjetas de herramientas.
 * - 3 columnas en lg, 2 en md, 1 en mobile (mobile-first).
 * - Vacío → EmptyState.
 * - Si al menos una herramienta en la lista tiene estado "Retirada",
 *   muestra un banner de advertencia de gobernanza por encima del grid.
 *   (H11 del design.md: se activa cuando el set visible contiene retiradas,
 *    típicamente cuando hay filtro ?estado=Retirada o sin filtro con retiradas mezcladas.)
 *
 * La lógica de ordenación (Activas → Condicionales → Retiradas, nombre ASC)
 * la aplica el repositorio, no este componente.
 */

interface ToolListProps {
  herramientas: HerramientaListItemDto[];
}

export function ToolList({ herramientas }: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  const hayRetiradas = herramientas.some((h) => h.estado === "Retirada");

  return (
    <section aria-label="Listado de herramientas AI aprobadas">
      {/* ── Banner de advertencia de gobernanza (H11) ────────────────── */}
      {hayRetiradas && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3"
          role="alert"
          aria-live="assertive"
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Estás viendo herramientas{" "}
            <strong>NO autorizadas</strong>. No deben usarse con datos de LAG.
          </p>
        </div>
      )}

      {/* ── Grid de tarjetas ─────────────────────────────────────────── */}
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label={`${herramientas.length} herramienta${herramientas.length !== 1 ? "s" : ""} encontrada${herramientas.length !== 1 ? "s" : ""}`}
      >
        {herramientas.map((herramienta) => (
          <li key={herramienta.id} role="listitem">
            <ToolCard herramienta={herramienta} />
          </li>
        ))}
      </ul>

      {/* ── Conteo al pie ────────────────────────────────────────────── */}
      <p
        className="mt-6 text-right text-xs text-[#6B7280]"
        aria-live="polite"
      >
        {herramientas.length} herramienta{herramientas.length !== 1 ? "s" : ""}
      </p>
    </section>
  );
}
