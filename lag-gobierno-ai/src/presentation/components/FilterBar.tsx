"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface FilterBarProps {
  /** Número de herramientas sin nivel asignado en el catálogo completo. */
  sinNivelCount: number;
}

/**
 * Barra de filtros del catálogo.
 *
 * Client Component — requiere useSearchParams y useRouter para actualizar la URL.
 * El filtro viaja como query param ?nivel= (URLs compartibles, SSR del resultado).
 * Seleccionar "Todos" elimina el param de la URL.
 */
export function FilterBar({ sinNivelCount }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivelActivo = searchParams.get("nivel") ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value) {
        router.push(`/catalogo?nivel=${encodeURIComponent(value)}`);
      } else {
        router.push("/catalogo");
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {/* Label explícito asociado al select — accesibilidad WCAG AA */}
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
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-2 text-sm text-[#383838] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:border-[#86B81C] transition-colors"
        >
          <option value="">Todos los niveles</option>
          {NIVELES_CLASIFICACION.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>

      {/* Aviso informativo cuando hay filtro activo y existen herramientas sin clasificar */}
      {nivelActivo && sinNivelCount > 0 && (
        <p
          className="text-xs text-[#6B7280]"
          role="note"
          aria-live="polite"
        >
          {sinNivelCount}{" "}
          {sinNivelCount === 1
            ? "herramienta sin nivel asignado no se muestra"
            : "herramientas sin nivel asignado no se muestran"}{" "}
          en este filtro.
        </p>
      )}
    </div>
  );
}
