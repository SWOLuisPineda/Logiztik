import { z } from "zod";

/**
 * Zod schemas para validación de parámetros HTTP de entrada.
 *
 * Solo valida input de la Presentation Layer.
 * Los value objects del dominio (NivelClasificacion, EstadoHerramienta) se replican aquí
 * como enum schemas para validar strings recibidos por query params.
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
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(),
});

/** GET /api/herramientas/[id] — path param */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
