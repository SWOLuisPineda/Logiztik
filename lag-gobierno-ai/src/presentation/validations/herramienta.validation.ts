import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas de nivel y estado — reutilizables en ambos endpoints
// ---------------------------------------------------------------------------

/**
 * Niveles de clasificación válidos.
 * Refleja el value object NivelClasificacion del dominio.
 */
export const NivelClasificacionSchema = z.enum([
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
]);

/**
 * Estados válidos de herramienta.
 * Refleja el value object EstadoHerramienta del dominio.
 */
export const EstadoHerramientaSchema = z.enum([
  "Activa",
  "Retirada",
  "Condicional",
]);

// ---------------------------------------------------------------------------
// GET /api/herramientas — query params
// ---------------------------------------------------------------------------

/**
 * Valida los query params de listado.
 *
 * - nivel: filtra por nivel máximo de clasificación (opcional)
 * - estado: filtra por estado de la herramienta (opcional)
 * - categoria: preparado para Post-MVP; el FilterBar de MVP no lo expone
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(),
});

export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;

// ---------------------------------------------------------------------------
// GET /api/herramientas/[id] — path params
// ---------------------------------------------------------------------------

/**
 * Valida el path param [id].
 * z.coerce.number() convierte el string de la URL a número antes de validar.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce
    .number()
    .int("El parámetro 'id' debe ser un número entero")
    .positive("El parámetro 'id' debe ser mayor que 0"),
});

export type GetHerramientaParams = z.infer<typeof GetHerramientaParamsSchema>;
