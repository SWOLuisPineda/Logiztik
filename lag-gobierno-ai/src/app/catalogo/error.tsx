/**
 * Task 27 — error.tsx catálogo
 *
 * Error boundary para CatalogoPage.
 * Renderiza ErrorState con botón "Reintentar" que llama reset().
 *
 * Client Component — requerido por Next.js error.tsx.
 */

"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

interface CatalogoErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CatalogoError({ reset }: CatalogoErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <ErrorState
        reset={reset}
        message="No pudimos cargar el catálogo de herramientas. Por favor, intenta nuevamente."
      />
    </div>
  );
}
