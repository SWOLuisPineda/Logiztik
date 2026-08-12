/**
 * Value Object: DpaEstado
 *
 * Estado del Data Processing Agreement (DPA) de una herramienta.
 * "No aplica" es el valor por defecto en MVP (sin datos fuente de DPA).
 *
 * Vive en Domain — NO es un input HTTP, no se valida con Zod en Presentation.
 * Es un atributo de la entidad que la Infrastructure mapea desde BD.
 */

export type DpaEstado = "Vigente" | "No aplica" | "Pendiente";

export const DPA_ESTADOS: readonly DpaEstado[] = [
  "Vigente",
  "No aplica",
  "Pendiente",
] as const;
