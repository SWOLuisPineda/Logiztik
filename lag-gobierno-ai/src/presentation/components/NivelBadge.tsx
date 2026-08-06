/**
 * Task 19 — NivelBadge
 *
 * Server Component. Muestra el nivel máximo de clasificación de datos
 * que una herramienta puede procesar.
 *
 * Si nivelMaximo es null → badge gris "Sin clasificar".
 * 4 niveles con colores diferenciados + texto legible (no solo color).
 *
 * Dependency Rule: no importa de @/domain ni @/infrastructure.
 */

type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

interface NivelBadgeProps {
  nivel: NivelClasificacion | string | null;
}

const NIVEL_CONFIG: Record<
  NivelClasificacion,
  { label: string; className: string }
> = {
  Publica: {
    label: "Pública",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  Interna: {
    label: "Interna",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  Confidencial: {
    label: "Confidencial",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Restringida: {
    label: "Restringida",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
};

const BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

export default function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel || !(nivel in NIVEL_CONFIG)) {
    return (
      <span className={`${BASE} bg-[#F5F7F0] text-[#6B7280] border border-[#E2E8E0]`}>
        Sin clasificar
      </span>
    );
  }

  const cfg = NIVEL_CONFIG[nivel as NivelClasificacion];

  return (
    <span className={`${BASE} ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
