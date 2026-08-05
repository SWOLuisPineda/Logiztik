/**
 * Errores tipados del dominio Herramienta.
 *
 * Cada error tiene un `code` único para identificación programática
 * y un `message` descriptivo para logging/debugging.
 */

export class HerramientaNotFoundError extends Error {
  readonly code = "HERRAMIENTA_NOT_FOUND";

  constructor(id: number) {
    super(`Herramienta con id ${id} no encontrada`);
    this.name = "HerramientaNotFoundError";
  }
}

export class NivelInvalidoError extends Error {
  readonly code = "NIVEL_INVALIDO";

  constructor(valor: string) {
    super(
      `Nivel de clasificación inválido: "${valor}". Valores permitidos: Publica, Interna, Confidencial, Restringida`
    );
    this.name = "NivelInvalidoError";
  }
}
