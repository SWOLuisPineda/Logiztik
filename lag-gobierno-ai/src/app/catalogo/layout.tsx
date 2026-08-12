/**
 * Layout del catálogo de herramientas.
 *
 * Aplica el contenedor centrado con max-width para todas las sub-rutas:
 * /catalogo, /catalogo/[id], loading, error, not-found.
 *
 * Tipografía Inter se hereda del layout raíz (globals.css / next/font).
 */
export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 bg-[#F5F7F0] min-h-screen">
      {children}
    </main>
  );
}
