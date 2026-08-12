/**
 * Helper: formatDpaLabel
 *
 * Única fuente de verdad para la transformación del valor DPA a texto visible.
 * H6 del design.md: "No aplica" → "Información no disponible aún".
 *
 * No duplicar esta lógica en ningún componente.
 */

export function formatDpaLabel(dpa: string): string {
  if (dpa === "No aplica") {
    return "Información no disponible aún";
  }
  return dpa;
}
