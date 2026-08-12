import Link from "next/link";

/**
 * Página not-found para detalle de herramienta.
 * Se muestra cuando el ID no corresponde a ninguna herramienta.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-[#383838] mb-2">
        Herramienta no encontrada
      </h2>
      <p className="text-[#6B7280] mb-6">
        La herramienta que buscas no existe o fue removida del catálogo.
      </p>
      <Link
        href="/catalogo"
        className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 font-medium transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
