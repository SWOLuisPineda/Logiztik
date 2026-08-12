/**
 * SemaforoIndicator — Server Component
 *
 * Indicador visual de estado de una herramienta.
 * Usa color + texto + aria-label para cumplir WCAG AA (no solo color).
 *
 * Estados:
 *   Activa      → verde  (#86B81C)
 *   Condicional → amarillo (#F59E0B)
 *   Retirada    → rojo   (#DC2626)
 *
 * NOTA: Las clases del dot deben ser strings literales completos
 * para que Tailwind las detecte en el scan y no las purgue.
 */

type EstadoHerramienta = "Activa" | "Condicional" | "Retirada";

interface SemaforoIndicatorProps {
  estado: EstadoHerramienta;
}

const CONFIG: Record<
  EstadoHerramienta,
  { dotClass: string; label: string; texto: string }
> = {
  Activa: {
    dotClass: "inline-block h-3 w-3 rounded-full bg-[#86B81C] shrink-0",
    label: "Estado: Activa — autorizada para uso",
    texto: "Activa",
  },
  Condicional: {
    dotClass: "inline-block h-3 w-3 rounded-full bg-[#F59E0B] shrink-0",
    label: "Estado: Condicional — autorizada con restricciones",
    texto: "Condicional",
  },
  Retirada: {
    dotClass: "inline-block h-3 w-3 rounded-full bg-[#DC2626] shrink-0",
    label: "Estado: Retirada — no autorizada para uso",
    texto: "Retirada",
  },
};

export function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const { dotClass, label, texto } = CONFIG[estado];

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={label}
      role="status"
    >
      {/* Círculo de color — decorativo, el aria-label transmite el significado */}
      <span className={dotClass} aria-hidden="true" />
      {/* Texto visible — no depende solo del color para transmitir información */}
      <span className="text-sm font-medium text-[#383838]">{texto}</span>
    </span>
  );
}
