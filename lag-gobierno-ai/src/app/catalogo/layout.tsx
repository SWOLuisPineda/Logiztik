import { Header } from "@/presentation/components/Header";

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
    <div className="min-h-screen bg-[#F5F7F0]">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
