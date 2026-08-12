import { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import {
  NivelClasificacionSchema,
  EstadoHerramientaSchema,
} from "@/presentation/validations/herramienta.validation";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
};

interface CatalogoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Página principal del catálogo. Server Component.
 * Lee searchParams.nivel para filtrar. Importa handler de container.
 * H7: Calcula sinNivelCount para el aviso de FilterBar.
 */
export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const resolvedParams = await searchParams;
  const nivelParam = typeof resolvedParams.nivel === "string" ? resolvedParams.nivel : undefined;
  const estadoParam = typeof resolvedParams.estado === "string" ? resolvedParams.estado : undefined;

  const filters: Record<string, string> = {};
  if (nivelParam && NivelClasificacionSchema.safeParse(nivelParam).success) {
    filters.nivelMaximo = nivelParam;
  }
  if (estadoParam && EstadoHerramientaSchema.safeParse(estadoParam).success) {
    filters.estado = estadoParam;
  }

  const hasFilters = Object.keys(filters).length > 0;
  const result = await listHerramientasHandler.execute(
    hasFilters ? (filters as Parameters<typeof listHerramientasHandler.execute>[0]) : undefined
  );

  // H7: Contar herramientas sin nivel para el aviso
  let sinNivelCount = 0;
  if (filters.nivelMaximo) {
    const estadoFilter = filters.estado
      ? ({ estado: filters.estado } as Parameters<typeof listHerramientasHandler.execute>[0])
      : undefined;
    const allResult = await listHerramientasHandler.execute(estadoFilter);
    sinNivelCount = allResult.data.filter((h) => h.nivelMaximo === null).length;
  }

  // H11: Mostrar banner si se filtran retiradas
  const showRetiredBanner = result.data.some((h) => h.estado === "Retirada");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#383838] mb-2">
          Catálogo de Herramientas AI
        </h1>
        <p className="text-[#6B7280] text-sm">
          Herramientas aprobadas para uso en Logiztik Alliance Group.
        </p>
      </header>

      <FilterBar sinNivelCount={sinNivelCount} />

      <div aria-live="polite">
        <p className="text-xs text-[#6B7280] mb-3">
          {result.count} herramienta{result.count !== 1 ? "s" : ""} encontrada
          {result.count !== 1 ? "s" : ""}
        </p>
        <ToolList
          herramientas={result.data}
          showRetiredBanner={showRetiredBanner}
        />
      </div>
    </div>
  );
}
