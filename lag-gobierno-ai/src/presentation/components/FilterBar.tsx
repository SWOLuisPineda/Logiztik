"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { NIVELES_CLASIFICACION_OPTIONS } from "@/presentation/validations/herramienta.validation";

interface FilterBarProps {
  sinNivelCount?: number;
}

/**
 * Barra de filtros interactiva para el catálogo.
 * Dropdown de nivel de clasificación. Actualiza URL con searchParams.
 * Label accesible asociado al select.
 *
 * H7: Cuando hay filtro activo y existen herramientas sin nivel asignado,
 * muestra un aviso informativo con el conteo.
 */
export function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentNivel = searchParams.get("nivel") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("nivel", value);
    } else {
      params.delete("nivel");
    }

    router.push(`/catalogo?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label
          htmlFor="filter-nivel"
          className="text-sm font-medium text-[#383838]"
        >
          Nivel de clasificación:
        </label>
        <select
          id="filter-nivel"
          value={currentNivel}
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-2 text-sm text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#86B81C]/50 focus:border-[#86B81C]"
        >
          <option value="">Todos</option>
          {NIVELES_CLASIFICACION_OPTIONS.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>

      {/* H7: Aviso de herramientas sin nivel cuando hay filtro activo */}
      {currentNivel && sinNivelCount > 0 && (
        <p className="text-xs text-[#6B7280] italic">
          {sinNivelCount} herramienta{sinNivelCount !== 1 ? "s" : ""} sin nivel
          asignado no se muestra{sinNivelCount !== 1 ? "n" : ""} en este filtro.
        </p>
      )}
    </div>
  );
}
