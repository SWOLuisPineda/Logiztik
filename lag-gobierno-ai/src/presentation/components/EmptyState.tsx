/**
 * Mensaje informativo cuando no hay resultados (filtro vacío o catálogo sin datos).
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-12 w-12 text-[#6B7280] mb-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.75 7.5h16.5"
        />
      </svg>
      <p className="text-[#6B7280] text-lg font-medium">
        No hay herramientas registradas actualmente
      </p>
      <p className="text-[#6B7280] text-sm mt-1">
        Intenta cambiar los filtros o vuelve más tarde.
      </p>
    </div>
  );
}
