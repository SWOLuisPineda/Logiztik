/**
 * SemaforoIndicator — Indicador visual del estado de una herramienta.
 *
 * Verde (brand-primary) = Activa | Amarillo = Condicional | Rojo = Retirada
 * Accesible: color + texto visible (WCAG AA — no depende solo del color).
 */

interface SemaforoIndicatorProps {
  readonly estado: "Activa" | "Retirada" | "Condicional";
}

const CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Activa: {
    color: "text-brand-dark",
    bg: "bg-semaforo-verde",
    label: "Autorizada",
  },
  Condicional: {
    color: "text-amber-700",
    bg: "bg-semaforo-amarillo",
    label: "Condicional",
  },
  Retirada: {
    color: "text-red-700",
    bg: "bg-semaforo-rojo",
    label: "No autorizada",
  },
};

export default function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const config = CONFIG[estado] ?? CONFIG.Activa;

  return (
    <output
      aria-label={`Estado: ${config.label}`}
      className={`inline-flex items-center gap-1.5 ${config.color}`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${config.bg}`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{config.label}</span>
      {estado === "Condicional" && (
        <span className="sr-only">
          Uso permitido con restricciones. Verificar condiciones.
        </span>
      )}
    </output>
  );
}
