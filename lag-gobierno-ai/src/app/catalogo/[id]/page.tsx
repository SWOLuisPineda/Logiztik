import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { BackButton } from "@/presentation/components/BackButton";
import { SemaforoIndicator } from "@/presentation/components/SemaforoIndicator";
import { NivelBadge } from "@/presentation/components/NivelBadge";

/**
 * ToolDetailPage — Server Component
 *
 * Página de detalle de una herramienta.
 * - Valida id (entero positivo).
 * - Llama handler del container → notFound() si null.
 * - H6: Layout diferenciado según estado (Activa/Condicional vs Retirada).
 * - generateMetadata con nombre de herramienta.
 */

type EstadoHerramienta = "Activa" | "Condicional" | "Retirada";
type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  const herramienta = await getHerramientaByIdHandler.execute(id);

  if (!herramienta) {
    return { title: "Herramienta no encontrada — LAG" };
  }

  return {
    title: `${herramienta.nombre} — Catálogo AI LAG`,
    description: `Detalle de ${herramienta.nombre} (${herramienta.proveedor}) en el catálogo de herramientas AI de LAG.`,
  };
}

// ── Page Component ───────────────────────────────────────────────────────────

export default async function ToolDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  // Validar id
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  // Fetch detalle
  const herramienta = await getHerramientaByIdHandler.execute(id);

  if (!herramienta) {
    notFound();
  }

  const estaRetirada = herramienta.estado === "Retirada";

  return (
    <article>
      {/* ── Navegación ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <Suspense fallback={null}>
          <BackButton />
        </Suspense>
      </div>

      {/* ── Banner de advertencia para herramientas retiradas ──────── */}
      {estaRetirada && (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3"
          role="alert"
          aria-live="assertive"
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Esta herramienta <strong>NO está autorizada</strong> para uso en LAG.
          </p>
        </div>
      )}

      {/* ── Cabecera ───────────────────────────────────────────────── */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#383838]">
          {herramienta.nombre}
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {herramienta.proveedor}
        </p>
      </header>

      {/* ── Detalle ────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm">
        <dl className="space-y-4">
          {/* Estado — siempre visible */}
          <div className="flex items-center gap-3">
            <dt className="text-sm font-medium text-[#383838]">Estado:</dt>
            <dd>
              <SemaforoIndicator estado={herramienta.estado as EstadoHerramienta} />
            </dd>
          </div>

          {/* ── Campos solo para Activa/Condicional ─────────────────── */}
          {!estaRetirada && (
            <>
              {/* Categoría */}
              <div>
                <dt className="text-sm font-medium text-[#383838]">Categoría:</dt>
                <dd className="mt-0.5 text-sm text-[#6B7280]">
                  {herramienta.categoria ?? (
                    <span className="italic text-gray-400">Sin categoría</span>
                  )}
                </dd>
              </div>

              {/* Nivel de clasificación */}
              <div>
                <dt className="text-sm font-medium text-[#383838]">
                  Nivel máximo de clasificación de datos:
                </dt>
                <dd className="mt-1">
                  <NivelBadge nivel={herramienta.nivelMaximo as NivelClasificacion | null} />
                </dd>
              </div>

              {/* DPA */}
              <div>
                <dt className="text-sm font-medium text-[#383838]">
                  Acuerdo de Procesamiento de Datos (DPA):
                </dt>
                <dd className="mt-0.5 text-sm text-[#6B7280]">
                  {herramienta.dpa === "No aplica"
                    ? "Información no disponible aún"
                    : herramienta.dpa}
                </dd>
              </div>
            </>
          )}

          {/* ── Campos solo para Retirada ───────────────────────────── */}
          {estaRetirada && (
            <>
              {/* Razón de retiro */}
              <div>
                <dt className="text-sm font-medium text-[#383838]">
                  Razón de retiro:
                </dt>
                <dd className="mt-0.5 text-sm text-red-600">
                  {herramienta.razonRetiro ?? "Sin razón registrada"}
                </dd>
              </div>

              {/* Fecha de retiro */}
              <div>
                <dt className="text-sm font-medium text-[#383838]">
                  Fecha de retiro:
                </dt>
                <dd className="mt-0.5 text-sm text-[#6B7280]">
                  {herramienta.retiradaEn
                    ? formatDate(herramienta.retiradaEn)
                    : "Fecha no registrada"}
                </dd>
              </div>
            </>
          )}

          {/* Timestamps — siempre visible */}
          <div className="border-t border-[#E2E8E0] pt-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6B7280]">
              <div>
                <span className="font-medium text-[#383838]">Registrado:</span>{" "}
                {formatDate(herramienta.creadoEn)}
              </div>
              <div>
                <span className="font-medium text-[#383838]">Última actualización:</span>{" "}
                {formatDate(herramienta.actualizadoEn)}
              </div>
            </div>
          </div>
        </dl>
      </div>
    </article>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
