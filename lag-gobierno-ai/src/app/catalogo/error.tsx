"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

/**
 * Error boundary del catálogo. Client Component requerido por Next.js.
 * Renderiza ErrorState con botón de reintentar.
 */
export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
