"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Botón de vuelta al catálogo.
 *
 * Client Component — necesita useSearchParams para leer el filtro activo.
 * Usa Link (no router.back()) para funcionar correctamente cuando el usuario
 * llega al detalle por un link directo (no desde el catálogo).
 * Preserva el query param ?nivel= si estaba presente en la URL actual.
 */
export function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${encodeURIComponent(nivel)}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C8314] hover:text-[#86B81C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 rounded"
      aria-label="Volver al catálogo de herramientas"
    >
      {/* Flecha izquierda */}
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      Volver al catálogo
    </Link>
  );
}
