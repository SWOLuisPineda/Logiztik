"use client";

import ErrorState from "@/presentation/components/ErrorState";

/**
 * Error boundary for /catalogo.
 *
 * Client Component (requerido por Next.js para error.tsx).
 * Renderiza ErrorState con botón "Reintentar" via reset().
 */
export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
