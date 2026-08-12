import { z } from "zod";

/**
 * Zod schemas para validación de input HTTP en endpoints de herramientas.
 * Solo parsean parámetros de entrada — no definen lógica de negocio.
 *
 * También exporta constantes de UI que la Presentation layer necesita
 * (evita que Client Components importen de @/domain/ directamente).
 */

export const NIVELES_CLASIFICACION_OPTIONS = [
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
] as const;

export const ESTADOS_HERRAMIENTA_OPTIONS = [
  "Activa",
  "Retirada",
  "Condicional",
] as const;

export const NivelClasificacionSchema = z.enum([
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
]);

export const EstadoHerramientaSchema = z.enum([
  "Activa",
  "Retirada",
  "Condicional",
]);

/** GET /api/herramientas — query params */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
});

/** GET /api/herramientas/[id] — path param */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** Tipo inferido para los filtros parseados por Zod (Presentation-only type) */
export type ParsedHerramientaFilters = {
  nivelMaximo?: z.infer<typeof NivelClasificacionSchema>;
  estado?: z.infer<typeof EstadoHerramientaSchema>;
};
