import { describe, it, expect } from "vitest";
import {
  NivelClasificacionSchema,
  EstadoHerramientaSchema,
  ListHerramientasQuerySchema,
  GetHerramientaParamsSchema,
} from "./herramienta.validation";

describe("NivelClasificacionSchema", () => {
  it("accepts valid niveles", () => {
    for (const nivel of ["Publica", "Interna", "Confidencial", "Restringida"]) {
      expect(NivelClasificacionSchema.safeParse(nivel).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(NivelClasificacionSchema.safeParse("Invalido").success).toBe(false);
    expect(NivelClasificacionSchema.safeParse("").success).toBe(false);
  });
});

describe("EstadoHerramientaSchema", () => {
  it("accepts valid estados", () => {
    for (const estado of ["Activa", "Retirada", "Condicional"]) {
      expect(EstadoHerramientaSchema.safeParse(estado).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(EstadoHerramientaSchema.safeParse("Borrada").success).toBe(false);
  });
});

describe("ListHerramientasQuerySchema", () => {
  it("accepts empty object (all filters optional)", () => {
    const result = ListHerramientasQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid nivel filter", () => {
    const result = ListHerramientasQuerySchema.safeParse({ nivel: "Publica" });
    expect(result.success).toBe(true);
  });

  it("accepts valid estado filter", () => {
    const result = ListHerramientasQuerySchema.safeParse({ estado: "Activa" });
    expect(result.success).toBe(true);
  });

  it("accepts both filters together", () => {
    const result = ListHerramientasQuerySchema.safeParse({
      nivel: "Interna",
      estado: "Condicional",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid nivel", () => {
    const result = ListHerramientasQuerySchema.safeParse({ nivel: "WRONG" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid estado", () => {
    const result = ListHerramientasQuerySchema.safeParse({ estado: "Borrada" });
    expect(result.success).toBe(false);
  });
});

describe("GetHerramientaParamsSchema", () => {
  it("coerces string to positive integer", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: "5" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(5);
    }
  });

  it("accepts numeric id", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: 10 });
    expect(result.success).toBe(true);
  });

  it("rejects zero", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects negative numbers", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: "-1" });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric strings", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects float numbers", () => {
    const result = GetHerramientaParamsSchema.safeParse({ id: "3.5" });
    expect(result.success).toBe(false);
  });
});
