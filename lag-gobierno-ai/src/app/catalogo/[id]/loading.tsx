/**
 * Loading skeleton para la página de detalle de herramienta.
 * Se muestra mientras el Server Component resuelve el fetch por ID.
 */

export default function DetalleLoading() {
  return (
    <div className="animate-pulse" aria-label="Cargando detalle...">
      {/* BackButton skeleton */}
      <div className="h-4 w-36 rounded bg-gray-200 mb-6" />

      {/* Nombre + semáforo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 w-2/5 rounded bg-gray-200" />
        <div className="h-7 w-24 rounded-full bg-gray-200" />
      </div>

      {/* Proveedor */}
      <div className="h-4 w-1/4 rounded bg-gray-200 mb-6" />

      {/* Campos de detalle */}
      <div className="rounded-lg border border-[#E2E8E0] bg-white p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
