import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";
import SemaforoIndicator from "@/presentation/components/SemaforoIndicator";
import NivelBadge from "@/presentation/components/NivelBadge";
import BackButton from "@/presentation/components/BackButton";
import type { HerramientaDetailDto } from "@/application/herramientas/dtos/herramienta-detail.dto";

/**
 * Task 31 — ToolDetailPage
 *
 * Server Component. Página de detalle de una herramienta AI.
 *
 * - params es Promise (Next.js 15).
 * - Valida id con Zod. ID inválido → notFound().
 * - Handler retorna null si no existe → notFound().
 * - Layout diferenciado según estado (design.md §H6):
 *     Activa/Condicional: muestra categoría, nivel, DPA.
 *     Retirada: muestra banner rojo + razonRetiro. Oculta categoría/nivel/DPA.
 * - DPA "No aplica" → muestra "Información no disponible aún".
 * - generateMetadata dinámico: tab muestra nombre de la herramienta.
 * - BackButton en Suspense (CC con useSearchParams).
 *
 * Dependency Rule: importa handler de @/infrastructure/container,
 * componentes de @/presentation/components/, validación de @/presentation/validations/.
 */

type EstadoHerramienta = "Activa" | "Retirada" | "Condicional";

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: ToolDetailPageProps
): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = GetHerramientaParamsSchema.safeParse({ id: resolvedParams.id });

  if (!parsed.success) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);

  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return {
    title: `${herramienta.nombre} — Catálogo AI LAG`,
    description: `Detalle de ${herramienta.nombre} (${herramienta.proveedor}). Estado: ${herramienta.estado}.`,
  };
}

// ─── Helpers de presentación ────────────────────────────────────────────────

function formatDpa(dpa: string): string {
  if (dpa === "No aplica") return "Información no disponible aún";
  return dpa;
}

function CampoDetalle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
        {label}
      </dt>
      <dd className="text-sm text-[#383838]">{children}</dd>
    </div>
  );
}

// ─── Layout para herramienta Retirada ────────────────────────────────────────

function DetalleRetirada({ h }: { h: HerramientaDetailDto }) {
  return (
    <>
      {/* Banner de advertencia */}
      <div
        role="alert"
        className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-4 text-sm text-red-700"
      >
        <svg
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p>
          <strong>Esta herramienta NO está autorizada para uso en LAG.</strong>
          {h.razonRetiro && (
            <span className="ml-1">Motivo: {h.razonRetiro}</span>
          )}
        </p>
      </div>

      {/* Campos básicos */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CampoDetalle label="Proveedor">{h.proveedor}</CampoDetalle>
        <CampoDetalle label="Estado">
          <SemaforoIndicator estado="Retirada" />
        </CampoDetalle>
        {h.razonRetiro && (
          <CampoDetalle label="Razón de retiro">
            <span className="text-red-700">{h.razonRetiro}</span>
          </CampoDetalle>
        )}
      </dl>
    </>
  );
}

// ─── Layout para herramienta Activa / Condicional ────────────────────────────

function DetalleActiva({ h }: { h: HerramientaDetailDto }) {
  const estadoTyped = (["Activa", "Retirada", "Condicional"].includes(h.estado)
    ? h.estado
    : "Activa") as EstadoHerramienta;

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <CampoDetalle label="Proveedor">{h.proveedor}</CampoDetalle>

      <CampoDetalle label="Estado">
        <SemaforoIndicator estado={estadoTyped} />
      </CampoDetalle>

      <CampoDetalle label="Categoría">
        {h.categoria ?? (
          <span className="text-[#6B7280] italic">Sin categoría</span>
        )}
      </CampoDetalle>

      <CampoDetalle label="Nivel máximo de datos">
        <NivelBadge nivel={h.nivelMaximo} />
      </CampoDetalle>

      <CampoDetalle label="DPA (Acuerdo de protección de datos)">
        <span
          className={
            h.dpa === "Vigente"
              ? "text-[#5C8314] font-medium"
              : h.dpa === "Pendiente"
              ? "text-amber-600 font-medium"
              : "text-[#6B7280] italic"
          }
        >
          {formatDpa(h.dpa)}
        </span>
      </CampoDetalle>
    </dl>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const resolvedParams = await params;

  // Validar id — id inválido trata como not found
  const parsed = GetHerramientaParamsSchema.safeParse({ id: resolvedParams.id });
  if (!parsed.success) notFound();

  const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);
  if (!herramienta) notFound();

  const esRetirada = herramienta.estado === "Retirada";

  return (
    <div>
      {/* BackButton — CC con useSearchParams necesita Suspense */}
      <div className="mb-6">
        <Suspense fallback={
          <div className="h-5 w-36 animate-pulse rounded bg-[#E2E8E0]" />
        }>
          <BackButton />
        </Suspense>
      </div>

      {/* Card de detalle */}
      <article
        className={`rounded-lg bg-white shadow-sm p-8 border ${
          esRetirada ? "border-red-200" : "border-[#E2E8E0]"
        }`}
      >
        {/* Cabecera */}
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#383838]">
            {herramienta.nombre}
          </h1>
        </header>

        {/* Cuerpo — diferenciado por estado */}
        {esRetirada ? (
          <DetalleRetirada h={herramienta} />
        ) : (
          <DetalleActiva h={herramienta} />
        )}
      </article>
    </div>
  );
}
