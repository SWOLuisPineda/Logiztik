interface SemaforoIndicatorProps {
  estado: string;
}

/**
 * Colors derived from design-system.md:
 * - Verde: #86B81C (brand-primary), dark: #5C8314
 * - Amarillo: #F59E0B
 * - Rojo: #DC2626
 */
const SEMAFORO_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Activa: {
    color: "bg-[#86B81C]",
    bg: "bg-[#86B81C]/10 text-[#5C8314]",
    label: "Activa — puede usarse",
  },
  Condicional: {
    color: "bg-[#F59E0B]",
    bg: "bg-[#F59E0B]/10 text-[#B45309]",
    label: "Condicional — uso con restricciones",
  },
  Retirada: {
    color: "bg-[#DC2626]",
    bg: "bg-[#DC2626]/10 text-[#991B1B]",
    label: "Retirada — no autorizada",
  },
};

/** Fallback para estados no reconocidos — gris neutro en vez de verde engañoso. */
const UNKNOWN_CONFIG = {
  color: "bg-gray-400",
  bg: "bg-gray-100 text-gray-700",
  label: "Estado desconocido",
};

/**
 * Componente visual de semáforo: indica el estado de una herramienta.
 * Verde = Activa, Amarillo = Condicional, Rojo = Retirada.
 * Accesible: usa color + texto + aria-label (no solo color).
 *
 * Si el estado no es reconocido, muestra gris neutro (nunca verde falso).
 */
export function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const config = SEMAFORO_CONFIG[estado] ?? UNKNOWN_CONFIG;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.bg}`}
      aria-label={config.label}
      role="status"
    >
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${config.color}`} aria-hidden="true" />
      {estado}
    </span>
  );
}
