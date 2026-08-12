/**
 * Task 15 — Zod schemas de validación HTTP.
 *
 * Valida únicamente inputs HTTP (query params, path params).
 * Sin lógica de negocio. Sin imports de @/domain ni @/infrastructure.
 *
 * Los enum literals se definen aquí de forma independiente para evitar
 * dependencia circular y para que Zod infiera los tipos correctamente.
 */

import { z } from "zod";

// ── Schemas reutilizables ─────────────────────────────────────────────────────

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
 * Query param `nivel` mapea al campo `nivelMaximo` en BD/dominio.
 * La traducción ocurre en la API route al construir HerramientaFilters.
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
});

export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;

// ── GET /api/herramientas/[id] — path param ───────────────────────────────────

/**
 * z.coerce.number() convierte el string de la URL a número.
 * Rechaza: strings no numéricos, 0, negativos, decimales.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce
    .number({ message: "El parámetro 'id' debe ser un número entero positivo." })
    .int({ message: "El parámetro 'id' debe ser un número entero." })
    .positive({ message: "El parámetro 'id' debe ser mayor que 0." }),
});

export type GetHerramientaParams = z.infer<typeof GetHerramientaParamsSchema>;
