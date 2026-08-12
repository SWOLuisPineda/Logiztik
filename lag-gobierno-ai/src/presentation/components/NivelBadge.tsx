/**
 * NivelBadge — Server Component
 *
 * Badge con color según el nivel de clasificación de datos.
 * null → gris "Sin clasificar"
 *
 * Variantes:
 *   Publica       → verde marca LAG
 *   Interna       → azul
 *   Confidencial  → naranja
 *   Restringida   → rojo
 *   null          → gris
 *
 * NOTA: Las clases deben ser strings literales completos (no interpolados)
 * para que Tailwind las detecte en el scan y no las purgue.
 */

type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

interface NivelBadgeProps {
  nivel: NivelClasificacion | null;
}

const VARIANTES: Record<NivelClasificacion, string> = {
  Publica:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-[#86B81C]/10 text-[#5C8314]",
  Interna:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700",
  Confidencial:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700",
  Restringida:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-700",
};

const VARIANTE_SIN_NIVEL =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500";

export function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel) {
    return (
      <span className={VARIANTE_SIN_NIVEL} aria-label="Nivel de clasificación no asignado">
        Sin clasificar
      </span>
    );
  }

  return (
    <span
      className={VARIANTES[nivel]}
      aria-label={`Nivel de clasificación: ${nivel}`}
    >
      {nivel}
    </span>
  );
}
