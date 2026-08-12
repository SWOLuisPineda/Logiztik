/**
 * Skeleton de la página de detalle.
 * Visible durante el fetch del ToolDetailPage Server Component.
 */
export default function DetalleLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando detalle de herramienta">
      {/* Botón volver placeholder */}
      <div className="mb-6">
        <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Card principal */}
      <div className="rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-8 space-y-6">
        {/* Nombre */}
        <div className="h-8 w-2/3 rounded bg-gray-200 animate-pulse" />

        {/* Semáforo + nivel */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
        </div>

        {/* Separador */}
        <div className="border-t border-[#E2E8E0]" />

        {/* Campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3.5 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
