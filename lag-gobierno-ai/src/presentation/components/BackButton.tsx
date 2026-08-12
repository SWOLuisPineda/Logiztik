"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * BackButton — Client Component
 *
 * Navega de vuelta al catálogo preservando el filtro ?nivel= si estaba activo.
 * Usa Link (no router.back()) para que funcione aunque el usuario haya llegado
 * por link directo desde fuera del sitio.
 */
export function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${encodeURIComponent(nivel)}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C8314] hover:text-[#383838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 rounded"
      aria-label="Volver al catálogo de herramientas"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      Volver al catálogo
    </Link>
  );
}
