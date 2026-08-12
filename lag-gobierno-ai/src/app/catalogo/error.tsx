"use client";

import { useEffect } from "react";
import ErrorState from "@/presentation/components/ErrorState";

/**
 * Error boundary para la ruta /catalogo.
 * Next.js requiere que sea Client Component.
 * Renderiza ErrorState con el reset de Next.js.
 */

export default function CatalogoError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("CatalogoError:", error);
  }, [error]);

  const msg = error.message.toLowerCase();
  const retryable =
    msg.includes("p1001") ||
    msg.includes("p1002") ||
    msg.includes("p1008") ||
    msg.includes("timeout") ||
    msg.includes("tempor") ||
    msg.includes("network") ||
    msg.includes("connect");

  return <ErrorState reset={reset} retryable={retryable} />;
}
