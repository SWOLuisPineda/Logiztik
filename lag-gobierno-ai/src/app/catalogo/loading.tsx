/**
 * Task 26 — Loading skeleton para /catalogo
 *
 * Next.js muestra este componente automáticamente mientras CatalogoPage
 * está fetching datos (Suspense boundary automático del App Router).
 */

function SkeletonCard() {
  return (
    <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 flex flex-col gap-4 animate-pulse">
      {/* Cabecera: nombre + semáforo */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-40 rounded bg-[#E2E8E0]" />
        <div className="h-6 w-24 rounded-full bg-[#E2E8E0]" />
      </div>
      {/* Proveedor */}
      <div className="h-4 w-28 rounded bg-[#E2E8E0]" />
      {/* Badges */}
      <div className="flex gap-2">
        <div className="h-4 w-20 rounded bg-[#E2E8E0]" />
        <div className="h-5 w-24 rounded-full bg-[#E2E8E0]" />
      </div>
      {/* Link detalle */}
      <div className="mt-auto pt-2 border-t border-[#E2E8E0]">
        <div className="h-4 w-20 rounded bg-[#E2E8E0]" />
      </div>
    </div>
  );
}

export default function CatalogoLoading() {
  return (
    <div aria-label="Cargando catálogo..." aria-busy="true">
      {/* Skeleton de FilterBar */}
      <div className="mb-6 flex items-center gap-3 animate-pulse">
        <div className="h-4 w-48 rounded bg-[#E2E8E0]" />
        <div className="h-9 w-44 rounded-lg bg-[#E2E8E0]" />
      </div>
      {/* Skeleton de contador */}
      <div className="mb-4 h-4 w-40 rounded bg-[#E2E8E0] animate-pulse" />
      {/* Grid de skeletons */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    </div>
  );
}
