import { z } from "zod";
import {
  NIVELES_CLASIFICACION,
} from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import {
  ESTADOS_HERRAMIENTA,
} from "@/domain/herramienta/value-objects/estado-herramienta.vo";

/**
 * Presentation Layer — Validaciones Zod para input HTTP.
 *
 * Responsabilidad exclusiva: parsear y validar parámetros de request.
 * NO define lógica de negocio. Los tipos del dominio se importan
 * para garantizar consistencia entre la validación y el contrato de domain.
 */

// Construidos desde los constantes del dominio — single source of truth.
// Si el dominio agrega un nivel/estado, la validación HTTP lo recoge automáticamente.
export const NivelClasificacionSchema = z.enum(
  NIVELES_CLASIFICACION as [string, ...string[]]
);

export const EstadoHerramientaSchema = z.enum(
  ESTADOS_HERRAMIENTA as [string, ...string[]]
);

/**
 * GET /api/herramientas — query params opcionales.
 * Ambos filtros se aplican con AND si se envían juntos.
 * H2/DT-05: `categoria` preparado para Post-MVP.
 */
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(),
});

export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;

/**
 * GET /api/herramientas/[id] — path param.
 * z.coerce convierte el string de la URL a number antes de validar.
 */
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce
    .number({ message: "El id debe ser un número" })
    .int({ message: "El id debe ser un número entero" })
    .positive({ message: "El id debe ser un número positivo" }),
});

export type GetHerramientaParams = z.infer<typeof GetHerramientaParamsSchema>;
