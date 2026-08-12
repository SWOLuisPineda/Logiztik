"use client";

interface ErrorStateProps {
  reset: () => void;
  /** Si false, oculta el botón de reintentar (error permanente). Default: true. */
  retryable?: boolean;
}

/**
 * Mensaje de error amigable. Client Component (requerido por error.tsx de Next.js).
 * Si retryable=true, muestra botón "Reintentar". Si false, sugiere contactar soporte.
 */
export function ErrorState({ reset, retryable = true }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-12 w-12 text-red-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <p className="text-lg font-medium text-[#383838]">
        Ocurrió un error al cargar el catálogo
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">
        {retryable
          ? "No pudimos obtener la información. Por favor intenta de nuevo."
          : "No pudimos obtener la información. Si el problema persiste, contacta al equipo de soporte."}
      </p>
      {retryable && (
        <button
          onClick={reset}
          className="mt-6 bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
