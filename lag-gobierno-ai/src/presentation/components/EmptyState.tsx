/**
 * EmptyState — Server Component
 *
 * Mensaje informativo cuando no hay herramientas que mostrar.
 * Se usa cuando el catálogo está vacío o el filtro no tiene resultados.
 */
export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8E0] bg-[#F5F7F0] px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <svg
        className="mb-4 h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-base font-medium text-[#383838]">
        No hay herramientas registradas actualmente
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">
        Intenta ajustar los filtros o vuelve más tarde.
      </p>
    </div>
  );
}
