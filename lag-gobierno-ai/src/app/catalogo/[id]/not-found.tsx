import Link from "next/link";

/**
 * Task 30 — Not Found para /catalogo/[id]
 *
 * Se activa cuando ToolDetailPage llama a notFound().
 * Muestra mensaje amigable con link de vuelta al catálogo.
 */

export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8E0] bg-[#F5F7F0] px-6 py-20 text-center">
      {/* Icono */}
      <svg
        aria-hidden="true"
        className="mb-4 h-14 w-14 text-[#6B7280]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>

      <h1 className="mb-2 text-xl font-bold text-[#383838]">
        Herramienta no encontrada
      </h1>
      <p className="mb-6 text-sm text-[#6B7280]">
        La herramienta que buscas no existe o fue eliminada del catálogo.
      </p>

      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#86B81C] focus-visible:ring-offset-2"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver al catálogo
      </Link>
    </div>
  );
}
