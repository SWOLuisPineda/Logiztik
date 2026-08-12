import { HerramientaListItemDto } from "./herramienta-list-item.dto";
import type { DpaEstado } from "@/domain/herramienta/value-objects/dpa-estado.vo";

/**
 * DTO para el detalle de una herramienta (incluye DPA y timestamps).
 * Los timestamps se serializan como string ISO 8601.
 */
export interface HerramientaDetailDto extends HerramientaListItemDto {
  dpa: DpaEstado;
  creadoEn: string;
  actualizadoEn: string;
}
