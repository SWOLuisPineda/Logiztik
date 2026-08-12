/**
 * Task 30 — not-found.tsx detalle
 *
 * Página personalizada cuando se intenta acceder a una herramienta inexistente.
 * Renderiza mensaje amigable + link de vuelta al catálogo.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7F0]">
        <svg
          className="h-8 w-8 text-[#6B7280]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[#383838] mb-2">
        Herramienta no encontrada
      </h1>

      <p className="text-[#6B7280] mb-8 max-w-md">
        Lo sentimos, la herramienta que buscas no existe o ha sido removida del
        catálogo.
      </p>

      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Volver al catálogo
      </Link>
    </div>
  );
}
