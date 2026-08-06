import { z } from "zod";

/**
 * Task 15 — Zod schemas para validación de inputs HTTP del módulo herramientas.
 *
 * Responsabilidad: parsear y validar query params y path params de la API.
 * No define DTOs de respuesta (esos viven en src/application/herramientas/dtos/).
 * No define DpaEstado (no es un input HTTP — vive en el dominio).
 *
 * Dependency Rule: este archivo NO importa de @/domain, @/application ni @/infrastructure.
 * Solo depende de "zod".
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

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

// ─── GET /api/herramientas — query params ────────────────────────────────────

/**
 * Valida los query params opcionales de GET /api/herramientas.
 * Si se pasan ambos, la API los aplica con AND.
 *
 * Nota (design.md §2): herramientas con nivelMaximo null se EXCLUYEN cuando
 * se filtra por nivel. Solo aparecen sin el parámetro `nivel`.
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
});

export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;

// ─── GET /api/herramientas/[id] — path param ─────────────────────────────────

/**
 * Valida el path param `id`.
 * z.coerce.number() convierte el string del segmento de ruta a número.
 * Rechaza: strings no numéricos, cero, negativos y decimales.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z
    .coerce
    .number()
    .int("El parámetro 'id' debe ser un número entero.")
    .positive("El parámetro 'id' debe ser un número positivo."),
});

export type GetHerramientaParams = z.infer<typeof GetHerramientaParamsSchema>;
