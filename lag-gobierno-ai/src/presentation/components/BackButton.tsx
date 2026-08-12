"use client";

import Link from "next/link";

interface BackButtonProps {
  nivel?: string | null;
}

/**
 * Botón de navegación de vuelta al catálogo.
 * Usa Link (no router.back()) para evitar salir del sitio si el usuario llegó por link directo.
 * Recibe nivel como prop desde el Server Component para preservar el filtro activo.
 */
export function BackButton({ nivel }: BackButtonProps) {
  const href = nivel ? `/catalogo?nivel=${nivel}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[#383838] hover:text-[#5C8314] font-medium transition-colors"
    >
      <span aria-hidden="true">&larr;</span>
      Volver al catálogo
    </Link>
  );
}
