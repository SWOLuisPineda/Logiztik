"use client";

/**
 * Task 21 — ErrorState
 *
 * Mensaje de error amigable con botón "Reintentar".
 * Client Component — requerido por Next.js error.tsx y por el handler reset().
 *
 * No expone detalles internos. Sugiere contactar soporte como fallback.
 */

interface ErrorStateProps {
  /** reset() del error boundary de Next.js para reintentar el render. */
  reset: () => void;
  message?: string;
}

export function ErrorState({
  reset,
  message = "Ocurrió un error al cargar el catálogo de herramientas.",
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50"
        aria-hidden="true"
      >
        <svg
          className="h-7 w-7 text-[#DC2626]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <p className="text-base font-medium text-[#383838]">{message}</p>

      <p className="mt-1 mb-6 text-sm text-[#6B7280]">
        Si el problema persiste, contacta al equipo de Gobernanza AI.
      </p>

      <button
        type="button"
        onClick={reset}
        className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}

export default ErrorState;
