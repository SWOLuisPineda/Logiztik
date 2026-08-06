/**
 * Task 20 — EmptyState
 *
 * Server Component. Mensaje informativo cuando no hay herramientas
 * disponibles — catálogo vacío o filtro sin resultados.
 *
 * Dependency Rule: no importa de @/domain ni @/infrastructure.
 */

interface EmptyStateProps {
  /** Mensaje alternativo opcional. Por defecto: mensaje estándar del catálogo. */
  mensaje?: string;
}

export default function EmptyState({
  mensaje = "No hay herramientas registradas actualmente.",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8E0] bg-[#F5F7F0] px-6 py-16 text-center"
    >
      {/* Icono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-[#6B7280]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <p className="text-base font-medium text-[#383838]">{mensaje}</p>
    </div>
  );
}
