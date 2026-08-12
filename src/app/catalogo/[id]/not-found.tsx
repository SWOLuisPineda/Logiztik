import Link from "next/link";

/**
 * Not Found page para /catalogo/[id] cuando el ID no existe en BD.
 */

export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-lag-bg-secondary rounded-lg border border-lag-border">
      <h2 className="text-xl font-semibold text-lag-text-primary mb-2">
        Herramienta no encontrada
      </h2>
      <p className="text-lag-text-secondary mb-6">
        La herramienta que buscas no existe en el catálogo.
      </p>
      <Link
        href="/catalogo"
        className="bg-brand-primary hover:bg-brand-dark text-white rounded-lg px-4 py-2 font-medium transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
