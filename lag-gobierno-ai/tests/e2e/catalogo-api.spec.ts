import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API del Catálogo de Herramientas AI
 *
 * Cubre US-01 a US-05 con: 1 happy path, 1 caso negativo, 1 edge case por story.
 * Ejecutar: npx playwright test catalogo-api
 */

// ============================================================
// US-01: Consultar catálogo completo
// ============================================================

test.describe("US-01: GET /api/herramientas — Catálogo completo", () => {
  test("happy path: retorna 31 herramientas con campos requeridos", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Cada herramienta tiene los campos requeridos
    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("nombre");
    expect(first).toHaveProperty("proveedor");
    expect(first).toHaveProperty("categoria");
    expect(first).toHaveProperty("nivelMaximo");
    expect(first).toHaveProperty("estado");
    expect(first).toHaveProperty("razonRetiro");
  });

  test("orden: Activas primero, luego Condicionales, luego Retiradas", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const estados = body.data.map((h: { estado: string }) => h.estado);
    const firstRetiradaIndex = estados.indexOf("Retirada");
    const lastActivaIndex = estados.lastIndexOf("Activa");

    // Todas las Activas deben estar antes de las Retiradas
    if (firstRetiradaIndex !== -1 && lastActivaIndex !== -1) {
      expect(lastActivaIndex).toBeLessThan(firstRetiradaIndex);
    }
  });

  test("edge case: respuesta incluye herramientas con nivelMaximo null (Odiseo)", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas");
    const body = await response.json();

    const sinNivel = body.data.filter(
      (h: { nivelMaximo: string | null }) => h.nivelMaximo === null
    );
    // Al menos Odiseo y las retiradas tienen nivel null
    expect(sinNivel.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// US-02: Filtrar por nivel de clasificación
// ============================================================

test.describe("US-02: GET /api/herramientas?nivel= — Filtro por nivel", () => {
  test("happy path: ?nivel=Publica retorna 5 herramientas", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=Publica");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(5);

    // Todas deben tener nivelMaximo === "Publica"
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }
  });

  test("caso negativo: ?nivel=INVALIDO retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=INVALIDO");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("nivel");
  });

  test("edge case: ?nivel=Restringida retorna 3 herramientas", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?nivel=Restringida");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(3);

    // Nombres esperados según requirements.md
    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Agentes IA Seguridad (Sophos MDR)");
    expect(nombres).toContain("LM Studio");
  });
});

// ============================================================
// US-03: Ver detalle de una herramienta
// ============================================================

test.describe("US-03: GET /api/herramientas/[id] — Detalle", () => {
  test("happy path: /1 retorna detalle completo con DPA", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas/1");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("nombre");
    expect(body).toHaveProperty("proveedor");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");
    expect(body.estado).toMatch(/^(Activa|Retirada|Condicional)$/);
  });

  test("caso negativo: /999 retorna 404", async ({ request }) => {
    const response = await request.get("/api/herramientas/999");
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("edge case: /abc retorna 400 (id no numérico)", async ({ request }) => {
    const response = await request.get("/api/herramientas/abc");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("número entero positivo");
  });
});

// ============================================================
// US-04: Semáforo visual (verificado via API — campo estado)
// ============================================================

test.describe("US-04: Semáforo — estados correctos en datos", () => {
  test("happy path: herramientas activas tienen estado 'Activa'", async ({
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

  test("caso negativo: ?estado=INVALIDO retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=INVALIDO");
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("estado");
  });

  test("edge case: Odiseo tiene estado 'Condicional'", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Condicional");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBeGreaterThanOrEqual(1);

    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Odiseo");
  });
});

// ============================================================
// US-05: Herramientas retiradas con razón
// ============================================================

test.describe("US-05: GET /api/herramientas?estado=Retirada — Retiradas", () => {
  test("happy path: retorna 4 herramientas retiradas con razón", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(4);

    // Todas deben tener estado Retirada y razonRetiro
    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).not.toBeNull();
    }
  });

  test("caso negativo: herramientas activas NO tienen razonRetiro con contenido", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Activa");
    const body = await response.json();

    for (const h of body.data) {
      expect(h.razonRetiro).toBeNull();
    }
  });

  test("edge case: DeepSeek tiene razón 'Bloqueado por firewall corporativo'", async ({
    request,
  }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");
    const body = await response.json();

    const deepseek = body.data.find(
      (h: { nombre: string }) => h.nombre === "DeepSeek"
    );
    expect(deepseek).toBeDefined();
    expect(deepseek.razonRetiro).toBe("Bloqueado por firewall corporativo");
  });
});

// ============================================================
// Filtros combinados (AND)
// ============================================================

test.describe("Filtros combinados", () => {
  test("?nivel=Publica&estado=Activa retorna solo activas públicas", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/herramientas?nivel=Publica&estado=Activa"
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
      expect(h.estado).toBe("Activa");
    }
  });

  test("?nivel=Publica&estado=Retirada retorna vacío (no hay retiradas con nivel Publica)", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/herramientas?nivel=Publica&estado=Retirada"
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
  });
});
