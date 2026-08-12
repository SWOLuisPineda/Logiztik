import { z } from "zod";

/**
 * Zod schemas para validación de input HTTP en endpoints de herramientas.
 *
 * Estos schemas parsean y validan query params y path params.
 * Solo se importan desde API routes (Presentation layer).
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
 * nivel y estado son opcionales. Si se pasan, deben ser valores válidos.
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
});

/**
 * GET /api/herramientas/[id] — path param
 * id debe ser un entero positivo.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
