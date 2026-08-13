import Image from "next/image";
import Link from "next/link";

/**
 * Header — Server Component
 *
 * Barra de navegación superior con logo e icono de Logiztik Alliance Group.
 * Se usa en el layout del catálogo para dar identidad de marca.
 */
export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-lag-border pb-4">
      {/* Logo principal a la izquierda */}
      <Link href="/catalogo" aria-label="Ir al catálogo de herramientas AI">
        <Image
          src="/imgs/Icono.png"
          alt="Logiztik Alliance Group"
          width={160}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </Link>

      {/* Texto + Icono a la derecha */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-lag-text-secondary">
          Gobierno AI
        </span>
        <Image
          src="/imgs/LogiztikAlliance.png"
          alt="Icono LAG"
          width={44}
          height={44}
          className="h-11 w-11 rounded-lg"
        />
      </div>
    </header>
  );
}
