interface NivelBadgeProps {
  nivel: string | null;
}

/**
 * Colores por nivel de clasificación.
 * Usa solo tokens del design-system.md:
 * - Publica: brand-primary (verde LAG)
 * - Interna: bg-secondary + text-primary (neutro)
 * - Confidencial: semáforo amarillo
 * - Restringida: semáforo rojo / badges retirados
 */
const NIVEL_STYLES: Record<string, string> = {
  Publica: "bg-[#86B81C]/10 text-[#5C8314]",
  Interna: "bg-[#F5F7F0] text-[#383838]",
  Confidencial: "bg-[#F59E0B]/10 text-[#383838]",
  Restringida: "bg-red-50 text-red-700",
};

/**
 * Badge con color por nivel de clasificación de datos.
 * Si nivel es null, muestra "Sin clasificar" en gris.
 */
export function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel) {
    return (
      <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-[#6B7280]">
        Sin clasificar
      </span>
    );
  }

  const style = NIVEL_STYLES[nivel] ?? "bg-gray-100 text-[#6B7280]";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${style}`}>
      {nivel}
    </span>
  );
}
