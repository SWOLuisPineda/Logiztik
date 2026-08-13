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
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-brand-primary/10 text-brand-dark",
  Interna:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-lag-bg-secondary text-lag-text-primary border border-lag-border",
  Confidencial:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700",
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
