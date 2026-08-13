/**
 * Value Object: Estado de Herramienta
 *
 * Determina si una herramienta puede ser utilizada por los empleados de LAG.
 * - Activa: autorizada para uso (semáforo verde)
 * - Condicional: autorizada con restricciones (semáforo amarillo)
 * - Retirada: no autorizada (semáforo rojo)
 */

export type EstadoHerramienta = "Activa" | "Retirada" | "Condicional";

export const ESTADOS_HERRAMIENTA: readonly EstadoHerramienta[] = [
  "Activa",
  "Retirada",
  "Condicional",
] as const;
