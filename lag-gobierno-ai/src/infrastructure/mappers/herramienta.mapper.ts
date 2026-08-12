import { Herramienta } from "@/domain/herramienta/herramienta.entity";
import type { NivelClasificacion } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import { NIVELES_CLASIFICACION } from "@/domain/herramienta/value-objects/nivel-clasificacion.vo";
import type { EstadoHerramienta } from "@/domain/herramienta/value-objects/estado-herramienta.vo";
import { ESTADOS_HERRAMIENTA } from "@/domain/herramienta/value-objects/estado-herramienta.vo";

/**
 * Tipo del modelo de Prisma (lo que retorna prisma.herramienta.findMany()).
 * Definido aquí para no acoplar Domain con Prisma types generados.
 */
interface PrismaHerramientaModel {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: string | null;
  estado: string;
  dpa: string;
  razonRetiro: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Mapper: convierte un model de Prisma a una entidad de dominio.
 *
 * Responsabilidad: validar/castear los strings de BD a los value objects tipados.
 * Si un valor no es válido (data corruption), usa null o valor por defecto.
 */
export function toDomain(model: PrismaHerramientaModel): Herramienta {
  const nivelMaximo = isValidNivel(model.nivelMaximo)
    ? model.nivelMaximo
    : null;

  const estado = isValidEstado(model.estado)
    ? model.estado
    : "Activa";

  return Herramienta.create({
    id: model.id,
    nombre: model.nombre,
    proveedor: model.proveedor,
    categoria: model.categoria,
    nivelMaximo,
    estado,
    dpa: model.dpa,
    razonRetiro: model.razonRetiro,
    creadoEn: model.creadoEn,
    actualizadoEn: model.actualizadoEn,
  });
}

function isValidNivel(value: string | null): value is NivelClasificacion {
  if (value === null) return false;
  return (NIVELES_CLASIFICACION as readonly string[]).includes(value);
}

function isValidEstado(value: string): value is EstadoHerramienta {
  return (ESTADOS_HERRAMIENTA as readonly string[]).includes(value);
}
