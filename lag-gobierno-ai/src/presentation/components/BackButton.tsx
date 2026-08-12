"use client";

/**
 * Task 22 — BackButton
 *
 * Navegación de vuelta al catálogo.
 * Usa Link (no router.back()) — evita salir del sitio si llegó por link directo.
 *
 * H10 (design.md): Si no hay ?nivel en la URL, href = "/catalogo" sin params.
 * Si hay ?nivel, lo preserva para mantener el contexto del filtro activo.
 *
 * Client Component — necesita useSearchParams().
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Volver al catálogo" }: BackButtonProps) {
  const searchParams = useSearchParams();
  const nivelParam = searchParams.get("nivel");

  // H10: preservar ?nivel solo si existe en la URL actual
  const href = nivelParam
    ? `/catalogo?nivel=${encodeURIComponent(nivelParam)}`
    : "/catalogo";

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
      {label}
    </Link>
  );
}

export default BackButton;
