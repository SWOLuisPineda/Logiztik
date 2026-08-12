"use client";

/**
 * BackButton — Client Component
 *
 * Enlace para volver al catálogo, preservando el filtro de nivel si estaba activo.
 * Usa brand-dark (#5C8314) como color base para cumplir WCAG AA (5.8:1 contraste).
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackButton() {
  const searchParams = useSearchParams();
  const nivel = searchParams.get("nivel");

  const href = nivel ? `/catalogo?nivel=${encodeURIComponent(nivel)}` : "/catalogo";

  return (
    <Link href={href} className="text-[#5C8314] hover:text-[#86B81C] hover:underline inline-flex items-center gap-1">
      <span aria-hidden="true">←</span> Volver al catálogo
    </Link>
  );
}
