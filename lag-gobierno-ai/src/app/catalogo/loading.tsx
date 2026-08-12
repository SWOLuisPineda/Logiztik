/**
 * Skeleton del catálogo — visible durante el fetch del Server Component.
 * Next.js muestra este archivo automáticamente mientras CatalogoPage resuelve.
 */
export default function CatalogoLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando catálogo de herramientas">
      {/* Barra de filtro placeholder */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
        <div className="h-9 w-48 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Grid de tarjetas placeholder — 6 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6 space-y-3"
          >
            {/* Nombre + semáforo */}
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-16 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            </div>
            {/* Proveedor */}
            <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-5 w-24 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
