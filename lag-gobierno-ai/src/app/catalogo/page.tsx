import { Metadata } from "next";
import { listHerramientasHandler } from "@/infrastructure/container";
import { ListHerramientasQuerySchema } from "@/presentation/validations/herramienta.validation";
import FilterBar from "@/presentation/components/FilterBar";
import ToolList from "@/presentation/components/ToolList";

export const metadata: Metadata = {
  title: "Catálogo de Herramientas AI — LAG",
  description:
    "Catálogo de herramientas de inteligencia artificial aprobadas por Logiztik Alliance Group.",
};

/**
 * CatalogoPage — Página principal del catálogo.
 *
 * Server Component. Lee searchParams.nivel para filtrar.
 * Importa handler de @/infrastructure/container (Dependency Rule).
 * Renderiza FilterBar + ToolList.
 */

interface CatalogoPageProps {
  searchParams: { nivel?: string; estado?: string };
}

export default async function CatalogoPage({
  searchParams,
}: CatalogoPageProps) {
  // Validar query params con Zod (misma validación que el API route)
  const parsed = ListHerramientasQuerySchema.safeParse({
    nivel: searchParams.nivel,
    estado: searchParams.estado,
  });

  const filters = parsed.success
    ? {
        ...(parsed.data.nivel && { nivelMaximo: parsed.data.nivel }),
        ...(parsed.data.estado && { estado: parsed.data.estado }),
      }
    : {};

  const result = await listHerramientasHandler.execute(filters);

  // H7: Contar herramientas sin nivel para el aviso del FilterBar
  const allResult = searchParams.nivel
    ? await listHerramientasHandler.execute()
    : result;
  const sinNivelCount = allResult.data.filter(
    (h) => h.nivelMaximo === null
  ).length;

  // H11: Determinar si se muestran herramientas retiradas
  const hasRetired = result.data.some((h) => h.estado === "Retirada");

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-[#383838]">
        Catálogo de Herramientas AI
      </h1>

      <FilterBar sinNivelCount={sinNivelCount} />

      <ToolList
        herramientas={result.data}
        showRetiredWarning={hasRetired}
        currentNivel={searchParams.nivel}
      />
    </>
  );
}
