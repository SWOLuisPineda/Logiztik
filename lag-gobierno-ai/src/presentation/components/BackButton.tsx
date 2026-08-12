"use client";

/**
 * BackButton — Client Component
 *
 * Navegación de vuelta al catálogo.
 * Usa Link (no router.back()) para evitar salir del sitio si el usuario
 * llegó por un link directo desde fuera de la aplicación.
 *
 * Preserva el query param ?nivel= activo para mantener el filtro
 * cuando el usuario regresa al listado.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C8314] hover:text-[#383838] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 rounded"
      aria-label="Volver al catálogo de herramientas"
    >
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
