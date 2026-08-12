/**
 * Task 18 — SemaforoIndicator
 *
 * Indicador visual de estado de herramienta.
 * Verde (#86B81C) = Activa | Amarillo (#F59E0B) = Condicional | Rojo (#DC2626) = Retirada
 *
 * WCAG AA: no depende solo del color — círculo + texto visible + aria-label.
 * H5 (design.md): estado Condicional muestra subtexto explicativo visible
 * para preservar la semántica de "Activa (condicional)" del catálogo fuente.
 *
 * Server Component — sin interactividad.
 */

import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

interface SemaforoIndicatorProps {
  estado: EstadoHerramienta;
  /** Mostrar subtexto para estado Condicional. Default: true. */
  showSubtext?: boolean;
}

const CONFIG: Record<
  EstadoHerramienta,
  { dot: string; text: string; label: string; ariaLabel: string }
> = {
  Activa: {
    dot: "bg-[#86B81C]",
    text: "text-[#5C8314]",
    label: "Activa",
    ariaLabel: "Estado: Activa — autorizada para uso en LAG",
  },
  Condicional: {
    dot: "bg-[#F59E0B]",
    text: "text-amber-700",
    label: "Condicional",
    ariaLabel: "Estado: Condicional — uso permitido con restricciones",
  },
  Retirada: {
    dot: "bg-[#DC2626]",
    text: "text-red-700",
    label: "Retirada",
    ariaLabel: "Estado: Retirada — no autorizada para uso en LAG",
  },
};

export function SemaforoIndicator({
  estado,
  showSubtext = true,
}: SemaforoIndicatorProps) {
  const cfg = CONFIG[estado];

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`inline-flex items-center gap-2 text-sm font-medium ${cfg.text}`}
        role="status"
        aria-label={cfg.ariaLabel}
      >
        <span
          className={`h-3 w-3 rounded-full flex-shrink-0 ${cfg.dot}`}
          aria-hidden="true"
        />
        {cfg.label}
      </span>

      {/* H5: subtexto visible — no tooltip, visible en mobile, accesible */}
      {estado === "Condicional" && showSubtext && (
        <p className="text-xs text-amber-700 pl-5 leading-snug">
          Uso permitido con restricciones. Verificar condiciones.
        </p>
      )}
    </div>
  );
}

export default SemaforoIndicator;
