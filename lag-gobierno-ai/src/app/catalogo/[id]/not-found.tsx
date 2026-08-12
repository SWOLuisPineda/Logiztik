import Link from "next/link";

/**
 * Página de "no encontrada" para herramientas con ID inexistente.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-12 w-12 text-[#6B7280] mb-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-[#383838] text-lg font-semibold mb-2">
        Herramienta no encontrada
      </h2>
      <p className="text-[#6B7280] text-sm mb-6">
        La herramienta que buscas no existe o fue removida del catálogo.
      </p>
      <Link
        href="/catalogo"
        className="bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
