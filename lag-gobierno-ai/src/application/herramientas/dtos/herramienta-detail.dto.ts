import { HerramientaListItemDto } from "./herramienta-list-item.dto";

/**
 * DTO para el detalle de una herramienta (incluye DPA, timestamps, y fecha de retiro).
 * Los timestamps se serializan como string ISO 8601.
 */
export interface HerramientaDetailDto extends HerramientaListItemDto {
  dpa: string;
  retiradaEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}
