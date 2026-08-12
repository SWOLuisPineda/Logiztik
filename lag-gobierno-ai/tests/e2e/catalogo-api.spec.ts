import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API del Catálogo de Herramientas AI
 *
 * Cobertura por User Story (requirements.md):
 * - US-01: Consultar catálogo completo
 * - US-02: Filtrar por nivel de clasificación
 * - US-03: Ver detalle de herramienta
 * - US-05: Herramientas retiradas con razón
 */

// =============================================================================
// US-01: Consultar el catálogo completo de herramientas
// =============================================================================

test.describe("US-01: Consultar catálogo completo", () => {
  test("Happy path: retorna las 31 herramientas con estructura correcta", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Cada herramienta tiene la estructura esperada
    const herramienta = body.data[0];
    expect(herramienta).toHaveProperty("id");
    expect(herramienta).toHaveProperty("nombre");
    expect(herramienta).toHaveProperty("proveedor");
    expect(herramienta).toHaveProperty("categoria");
    expect(herramienta).toHaveProperty("nivelMaximo");
    expect(herramienta).toHaveProperty("estado");
    expect(herramienta).toHaveProperty("razonRetiro");
  });

  test("Caso negativo: endpoint inexistente retorna 404", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas-invalido");
    expect(response.status()).toBe(404);
  });

  test("Edge case: orden — Activas primero, luego Condicionales, luego Retiradas", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const estados = body.data.map((h: { estado: string }) => h.estado);
    const primeraRetirada = estados.indexOf("Retirada");
    const ultimaActiva = estados.lastIndexOf("Activa");

    // Todas las Activas deben estar antes de las Retiradas
    if (primeraRetirada !== -1 && ultimaActiva !== -1) {
      expect(ultimaActiva).toBeLessThan(primeraRetirada);
    }
  });
});

// =============================================================================
// US-02: Filtrar herramientas por nivel de clasificación
// =============================================================================

test.describe("US-02: Filtrar por nivel de clasificación", () => {
  test("Happy path: filtro nivel=Publica retorna subset correcto", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=Publica");

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Todas las herramientas retornadas tienen nivel Publica
    expect(body.count).toBeGreaterThan(0);
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }
  });

  test("Caso negativo: nivel inválido retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=FAKE");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("Edge case: filtro nivel=Restringida retorna herramientas de alta sensibilidad", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=Restringida");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.count).toBeGreaterThan(0);
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Restringida");
    }
  });
});

// =============================================================================
// US-03: Ver detalle de una herramienta
// =============================================================================

test.describe("US-03: Ver detalle de herramienta", () => {
  test("Happy path: detalle de herramienta activa por ID", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas/1");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("id", 1);
    expect(body).toHaveProperty("nombre");
    expect(body).toHaveProperty("proveedor");
    expect(body).toHaveProperty("estado");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");
    expect(body).toHaveProperty("retiradaEn");
  });

  test("Caso negativo: ID inexistente retorna 404", async ({ request }) => {
    const response = await request.get("/api/herramientas/999");

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("Edge case: ID no numérico retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/abc");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("id");
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón de retiro
// =============================================================================

test.describe("US-05: Herramientas retiradas con razón", () => {
  test("Happy path: filtro estado=Retirada muestra las 4 retiradas con razón", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.count).toBe(4);
    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).not.toBeNull();
      expect(h.razonRetiro).toBeTruthy();
    }
  });

  test("Caso negativo: estado inválido retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Eliminada");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("Edge case: combinación nivel + estado con 0 resultados retorna array vacío", async ({
    request,
  }) => {
    // Herramientas retiradas no tienen nivelMaximo asignado (null), así que
    // filtrar por nivel + estado=Retirada debería dar 0 resultados
    const response = await request.get(
      "/api/herramientas?nivel=Publica&estado=Retirada"
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
  });
});

// =============================================================================
// Validaciones adicionales (robustez API)
// =============================================================================

test.describe("Robustez API", () => {
  test("ID negativo retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/-1");

    expect(response.status()).toBe(400);
  });

  test("ID 0 retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/0");

    expect(response.status()).toBe(400);
  });

  test("Query params vacíos retorna todo el catálogo", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=&estado=");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.count).toBe(31);
  });
});
