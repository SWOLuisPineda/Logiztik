import Link from "next/link";

/**
 * Página de herramienta no encontrada.
 *
 * Se activa cuando ToolDetailPage llama a notFound() —
 * es decir, cuando el ID existe en la URL pero no en la BD.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icono decorativo */}
      <svg
        aria-hidden="true"
        className="mb-4 h-12 w-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>

      <h1 className="text-lg font-semibold text-[#383838]">
        Herramienta no encontrada
      </h1>
      <p className="mt-1 text-sm text-[#6B7280] max-w-sm">
        No existe ninguna herramienta con ese identificador en el catálogo.
      </p>

      <Link
        href="/catalogo"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#5C8314] hover:text-[#86B81C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 rounded"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Volver al catálogo
      </Link>
    </div>
  );
}
