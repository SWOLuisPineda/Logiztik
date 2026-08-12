/**
 * SemaforoIndicator — Server Component
 *
 * Indica visualmente el estado de autorización de una herramienta.
 * WCAG AA: nunca transmite información solo por color — incluye texto visible y aria-label.
 *
 * Colores según design-system.md:
 *   Verde  #86B81C — Activa
 *   Amarillo #F59E0B — Condicional (texto en amber-800 para contraste WCAG AA)
 *   Rojo   #DC2626 — Retirada
 */

type EstadoHerramienta = "Activa" | "Condicional" | "Retirada";

interface SemaforoConfig {
  circuloColor: string;
  textColor: string;
  bgColor: string;
  texto: string;
  ariaLabel: string;
}

const CONFIG: Record<EstadoHerramienta, SemaforoConfig> = {
  Activa: {
    circuloColor: "#86B81C",
    textColor: "text-[#5C8314]",
    bgColor: "bg-[#86B81C]/10",
    texto: "Autorizada",
    ariaLabel: "Estado: Autorizada para uso",
  },
  Condicional: {
    circuloColor: "#F59E0B",
    // Amarillo #F59E0B tiene contraste 2.6:1 sobre blanco — insuficiente para texto.
    // Se usa amber-800 (#92400E) sobre amber-50 (#FFFBEB): contraste 7.1:1 ✅
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    texto: "Condicional",
    ariaLabel: "Estado: Autorizada con restricciones",
  },
  Retirada: {
    circuloColor: "#DC2626",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    texto: "No autorizada",
    ariaLabel: "Estado: No autorizada para uso en LAG",
  },
};

interface SemaforoIndicatorProps {
  estado: string;
  size?: "sm" | "md";
}

export function SemaforoIndicator({
  estado,
  size = "md",
}: SemaforoIndicatorProps) {
  const config = CONFIG[estado as EstadoHerramienta] ?? CONFIG.Retirada;
  const circuloSize = size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${config.bgColor} ${config.textColor} ${textSize}`}
    >
      {/* Círculo decorativo — refuerza el color pero no es la única señal */}
      <span
        aria-hidden="true"
        className={`inline-block rounded-full flex-shrink-0 ${circuloSize}`}
        style={{ backgroundColor: config.circuloColor }}
      />
      {config.texto}
    </span>
  );
}
