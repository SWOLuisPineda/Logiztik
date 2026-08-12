/**
 * NivelBadge — Server Component
 *
 * Badge de nivel de clasificación de datos.
 * 5 variantes: 4 niveles + null (sin clasificar).
 *
 * Colores exclusivamente de la paleta LAG (design-system.md):
 *   Pública     — verde LAG suave (menor sensibilidad)
 *   Interna     — fondo LAG + texto primario (neutral)
 *   Confidencial — amarillo semáforo (precaución)
 *   Restringida — rojo semáforo (máxima restricción)
 *   Sin clasificar — gris neutro
 *
 * Progresión visual: verde → neutro → amarillo → rojo (sensibilidad creciente)
 */

type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

interface NivelConfig {
  label: string;
  className: string;
}

const NIVEL_CONFIG: Record<NivelClasificacion, NivelConfig> = {
  Publica: {
    label: "Pública",
    className: "bg-[#F5F7F0] text-[#5C8314]",
  },
  Interna: {
    label: "Interna",
    className: "bg-[#F5F7F0] text-[#383838]",
  },
  Confidencial: {
    label: "Confidencial",
    className: "bg-amber-50 text-amber-800",
  },
  Restringida: {
    label: "Restringida",
    className: "bg-red-50 text-red-700",
  },
};

const SIN_CLASIFICAR: NivelConfig = {
  label: "Sin clasificar",
  className: "bg-gray-100 text-gray-600",
};

interface NivelBadgeProps {
  nivel: string | null;
}

export function NivelBadge({ nivel }: NivelBadgeProps) {
  const config =
    nivel != null
      ? (NIVEL_CONFIG[nivel as NivelClasificacion] ?? SIN_CLASIFICAR)
      : SIN_CLASIFICAR;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
