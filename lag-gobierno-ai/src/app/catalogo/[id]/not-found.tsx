import Link from "next/link";

/**
 * not-found.tsx — Página cuando el ID no existe en la BD.
 *
 * Se activa desde page.tsx con `notFound()` de Next.js.
 */
export default function HerramientaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8E0] bg-[#F5F7F0] px-6 py-16 text-center">
      <svg
        className="mb-4 h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
      <h2 className="text-lg font-semibold text-[#383838]">
        Herramienta no encontrada
      </h2>
      <p className="mt-1 text-sm text-[#6B7280]">
        La herramienta solicitada no existe en el catálogo.
      </p>
      <Link
        href="/catalogo"
        className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#86B81C] px-4 py-2 text-sm font-medium text-white hover:bg-[#5C8314] focus:outline-none focus:ring-2 focus:ring-[#86B81C] focus:ring-offset-2 transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
