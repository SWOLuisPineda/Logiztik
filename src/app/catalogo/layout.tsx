/**
 * Layout del módulo catálogo.
 *
 * Aplica contenedor centrado con max-width, padding.
 * La tipografía Inter se hereda del layout raíz (globals.css / app layout).
 * Todas las páginas hijas (/catalogo, /catalogo/[id]) heredan este wrapper.
 */

export default function CatalogoLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {children}
    </section>
  );
}
