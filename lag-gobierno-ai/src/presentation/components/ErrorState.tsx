"use client";

/**
 * ErrorState — Client Component
 *
 * Muestra un mensaje de error con un botón de reintento.
 * Pensado para usarse con el error boundary de Next.js.
 */

interface ErrorStateProps {
  reset: () => void;
}

export default function ErrorState({ reset }: ErrorStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-[#383838] mb-4">
        Ha ocurrido un error al cargar los datos.
      </p>
      <button
        onClick={reset}
        className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2"
      >
        Reintentar
      </button>
    </div>
  );
}
