"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * FilterBar — Client Component
 *
 * Barra de filtros por nivel de clasificación.
 * - Seleccionar un nivel → agrega ?nivel=X a la URL (SSR-friendly).
 * - Seleccionar "Todos"  → elimina el param ?nivel de la URL.
 * - Preserva otros query params existentes.
 * - Label accesible asociado al select vía htmlFor.
 *
 * sinNivelCount: número de herramientas sin nivel asignado en el set actual.
 * Cuando hay un filtro activo y sinNivelCount > 0, muestra aviso informativo.
 */

const NIVELES = ["Publica", "Interna", "Confidencial", "Restringida"] as const;

interface FilterBarProps {
  sinNivelCount?: number;
}

export function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivelActual = searchParams.get("nivel") ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      // Construir nueva URL preservando otros params
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("nivel", value);
      } else {
        params.delete("nivel");
      }

      const query = params.toString();
      router.push(query ? `/catalogo?${query}` : "/catalogo");
    },
    [router, searchParams]
  );

  const hayFiltroActivo = nivelActual !== "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="filtro-nivel"
          className="text-sm font-medium text-[#383838]"
        >
          Filtrar por nivel de clasificación:
        </label>
        <select
          id="filtro-nivel"
          name="nivel"
          value={nivelActual}
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-1.5 text-sm text-[#383838] shadow-sm focus:border-[#86B81C] focus:outline-none focus:ring-2 focus:ring-[#86B81C]/30 transition-colors"
          aria-label="Selecciona el nivel de clasificación para filtrar herramientas"
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>

      {/* Aviso informativo: herramientas sin nivel excluidas del filtro actual */}
      {hayFiltroActivo && sinNivelCount > 0 && (
        <p
          className="text-xs text-[#6B7280]"
          role="note"
          aria-live="polite"
        >
          {sinNivelCount} herramienta{sinNivelCount !== 1 ? "s" : ""} sin nivel
          asignado no se muestra{sinNivelCount !== 1 ? "n" : ""} en este filtro.
        </p>
      )}
    </div>
  );
}
