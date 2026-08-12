/**
 * Mensaje informativo cuando no hay herramientas para mostrar.
 * Se usa cuando el catálogo está vacío o el filtro no tiene resultados.
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-lg text-[#6B7280]">
        No hay herramientas registradas actualmente
      </p>
    </div>
  );
}
