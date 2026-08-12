import { test, expect } from "@playwright/test";

/**
 * E2E — API del Catálogo de Herramientas AI (sin browser)
 *
 * Cobertura por User Story (Must Have + Should Have del requirements.md):
 *   US-01: Catálogo completo
 *   US-02: Filtrar por nivel
 *   US-03: Detalle de herramienta
 *   US-04: Semáforo (verificado via campo estado)
 *   US-05: Herramientas retiradas
 *
 * Cada US: 1 happy path · 1 negativo · 1 edge case
 */

// =============================================================================
// US-01: Consultar el catálogo completo de herramientas
// =============================================================================

test.describe("US-01: Consultar catálogo completo", () => {
  test("Happy — retorna 31 herramientas con campos requeridos", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.data).toHaveLength(31);
    expect(body.count).toBe(31);

    for (const h of body.data) {
      expect(h).toHaveProperty("id");
      expect(h).toHaveProperty("nombre");
      expect(h).toHaveProperty("proveedor");
      expect(h).toHaveProperty("estado");
      expect(["Activa", "Retirada", "Condicional"]).toContain(h.estado);
    }
  });

  test("Negativo — query param inválido retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas?nivel=FAKE");
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty("error");
    expect(body.error.toLowerCase()).toContain("inválid");
  });

  test("Edge — orden determinístico Activas → Condicionales → Retiradas", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas");
    const body = await res.json();

    const estados: string[] = body.data.map(
      (h: { estado: string }) => h.estado
    );

    const lastActiva = estados.lastIndexOf("Activa");
    const firstCondicional = estados.indexOf("Condicional");
    const lastCondicional = estados.lastIndexOf("Condicional");
    const firstRetirada = estados.indexOf("Retirada");

    if (firstCondicional !== -1) {
      expect(lastActiva).toBeLessThan(firstCondicional);
    }
    if (firstRetirada !== -1 && firstCondicional !== -1) {
      expect(lastCondicional).toBeLessThan(firstRetirada);
    }
  });
});

// =============================================================================
// US-02: Filtrar herramientas por nivel de datos permitido
// =============================================================================

test.describe("US-02: Filtrar por nivel", () => {
  test("Happy — nivel=Publica retorna subset correcto", async ({ request }) => {
    const res = await request.get("/api/herramientas?nivel=Publica");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);

    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }
  });

  test("Negativo — nivel inventado retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas?nivel=SuperSecreto");
    expect(res.status()).toBe(400);
  });

  test("Edge — nivel=Restringida retorna herramientas de alta sensibilidad", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Restringida");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);

    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Restringida");
    }
  });
});

// =============================================================================
// US-03: Ver detalle de una herramienta
// =============================================================================

test.describe("US-03: Detalle de herramienta", () => {
  test("Happy — GET /api/herramientas/1 retorna detalle completo", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas/1");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("id", 1);
    expect(body).toHaveProperty("nombre");
    expect(body).toHaveProperty("proveedor");
    expect(body).toHaveProperty("estado");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");
  });

  test("Negativo — ID inexistente retorna 404", async ({ request }) => {
    const res = await request.get("/api/herramientas/999");
    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("Edge — ID no numérico retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas/abc");
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toContain("número entero positivo");
  });
});

// =============================================================================
// US-04: Semáforo (verificado via campo estado en API)
// =============================================================================

test.describe("US-04: Semáforo de estado", () => {
  test("Happy — estado=Activa filtra solo herramientas verdes", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Activa");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);

    for (const h of body.data) {
      expect(h.estado).toBe("Activa");
    }
  });

  test("Negativo — ID=0 (no positivo) retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas/0");
    expect(res.status()).toBe(400);
  });

  test("Edge — existe al menos 1 herramienta Condicional (Odiseo)", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Condicional");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.count).toBeGreaterThanOrEqual(1);

    for (const h of body.data) {
      expect(h.estado).toBe("Condicional");
    }
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón de retiro
// =============================================================================

test.describe("US-05: Herramientas retiradas", () => {
  test("Happy — estado=Retirada retorna 4 herramientas con razonRetiro", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Retirada");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.count).toBe(4);

    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).not.toBeNull();
      expect(h.razonRetiro.length).toBeGreaterThan(0);
    }
  });

  test("Negativo — estado inventado retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas?estado=Eliminada");
    expect(res.status()).toBe(400);
  });

  test("Edge — Retirada + nivel=Publica combina filtros (probablemente vacío)", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/herramientas?estado=Retirada&nivel=Publica"
    );
    expect(res.status()).toBe(200);

    const body = await res.json();
    // Las retiradas generalmente no tienen nivel → vacío esperado
    expect(body.count).toBeGreaterThanOrEqual(0);

    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.nivelMaximo).toBe("Publica");
    }
  });
});
