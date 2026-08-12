import { Metadata } from "next";
import { Suspense } from "react";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import { NivelClasificacionSchema } from "@/presentation/validations/herramienta.validation";

/**
 * CatalogoPage — Server Component
 *
 * Página principal del catálogo de herramientas AI aprobadas.
 * - Lee searchParams.nivel para filtrar por nivel de clasificación.
 * - Importa handler del container (Dependency Rule).
 * - Renderiza FilterBar (CC) + ToolList (SC).
 * - Calcula sinNivelCount para el aviso de FilterBar (H7).
 */

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
  description:
    "Consulta las herramientas de inteligencia artificial aprobadas para uso en Logiztik Alliance Group.",
};

interface CatalogoPageProps {
  searchParams: Promise<{ nivel?: string }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const nivelParam = params.nivel;

  // Validar que el nivel sea uno de los 4 válidos (usa Zod schema de Presentation)
  const parsed = NivelClasificacionSchema.safeParse(nivelParam);
  const nivelValido = parsed.success ? parsed.data : undefined;

  // Construir filtros (el handler tipifica internamente como HerramientaFilters)
  const filters = nivelValido ? { nivelMaximo: nivelValido } : undefined;

  // Ejecutar handler
  const { data: herramientas } = await listHerramientasHandler.execute(filters);

  // H7: Calcular herramientas sin nivel asignado (para el aviso en FilterBar)
  // Solo relevante cuando hay filtro activo — se obtiene con query sin filtro.
  let sinNivelCount = 0;
  if (nivelValido) {
    const { data: todas } = await listHerramientasHandler.execute();
    sinNivelCount = todas.filter((h) => h.nivelMaximo === null).length;
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#383838]">
          Catálogo de Herramientas AI
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Herramientas de inteligencia artificial aprobadas para uso en LAG.
        </p>
      </header>

      <div className="mb-6">
        <Suspense fallback={null}>
          <FilterBar sinNivelCount={sinNivelCount} />
        </Suspense>
      </div>

      <ToolList herramientas={herramientas} />
    </>
  );
}
