import Link from "next/link";

/**
 * not-found.tsx — Se muestra cuando el ID no corresponde a ninguna herramienta.
 * Triggered por notFound() en ToolDetailPage.
 */

export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        aria-hidden="true"
        className="mb-4 h-16 w-16 text-[#6B7280]"
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
      <h1 className="text-xl font-bold text-[#383838]">
        Herramienta no encontrada
      </h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        La herramienta que buscas no existe en el catálogo o fue removida.
      </p>
      <Link
        href="/catalogo"
        className="mt-6 inline-flex items-center rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
