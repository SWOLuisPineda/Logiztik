import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";

interface NivelBadgeProps {
  nivel: NivelClasificacion | null;
}

const NIVEL_CONFIG: Record<
  NivelClasificacion,
  { bg: string; text: string }
> = {
  Publica: { bg: "bg-[#86B81C]/10", text: "text-[#5C8314]" },
  Interna: { bg: "bg-blue-50", text: "text-blue-700" },
  Confidencial: { bg: "bg-amber-50", text: "text-amber-700" },
  Restringida: { bg: "bg-red-50", text: "text-red-700" },
};

/**
 * Badge que muestra el nivel de clasificación de datos de una herramienta.
 * Si nivel es null, muestra "Sin clasificar" en gris.
 */
export function NivelBadge({ nivel }: NivelBadgeProps) {
  if (!nivel) {
    return (
      <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-500">
        Sin clasificar
      </span>
    );
  }

  const { bg, text } = NIVEL_CONFIG[nivel];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}
    >
      {nivel}
    </span>
  );
}
