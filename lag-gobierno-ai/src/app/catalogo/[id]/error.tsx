"use client";

import Link from "next/link";

/**
 * Error boundary para la página de detalle /catalogo/[id].
 * Ofrece contexto específico de "estabas viendo un detalle" y link de vuelta.
 */
export default function DetalleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-[#383838] font-medium mb-2">
        No se pudo cargar el detalle de la herramienta
      </p>
      <p className="text-[#6B7280] mb-6">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al
        catálogo.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/catalogo"
          className="border border-[#E2E8E0] rounded-lg px-4 py-2 font-medium text-[#383838] hover:bg-[#F5F7F0] transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
