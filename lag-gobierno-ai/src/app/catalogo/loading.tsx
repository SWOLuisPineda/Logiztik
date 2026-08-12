/**
 * Skeleton de carga para la página del catálogo.
 * Se muestra durante el fetch de datos en Server Components.
 */
export default function CatalogoLoading() {
  return (
    <div className="animate-pulse" role="status" aria-busy="true" aria-label="Cargando catálogo">
      <span className="sr-only">Cargando catálogo...</span>

      {/* Título */}
      <div className="h-8 w-64 bg-gray-200 rounded mb-6" />

      {/* FilterBar skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-10 w-40 bg-gray-200 rounded-lg" />
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E2E8E0] p-6 h-40 bg-gray-50"
          >
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
