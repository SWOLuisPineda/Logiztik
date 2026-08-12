"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * BackButton — Navegación de vuelta al catálogo.
 *
 * Usa Link con href `/catalogo` (no router.back()) para evitar salir del sitio.
 * Preserva query param `nivel` si está presente en la URL actual.
 */

export default function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#86B81C] hover:text-[#5C8314] focus:outline-none focus:underline"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Volver al catálogo
    </Link>
  );
}
