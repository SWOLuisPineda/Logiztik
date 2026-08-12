import Link from "next/link";

/**
 * Not Found page for /catalogo/[id].
 *
 * Shown when a herramienta ID doesn't exist.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="mb-4 h-12 w-12 text-[#E2E8E0]"
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
      <h2 className="mb-2 text-lg font-semibold text-[#383838]">
        Herramienta no encontrada
      </h2>
      <p className="mb-6 text-sm text-[#6B7280]">
        La herramienta que buscas no existe o fue eliminada del catálogo.
      </p>
      <Link
        href="/catalogo"
        className="rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
