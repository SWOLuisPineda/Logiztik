"use client";

/**
 * Task 22 — BackButton
 *
 * Client Component. Navega de vuelta al catálogo preservando el filtro
 * de nivel si está presente en la URL actual.
 *
 * Usa Link (no router.back()) para garantizar que el usuario siempre
 * llegue al catálogo, incluso si vino de un link externo directo.
 *
 * Lógica de preservación de filtro:
 *   - La URL del detalle puede incluir ?nivel=X (propagado por ToolCard).
 *   - Si existe, BackButton construye href="/catalogo?nivel=X".
 *   - Si no existe, href="/catalogo".
 *
 * Dependency Rule: no importa de @/domain, @/application ni @/infrastructure.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${encodeURIComponent(nivel)}` : "/catalogo";

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C8314] hover:text-[#86B81C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C] focus-visible:ring-offset-2 rounded"
    >
      {/* Flecha izquierda */}
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Volver al catálogo
    </Link>
  );
}
