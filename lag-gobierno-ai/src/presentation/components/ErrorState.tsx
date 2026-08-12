"use client";

/**
 * ErrorState — Mensaje de error amigable con botón "Reintentar" condicional.
 *
 * Client Component porque se usa dentro de `error.tsx` (Next.js lo requiere como CC).
 * No expone detalles internos del error.
 * Si retryable=true, muestra botón "Reintentar". Si false, sugiere contactar soporte.
 */

interface ErrorStateProps {
  reset: () => void;
  retryable?: boolean;
}

export default function ErrorState({
  reset,
  retryable = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="mb-4 h-12 w-12 text-[#DC2626]/30"
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
      <h2 className="mb-2 text-lg font-semibold text-[#383838]">
        Ocurrió un error
      </h2>
      <p className="mb-6 text-sm text-[#6B7280]">
        {retryable
          ? "No pudimos cargar la información. Por favor, intenta de nuevo."
          : "Ocurrió un problema inesperado. Si persiste, contacta al equipo de soporte."}
      </p>
      {retryable && (
        <button
          onClick={reset}
          className="rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
