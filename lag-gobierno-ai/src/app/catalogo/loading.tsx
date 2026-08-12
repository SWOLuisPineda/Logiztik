/**
 * Loading state for /catalogo — Skeleton visible during fetch.
 */
export default function CatalogoLoading() {
  return (
    <div className="animate-pulse">
      {/* Filter skeleton */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-9 w-44 rounded-lg bg-gray-200" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="h-5 w-36 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded-full bg-gray-200" />
            </div>
            <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-5 w-20 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
