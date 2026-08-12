/**
 * Constantes de niveles de clasificación para la capa de Presentation.
 * Evita que los Client Components importen directamente de @/domain/.
 *
 * Fuente de verdad: src/domain/herramienta/value-objects/nivel-clasificacion.vo.ts
 * Si se agrega un nivel, actualizar ambos archivos.
 */

export const NIVELES_CLASIFICACION = [
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
] as const;

export type NivelClasificacionLabel = (typeof NIVELES_CLASIFICACION)[number];

export const NIVEL_LABELS: Record<NivelClasificacionLabel, string> = {
  Publica: "Pública",
  Interna: "Interna",
  Confidencial: "Confidencial",
  Restringida: "Restringida",
};
