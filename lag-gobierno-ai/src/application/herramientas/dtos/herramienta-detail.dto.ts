import { HerramientaListItemDto } from "./herramienta-list-item.dto";

/**
 * DTO para el detalle de una herramienta (incluye DPA y timestamps).
 * Los timestamps se serializan como string ISO 8601.
 */
export interface HerramientaDetailDto extends HerramientaListItemDto {
  dpa: string;
  creadoEn: string;
  actualizadoEn: string;
}
