/**
 * Task 26 — loading.tsx catálogo
 *
 * Skeleton/spinner visible durante el fetch de datos en CatalogoPage.
 * Renderiza un grid de placeholders.
 */

export default function CatalogoLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-100 rounded-lg border border-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
