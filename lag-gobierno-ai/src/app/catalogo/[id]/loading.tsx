/**
 * loading.tsx — Skeleton del detalle de herramienta durante fetch.
 */
export default function DetalleLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Cargando detalle de herramienta">
      {/* Back button skeleton */}
      <div className="h-4 w-36 rounded bg-gray-200" />

      {/* Título skeleton */}
      <div className="h-7 w-2/3 rounded bg-gray-200" />

      {/* Info principal skeleton */}
      <div className="space-y-4 rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-5 w-24 rounded-full bg-gray-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded bg-gray-100" />
          <div className="h-4 w-1/4 rounded bg-gray-100" />
          <div className="h-4 w-2/5 rounded bg-gray-100" />
          <div className="h-4 w-1/3 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
