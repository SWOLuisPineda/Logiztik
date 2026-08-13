import type { HerramientaListItemDto } from "@/application/herramientas/dtos/herramienta-list-item.dto";
import ToolCard from "./ToolCard";
import EmptyState from "./EmptyState";

/**
 * ToolList — Grid responsivo de herramientas.
 *
 * Server Component. Renderiza ToolCard por cada herramienta.
 * Si array vacío → EmptyState.
 * H11: Si hay herramientas retiradas visibles, muestra banner de gobernanza.
 * H7: Si hay filtro activo y existen herramientas sin nivel, muestra aviso informativo.
 * Grid: 1 col mobile, 2 col tablet, 3 col desktop.
 */

interface ToolListProps {
  readonly herramientas: HerramientaListItemDto[];
  readonly sinNivelCount?: number;
  readonly filtroNivelActivo?: boolean;
  readonly nivelSeleccionado?: string;
}

export default function ToolList({
  herramientas,
  sinNivelCount = 0,
  filtroNivelActivo = false,
  nivelSeleccionado,
}: ToolListProps) {
  if (herramientas.length === 0) {
    return <EmptyState />;
  }

  const hayRetiradas = herramientas.some((h) => h.estado === "Retirada");

  return (
    <div className="space-y-4">
      {/* H11: Banner de gobernanza cuando se muestran herramientas retiradas */}
      {hayRetiradas && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-[#DC2626] shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-700 font-medium">
            Estás viendo herramientas NO autorizadas. No deben usarse con datos
            de LAG.
          </p>
        </div>
      )}

      {/* H7: Aviso cuando hay filtro de nivel activo y herramientas sin nivel existen */}
      {filtroNivelActivo && sinNivelCount > 0 && (
        <p className="text-sm text-[#6B7280]">
          {sinNivelCount} herramienta{sinNivelCount > 1 ? "s" : ""} sin nivel
          asignado no se muestra{sinNivelCount > 1 ? "n" : ""} en este filtro.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herramientas.map((herramienta) => (
          <ToolCard
            key={herramienta.id}
            herramienta={herramienta}
            nivel={nivelSeleccionado}
          />
        ))}
      </div>
    </div>
  );
}
