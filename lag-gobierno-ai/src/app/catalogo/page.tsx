import type { Metadata } from "next";
import { Suspense } from "react";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
  description:
    "Herramientas de Inteligencia Artificial aprobadas para uso interno en Logiztik Alliance Group.",
};

interface CatalogoPageProps {
  readonly searchParams: Promise<{ nivel?: string }>;
}

/**
 * CatalogoPage — Server Component.
 *
 * Responsabilidades:
 * 1. Leer el query param ?nivel= de la URL.
 * 2. Construir los filtros y llamar al handler (Application layer).
 * 3. Calcular sinNivelCount para el aviso de FilterBar.
 * 4. Renderizar FilterBar + banner de retiradas (si aplica) + ToolList.
 *
 * Dependency Rule: importa handlers de @/infrastructure/container.
 * No instancia repositorios directamente.
 */
export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const { nivel } = await searchParams;

  // Validar que el nivel sea un valor conocido antes de pasarlo al handler
  const NIVELES_VALIDOS: NivelClasificacion[] = [
    "Publica",
    "Interna",
    "Confidencial",
    "Restringida",
  ];
  const nivelFiltro =
    nivel && NIVELES_VALIDOS.includes(nivel as NivelClasificacion)
      ? (nivel as NivelClasificacion)
      : undefined;

  // Una sola query sin filtro → filtrado en memoria.
  // Evita la segunda query serial del patrón anterior (H4).
  const { data: todas } = await listHerramientasHandler.execute(undefined);

  // sinNivelCount para el aviso de FilterBar (solo relevante con filtro activo)
  const sinNivelCount = nivelFiltro
    ? todas.filter((h) => h.nivelMaximo === null).length
    : 0;

  // Filtrado en memoria — 31 registros, O(n) trivial
  const herramientas = nivelFiltro
    ? todas.filter((h) => h.nivelMaximo === nivelFiltro)
    : todas;

  // H5: banner solo cuando hay un filtro activo explícito y ese filtro
  // trae retiradas — no en el listado completo por defecto.
  const mostrarBannerRetiradas =
    nivelFiltro !== undefined &&
    herramientas.some((h) => h.estado === "Retirada");

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#383838] mb-1">
          Catálogo de Herramientas AI
        </h1>
        <p className="text-sm text-[#6B7280]">
          Herramientas aprobadas por el equipo de Gobernanza AI para uso interno en LAG.
        </p>
      </div>

      {/* Barra de filtros — Suspense requerido por useSearchParams en Next.js 14 */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-9 w-64 rounded-lg bg-gray-100 animate-pulse" />}>
          <FilterBar sinNivelCount={sinNivelCount} />
        </Suspense>
      </div>

      {/* Banner de advertencia — solo con filtro activo explícito que trae retiradas */}
      {mostrarBannerRetiradas && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
          aria-live="polite"
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm text-red-700">
            <span className="font-semibold">Atención:</span> Estás viendo herramientas
            NO autorizadas. No deben usarse con datos de LAG.
          </p>
        </div>
      )}

      {/* Listado */}
      <ToolList herramientas={herramientas} nivelActivo={nivel} />
    </main>
  );
}
