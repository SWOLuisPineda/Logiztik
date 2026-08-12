/**
 * Estado vacío — se muestra cuando no hay herramientas para listar.
 *
 * Casos de uso:
 *   - El catálogo está vacío (seed no ejecutado)
 *   - El filtro activo no tiene resultados
 */
export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-gray-300"
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
        Intenta ajustar los filtros o consulta con el equipo de Gobernanza AI.
      </p>
    </div>
  );
}
