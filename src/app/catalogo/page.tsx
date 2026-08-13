import { Suspense } from "react";
import { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import FilterBar from "@/presentation/components/FilterBar";
import ToolList from "@/presentation/components/ToolList";
import { NivelClasificacionSchema } from "@/presentation/validations/herramienta.validation";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
};

export const dynamic = "force-dynamic";

/**
 * CatalogoPage — Página principal del catálogo.
 *
 * Server Component. Lee searchParams.nivel, llama handler, renderiza FilterBar + ToolList.
 * Calcula sinNivelCount para H7 (aviso de herramientas sin nivel excluidas del filtro).
 * FilterBar envuelto en Suspense (requerido por useSearchParams en Next.js 14).
 */

interface CatalogoPageProps {
  readonly searchParams: { nivel?: string };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const nivelParam = searchParams.nivel;

  const nivelesValidos = NivelClasificacionSchema.options;
  const nivelValido =
    nivelParam && (nivelesValidos as readonly string[]).includes(nivelParam)
      ? nivelParam
      : undefined;

  const filters = nivelValido
    ? { nivelMaximo: nivelValido as (typeof nivelesValidos)[number] }
    : undefined;

  const result = await listHerramientasHandler.execute(filters);

  let sinNivelCount = 0;
  if (nivelValido) {
    const allResult = await listHerramientasHandler.execute();
    sinNivelCount = allResult.data.filter((h) => h.nivelMaximo === null).length;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-lag-text-primary">
        Catálogo de Herramientas AI
      </h1>

      {/* Zona de filtros con fondo alternativo (bg-secondary) */}
      <div className="bg-lag-bg-secondary rounded-lg p-4 border border-lag-border">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      <ToolList
        herramientas={result.data}
        sinNivelCount={sinNivelCount}
        filtroNivelActivo={!!nivelValido}
        nivelSeleccionado={nivelValido}
      />
    </div>
  );
}
