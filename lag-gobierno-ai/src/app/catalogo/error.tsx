"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

/**
 * error.tsx — Error boundary del catálogo (Next.js requiere CC).
 *
 * Captura errores no manejados en page.tsx y loading.tsx.
 * Renderiza ErrorState con botón "Reintentar" que invoca reset().
 */
export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
