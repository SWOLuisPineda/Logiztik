/**
 * Task 29 — Loading skeleton para /catalogo/[id]
 *
 * Next.js muestra este componente mientras ToolDetailPage fetching datos.
 */

export default function ToolDetailLoading() {
  return (
    <div aria-label="Cargando detalle..." aria-busy="true" className="animate-pulse">
      {/* BackButton skeleton */}
      <div className="mb-6 h-5 w-36 rounded bg-[#E2E8E0]" />

      {/* Card de detalle */}
      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-8 flex flex-col gap-6">
        {/* Cabecera: nombre + semáforo */}
        <div className="flex items-start justify-between gap-4">
          <div className="h-8 w-64 rounded bg-[#E2E8E0]" />
          <div className="h-7 w-28 rounded-full bg-[#E2E8E0]" />
        </div>

        {/* Proveedor */}
        <div className="h-5 w-40 rounded bg-[#E2E8E0]" />

        {/* Campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-20 rounded bg-[#E2E8E0]" />
              <div className="h-5 w-32 rounded bg-[#E2E8E0]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
