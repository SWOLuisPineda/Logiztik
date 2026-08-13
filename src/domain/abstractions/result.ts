/**
 * Result<T> Pattern — Para post-MVP commands.
 *
 * Las operaciones de escritura retornarán Result en vez de lanzar excepciones
 * para errores de negocio previsibles. En el MVP read-only no se usa aún.
 *
 * Ref: docs/engineering/Clean-Architecture-Unify.md
 */

export type Result<T, E = ResultError> =
  | { success: true; value: T }
  | { success: false; error: E };

export interface ResultError {
  code: string;
  description: string;
}

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function fail<E = ResultError>(error: E): Result<never, E> {
  return { success: false, error };
}
