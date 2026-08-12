interface SemaforoIndicatorProps {
  estado: string;
}

/**
 * Configuración del semáforo usando exactamente los tokens del design-system.md:
 * - Activa: badge activo = bg-[#86B81C]/10 text-[#5C8314]
 * - Condicional: amarillo #F59E0B
 * - Retirada: badge retirado = bg-red-50 text-red-700
 */
const CONFIG: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  Activa: {
    dot: "bg-[#86B81C]",
    bg: "bg-[#86B81C]/10",
    text: "text-[#5C8314]",
    label: "Activa — puede usarse",
  },
  Condicional: {
    dot: "bg-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    text: "text-[#383838]",
    label: "Condicional — uso con restricciones",
  },
  Retirada: {
    dot: "bg-[#DC2626]",
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Retirada — no autorizada",
  },
};

/**
 * Semáforo visual reutilizable.
 * Verde = Activa, Amarillo = Condicional, Rojo = Retirada.
 * Accesible: aria-label + texto alternativo (no depende solo del color — WCAG AA).
 */
export function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const config = CONFIG[estado] ?? CONFIG.Activa;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.bg}`}
      aria-label={config.label}
      role="status"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${config.dot}`}
        aria-hidden="true"
      />
      <span className={config.text}>{estado}</span>
    </span>
  );
}
