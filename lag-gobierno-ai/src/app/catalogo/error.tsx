"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

/**
 * Error boundary para la ruta /catalogo.
 * Next.js requiere que error.tsx sea Client Component.
 */
export default function CatalogoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} retryable />;
}
