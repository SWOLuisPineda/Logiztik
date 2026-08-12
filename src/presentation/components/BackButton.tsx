"use client";

import Link from "next/link";

/**
 * BackButton — Navega a /catalogo preservando el filtro de nivel.
 *
 * Recibe `nivel` como prop desde la page de detalle.
 * Usa Link (no router.back()) para evitar salir del sitio en acceso directo.
 * Usa SVG chevron para consistencia con el design system.
 */

interface BackButtonProps {
  readonly nivel?: string | null;
}

export default function BackButton({ nivel }: BackButtonProps) {
  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-lag-text-secondary hover:text-lag-text-primary transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
          clipRule="evenodd"
        />
      </svg>
      <span>Volver al catálogo</span>
    </Link>
  );
}
