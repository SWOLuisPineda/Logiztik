/**
 * Layout para la sección /catalogo.
 * Contenedor centrado con max-width y padding.
 */
export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
  );
}
