import { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import { FilterBar } from "@/presentation/components/FilterBar";
import { ToolList } from "@/presentation/components/ToolList";
import { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

/**
 * CatalogoPage — Server Component
 *
 * Página principal del catálogo de herramientas AI aprobadas.
 * Lee searchParams.nivel y searchParams.estado para filtrar.
 * Importa handler de @/infrastructure/container (Dependency Rule).
 *
 * H7: Calcula sinNivelCount para el aviso de herramientas sin nivel.
 * H11: Pasa filtroEstado a ToolList para banner de gobernanza.
 */

export const metadata: Metadata = {
  description:
    "Consulta las herramientas de inteligencia artificial aprobadas para uso en Logiztik Alliance Group.",
};

// Next.js 15: searchParams es una Promise
interface CatalogoPageProps {
  searchParams: Promise<{ nivel?: string; estado?: string }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;

  // Construir filtros tipados (solo si los valores son válidos)
  const filters: {
    nivelMaximo?: NivelClasificacion;
    estado?: EstadoHerramienta;
  } = {};

  const nivelesValidos: string[] = [
    "Publica",
    "Interna",
    "Confidencial",
    "Restringida",
  ];
  const estadosValidos: string[] = ["Activa", "Retirada", "Condicional"];

  if (params.nivel && nivelesValidos.includes(params.nivel)) {
    filters.nivelMaximo = params.nivel as NivelClasificacion;
  }

  if (params.estado && estadosValidos.includes(params.estado)) {
    filters.estado = params.estado as EstadoHerramienta;
  }

  const result = await listHerramientasHandler.execute(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  // H7: Calcular cuántas herramientas tienen nivelMaximo: null en el catálogo total.
  // Solo relevante cuando hay filtro de nivel activo.
  let sinNivelCount = 0;
  if (filters.nivelMaximo) {
    const allResult = await listHerramientasHandler.execute();
    sinNivelCount = allResult.data.filter((h) => h.nivelMaximo === null).length;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#383838]">
          Catálogo de Herramientas AI
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Herramientas de inteligencia artificial aprobadas para uso en LAG.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <FilterBar sinNivelCount={sinNivelCount} />
      </div>

      {/* Listado — H11: pasa filtroEstado para banner de gobernanza */}
      <ToolList herramientas={result.data} filtroEstado={filters.estado} />
    </>
  );
}
