import {
  IHerramientaRepository,
  HerramientaFilters,
} from "@/domain/herramienta/herramienta.repository";
import { HerramientaListItemDto } from "../dtos/herramienta-list-item.dto";

export interface ListHerramientasResult {
  data: HerramientaListItemDto[];
  count: number;
}

/**
 * Query Handler: Lista herramientas con filtros opcionales.
 *
 * Recibe IHerramientaRepository por constructor (DI).
 * Convierte entities de dominio a DTOs serializables.
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

    return { data, count: data.length };
  }
}
