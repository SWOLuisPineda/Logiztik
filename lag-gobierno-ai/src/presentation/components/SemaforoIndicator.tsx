/**
 * SemaforoIndicator — Indicador visual del estado de una herramienta.
 *
 * Verde (#86B81C) = Activa
 * Amarillo (#F59E0B) = Condicional
 * Rojo (#DC2626) = Retirada
 *
 * Accesible: usa color + texto + aria-label. No depende solo del color (WCAG AA).
 */

interface SemaforoIndicatorProps {
  estado: string;
}

const CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Activa: {
    color: "bg-[#86B81C]",
    bg: "bg-[#86B81C]/10",
    label: "Activa",
  },
  Condicional: {
    color: "bg-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    label: "Condicional",
  },
  Retirada: {
    color: "bg-[#DC2626]",
    bg: "bg-[#DC2626]/10",
    label: "Retirada",
  },
};

export default function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const config = CONFIG[estado] ?? CONFIG.Activa;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg}`}
      aria-label={`Estado: ${config.label}`}
      role="status"
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${config.color}`}
        aria-hidden="true"
      />
      <span className="text-[#383838]">{config.label}</span>
    </span>
  );
}
