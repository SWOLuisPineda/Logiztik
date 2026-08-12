"use client";

import Link from "next/link";

interface BackButtonProps {
  /** Nivel de filtro activo para preservar al volver al catálogo. */
  nivel?: string | null;
}

/**
 * Navegación de vuelta al catálogo.
 * Usa Link (no router.back()) para evitar salir del sitio.
 * Preserva query param `nivel` si se pasa como prop desde el Server Component.
 *
 * Contraste: usa text-[#383838] (10.5:1 sobre blanco, ~8.5:1 sobre #F5F7F0)
 * para cumplir WCAG AA. Hover usa brand-dark.
 */
export function BackButton({ nivel }: BackButtonProps) {
  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[#383838] hover:text-[#5C8314] font-medium transition-colors"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver al catálogo
    </Link>
  );
}
