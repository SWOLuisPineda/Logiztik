import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

interface SemaforoIndicatorProps {
  estado: EstadoHerramienta;
}

const CONFIG: Record<
  EstadoHerramienta,
  { color: string; bgColor: string; label: string }
> = {
  Activa: {
    color: "bg-[#86B81C]",
    bgColor: "bg-[#86B81C]/10",
    label: "Activa — autorizada para uso",
  },
  Condicional: {
    color: "bg-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/10",
    label: "Condicional — uso con restricciones",
  },
  Retirada: {
    color: "bg-[#DC2626]",
    bgColor: "bg-red-50",
    label: "Retirada — no autorizada",
  },
};

/**
 * Indicador visual de semáforo para el estado de una herramienta.
 * Verde = Activa, Amarillo = Condicional, Rojo = Retirada.
 * Accesible: usa color + texto + aria-label (no solo color).
 */
export function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const { color, bgColor, label } = CONFIG[estado];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${bgColor}`}
      aria-label={label}
      role="status"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${color}`}
        aria-hidden="true"
      />
      <span className="text-[#383838]">{estado}</span>
    </span>
  );
}
