import { z } from "zod";

/**
 * Schemas de validación Zod para los endpoints HTTP del catálogo de herramientas.
 *
 * Responsabilidad: parsear y validar parámetros de entrada de las API routes.
 * No se usan aquí para lógica de dominio — esos tipos viven en @/domain/.
 */

// ── Enums HTTP ────────────────────────────────────────────────────────────────

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

// ── GET /api/herramientas — query params ──────────────────────────────────────

/**
 * Valida los query params de la lista de herramientas.
 * Todos los campos son opcionales.
 * `categoria` está preparado para Post-MVP (US-07); la FilterBar de MVP no lo expone.
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(),
});

export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;

// ── GET /api/herramientas/[id] — path params ──────────────────────────────────

/**
 * Valida el parámetro `id` del path.
 * `z.coerce.number()` convierte el string "1" → number 1 antes de validar.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce
    .number({ error: "El parámetro 'id' debe ser un número entero positivo." })
    .int()
    .positive({ message: "El parámetro 'id' debe ser un número entero positivo." }),
});

export type GetHerramientaParams = z.infer<typeof GetHerramientaParamsSchema>;
