/**
 * Skeleton de carga para la página de detalle de herramienta.
 */
export default function DetalleLoading() {
  return (
    <div className="animate-pulse" role="status" aria-busy="true" aria-label="Cargando detalle de herramienta">
      <span className="sr-only">Cargando detalle...</span>

      {/* BackButton skeleton */}
      <div className="h-5 w-36 bg-gray-200 rounded mb-6" />

      {/* Título */}
      <div className="h-8 w-80 bg-gray-200 rounded mb-4" />

      {/* Proveedor */}
      <div className="h-5 w-40 bg-gray-200 rounded mb-6" />

      {/* Card de detalles */}
      <div className="rounded-lg border border-[#E2E8E0] p-6">
        <div className="space-y-4">
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
          <div className="h-5 w-1/4 bg-gray-200 rounded" />
          <div className="h-5 w-1/2 bg-gray-200 rounded" />
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
