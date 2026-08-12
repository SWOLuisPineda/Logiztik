/**
 * EmptyState — Server Component
 *
 * Muestra un mensaje centrado cuando no hay herramientas para mostrar.
 */

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No hay herramientas registradas actualmente",
}: EmptyStateProps) {
  return (
    <p className="py-12 text-center text-[#6B7280]">
      {message}
    </p>
  );
}
