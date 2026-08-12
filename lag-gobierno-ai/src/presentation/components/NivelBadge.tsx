/**
 * NivelBadge — Server Component
 *
 * Muestra un badge con el nivel de clasificación de datos de una herramienta.
 * 5 variantes visuales según el nivel.
 */

interface NivelBadgeProps {
  nivel: string | null;
}

const VARIANTS: Record<string, string> = {
  Publica: "bg-[#86B81C]/10 text-[#5C8314]",
  Interna: "bg-blue-50 text-blue-700",
  Confidencial: "bg-amber-50 text-amber-700",
  Restringida: "bg-red-50 text-red-700",
};

const DEFAULT_VARIANT = "bg-gray-100 text-gray-600";

export default function NivelBadge({ nivel }: NivelBadgeProps) {
  const variant = nivel ? (VARIANTS[nivel] ?? DEFAULT_VARIANT) : DEFAULT_VARIANT;
  const label = nivel ?? "Sin clasificar";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${variant}`}>
      {label}
    </span>
  );
}
