import { z } from "zod";

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

export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
});

export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
