import type { Metadata } from "next";
import { Suspense } from "react";
import { listHerramientasHandler } from "@/infrastructure/container";
import FilterBar from "@/presentation/components/FilterBar";
import ToolList from "@/presentation/components/ToolList";
import type { HerramientaFilters } from "@/domain/herramienta/herramienta.repository";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

/**
 * Task 28 — CatalogoPage
 *
 * Server Component. Página principal del catálogo de herramientas AI.
 *
 * - Lee searchParams.nivel para filtrar herramientas.
 * - Importa handler de @/infrastructure/container (NO Prisma directo).
 * - Calcula sinNivelCount para informar a FilterBar cuántas herramientas
 *   sin nivel quedan fuera del filtro (design.md §H7).
 * - Envuelve FilterBar en Suspense porque usa useSearchParams (CC) y
 *   Next.js requiere Suspense boundary para CCs que leen searchParams.
 *
 * Dependency Rule: importa handlers de @/infrastructure/container,
 * componentes de @/presentation/components/.
 */

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
  description:
    "Consulta las herramientas de Inteligencia Artificial aprobadas y retiradas en Logiztik Alliance Group.",
};

const NIVELES_VALIDOS: readonly string[] = [
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
];

interface CatalogoPageProps {
  searchParams: Promise<{ nivel?: string; estado?: string }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  // Next.js 15: searchParams es una Promise
  const params = await searchParams;
  const nivelRaw = params.nivel;
  const estadoRaw = params.estado;

  // Validar nivel — ignorar valores inválidos silenciosamente
  const nivelValido = nivelRaw && NIVELES_VALIDOS.includes(nivelRaw)
    ? (nivelRaw as NivelClasificacion)
    : undefined;

  // Construir filtros para el handler
  const filters: HerramientaFilters = {
    ...(nivelValido && { nivelMaximo: nivelValido }),
  };

  // Obtener herramientas filtradas
  const { data: herramientas } = await listHerramientasHandler.execute(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  // Calcular herramientas sin nivel (para aviso en FilterBar — design.md §H7)
  // Solo relevante cuando hay filtro activo
  let sinNivelCount = 0;
  if (nivelValido) {
    const { data: todas } = await listHerramientasHandler.execute(undefined);
    sinNivelCount = todas.filter((h) => h.nivelMaximo === null).length;
  }

  return (
    <div>
      {/* Cabecera de sección */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#383838]">
          Catálogo de Herramientas AI
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Herramientas aprobadas y retiradas por el Comité de Gobernanza AI de LAG.
        </p>
      </div>

      {/* FilterBar: CC que usa useSearchParams — necesita Suspense */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-lg bg-[#E2E8E0]" />}>
          <FilterBar sinNivelCount={sinNivelCount} />
        </Suspense>
      </div>

      {/* Listado */}
      <ToolList
        herramientas={herramientas}
        nivelFiltroActivo={nivelValido ?? null}
        estadoFiltroActivo={estadoRaw ?? null}
      />
    </div>
  );
}
