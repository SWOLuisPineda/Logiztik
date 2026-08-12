import { Metadata } from "next";
import { Suspense } from "react";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import {
  NIVELES_CLASIFICACION_OPTIONS,
  type ParsedHerramientaFilters,
} from "@/presentation/validations/herramienta.validation";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
};

interface CatalogoPageProps {
  searchParams: { nivel?: string };
}

/**
 * Página principal del catálogo de herramientas AI aprobadas.
 * Server Component. Lee searchParams.nivel para filtrar.
 * Importa handler de @/infrastructure/container (Dependency Rule).
 */
export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const filters: ParsedHerramientaFilters = {};

  if (
    searchParams.nivel &&
    (NIVELES_CLASIFICACION_OPTIONS as readonly string[]).includes(searchParams.nivel)
  ) {
    filters.nivelMaximo = searchParams.nivel as typeof NIVELES_CLASIFICACION_OPTIONS[number];
  }

  const { data, count, sinNivelCount } = await listHerramientasHandler.execute(filters);

  // H11: Determinar si se están mostrando herramientas retiradas
  const mostrandoRetiradas = data.some((h) => h.estado === "Retirada");

  return (
    <>
      <h1 className="text-2xl font-bold text-[#383838] mb-6">
        Catálogo de Herramientas AI Aprobadas
      </h1>

      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <Suspense fallback={<div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />}>
          <FilterBar sinNivelCount={sinNivelCount} />
        </Suspense>
        <p className="text-sm text-[#6B7280]">
          {count} herramienta{count !== 1 ? "s" : ""}
        </p>
      </div>

      <ToolList herramientas={data} mostrandoRetiradas={mostrandoRetiradas} />
    </>
  );
}
