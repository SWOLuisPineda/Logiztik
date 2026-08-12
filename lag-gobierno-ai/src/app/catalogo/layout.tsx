import { Metadata } from "next";

/**
 * Layout del módulo catálogo.
 * Contenedor centrado con ancho máximo y padding consistente.
 * Se aplica a /catalogo y /catalogo/[id].
 */

export const metadata: Metadata = {
  title: {
    template: "%s — Catálogo AI LAG",
    default: "Catálogo de Herramientas AI — LAG",
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {children}
    </main>
  );
}
