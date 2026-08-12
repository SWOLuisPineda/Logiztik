/**
 * Task 28 — CatalogoPage
 *
 * Página principal del catálogo de herramientas.
 * Server Component — fetcha datos via handler (sin Prisma directo).
 *
 * Renderiza: FilterBar + ToolList.
 * Filtro por nivel funciona vía query param — SSR, no client-side fetch.
 *
 * Dependency Rule: Importa handler de @/infrastructure/container (composición root),
 * no instancia PrismaHerramientaRepository.
 */

import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface CatalogPageProps {
  searchParams: Promise<{ nivel?: string }>;
}

export const metadata = {
  title: "Catálogo de Herramientas AI — Logiztik Alliance Group",
  description:
    "Explora el catálogo de herramientas de inteligencia artificial aprobadas por Logiztik Alliance Group.",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const nivelFiltro = params.nivel as NivelClasificacion | undefined;

  // Una sola query al catálogo completo para calcular sinNivelCount y filtrar en memoria
  const todosCatalogo = await listHerramientasHandler.execute();
  const sinNivelCount = todosCatalogo.data.filter(
    (h) => h.nivelMaximo === null,
  ).length;

  // Aplicar filtro si existe — si no hay filtro, usa el resultado completo
  const result = nivelFiltro
    ? await listHerramientasHandler.execute({ nivelMaximo: nivelFiltro })
    : todosCatalogo;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#383838] mb-2">
          Catálogo de Herramientas AI
        </h1>
        <p className="text-[#6B7280]">
          {result.count} herramienta{result.count !== 1 ? "s" : ""} registrada
          {result.count !== 1 ? "s" : ""}
        </p>
      </div>

      <FilterBar sinNivelCount={sinNivelCount} />

      <ToolList herramientas={result.data} />

      {nivelFiltro && sinNivelCount > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">ℹ️ Nota:</span> {sinNivelCount}{" "}
            herramienta{sinNivelCount !== 1 ? "s" : ""} sin nivel asignado no se
            muestran en este filtro.
          </p>
        </div>
      )}
    </div>
  );
}
