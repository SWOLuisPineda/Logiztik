"use client";

/**
 * Task 23 — FilterBar
 *
 * Client Component. Barra de filtrado por nivel de clasificación de datos.
 *
 * - Actualiza la URL con ?nivel=X al seleccionar un nivel.
 * - "Todos los niveles" remueve el parámetro nivel de la URL.
 * - El label es visible y está asociado al select con htmlFor (accesibilidad WCAG 1.3.1).
 * - Usa useSearchParams + useRouter para mantener otros query params intactos.
 * - Si sinNivelCount > 0 y hay un filtro activo, muestra aviso informativo.
 *
 * Dependency Rule: no importa de @/domain, @/application ni @/infrastructure.
 */

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const NIVELES = [
  { value: "Publica", label: "Pública" },
  { value: "Interna", label: "Interna" },
  { value: "Confidencial", label: "Confidencial" },
  { value: "Restringida", label: "Restringida" },
] as const;

interface FilterBarProps {
  /**
   * Cantidad de herramientas con nivelMaximo: null en el catálogo completo.
   * Cuando hay filtro activo y este valor > 0, se muestra un aviso informativo.
   * (design.md §H7)
   */
  sinNivelCount?: number;
}

export default function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nivelActivo = searchParams.get("nivel") ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      // Clonar params actuales para no perder otros (e.g. ?estado=)
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("nivel", value);
      } else {
        params.delete("nivel");
      }

      // Evitar URL con ? trailing cuando no quedan params
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Label visible y asociado — WCAG 1.3.1 */}
        <label
          htmlFor="filtro-nivel"
          className="text-sm font-medium text-[#383838] whitespace-nowrap"
        >
          Filtrar por nivel de clasificación:
        </label>

        <select
          id="filtro-nivel"
          name="nivel"
          value={nivelActivo}
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-1.5 text-sm text-[#383838] shadow-sm focus:border-[#86B81C] focus:outline-none focus:ring-1 focus:ring-[#86B81C] transition-colors"
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        {/* Pill de filtro activo con botón de limpiar */}
        {nivelActivo && (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("nivel");
              const qs = params.toString();
              router.push(qs ? `${pathname}?${qs}` : pathname);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-[#86B81C]/10 px-2.5 py-0.5 text-xs font-medium text-[#5C8314] hover:bg-[#86B81C]/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C]"
            aria-label={`Quitar filtro: ${nivelActivo}`}
          >
            {NIVELES.find((n) => n.value === nivelActivo)?.label ?? nivelActivo}
            <svg aria-hidden="true" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Aviso informativo: herramientas sin nivel excluidas del filtro (design.md §H7) */}
      {nivelActivo && sinNivelCount > 0 && (
        <p
          role="note"
          className="text-xs text-[#6B7280]"
        >
          {sinNivelCount === 1
            ? "1 herramienta sin nivel asignado no se muestra en este filtro."
            : `${sinNivelCount} herramientas sin nivel asignado no se muestran en este filtro.`}
        </p>
      )}
    </div>
  );
}
