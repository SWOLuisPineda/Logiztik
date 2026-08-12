"use client";

interface ErrorStateProps {
  reset: () => void;
}

/**
 * Mensaje de error amigable cuando falla la carga de datos.
 * No expone detalles internos. Incluye botón "Reintentar" que invoca reset().
 * Client Component porque se usa dentro de error.tsx (requerido por Next.js como CC).
 */
export function ErrorState({ reset }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-[#383838] font-medium mb-2">
        Ocurrió un error al cargar los datos
      </p>
      <p className="text-[#6B7280] mb-6">
        No se pudo conectar con el servidor. Intenta de nuevo en unos momentos.
      </p>
      <button
        onClick={reset}
        className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 font-medium transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
