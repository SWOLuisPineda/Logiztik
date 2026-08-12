"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Navegación de vuelta al catálogo.
 * Usa Link con href /catalogo (no router.back()) para evitar salir del sitio.
 * Preserva query param `nivel` si está presente en la URL actual.
 */
export function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");
  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#86B81C] hover:text-[#5C8314] transition-colors"
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
  );
}
