"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * FilterBar — Barra de filtros interactiva para nivel de clasificación.
 *
 * Client Component: mantiene estado de filtro con useSearchParams.
 * Label accesible asociado al select.
 * Props: sinNivelCount para mostrar aviso H7.
 */

interface FilterBarProps {
  sinNivelCount?: number;
}

const NIVELES = [
  { value: "", label: "Todos los niveles" },
  { value: "Publica", label: "Pública" },
  { value: "Interna", label: "Interna" },
  { value: "Confidencial", label: "Confidencial" },
  { value: "Restringida", label: "Restringida" },
];

export default function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
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
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <label
          htmlFor="filter-nivel"
          className="text-sm font-medium text-[#383838]"
        >
          Filtrar por nivel:
        </label>
        <select
          id="filter-nivel"
          value={currentNivel}
          onChange={handleChange}
          className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-2 text-sm text-[#383838] focus:border-[#86B81C] focus:outline-none focus:ring-1 focus:ring-[#86B81C]"
        >
          {NIVELES.map((nivel) => (
            <option key={nivel.value} value={nivel.value}>
              {nivel.label}
            </option>
          ))}
        </select>
      </div>

      {currentNivel && sinNivelCount > 0 && (
        <p className="mt-2 text-xs text-[#6B7280]" role="note">
          {sinNivelCount} herramienta(s) sin nivel asignado no se muestran en
          este filtro.
        </p>
      )}
    </div>
  );
}
