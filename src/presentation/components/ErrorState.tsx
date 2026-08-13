"use client";

/**
 * ErrorState — Mensaje de error amigable con botón de reintentar.
 *
 * Client Component (requerido por Next.js error.tsx boundary).
 * Usa bg-secondary y tokens del design system.
 */

interface ErrorStateProps {
  readonly reset: () => void;
  readonly retryable?: boolean;
}

export default function ErrorState({
  reset,
  retryable = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-lag-bg-secondary rounded-lg border border-lag-border">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-semaforo-rojo mb-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-lg text-lag-text-primary mb-4">
        Ocurrió un error al cargar los datos.
      </p>
      {retryable ? (
        <button
          type="button"
          onClick={reset}
          className="bg-brand-primary hover:bg-brand-dark text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Reintentar
        </button>
      ) : (
        <p className="text-sm text-lag-text-secondary">
          Si el problema persiste, contacta al equipo de soporte.
        </p>
      )}
    </div>
  );
}
