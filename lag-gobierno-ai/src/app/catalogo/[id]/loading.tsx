/**
 * Loading state for /catalogo/[id] — Skeleton visible during fetch.
 */
export default function ToolDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>

      {/* Header skeleton */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-7 w-48 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded-full bg-gray-200" />
      </div>

      {/* Proveedor skeleton */}
      <div className="mb-6 h-4 w-28 rounded bg-gray-200" />

      {/* Detail card skeleton */}
      <div className="rounded-lg border border-[#E2E8E0] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-[#E2E8E0] py-2"
            >
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-36 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
