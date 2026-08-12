/**
 * Loading skeleton para la página de catálogo.
 * Se muestra durante el fetch de datos del Server Component.
 */
export default function CatalogoLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
      <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E2E8E0] p-6 space-y-3"
          >
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
