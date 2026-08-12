import Link from "next/link";

export default function HerramientaNotFound() {
  return (
    <div className="py-12 text-center">
      <h2 className="text-xl font-bold text-[#383838] mb-2">
        Herramienta no encontrada
      </h2>
      <p className="text-[#6B7280] mb-6">
        La herramienta que buscas no existe en el catálogo.
      </p>
      <Link
        href="/catalogo"
        className="text-[#86B81C] hover:text-[#5C8314] font-medium"
      >
        ← Volver al catálogo
      </Link>
    </div>
  );
}
