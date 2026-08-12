/**
 * loading.tsx — Skeleton del catálogo durante fetch.
 *
 * Next.js App Router lo muestra automáticamente mientras
 * el Server Component (page.tsx) resuelve su data fetching.
 */
export default function CatalogoLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Cargando catálogo de herramientas">
      {/* Barra de filtros skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="h-9 w-40 rounded-lg bg-gray-200" />
      </div>

      {/* Grid de tarjetas skeleton */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-2/5 rounded bg-gray-100" />
            </div>
            <div className="mt-4 h-6 w-24 rounded-full bg-gray-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
