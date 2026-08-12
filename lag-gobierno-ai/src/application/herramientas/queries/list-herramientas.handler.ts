import {
  IHerramientaRepository,
  HerramientaFilters,
} from "@/domain/herramienta/herramienta.repository";
import { HerramientaListItemDto } from "../dtos/herramienta-list-item.dto";

export interface ListHerramientasResult {
  data: HerramientaListItemDto[];
  count: number;
  /** Cantidad de herramientas sin nivel asignado en el catálogo completo (para H7). */
  sinNivelCount: number;
}

/**
 * Query Handler: Lista herramientas con filtros opcionales.
 *
 * Recibe IHerramientaRepository por constructor (DI).
 * Convierte entities de dominio a DTOs serializables.
 * Calcula sinNivelCount consultando sin filtros para H7.
 */
export class ListHerramientasHandler {
  constructor(private readonly repository: IHerramientaRepository) {}

  async execute(filters?: HerramientaFilters): Promise<ListHerramientasResult> {
    const herramientas = await this.repository.findAll(filters);

    const data: HerramientaListItemDto[] = herramientas.map((h) => ({
      id: h.id,
      nombre: h.nombre,
      proveedor: h.proveedor,
      categoria: h.categoria,
      nivelMaximo: h.nivelMaximo,
      estado: h.estado,
      razonRetiro: h.razonRetiro,
    }));

    // H7: Calcular herramientas sin nivel asignado.
    // Si hay filtro de nivel activo, necesitamos saber cuántas herramientas tienen nivelMaximo=null.
    let sinNivelCount = 0;
    if (filters?.nivelMaximo) {
      const todas = await this.repository.findAll();
      sinNivelCount = todas.filter((h) => h.nivelMaximo === null).length;
    }

    return { data, count: data.length, sinNivelCount };
  }
}
