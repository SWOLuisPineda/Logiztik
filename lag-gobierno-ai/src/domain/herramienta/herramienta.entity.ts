import { NivelClasificacion } from "./value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "./value-objects/estado-herramienta.vo";

/**
 * Props para crear una entidad Herramienta.
 */
export interface HerramientaProps {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: NivelClasificacion | null;
  estado: EstadoHerramienta;
  dpa: string;
  razonRetiro: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Entidad de dominio: Herramienta AI del catálogo de LAG.
 *
 * Inmutable (read-only). Creación exclusivamente via factory method `create()`.
 * Post-MVP: el factory validará invariantes cuando existan commands de escritura.
 */
export class Herramienta {
  private constructor(private readonly props: HerramientaProps) {}

  static create(props: HerramientaProps): Herramienta {
    return new Herramienta(props);
  }

  get id(): number {
    return this.props.id;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get proveedor(): string {
    return this.props.proveedor;
  }

  get categoria(): string | null {
    return this.props.categoria;
  }

  get nivelMaximo(): NivelClasificacion | null {
    return this.props.nivelMaximo;
  }

  get estado(): EstadoHerramienta {
    return this.props.estado;
  }

  get dpa(): string {
    return this.props.dpa;
  }

  get razonRetiro(): string | null {
    return this.props.razonRetiro;
  }

  get creadoEn(): Date {
    return this.props.creadoEn;
  }

  get actualizadoEn(): Date {
    return this.props.actualizadoEn;
  }

  /** Indica si la herramienta fue retirada del catálogo (semáforo rojo). */
  get estaRetirada(): boolean {
    return this.props.estado === "Retirada";
  }

  /** Indica si la herramienta tiene uso condicional (semáforo amarillo). */
  get esCondicional(): boolean {
    return this.props.estado === "Condicional";
  }
}
