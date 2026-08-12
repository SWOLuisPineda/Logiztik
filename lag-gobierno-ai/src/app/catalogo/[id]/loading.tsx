/**
 * Loading skeleton para la página de detalle de herramienta.
 */
export default function DetalleLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Back button skeleton */}
      <div className="h-4 w-32 bg-[#E2E8E0] rounded" />

      {/* Title */}
      <div className="h-7 w-64 bg-[#E2E8E0] rounded" />

      {/* Card skeleton */}
      <div className="rounded-lg border border-[#E2E8E0] p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-40 bg-[#E2E8E0] rounded" />
          <div className="h-6 w-24 bg-[#E2E8E0] rounded-full" />
        </div>
        <div className="h-4 w-32 bg-[#E2E8E0] rounded" />
        <div className="h-4 w-48 bg-[#E2E8E0] rounded" />
        <div className="h-4 w-28 bg-[#E2E8E0] rounded" />
        <div className="h-4 w-36 bg-[#E2E8E0] rounded" />
      </div>
    </div>
  );
}
