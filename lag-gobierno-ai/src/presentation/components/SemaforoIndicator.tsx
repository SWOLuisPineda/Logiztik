/**
 * SemaforoIndicator — Server Component
 *
 * Muestra el estado de una herramienta con un indicador de color (semáforo)
 * y texto descriptivo para cumplir con WCAG AA (no solo color).
 */

interface SemaforoIndicatorProps {
  estado: "Activa" | "Retirada" | "Condicional";
}

const CONFIG = {
  Activa: {
    color: "bg-[#86B81C]",
    text: "Activa — puede usarse",
    ariaLabel: "Estado: Activa, puede usarse",
  },
  Condicional: {
    color: "bg-[#F59E0B]",
    text: "Condicional — uso con restricciones",
    ariaLabel: "Estado: Condicional, uso con restricciones",
  },
  Retirada: {
    color: "bg-[#DC2626]",
    text: "Retirada — no autorizada",
    ariaLabel: "Estado: Retirada, no autorizada",
  },
} as const;

export default function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const { color, text, ariaLabel } = CONFIG[estado];

  return (
    <span className="inline-flex items-center gap-2" aria-label={ariaLabel} role="status">
      <span className={`inline-block w-3 h-3 rounded-full ${color}`} aria-hidden="true" />
      <span className="text-sm text-[#383838]">{text}</span>
    </span>
  );
}
