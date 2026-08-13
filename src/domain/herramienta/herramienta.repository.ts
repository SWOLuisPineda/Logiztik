import { Herramienta } from "./herramienta.entity";
import { NivelClasificacion } from "./value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "./value-objects/estado-herramienta.vo";

/**
 * Filtros opcionales para la consulta de herramientas.
 * Se aplican con AND cuando ambos están presentes.
 */
export interface HerramientaFilters {
  nivelMaximo?: NivelClasificacion;
  estado?: EstadoHerramienta;
}

/**
 * PORT: Interface del repositorio de herramientas.
 *
 * Define las operaciones de lectura que la capa de Infrastructure debe implementar.
 * Domain no conoce la implementación concreta (Prisma, in-memory, etc.).
 */
export interface IHerramientaRepository {
  /**
   * Retorna todas las herramientas que cumplen los filtros.
   * Sin filtros retorna todas (31 en el catálogo actual).
   * Orden: Activas (nombre ASC) → Condicionales → Retiradas.
   */
  findAll(filters?: HerramientaFilters): Promise<Herramienta[]>;

  /**
   * Busca una herramienta por su ID.
   * Retorna null si no existe.
   */
  findById(id: number): Promise<Herramienta | null>;
}
