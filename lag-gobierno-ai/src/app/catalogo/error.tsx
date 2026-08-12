"use client";

import { ErrorState } from "@/presentation/components/ErrorState";

interface CatalogoErrorProps {
  readonly reset: () => void;
}

/**
 * Error boundary del catálogo.
 *
 * Next.js requiere que error.tsx sea un Client Component.
 * Delega el renderizado a ErrorState (CC reutilizable).
 */
export default function CatalogoError({ reset }: CatalogoErrorProps) {
  return <ErrorState reset={reset} />;
}
