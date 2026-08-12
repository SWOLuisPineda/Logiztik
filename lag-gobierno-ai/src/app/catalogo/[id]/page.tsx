import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHerramientaByIdHandler } from "@/infrastructure/container";
import { GetHerramientaParamsSchema } from "@/presentation/validations/herramienta.validation";
import SemaforoIndicator from "@/presentation/components/SemaforoIndicator";
import NivelBadge from "@/presentation/components/NivelBadge";
import BackButton from "@/presentation/components/BackButton";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsed = GetHerramientaParamsSchema.safeParse({ id: params.id });
  if (!parsed.success) return { title: "Herramienta no encontrada — LAG" };

  const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);
  if (!herramienta) return { title: "Herramienta no encontrada — LAG" };

  return { title: `${herramienta.nombre} — Catálogo LAG` };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const parsed = GetHerramientaParamsSchema.safeParse({ id: params.id });
  if (!parsed.success) notFound();

  const herramienta = await getHerramientaByIdHandler.execute(parsed.data.id);
  if (!herramienta) notFound();

  const esRetirada = herramienta.estado === "Retirada";

  return (
    <div className="space-y-6">
      <Suspense>
        <BackButton />
      </Suspense>

      <h1 className="text-2xl font-bold text-[#383838]">{herramienta.nombre}</h1>

      {esRetirada && (
        <div
          className="bg-red-50 border border-[#DC2626] rounded-lg p-4"
          role="alert"
        >
          <p className="text-[#DC2626] font-medium">
            Esta herramienta NO está autorizada para uso en LAG.
          </p>
        </div>
      )}

      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Proveedor</dt>
          <dd className="text-[#383838]">{herramienta.proveedor}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Estado</dt>
          <dd>
            <SemaforoIndicator
              estado={
                herramienta.estado as "Activa" | "Retirada" | "Condicional"
              }
            />
          </dd>
        </div>

        {!esRetirada && (
          <>
            <div>
              <dt className="text-sm font-medium text-[#6B7280]">Categoría</dt>
              <dd className="text-[#383838]">
                {herramienta.categoria ?? (
                  <span className="italic text-[#6B7280]">Sin categoría</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-[#6B7280]">
                Nivel máximo de clasificación
              </dt>
              <dd>
                <NivelBadge nivel={herramienta.nivelMaximo} />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-[#6B7280]">DPA</dt>
              <dd className="text-[#383838]">
                {herramienta.dpa === "No aplica"
                  ? "Información no disponible aún"
                  : herramienta.dpa}
              </dd>
            </div>
          </>
        )}

        {esRetirada && herramienta.razonRetiro && (
          <div>
            <dt className="text-sm font-medium text-[#6B7280]">
              Razón de retiro
            </dt>
            <dd className="text-[#383838]">{herramienta.razonRetiro}</dd>
          </div>
        )}

        {esRetirada && (
          <div>
            <dt className="text-sm font-medium text-[#6B7280]">Fecha de retiro</dt>
            <dd className="text-[#383838]">
              {herramienta.retiradaEn
                ? new Date(herramienta.retiradaEn).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha no registrada"}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
