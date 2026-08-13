import { z } from "zod";

/**
 * Zod schemas para validación de input HTTP (Presentation Layer).
 *
 * Solo validan parámetros de entrada de la API.
 * NO son la fuente de verdad de tipos del dominio (esos están en value-objects).
 * Usa .strict() para rechazar params desconocidos explícitamente.
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

/** GET /api/herramientas — query params */
export const ListHerramientasQuerySchema = z
  .object({
    nivel: NivelClasificacionSchema.optional(),
    estado: EstadoHerramientaSchema.optional(),
  })
  .strict();

/** GET /api/herramientas/[id] — path param */
export const GetHerramientaParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();
