"use client";

/**
 * Error boundary para el módulo catálogo.
 * Next.js requiere que error.tsx sea Client Component.
 * Renderiza ErrorState con la función reset() para reintentar.
 */

import { ErrorState } from "@/presentation/components/ErrorState";

export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
