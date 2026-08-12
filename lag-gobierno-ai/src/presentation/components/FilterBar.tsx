"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * FilterBar — Dropdown de filtro por nivel de clasificación.
 *
 * Actualiza la URL con ?nivel=X via useSearchParams + useRouter.
 * Usa usePathname() para construir URL relativa.
 * Label accesible asociado al select.
 */

const NIVELES = ["Publica ", "Interna", "Confidencial", "Restringida"] as const;

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nivelActual = searchParams.get("nivel") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value) {
      router.push(`${pathname}?nivel=${value}`);
    } else {
      router.push(pathname);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="filtro-nivel"
        className="text-sm font-medium text-lag-text-primary"
      >
        Filtrar por nivel de clasificación
      </label>
      <select
        id="filtro-nivel"
        value={nivelActual}
        onChange={handleChange}
        className="rounded-lg border border-lag-border bg-white px-3 py-2 text-sm text-lag-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
      >
        <option value="">Todos los niveles</option>
        {NIVELES.map((nivel) => (
          <option key={nivel} value={nivel}>
            {nivel}
          </option>
        ))}
      </select>
    </div>
  );
}
