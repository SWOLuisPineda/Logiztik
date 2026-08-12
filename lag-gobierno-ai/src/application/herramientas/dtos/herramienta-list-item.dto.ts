/**
 * DTO para el listado de herramientas (sin DPA ni timestamps).
 * Shape serializable que la Presentation layer consume directamente.
 */
export interface HerramientaListItemDto {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: string | null;
  estado: string;
  razonRetiro: string | null;
}
