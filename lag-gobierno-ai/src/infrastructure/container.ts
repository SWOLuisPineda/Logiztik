import { ListHerramientasHandler } from "@/application/herramientas/queries/list-herramientas.handler";
import { GetHerramientaByIdHandler } from "@/application/herramientas/queries/get-herramienta-by-id.handler";
import { PrismaHerramientaRepository } from "@/infrastructure/repositories/prisma-herramienta.repository";

/**
 * Composition Root: instancia handlers con sus dependencias resueltas.
 *
 * Las pages y API routes importan handlers de aquí.
 * Esto mantiene la Dependency Rule: Presentation no conoce Infrastructure directamente,
 * solo importa el handler ya instanciado con su repositorio inyectado.
 */

const herramientaRepository = new PrismaHerramientaRepository();

export const listHerramientasHandler = new ListHerramientasHandler(
  herramientaRepository
);

export const getHerramientaByIdHandler = new GetHerramientaByIdHandler(
  herramientaRepository
);
