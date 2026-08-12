"use client";

interface ErrorStateProps {
  reset?: () => void;
  retryable?: boolean;
}

/**
 * Mensaje de error amigable cuando falla el fetch a BD.
 * No expone detalles internos. Incluye botón "Reintentar" si es retryable.
 * Client Component porque se usa dentro de error.tsx (Next.js requiere CC).
 */
export function ErrorState({ reset, retryable = true }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-12 w-12 text-[#DC2626] mb-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h2 className="text-[#383838] text-lg font-semibold mb-2">
        Ocurrió un error
      </h2>
      <p className="text-[#6B7280] text-sm mb-6 max-w-md">
        No pudimos cargar la información. Por favor intenta de nuevo más tarde.
      </p>
      {retryable && reset && (
        <button
          onClick={reset}
          className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Reintentar
        </button>
      )}
      {!retryable && (
        <p className="text-[#6B7280] text-xs">
          Si el problema persiste, contacta al equipo de soporte.
        </p>
      )}
    </div>
  );
}
