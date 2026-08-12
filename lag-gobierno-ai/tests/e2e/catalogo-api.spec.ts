import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API del Catálogo de Herramientas AI
 *
 * Cobertura por user story (requirements.md):
 * - US-01: Consultar catálogo completo
 * - US-02: Filtrar por nivel de clasificación
 * - US-03: Ver detalle de una herramienta
 * - US-05: Herramientas retiradas con razón
 */

// =============================================================================
// US-01: Consultar el catálogo completo de herramientas
// =============================================================================

test.describe("US-01: GET /api/herramientas — Catálogo completo", () => {
  test("happy path: retorna 31 herramientas con shape correcta", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Cada item tiene los campos requeridos por US-01
    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("nombre");
    expect(first).toHaveProperty("proveedor");
    expect(first).toHaveProperty("categoria");
    expect(first).toHaveProperty("nivelMaximo");
    expect(first).toHaveProperty("estado");
    expect(first).toHaveProperty("razonRetiro");
  });

  test("negativo: query param desconocido no afecta la respuesta", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?foo=bar");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.count).toBe(31);
  });

  test("edge case: orden determinístico (Activas primero, luego Condicionales, luego Retiradas)", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    // Encontrar el índice de la primera Retirada y la última Activa
    const estados = body.data.map(
      (h: { estado: string }) => h.estado
    );
    const lastActivaIndex = estados.lastIndexOf("Activa");
    const firstCondicionalIndex = estados.indexOf("Condicional");
    const firstRetiradaIndex = estados.indexOf("Retirada");

    // Las Activas van antes que Condicionales, y estas antes que Retiradas
    if (firstCondicionalIndex !== -1) {
      expect(lastActivaIndex).toBeLessThan(firstCondicionalIndex);
    }
    if (firstRetiradaIndex !== -1 && firstCondicionalIndex !== -1) {
      expect(firstCondicionalIndex).toBeLessThan(firstRetiradaIndex);
    }
  });
});

// =============================================================================
// US-02: Filtrar herramientas por nivel de clasificación
// =============================================================================

test.describe("US-02: GET /api/herramientas?nivel= — Filtro por nivel", () => {
  test("happy path: filtrar por nivel Publica retorna subset correcto", async ({
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

  test("negativo: nivel inválido retorna 400 con error descriptivo", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=FAKE");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error).toContain("Publica");
    expect(body.error).toContain("Restringida");
  });

  test("edge case: filtrar por Restringida retorna herramientas de nivel Restringida", async ({
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

test.describe("US-03: GET /api/herramientas/[id] — Detalle", () => {
  test("happy path: herramienta existente retorna detalle completo con DPA", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas/1");

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Campos de detalle requeridos por US-03
    expect(body).toHaveProperty("id", 1);
    expect(body).toHaveProperty("nombre");
    expect(body).toHaveProperty("proveedor");
    expect(body).toHaveProperty("categoria");
    expect(body).toHaveProperty("nivelMaximo");
    expect(body).toHaveProperty("estado");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");

    // Timestamps son ISO 8601
    expect(body.creadoEn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(body.actualizadoEn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("negativo: ID inexistente retorna 404", async ({ request }) => {
    const response = await request.get("/api/herramientas/999");

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("edge case: ID no numérico retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/abc");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("número entero positivo");
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón de retiro
// =============================================================================

test.describe("US-05: Herramientas retiradas via API", () => {
  test("happy path: filtro por estado=Retirada retorna las 4 retiradas con razón", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.count).toBe(4);
    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).not.toBeNull();
    }
  });

  test("negativo: estado inválido retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Eliminada");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Activa");
    expect(body.error).toContain("Retirada");
    expect(body.error).toContain("Condicional");
  });

  test("edge case: combinación nivel + estado=Retirada retorna vacío (retiradas no tienen nivel)", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/herramientas?nivel=Publica&estado=Retirada"
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    // Las herramientas retiradas típicamente no tienen nivelMaximo asignado
    expect(body.count).toBe(0);
  });
});

// =============================================================================
// US-04: Semáforo via API (campo estado en la respuesta)
// =============================================================================

test.describe("US-04: Semáforo — estados válidos en API", () => {
  test("happy path: todos los items tienen un estado reconocido", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const estadosValidos = ["Activa", "Retirada", "Condicional"];
    for (const h of body.data) {
      expect(estadosValidos).toContain(h.estado);
    }
  });

  test("negativo: herramienta retirada NO tiene nivel asignado", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");
    const body = await response.json();

    for (const h of body.data) {
      expect(h.nivelMaximo).toBeNull();
    }
  });

  test("edge case: herramienta con id=0 retorna 400 (id debe ser positivo)", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas/0");

    expect(response.status()).toBe(400);
  });
});
