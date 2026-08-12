/**
 * Loading skeleton para la página del catálogo.
 * Se muestra mientras se resuelve el Server Component con datos.
 */
export default function CatalogoLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-24 bg-[#E2E8E0] rounded" />
        <div className="h-9 w-40 bg-[#E2E8E0] rounded-lg" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E2E8E0] p-6 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-[#E2E8E0] rounded" />
              <div className="h-6 w-20 bg-[#E2E8E0] rounded-full" />
            </div>
            <div className="h-4 w-24 bg-[#E2E8E0] rounded" />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-[#E2E8E0] rounded" />
              <div className="h-6 w-20 bg-[#E2E8E0] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
