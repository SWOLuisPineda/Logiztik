"use client";

/**
 * ErrorState — Client Component
 *
 * Mensaje de error amigable para cuando falla el fetch a BD.
 * Requiere "use client" porque se usa dentro de error.tsx de Next.js,
 * que debe ser un Client Component.
 *
 * H4/DT-02: El botón "Reintentar" solo se muestra si retryable=true (errores transitorios).
 * Para errores permanentes, muestra solo el mensaje y sugiere contactar soporte.
 *
 * No expone detalles internos del error al usuario.
 */

interface ErrorStateProps {
  reset: () => void;
  /** Si true, muestra botón Reintentar. Si false, sugiere contactar soporte. Default: true */
  retryable?: boolean;
}

export function ErrorState({ reset, retryable = true }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      {/* Ícono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p className="text-base font-medium text-red-800">
        El catálogo no está disponible en este momento
      </p>
      <p className="mt-1 text-sm text-red-600">
        {retryable
          ? "Ocurrió un error al cargar las herramientas. Intenta de nuevo."
          : "Ocurrió un error inesperado. Si persiste, contacta al equipo de soporte."}
      </p>
      {retryable && (
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
