import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";
import { BackButton } from "@/presentation/components/BackButton";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import type { HerramientaDetailDto } from "@/application/herramientas/dtos/herramienta-detail.dto";

interface ToolDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// generateMetadata — tab dinámico con el nombre de la herramienta
// ---------------------------------------------------------------------------
export async function generateMetadata(
  { params }: ToolDetailPageProps
): Promise<Metadata> {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return { title: "Herramienta — LAG" };
  }
  const herramienta = await getHerramientaByIdHandler.execute(idNum);
  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }
  return {
    title: `${herramienta.nombre} — Catálogo AI LAG`,
    description: `Detalle de la herramienta ${herramienta.nombre} (${herramienta.proveedor}) en el catálogo AI de Logiztik Alliance Group.`,
  };
}

// ---------------------------------------------------------------------------
// Helpers de renderizado
// ---------------------------------------------------------------------------

/** Fila de dato con label + valor. */
function CampoDetalle({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
        {label}
      </dt>
      <dd className="text-sm text-[#383838]">{children}</dd>
    </div>
  );
}

/** Formatea una fecha ISO a dd/mm/aaaa localizado en es-CO. */
function formatFecha(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

// ---------------------------------------------------------------------------
// Layout: Herramienta Activa / Condicional
// ---------------------------------------------------------------------------
function LayoutActiva({ h }: { readonly h: HerramientaDetailDto }) {
  const dpaTexto =
    h.dpa === "No aplica" ? "Información no disponible aún" : h.dpa;

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <CampoDetalle label="Proveedor">{h.proveedor}</CampoDetalle>

      <CampoDetalle label="Categoría">
        {h.categoria ?? "Sin categoría"}
      </CampoDetalle>

      <CampoDetalle label="Nivel máximo de datos">
        <NivelBadge nivel={h.nivelMaximo as NivelClasificacion | null} />
      </CampoDetalle>

      <CampoDetalle label="Acuerdo de Protección de Datos (DPA)">
        <span
          className={
            h.dpa === "Vigente"
              ? "text-[#5C8314] font-medium"
              : "text-[#6B7280]"
          }
        >
          {dpaTexto}
        </span>
      </CampoDetalle>

      <CampoDetalle label="Registrada en catálogo">
        {formatFecha(h.creadoEn)}
      </CampoDetalle>

      <CampoDetalle label="Última actualización">
        {formatFecha(h.actualizadoEn)}
      </CampoDetalle>
    </dl>
  );
}

// ---------------------------------------------------------------------------
// Layout: Herramienta Retirada
// ---------------------------------------------------------------------------
function LayoutRetirada({ h }: { readonly h: HerramientaDetailDto }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <CampoDetalle label="Proveedor">{h.proveedor}</CampoDetalle>

      <CampoDetalle label="Razón de retiro">
        <span className="text-red-700">
          {h.razonRetiro ?? "No especificada"}
        </span>
      </CampoDetalle>

      <CampoDetalle label="Registrada en catálogo">
        {formatFecha(h.creadoEn)}
      </CampoDetalle>

      <CampoDetalle label="Última actualización">
        {formatFecha(h.actualizadoEn)}
      </CampoDetalle>
    </dl>
  );
}

// ---------------------------------------------------------------------------
// ToolDetailPage — Server Component principal
// ---------------------------------------------------------------------------

/**
 * Página de detalle de herramienta.
 *
 * Dependency Rule: importa handler de @/infrastructure/container.
 * Evalúa dto.estado === "Retirada" para ramificar el layout.
 * Llama notFound() si el ID no existe en BD.
 */
export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { id } = await params;

  // Validar que el id sea un entero positivo antes de llamar al handler
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    notFound();
  }

  const herramienta = await getHerramientaByIdHandler.execute(idNum);

  if (!herramienta) {
    notFound();
  }

  const estaRetirada = herramienta.estado === "Retirada";

  return (
    <main>
      {/* Navegación de vuelta — Suspense requerido por useSearchParams */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-5 w-32 rounded bg-gray-100 animate-pulse" />}>
          <BackButton />
        </Suspense>
      </div>

      {/* Banner de herramienta retirada */}
      {estaRetirada && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      {/* Card principal */}
      <article className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-8">
        {/* Cabecera: nombre + semáforo */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#383838] leading-tight">
            {herramienta.nombre}
          </h1>
          <SemaforoIndicator
            estado={herramienta.estado as EstadoHerramienta}
          />
        </div>

        <div className="border-t border-[#E2E8E0] pt-6">
          {estaRetirada ? (
            <LayoutRetirada h={herramienta} />
          ) : (
            <LayoutActiva h={herramienta} />
          )}
        </div>
      </article>
    </main>
  );
}
