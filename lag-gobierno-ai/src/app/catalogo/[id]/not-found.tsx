import Link from "next/link";

/**
 * Página not-found para ID de herramienta inexistente.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-lg font-medium text-[#383838]">
        Herramienta no encontrada
      </h2>
      <p className="mt-1 text-sm text-[#6B7280] mb-6">
        El ID proporcionado no corresponde a ninguna herramienta en el catálogo.
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
