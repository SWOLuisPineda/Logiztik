"use client";

interface ErrorStateProps {
  reset: () => void;
}

/**
 * Estado de error amigable para el usuario.
 *
 * Client Component — requerido por Next.js error.tsx que debe ser CC.
 * No expone detalles internos del error.
 * Incluye botón "Reintentar" que llama a reset() para re-renderizar el boundary.
 */
export function ErrorState({ reset }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      {/* Icono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-[#DC2626]"
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

      <p className="text-base font-medium text-[#383838]">
        No se pudo cargar el catálogo
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">
        Ocurrió un problema al conectar con la base de datos. Intenta de nuevo.
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}
