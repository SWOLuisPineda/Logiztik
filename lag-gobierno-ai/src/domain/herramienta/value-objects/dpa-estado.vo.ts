/**
 * Value Object: Estado de DPA (Data Processing Agreement).
 *
 * Indica si existe un acuerdo de procesamiento de datos vigente con el proveedor.
 * En MVP todos los registros tienen "No aplica" (no hay datos fuente de DPA).
 * Post-MVP: se integrará con el sistema de contratos.
 */

export type DpaEstado = "Vigente" | "No aplica" | "Pendiente";

export const DPA_ESTADOS: readonly DpaEstado[] = [
  "Vigente",
  "No aplica",
  "Pendiente",
] as const;
