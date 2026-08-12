"use client";

/**
 * FilterBar — Client Component
 *
 * Barra de filtros para el catálogo. Permite filtrar herramientas
 * por nivel de clasificación de datos.
 *
 * H7: Cuando hay un filtro de nivel activo y existen herramientas sin nivel,
 * muestra un aviso informativo debajo del select.
 *
 * Implementación:
 * - El filtro viaja como ?nivel=X en la URL (SSR-compatible, URLs compartibles)
 * - useSearchParams lee el valor activo
 * - useRouter.push() actualiza la URL sin recargar la página
 * - "Todos" elimina el param nivel de la URL
 * - Label visible asociado al select para WCAG AA
 */

import { useRouter, useSearchParams } from "next/navigation";
import {
  NIVELES_CLASIFICACION,
  NIVEL_LABELS,
} from "@/presentation/constants/niveles";

interface FilterBarProps {
  /** H7: Cantidad de herramientas con nivelMaximo=null en el catálogo total */
  sinNivelCount?: number;
}

export function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivelActivo = searchParams.get("nivel") ?? "";

  function handleNivelChange(e: React.ChangeEvent<HTMLSelectElement>) {
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
          htmlFor="filtro-nivel"
          className="text-sm font-medium text-[#383838] whitespace-nowrap"
        >
          Filtrar por nivel:
        </label>
        <select
          id="filtro-nivel"
          name="nivel"
          value={nivelActivo}
          onChange={handleNivelChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-1.5 text-sm text-[#383838] focus:border-[#86B81C] focus:outline-none focus:ring-2 focus:ring-[#86B81C]/30 transition-colors cursor-pointer"
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

      {/* H7: Aviso cuando filtro activo y hay herramientas sin nivel */}
      {nivelActivo && sinNivelCount > 0 && (
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-[#6B7280] italic"
        >
          {sinNivelCount}{" "}
          {sinNivelCount === 1 ? "herramienta" : "herramientas"} sin nivel
          asignado no se {sinNivelCount === 1 ? "muestra" : "muestran"} en este
          filtro.
        </p>
      )}
    </div>
  );
}
