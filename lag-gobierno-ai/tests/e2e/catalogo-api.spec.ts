import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API endpoints del catálogo de herramientas.
 * Basados en criterios de aceptación de requirements.md (US-01 a US-05).
 */

// =============================================================================
// US-01: Consultar el catálogo completo de herramientas
// =============================================================================

test.describe("US-01: GET /api/herramientas — Catálogo completo", () => {
  test("Happy path: retorna 31 herramientas con estructura correcta", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Verificar estructura de cada item
    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("nombre");
    expect(first).toHaveProperty("proveedor");
    expect(first).toHaveProperty("categoria");
    expect(first).toHaveProperty("nivelMaximo");
    expect(first).toHaveProperty("estado");
    expect(first).toHaveProperty("razonRetiro");
  });

  test("Orden: Activas primero, luego Condicionales, luego Retiradas", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const estados = body.data.map((h: { estado: string }) => h.estado);
    const firstRetirada = estados.indexOf("Retirada");
    const lastActiva = estados.lastIndexOf("Activa");

    // Todas las activas deben aparecer antes de las retiradas
    if (firstRetirada !== -1 && lastActiva !== -1) {
      expect(lastActiva).toBeLessThan(firstRetirada);
    }
  });

  test("Edge case: respuesta incluye herramientas retiradas con razonRetiro", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const retiradas = body.data.filter(
      (h: { estado: string }) => h.estado === "Retirada"
    );
    expect(retiradas.length).toBe(4);

    // Todas las retiradas tienen razón de retiro
    for (const h of retiradas) {
      expect(h.razonRetiro).toBeTruthy();
    }
  });
});

// =============================================================================
// US-02: Filtrar herramientas por nivel de clasificación
// =============================================================================

test.describe("US-02: GET /api/herramientas?nivel= — Filtro por nivel", () => {
  test("Happy path: filtro nivel=Publica retorna subset correcto", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=Publica");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBeGreaterThan(0);
    expect(body.count).toBeLessThan(31);

    // Todas las herramientas retornadas tienen nivel Publica
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }
  });

  test("Caso negativo: nivel inválido retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=FAKE");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("inválido");
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

test.describe("US-03: GET /api/herramientas/[id] — Detalle", () => {
  test("Happy path: /1 retorna detalle completo con DPA y timestamps", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas/1");
    expect(response.status()).toBe(200);

    const body = await response.json();
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

  test("Caso negativo: ID inexistente retorna 404", async ({ request }) => {
    const response = await request.get("/api/herramientas/999");
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("Edge case: ID inválido (string) retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/abc");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("id");
  });
});

// =============================================================================
// US-04: Semáforo visual (validamos via API que los estados son correctos)
// =============================================================================

test.describe("US-04: Estados de herramienta — Semáforo", () => {
  test("Happy path: herramientas activas tienen estado 'Activa'", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Activa");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBeGreaterThan(0);

    for (const h of body.data) {
      expect(h.estado).toBe("Activa");
    }
  });

  test("Caso negativo: estado inválido retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Invalido");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("inválido");
  });

  test("Edge case: filtro estado=Condicional retorna herramientas condicionales", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Condicional");
    expect(response.status()).toBe(200);

    const body = await response.json();
    // Debe existir al menos Odiseo como condicional
    expect(body.count).toBeGreaterThanOrEqual(1);

    for (const h of body.data) {
      expect(h.estado).toBe("Condicional");
    }
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón de retiro
// =============================================================================

test.describe("US-05: GET /api/herramientas?estado=Retirada — Herramientas retiradas", () => {
  test("Happy path: filtro estado=Retirada retorna 4 herramientas con razón", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(4);

    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).toBeTruthy();
    }
  });

  test("Caso negativo: herramienta retirada por ID muestra razón en detalle", async ({
    request,
  }) => {
    // Buscar una herramienta retirada por filtro
    const listResponse = await request.get(
      "/api/herramientas?estado=Retirada"
    );
    const listBody = await listResponse.json();
    const retirada = listBody.data[0];

    // Consultar su detalle
    const detailResponse = await request.get(
      `/api/herramientas/${retirada.id}`
    );
    expect(detailResponse.status()).toBe(200);

    const detail = await detailResponse.json();
    expect(detail.estado).toBe("Retirada");
    expect(detail.razonRetiro).toBeTruthy();
  });

  test("Edge case: ID negativo retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas/-1");
    expect(response.status()).toBe(400);
  });
});
