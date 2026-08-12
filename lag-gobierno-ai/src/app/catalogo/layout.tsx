/**
 * Layout para /catalogo y /catalogo/[id].
 *
 * Contenedor centrado con max-width, padding y fondo claro (design-system).
 * Usa font Inter via la clase del root layout.
 */
export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F5F7F0]">
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </main>
  );
}
