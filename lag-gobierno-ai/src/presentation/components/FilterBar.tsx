"use client";

/**
 * Task 23 — FilterBar
 *
 * Barra de filtros interactiva para el catálogo.
 * Dropdown de nivel de clasificación con label accesible.
 *
 * Flujo CC→SC (H4 del design.md):
 * 1. Usuario cambia el select → onChange llama router.push con ?nivel=X
 * 2. Next.js re-ejecuta CatalogoPage (SC) con los nuevos searchParams
 * 3. CatalogoPage obtiene datos filtrados del handler y renderiza ToolList
 * No hay fetch desde cliente. El filtrado es 100% SSR.
 *
 * "Todos" remueve el param nivel de la URL.
 * sinNivelCount: si > 0 y hay filtro activo, muestra aviso informativo.
 *
 * Client Component — necesita useRouter() + useSearchParams().
 */

import { useRouter, useSearchParams } from "next/navigation";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

const NIVEL_LABELS: Record<string, string> = {
  Publica: "Pública",
  Interna: "Interna",
  Confidencial: "Confidencial",
  Restringida: "Restringida",
};

interface FilterBarProps {
  /** Cantidad de herramientas sin nivelMaximo en el catálogo completo. */
  sinNivelCount?: number;
}

export function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivelActual = searchParams.get("nivel") ?? "";

  function handleNivelChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value) {
      router.push(`/catalogo?nivel=${encodeURIComponent(value)}`);
    } else {
      router.push("/catalogo");
    }
  }

  const hayFiltroActivo = nivelActual !== "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <label
          htmlFor="filtro-nivel"
          className="text-sm font-medium text-[#383838] whitespace-nowrap"
        >
          Filtrar por nivel:
        </label>
        <select
          id="filtro-nivel"
          name="filtro-nivel"
          value={nivelActual}
          onChange={handleNivelChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-1.5 text-sm text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-1"
          aria-label="Filtrar herramientas por nivel de clasificación de datos"
        >
          <option value="">Todos los niveles</option>
          {NIVELES_CLASIFICACION.map((nivel) => (
            <option key={nivel} value={nivel}>
              {NIVEL_LABELS[nivel] ?? nivel}
            </option>
          ))}
        </select>
      </div>

      {/* Aviso informativo cuando hay herramientas sin clasificar excluidas del filtro */}
      {hayFiltroActivo && sinNivelCount > 0 && (
        <p
          className="text-xs text-[#6B7280]"
          role="note"
          aria-live="polite"
        >
          {sinNivelCount === 1
            ? "1 herramienta sin nivel asignado no se muestra en este filtro."
            : `${sinNivelCount} herramientas sin nivel asignado no se muestran en este filtro.`}
        </p>
      )}
    </div>
  );
}

export default FilterBar;
