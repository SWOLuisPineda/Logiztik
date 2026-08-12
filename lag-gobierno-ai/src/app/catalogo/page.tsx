import { Suspense } from "react";
import { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import FilterBar from "@/presentation/components/FilterBar";
import ToolList from "@/presentation/components/ToolList";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
};

interface CatalogoPageProps {
  searchParams: { nivel?: string };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const nivelParam = searchParams.nivel;
  const nivelValido =
    nivelParam &&
    (NIVELES_CLASIFICACION as readonly string[]).includes(nivelParam)
      ? (nivelParam as NivelClasificacion)
      : undefined;

  const filters = nivelValido ? { nivelMaximo: nivelValido } : undefined;
  const result = await listHerramientasHandler.execute(filters);

  // Calculate sinNivelCount when a filter is active
  let sinNivelCount = 0;
  if (nivelValido) {
    const allResult = await listHerramientasHandler.execute();
    sinNivelCount = allResult.data.filter((h) => h.nivelMaximo === null).length;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#383838]">
        Catálogo de Herramientas AI
      </h1>
      <Suspense>
        <FilterBar sinNivelCount={sinNivelCount} />
      </Suspense>
      <ToolList herramientas={result.data} />
    </div>
  );
}
