/**
 * NivelBadge — Badge visual para el nivel de clasificación de datos.
 *
 * 4 niveles con colores derivados del design system + null → gris "Sin clasificar".
 * Accesible: texto explícito, no depende solo del color.
 */

interface NivelBadgeProps {
  nivel: string | null;
}

const NIVEL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Publica: {
    bg: "bg-[#86B81C]/10",
    text: "text-[#5C8314]",
    label: "Pública",
  },
  Interna: {
    bg: "bg-[#86B81C]/5",
    text: "text-[#383838]",
    label: "Interna",
  },
  Confidencial: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#383838]",
    label: "Confidencial",
  },
  Restringida: {
    bg: "bg-[#DC2626]/10",
    text: "text-[#DC2626]",
    label: "Restringida",
  },
};

const NULL_STYLE = {
  bg: "bg-[#E2E8E0]/50",
  text: "text-[#6B7280]",
  label: "Sin clasificar",
};

export default function NivelBadge({ nivel }: NivelBadgeProps) {
  const style = nivel ? (NIVEL_STYLES[nivel] ?? NULL_STYLE) : NULL_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
      aria-label={`Nivel de clasificación: ${style.label}`}
    >
      {style.label}
    </span>
  );
}
