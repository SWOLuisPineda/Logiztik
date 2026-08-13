/**
 * Loading skeleton para la página de detalle de herramienta.
 */

export default function DetalleLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Back button skeleton */}
      <div className="h-4 w-32 bg-lag-border rounded" />

      {/* Title + semáforo */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 bg-lag-border rounded" />
        <div className="h-5 w-24 bg-lag-border rounded" />
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 bg-lag-border rounded" />
            <div className="h-5 w-40 bg-lag-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
