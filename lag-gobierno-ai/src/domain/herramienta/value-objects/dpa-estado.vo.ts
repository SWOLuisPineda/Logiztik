/**
 * Value Object: Estado de DPA (Data Processing Agreement)
 *
 * Indica el estado del acuerdo de procesamiento de datos con el proveedor.
 * - Vigente: DPA firmado y vigente
 * - No aplica: No se requiere DPA (e.g. herramienta sin datos personales)
 * - Pendiente: DPA en proceso de negociación/firma
 */

export type DpaEstado = "Vigente" | "No aplica" | "Pendiente";

export const DPA_ESTADOS: readonly DpaEstado[] = [
  "Vigente",
  "No aplica",
  "Pendiente",
] as const;
