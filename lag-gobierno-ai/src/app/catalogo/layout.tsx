/**
 * Task 32 — Layout del módulo catálogo
 *
 * Contenedor centrado con ancho máximo y padding consistente.
 * Tipografía Inter heredada del layout raíz (src/app/layout.tsx).
 * Todas las páginas bajo /catalogo heredan este wrapper.
 */

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
