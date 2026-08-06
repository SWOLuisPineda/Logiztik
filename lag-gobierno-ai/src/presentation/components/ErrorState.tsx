"use client";

/**
 * Task 21 — ErrorState
 *
 * Client Component (requerido por Next.js: error.tsx debe ser CC).
 *
 * Muestra un mensaje de error amigable cuando falla la carga de datos.
 * No expone detalles técnicos al usuario.
 * El botón "Reintentar" llama a reset() — proporcionado por Next.js error boundary.
 *
 * Dependency Rule: no importa de @/domain, @/application ni @/infrastructure.
 */

interface ErrorStateProps {
  reset: () => void;
}

export default function ErrorState({ reset }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      {/* Icono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-red-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>

      <p className="mb-1 text-base font-medium text-[#383838]">
        Ocurrió un error al cargar los datos.
      </p>
      <p className="mb-6 text-sm text-[#6B7280]">
        Si el problema persiste, contacta al equipo de TI.
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C] focus-visible:ring-offset-2 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
