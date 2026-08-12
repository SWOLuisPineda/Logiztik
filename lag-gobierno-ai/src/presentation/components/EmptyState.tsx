/**
 * Task 20 — EmptyState
 *
 * Mensaje informativo cuando no hay herramientas que mostrar.
 * Usado cuando el catálogo está vacío o el filtro no produce resultados.
 *
 * Server Component — sin interactividad.
 */

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = "No hay herramientas registradas actualmente.",
  description,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F7F0]"
        aria-hidden="true"
      >
        <svg
          className="h-7 w-7 text-[#6B7280]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>

      <p className="text-base font-medium text-[#383838]">{message}</p>

      {description && (
        <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
      )}
    </div>
  );
}

export default EmptyState;
