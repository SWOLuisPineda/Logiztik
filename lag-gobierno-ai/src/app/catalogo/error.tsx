"use client";

/**
 * Task 27 — Error boundary para /catalogo
 *
 * Next.js requiere que error.tsx sea un Client Component.
 * Recibe `reset` del framework y lo pasa a ErrorState.
 *
 * Captura errores de CatalogoPage (ej: Prisma no disponible).
 */

import ErrorState from "@/presentation/components/ErrorState";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CatalogoError({ reset }: ErrorPageProps) {
  return (
    <div className="py-8">
      <ErrorState reset={reset} />
    </div>
  );
}
