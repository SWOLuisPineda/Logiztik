import { Herramienta } from "@/domain/herramienta/herramienta.entity";
import {
  IHerramientaRepository,
  HerramientaFilters,
} from "@/domain/herramienta/herramienta.repository";
import { prisma } from "@/infrastructure/database/prisma.client";
import { toDomain } from "@/infrastructure/mappers/herramienta.mapper";

/**
 * ADAPTER: Implementación del repositorio de herramientas con Prisma + libSQL.
 *
 * Implementa IHerramientaRepository (PORT definido en Domain).
 * Orden: Activas (nombre ASC) → Condicionales (nombre ASC) → Retiradas (nombre ASC).
 */
export class PrismaHerramientaRepository implements IHerramientaRepository {
  async findAll(filters?: HerramientaFilters): Promise<Herramienta[]> {
    const where: Record<string, string> = {};

    if (filters?.nivelMaximo) {
      where.nivelMaximo = filters.nivelMaximo;
    }

    if (filters?.estado) {
      where.estado = filters.estado;
    }

    // Prisma SQLite no soporta orderBy con CASE nativo.
    // Consultamos todo y ordenamos en memoria (31 registros, costo trivial).
    const models = await prisma.herramienta.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    // Ordenar: Activas → Condicionales → Retiradas, nombre ASC dentro de cada grupo
    const estadoOrden: Record<string, number> = {
      Activa: 0,
      Condicional: 1,
      Retirada: 2,
    };

    models.sort((a, b) => {
      const ordenA = estadoOrden[a.estado] ?? 3;
      const ordenB = estadoOrden[b.estado] ?? 3;
      if (ordenA !== ordenB) return ordenA - ordenB;
      return a.nombre.localeCompare(b.nombre, "es");
    });

    return models.map(toDomain);
  }

  async findById(id: number): Promise<Herramienta | null> {
    const model = await prisma.herramienta.findUnique({
      where: { id },
    });

    if (!model) return null;

    return toDomain(model);
  }
}
