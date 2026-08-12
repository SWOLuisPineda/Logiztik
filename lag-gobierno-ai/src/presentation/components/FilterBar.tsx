"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Valores válidos de nivel de clasificación (duplicados aquí para respetar Dependency Rule:
 * Presentation no importa de Domain directamente).
 */
const NIVELES_CLASIFICACION = [
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
] as const;

interface FilterBarProps {
  sinNivelCount?: number;
}

/**
 * Barra de filtros interactiva. Dropdown de nivel de clasificación.
 * Mantiene estado de filtro con useSearchParams. Label accesible asociado al select.
 * H7: Muestra aviso informativo sobre herramientas sin nivel asignado.
 */
export function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentNivel = searchParams.get("nivel") ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("nivel", value);
      } else {
        params.delete("nivel");
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label
          htmlFor="filtro-nivel"
          className="text-sm font-medium text-[#383838]"
        >
          Filtrar por nivel:
        </label>
        <select
          id="filtro-nivel"
          value={currentNivel}
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-2 text-sm text-[#383838] focus:border-[#86B81C] focus:outline-none focus:ring-1 focus:ring-[#86B81C]"
        >
          <option value="">Todos</option>
          {NIVELES_CLASIFICACION.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>
      {currentNivel && sinNivelCount > 0 && (
        <p className="text-xs text-[#6B7280]" role="note">
          {sinNivelCount} herramienta(s) sin nivel asignado no se muestran en
          este filtro.
        </p>
      )}
    </div>
  );
}
