import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API del Catálogo de Herramientas AI
 *
 * Cubre US-01, US-02, US-03 (criterios Gherkin) a nivel de API.
 * Para cada story: 1 happy path + 1 caso negativo + 1 edge case.
 *
 * Prerequisito: BD seeded con 31 herramientas (27 activas + 4 retiradas).
 */

const API_BASE = "/api/herramientas";

// ─── US-01: Consultar el catálogo completo ───────────────────────────────────

test.describe("US-01: GET /api/herramientas — catálogo completo", () => {
  test("happy path: retorna 31 herramientas con shape correcta", async ({ request }) => {
    const response = await request.get(API_BASE);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Cada herramienta tiene los campos requeridos (US-01 Gherkin)
    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("nombre");
    expect(first).toHaveProperty("proveedor");
    expect(first).toHaveProperty("categoria");
    expect(first).toHaveProperty("nivelMaximo");
    expect(first).toHaveProperty("estado");
    expect(first).toHaveProperty("razonRetiro");
  });

  test("negativo: query param inválido retorna 400 descriptivo", async ({ request }) => {
    const response = await request.get(`${API_BASE}?nivel=INVALIDO`);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("nivel");
    expect(body.error).toContain("Publica");
  });

  test("edge case: filtro por estado=Retirada retorna exactamente 4 herramientas", async ({
    request,
  }) => {
    const response = await request.get(`${API_BASE}?estado=Retirada`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(4);
    // Todas deben tener estado "Retirada"
    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
    }
    // Todas deben tener razonRetiro no nulo (design.md)
    for (const h of body.data) {
      expect(h.razonRetiro).not.toBeNull();
    }
  });
});

// ─── US-02: Filtrar por nivel de datos ───────────────────────────────────────

test.describe("US-02: GET /api/herramientas?nivel= — filtro por nivel", () => {
  test("happy path: nivel=Publica retorna 5 herramientas correctas", async ({ request }) => {
    const response = await request.get(`${API_BASE}?nivel=Publica`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(5);

    // Verificar que incluye las herramientas esperadas (Gherkin US-02)
    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Gemini");
    expect(nombres).toContain("Grok");

    // Todas deben tener nivelMaximo = "Publica"
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }
  });

  test("negativo: nivel=Invalido retorna 400 con mensaje descriptivo", async ({ request }) => {
    const response = await request.get(`${API_BASE}?nivel=FAKE`);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error).toContain("Publica");
    expect(body.error).toContain("Restringida");
  });

  test("edge case: nivel=Restringida retorna 3 herramientas", async ({ request }) => {
    const response = await request.get(`${API_BASE}?nivel=Restringida`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(3);

    // Verificar herramientas de nivel Restringida (Gherkin US-02)
    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("LM Studio");

    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Restringida");
    }
  });
});

// ─── US-03: Ver detalle de una herramienta ───────────────────────────────────

test.describe("US-03: GET /api/herramientas/[id] — detalle", () => {
  test("happy path: id=1 retorna herramienta con todos los campos de detalle", async ({
    request,
  }) => {
    const response = await request.get(`${API_BASE}/1`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    // Campos del detalle (Gherkin US-03)
    expect(body).toHaveProperty("id", 1);
    expect(body).toHaveProperty("nombre");
    expect(body).toHaveProperty("proveedor");
    expect(body).toHaveProperty("categoria");
    expect(body).toHaveProperty("nivelMaximo");
    expect(body).toHaveProperty("estado");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("razonRetiro");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");

    // estado debe ser uno de los 3 válidos
    expect(["Activa", "Retirada", "Condicional"]).toContain(body.estado);

    // timestamps ISO 8601
    expect(new Date(body.creadoEn).toISOString()).toBe(body.creadoEn);
  });

  test("negativo: id=999 retorna 404 con mensaje claro", async ({ request }) => {
    const response = await request.get(`${API_BASE}/999`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toContain("no encontrada");
  });

  test("edge case: id=abc retorna 400 (id no numérico)", async ({ request }) => {
    const response = await request.get(`${API_BASE}/abc`);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("id");
  });
});

// ─── US-05: Herramientas retiradas con razón de retiro ───────────────────────

test.describe("US-05: Herramientas retiradas incluyen razón de retiro", () => {
  test("happy path: todas las retiradas tienen razonRetiro visible", async ({ request }) => {
    const response = await request.get(`${API_BASE}?estado=Retirada`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const retiradas = body.data;

    // Verificar las 4 retiradas con sus razones (Gherkin US-05)
    expect(retiradas).toHaveLength(4);

    const deepseek = retiradas.find(
      (h: { nombre: string }) => h.nombre === "DeepSeek"
    );
    expect(deepseek).toBeDefined();
    expect(deepseek.razonRetiro).toContain("firewall");

    const notionAi = retiradas.find(
      (h: { nombre: string }) => h.nombre === "Notion AI"
    );
    expect(notionAi).toBeDefined();
    expect(notionAi.razonRetiro).toContain("OneNote");
  });

  test("negativo: estado=Invalido retorna 400", async ({ request }) => {
    const response = await request.get(`${API_BASE}?estado=Invalido`);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("estado");
  });

  test("edge case: filtros combinados nivel+estado con 0 resultados", async ({ request }) => {
    // Herramientas retiradas no tienen nivel asignado (null).
    // Filtrar por nivel y estado Retirada debe retornar 0 items.
    const response = await request.get(`${API_BASE}?nivel=Publica&estado=Retirada`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
  });
});

// ─── Orden y estructura ──────────────────────────────────────────────────────

test.describe("Orden del listado (design.md): Activas → Condicionales → Retiradas", () => {
  test("el listado respeta el orden definido", async ({ request }) => {
    const response = await request.get(API_BASE);
    const body = await response.json();

    const estados = body.data.map((h: { estado: string }) => h.estado);

    // Encontrar índices de transición
    const lastActiva = estados.lastIndexOf("Activa");
    const firstCondicional = estados.indexOf("Condicional");
    const lastCondicional = estados.lastIndexOf("Condicional");
    const firstRetirada = estados.indexOf("Retirada");

    // Si hay Condicional, debe estar después de la última Activa
    if (firstCondicional !== -1) {
      expect(firstCondicional).toBeGreaterThan(lastActiva);
    }

    // Si hay Retirada, debe estar después de la última Condicional (o Activa)
    if (firstRetirada !== -1) {
      const lastNonRetirada = Math.max(lastActiva, lastCondicional);
      expect(firstRetirada).toBeGreaterThan(lastNonRetirada);
    }
  });
});
