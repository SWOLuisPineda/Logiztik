"use client";

/**
 * FilterBar — Client Component
 *
 * Barra de filtro por nivel de clasificación.
 * Actualiza la URL con el searchParam `nivel` al cambiar la selección.
 */

import { useSearchParams, useRouter } from "next/navigation";

interface FilterBarProps {
  sinNivelCount?: number;
}

const OPTIONS = [
  { value: "", label: "Todos" },
  { value: "Publica", label: "Pública" },
  { value: "Interna", label: "Interna" },
  { value: "Confidencial", label: "Confidencial" },
  { value: "Restringida", label: "Restringida" },
] as const;

export default function FilterBar({ sinNivelCount = 0 }: FilterBarProps) {
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

    const query = params.toString();
    router.push(query ? `/catalogo?${query}` : "/catalogo");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label htmlFor="nivel-filter" className="text-sm font-medium text-[#383838]">
          Nivel de clasificación
        </label>
        <select
          id="nivel-filter"
          value={currentNivel}
          onChange={handleChange}
          className="border border-[#E2E8E0] rounded-lg px-3 py-2 text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#86B81C]"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {currentNivel && sinNivelCount > 0 && (
        <p className="text-sm text-[#6B7280]">
          {sinNivelCount} herramienta{sinNivelCount > 1 ? "s" : ""} sin nivel asignado no se
          muestra{sinNivelCount > 1 ? "n" : ""} en este filtro.
        </p>
      )}
    </div>
  );
}
