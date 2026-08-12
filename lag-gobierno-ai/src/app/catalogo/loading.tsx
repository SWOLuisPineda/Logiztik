/**
 * Loading skeleton para la página del catálogo.
 * Se muestra mientras el Server Component resuelve el fetch a BD.
 * Estructura: simula la FilterBar + un grid 3/2/1 de tarjetas skeleton.
 */

export default function CatalogoLoading() {
  return (
    <div className="animate-pulse" aria-label="Cargando catálogo...">
      {/* FilterBar skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-9 w-44 rounded-lg bg-gray-200" />
      </div>

      {/* Contador skeleton */}
      <div className="h-4 w-32 rounded bg-gray-200 mb-4" />

      {/* Grid de cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E2E8E0] bg-white p-6 space-y-3"
          >
            {/* Header: nombre + semáforo */}
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-3/5 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
            {/* Proveedor */}
            <div className="h-4 w-2/5 rounded bg-gray-200" />
            {/* Categoría */}
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            {/* Nivel badge */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-10 rounded bg-gray-200" />
              <div className="h-5 w-20 rounded-full bg-gray-200" />
            </div>
            {/* Footer */}
            <div className="pt-2 border-t border-[#E2E8E0]">
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
