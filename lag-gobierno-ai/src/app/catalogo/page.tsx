import { Suspense } from "react";
import type { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
};

interface CatalogoPageProps {
  searchParams: { nivel?: string };
}

/**
 * CatalogoPage — Server Component.
 * Lee searchParams.nivel, llama al handler del container, renderiza FilterBar + ToolList.
 * Si nivel es inválido, se ignora (muestra todos) y FilterBar reflejará "Todos" seleccionado.
 */
export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const nivelParam = searchParams.nivel;

  // Validar que el nivel sea uno de los valores permitidos
  const nivelValido = nivelParam && NIVELES_CLASIFICACION.includes(nivelParam as NivelClasificacion)
    ? (nivelParam as NivelClasificacion)
    : undefined;

  const filters = nivelValido ? { nivelMaximo: nivelValido } : undefined;
  const { data } = await listHerramientasHandler.execute(filters);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#383838] mb-6">
        Catálogo de Herramientas AI Aprobadas
      </h1>

      <div className="mb-8">
        <Suspense fallback={<div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />}>
          <FilterBar />
        </Suspense>
      </div>

      <ToolList herramientas={data} nivelActivo={nivelValido} />
    </div>
  );
}
