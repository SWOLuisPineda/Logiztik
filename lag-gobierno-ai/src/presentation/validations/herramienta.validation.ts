import { z } from "zod";

/**
 * Zod schemas para validación de input HTTP en endpoints de herramientas.
 *
 * H10: NivelClasificacion y EstadoHerramienta se definen aquí para validar
 * parámetros HTTP de entrada. DpaEstado NO se define aquí — no es un input HTTP.
 */

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

/**
 * GET /api/herramientas — query params
 * H2: Se agrega `categoria` como filtro opcional (Post-MVP preparado).
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(),
});

/**
 * GET /api/herramientas/[id] — path param
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
