"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

/**
 * Barra de filtros interactiva para el catálogo.
 * Dropdown de nivel de clasificación con label accesible.
 * Mantiene estado del filtro vía searchParams (URL compartible).
 * "Todos" remueve el param de la URL.
 */
export function FilterBar() {
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
    <div className="flex items-center gap-3">
      <label
        htmlFor="filtro-nivel"
        className="text-sm font-medium text-[#383838]"
      >
        Nivel de clasificación:
      </label>
      <select
        id="filtro-nivel"
        value={currentNivel}
        onChange={handleChange}
        className="rounded-lg border border-[#E2E8E0] bg-white px-3 py-2 text-sm text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#86B81C]/50 focus:border-[#86B81C]"
      >
        <option value="">Todos</option>
        {NIVELES_CLASIFICACION.map((nivel) => (
          <option key={nivel} value={nivel}>
            {nivel}
          </option>
        ))}
      </select>
    </div>
  );
}
