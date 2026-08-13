import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

/**
 * NivelBadge — Badge visual para el nivel de clasificación de datos.
 *
 * Usa tokens del design system LAG.
 * Publica = verde marca (brand), Interna = gris neutro, Confidencial = amber, Restringida = rojo.
 * Null = gris "Sin clasificar".
 */

interface NivelBadgeProps {
  readonly nivel: NivelClasificacion | null;
}

const NIVEL_STYLES: Record<string, string> = {
  Publica: "bg-brand-primary/10 text-brand-dark",
  Interna: "bg-lag-bg-secondary text-lag-text-primary border border-lag-border",
  Confidencial: "bg-amber-50 text-amber-700",
  Restringida: "bg-red-50 text-red-700",
};

export default function NivelBadge({ nivel }: NivelBadgeProps) {
  const label = nivel ?? "Sin clasificar";
  const styles = nivel
    ? NIVEL_STYLES[nivel] ?? "bg-gray-100 text-gray-600"
    : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles}`}>
      {label}
    </span>
  );
}
