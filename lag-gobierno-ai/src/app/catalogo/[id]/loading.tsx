/**
 * Loading skeleton para la página de detalle de herramienta.
 * Se muestra durante el fetch de datos del Server Component.
 */
export default function DetalleLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
      <div className="rounded-lg border border-[#E2E8E0] p-6 space-y-4">
        <div className="h-7 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-6 w-28 bg-gray-200 rounded-full" />
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
