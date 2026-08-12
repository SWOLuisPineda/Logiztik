import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

/**
 * DTO para el listado de herramientas (sin DPA ni timestamps).
 * Shape serializable que la Presentation layer consume directamente.
 */
export interface HerramientaListItemDto {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: NivelClasificacion | null;
  estado: EstadoHerramienta;
  razonRetiro: string | null;
}
