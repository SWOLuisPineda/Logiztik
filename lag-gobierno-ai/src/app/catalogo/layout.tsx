/**
 * Layout para la sección de catálogo.
 *
 * Contenedor centrado con ancho máximo y padding.
 * Reutiliza font Inter definida en root layout.
 */

import { ReactNode } from "react";

interface CatalogoLayoutProps {
  children: ReactNode;
}

export default function CatalogoLayout({ children }: CatalogoLayoutProps) {
  return <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>;
}
