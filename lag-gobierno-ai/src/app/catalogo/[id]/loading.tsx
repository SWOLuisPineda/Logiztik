/**
 * Task 29 — loading.tsx detalle
 *
 * Skeleton/spinner visible durante el fetch de datos en ToolDetailPage.
 */

export default function ToolDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-64" />
      <div className="h-6 bg-gray-200 rounded-lg w-48" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
