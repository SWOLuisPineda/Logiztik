import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

interface SemaforoIndicatorProps {
  readonly estado: EstadoHerramienta;
}

const SEMAFORO_CONFIG: Record<
  EstadoHerramienta,
  { color: string; label: string; texto: string }
> = {
  Activa: {
    color: "#86B81C",
    label: "Herramienta activa — autorizada para uso",
    texto: "Activa",
  },
  Condicional: {
    color: "#F59E0B",
    label: "Herramienta condicional — autorizada con restricciones",
    texto: "Condicional",
  },
  Retirada: {
    color: "#DC2626",
    label: "Herramienta retirada — no autorizada para uso",
    texto: "Retirada",
  },
};

/**
 * Semáforo visual de estado de herramienta.
 *
 * Cumple WCAG AA: no depende solo del color para transmitir información.
 * Muestra color (círculo) + texto + aria-label descriptivo.
 */
export function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const config = SEMAFORO_CONFIG[estado];

  return (
    <span
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={config.label}
    >
      {/* Círculo de color — decorativo, el aria-label cubre el significado */}
      <span
        aria-hidden="true"
        className="inline-block h-3 w-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {/* Texto visible — no solo color */}
      <span
        className="text-sm font-medium"
        style={{ color: config.color }}
      >
        {config.texto}
      </span>
    </span>
  );
}
