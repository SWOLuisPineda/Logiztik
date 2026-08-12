import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s — LAG",
    default: "Catálogo de Herramientas AI — LAG",
  },
};

/**
 * Layout del módulo /catalogo.
 *
 * Aplica:
 * - Fuente Inter (design-system.md: "Inter", system-ui, sans-serif)
 * - Fondo bg-secondary #F5F7F0
 * - Contenedor centrado max-w-5xl con padding responsivo
 * - min-h-screen para que el fondo cubra toda la viewport
 */
export default function CatalogoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${inter.variable} min-h-screen bg-[#F5F7F0] font-[family-name:var(--font-inter)]`}
    >
      {/* Banda de cabecera con marca LAG */}
      <header className="bg-white border-b border-[#E2E8E0]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
          <span
            className="text-sm font-semibold text-[#86B81C] tracking-wide uppercase"
            aria-label="Logiztik Alliance Group"
          >
            LAG
          </span>
          <span className="text-[#E2E8E0]" aria-hidden="true">
            /
          </span>
          <span className="text-sm text-[#6B7280]">Gobierno AI</span>
        </div>
      </header>

      {/* Contenido principal centrado */}
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
