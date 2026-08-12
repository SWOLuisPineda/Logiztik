import { IHerramientaRepository } from "@/domain/herramienta/herramienta.repository";
import { HerramientaDetailDto } from "../dtos/herramienta-detail.dto";

/**
 * Query Handler: Obtiene el detalle completo de una herramienta por ID.
 *
 * Retorna null si la herramienta no existe (el caller decide si es 404 u otra acción).
 */
export class GetHerramientaByIdHandler {
  constructor(private readonly repository: IHerramientaRepository) {}

  async execute(id: number): Promise<HerramientaDetailDto | null> {
    const herramienta = await this.repository.findById(id);

    if (!herramienta) {
      return null;
    }

    return {
      id: herramienta.id,
      nombre: herramienta.nombre,
      proveedor: herramienta.proveedor,
      categoria: herramienta.categoria,
      nivelMaximo: herramienta.nivelMaximo,
      estado: herramienta.estado,
      dpa: herramienta.dpa,
      razonRetiro: herramienta.razonRetiro,
      creadoEn: herramienta.creadoEn.toISOString(),
      actualizadoEn: herramienta.actualizadoEn.toISOString(),
    };
  }
}
