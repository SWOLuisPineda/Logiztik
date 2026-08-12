/**
 * EmptyState — Server Component
 *
 * Mensaje informativo cuando el catálogo está vacío.
 * Sin filtro activo: el catálogo no tiene herramientas registradas.
 */

export function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8E0] bg-[#F5F7F0] px-6 py-16 text-center"
    >
      {/* Ícono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-[#6B7280]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <p className="text-base font-medium text-[#383838]">
        No hay herramientas registradas actualmente
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">
        El catálogo de herramientas AI aprobadas aún no tiene registros.
      </p>
    </div>
  );
}
