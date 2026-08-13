/**
 * Value Object: Nivel de Clasificación de Datos
 *
 * Representa la sensibilidad máxima de datos que una herramienta puede procesar.
 * Ordenados de menor a mayor sensibilidad.
 */

export type NivelClasificacion =
  | "Publica"
  | "Interna"
  | "Confidencial"
  | "Restringida";

export const NIVELES_CLASIFICACION: readonly NivelClasificacion[] = [
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
] as const;
