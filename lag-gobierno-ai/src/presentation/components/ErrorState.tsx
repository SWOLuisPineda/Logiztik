"use client";

/**
 * ErrorState — Client Component
 *
 * Mensaje de error amigable cuando falla el fetch a BD.
 * No expone detalles internos (stack, queries).
 * Incluye botón "Reintentar" que invoca reset() del error boundary de Next.js.
 *
 * Es Client Component porque se usa dentro de error.tsx,
 * que Next.js requiere como CC.
 */
interface ErrorStateProps {
  reset: () => void;
}

export function ErrorState({ reset }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center"
      role="alert"
      aria-live="assertive"
    >
      <svg
        className="mb-4 h-12 w-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p className="text-base font-medium text-[#383838]">
        No se pudo cargar el catálogo
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">
        Ocurrió un error al conectar con la base de datos. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 transition-colors"
        type="button"
      >
        Reintentar
      </button>
    </div>
  );
}
