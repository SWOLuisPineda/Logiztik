interface NivelBadgeProps {
  nivel: string | null;
}

/**
 * Colores derivados de los tokens del design system LAG.
 * - Publica: brand-primary (#86B81C) como base → bg con opacity, text con brand-dark
 * - Interna: tono azul corporativo
 * - Confidencial: tono amber/naranja de advertencia
 * - Restringida: rojo del semáforo (#DC2626)
 */
const NIVEL_STYLES: Record<string, string> = {
  Publica: "bg-[#86B81C]/10 text-[#5C8314]",
  Interna: "bg-[#3B82F6]/10 text-[#1D4ED8]",
  Confidencial: "bg-[#F59E0B]/10 text-[#B45309]",
  Restringida: "bg-[#DC2626]/10 text-[#991B1B]",
};

/**
 * Badge de nivel de clasificación de datos.
 * Null → "Sin clasificar" en gris. 4 niveles con color derivado del design system.
 */
export function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel) {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-[#6B7280]">
        Sin clasificar
      </span>
    );
  }

  const style = NIVEL_STYLES[nivel] ?? "bg-gray-100 text-[#6B7280]";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${style}`}>
      {nivel}
    </span>
  );
}
