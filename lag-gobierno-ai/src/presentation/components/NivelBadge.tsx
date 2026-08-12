/**
 * Task 19 — NivelBadge
 *
 * Badge con color por nivel de clasificación de datos.
 * 5 variantes: Publica | Interna | Confidencial | Restringida | null
 *
 * null → "Sin clasificar" en gris canónico: text-gray-500 bg-gray-100 border border-gray-200
 * (H12 del design.md — no usar otros grises).
 *
 * Server Component — sin interactividad.
 */

import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface NivelBadgeProps {
  nivel: NivelClasificacion | null;
}

const NIVEL_STYLES: Record<NivelClasificacion, string> = {
  Publica: "bg-[#86B81C]/10 text-[#5C8314] border border-[#86B81C]/30",
  Interna: "bg-blue-50 text-blue-700 border border-blue-200",
  Confidencial: "bg-amber-50 text-amber-700 border border-amber-200",
  Restringida: "bg-red-50 text-red-700 border border-red-200",
};

const NIVEL_LABELS: Record<NivelClasificacion, string> = {
  Publica: "Pública",
  Interna: "Interna",
  Confidencial: "Confidencial",
  Restringida: "Restringida",
};

export function NivelBadge({ nivel }: NivelBadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

  if (!nivel) {
    return (
      <span
        className={`${baseClasses} text-gray-500 bg-gray-100 border border-gray-200`}
        aria-label="Nivel de clasificación: Sin clasificar"
      >
        Sin clasificar
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} ${NIVEL_STYLES[nivel]}`}
      aria-label={`Nivel de clasificación: ${NIVEL_LABELS[nivel]}`}
    >
      {NIVEL_LABELS[nivel]}
    </span>
  );
}

export default NivelBadge;
