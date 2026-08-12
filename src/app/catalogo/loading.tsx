/**
 * Loading skeleton para la página del catálogo.
 * Next.js lo muestra automáticamente como Suspense boundary durante el fetch.
 */

export default function CatalogoLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Filtro skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-48 bg-lag-border rounded" />
        <div className="h-10 w-48 bg-lag-border rounded-lg" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-lag-border p-6 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-lag-border rounded" />
              <div className="h-5 w-20 bg-lag-border rounded" />
            </div>
            <div className="h-4 w-24 bg-lag-border rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-lag-border rounded-full" />
              <div className="h-4 w-16 bg-lag-border rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
