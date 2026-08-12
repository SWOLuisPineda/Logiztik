import { describe, expect, it } from "vitest";
import { toDomain } from "@/infrastructure/mappers/herramienta.mapper";

describe("toDomain", () => {
  const baseModel = {
    id: 999,
    nombre: "Tool Test",
    proveedor: "Proveedor Test",
    categoria: null,
    nivelMaximo: "Interna",
    estado: "Activa",
    dpa: "No aplica",
    razonRetiro: null,
    creadoEn: new Date("2026-01-01T00:00:00.000Z"),
    actualizadoEn: new Date("2026-01-02T00:00:00.000Z"),
  };

  it("normaliza nivel invalido a null", () => {
    const entity = toDomain({ ...baseModel, nivelMaximo: "TopSecret" });
    expect(entity.nivelMaximo).toBeNull();
  });

  it("normaliza estado invalido a Retirada por seguridad", () => {
    const entity = toDomain({ ...baseModel, estado: "DESCONOCIDO" });
    expect(entity.estado).toBe("Retirada");
  });

  it("normaliza dpa invalido a No aplica", () => {
    const entity = toDomain({ ...baseModel, dpa: "INVALIDO" });
    expect(entity.dpa).toBe("No aplica");
  });
});
