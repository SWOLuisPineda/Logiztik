import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface NivelBadgeProps {
  nivel: NivelClasificacion | null;
}

const NIVEL_CONFIG: Record<
  NivelClasificacion,
  { bg: string; text: string; border: string }
> = {
  Publica: {
    bg: "bg-[#86B81C]/10",
    text: "text-[#5C8314]",
    border: "border-[#86B81C]/20",
  },
  Interna: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Confidencial: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Restringida: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

/**
 * Badge de nivel de clasificación de datos.
 *
 * 5 variantes:
 *   - Publica → verde LAG
 *   - Interna → azul
 *   - Confidencial → ámbar
 *   - Restringida → rojo
 *   - null → gris "Sin clasificar"
 */
export function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel) {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
        Sin clasificar
      </span>
    );
  }

  const config = NIVEL_CONFIG[nivel];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {nivel}
    </span>
  );
}
