"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

/**
 * Error boundary para la sección /catalogo.
 * Next.js requiere que error.tsx sea Client Component.
 * Renderiza ErrorState con el callback reset() para reintentar.
 */
export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
