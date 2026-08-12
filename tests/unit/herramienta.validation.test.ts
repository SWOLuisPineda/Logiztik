import { describe, expect, it } from "vitest";
import {
  GetHerramientaParamsSchema,
  ListHerramientasQuerySchema,
} from "@/presentation/validations/herramienta.validation";

describe("ListHerramientasQuerySchema", () => {
  it("acepta filtros validos de nivel y estado", () => {
    const parsed = ListHerramientasQuerySchema.safeParse({
      nivel: "Publica",
      estado: "Activa",
    });

    expect(parsed.success).toBe(true);
  });

  it("rechaza parametros desconocidos por strict mode", () => {
    const parsed = ListHerramientasQuerySchema.safeParse({
      nivel: "Publica",
      foo: "bar",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("GetHerramientaParamsSchema", () => {
  it("acepta id entero positivo", () => {
    const parsed = GetHerramientaParamsSchema.safeParse({ id: "10" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.id).toBe(10);
    }
  });

  it("rechaza id no numerico", () => {
    const parsed = GetHerramientaParamsSchema.safeParse({ id: "abc" });
    expect(parsed.success).toBe(false);
  });
});
