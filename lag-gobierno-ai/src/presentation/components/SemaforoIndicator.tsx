/**
 * Task 18 — SemaforoIndicator
 *
 * Server Component. Muestra el estado de autorización de una herramienta
 * como un indicador visual (semáforo) accesible conforme WCAG AA.
 *
 * - No depende solo del color: incluye icono + texto descriptivo + aria-label.
 * - Dependency Rule: no importa de @/domain ni @/infrastructure.
 */

type EstadoHerramienta = "Activa" | "Retirada" | "Condicional";

interface SemaforoIndicatorProps {
  estado: EstadoHerramienta;
}

const CONFIG: Record<
  EstadoHerramienta,
  { color: string; bg: string; texto: string; ariaLabel: string }
> = {
  Activa: {
    color: "#86B81C",
    bg: "bg-[#86B81C]/10",
    texto: "Autorizada",
    ariaLabel: "Estado: Autorizada para uso en LAG",
  },
  Condicional: {
    color: "#F59E0B",
    bg: "bg-amber-50",
    texto: "Condicional",
    ariaLabel: "Estado: Autorizada con restricciones, verificar condiciones de uso",
  },
  Retirada: {
    color: "#DC2626",
    bg: "bg-red-50",
    texto: "No autorizada",
    ariaLabel: "Estado: No autorizada, no debe usarse con datos de LAG",
  },
};

export default function SemaforoIndicator({ estado }: SemaforoIndicatorProps) {
  const cfg = CONFIG[estado];

  return (
    <span
      role="status"
      aria-label={cfg.ariaLabel}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cfg.bg}`}
    >
      {/* Círculo de color — canal visual */}
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.color }}
      />
      {/* Texto — canal no-color, requerido por WCAG 1.4.1 */}
      <span style={{ color: cfg.color }}>{cfg.texto}</span>
    </span>
  );
}
