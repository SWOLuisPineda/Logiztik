import { test, expect } from "@playwright/test";

/**
 * E2E Tests — API del Catálogo de Herramientas AI
 *
 * Cubre User Stories: US-01, US-02, US-03, US-05
 * Framework: Playwright (API testing sin browser)
 * Base URL: http://localhost:3000
 */

// ═══════════════════════════════════════════════════════════════════════════════
// US-01: Consultar el catálogo completo de herramientas
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-01: GET /api/herramientas — Catálogo completo", () => {
  test("Happy path: retorna 31 herramientas con shape correcta", async ({ request }) => {
    const response = await request.get("/api/herramientas");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Verificar shape del primer item
    const item = body.data[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("nombre");
    expect(item).toHaveProperty("proveedor");
    expect(item).toHaveProperty("categoria");
    expect(item).toHaveProperty("nivelMaximo");
    expect(item).toHaveProperty("estado");
    expect(item).toHaveProperty("razonRetiro");
  });

  test("Orden: Activas primero, luego Condicionales, luego Retiradas", async ({ request }) => {
    const response = await request.get("/api/herramientas");
    const { data } = await response.json();

    // Encontrar primera Condicional y primera Retirada
    const primeraCondicional = data.findIndex((h: { estado: string }) => h.estado === "Condicional");
    const primeraRetirada = data.findIndex((h: { estado: string }) => h.estado === "Retirada");
    const ultimaActiva = data.findLastIndex((h: { estado: string }) => h.estado === "Activa");

    // Activas antes que Condicionales antes que Retiradas
    expect(ultimaActiva).toBeLessThan(primeraCondicional);
    expect(primeraCondicional).toBeLessThan(primeraRetirada);
  });

  test("Edge case: contiene exactamente 26 Activas, 1 Condicional, 4 Retiradas", async ({ request }) => {
    const response = await request.get("/api/herramientas");
    const { data } = await response.json();

    const activas = data.filter((h: { estado: string }) => h.estado === "Activa");
    const condicionales = data.filter((h: { estado: string }) => h.estado === "Condicional");
    const retiradas = data.filter((h: { estado: string }) => h.estado === "Retirada");

    expect(activas).toHaveLength(26);
    expect(condicionales).toHaveLength(1);
    expect(retiradas).toHaveLength(4);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-02: Filtrar herramientas por nivel de datos permitido
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-02: GET /api/herramientas?nivel= — Filtro por nivel", () => {
  test("Happy path: ?nivel=Publica retorna 5 herramientas correctas", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=Publica");

    expect(response.status()).toBe(200);

    const { data, count } = await response.json();
    expect(count).toBe(5);

    // Todas deben tener nivelMaximo = Publica
    for (const h of data) {
      expect(h.nivelMaximo).toBe("Publica");
    }

    // Verificar nombres esperados del requirements.md
    const nombres = data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Gemini");
    expect(nombres).toContain("Gamma");
    expect(nombres).toContain("Perplexity");
    expect(nombres).toContain("Meta AI (WhatsApp)");
    expect(nombres).toContain("Grok");
  });

  test("Happy path: ?nivel=Restringida retorna 3 herramientas", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=Restringida");

    expect(response.status()).toBe(200);

    const { data, count } = await response.json();
    expect(count).toBe(3);

    const nombres = data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Agentes IA Seguridad (Sophos MDR)");
    expect(nombres).toContain("LM Studio");
    expect(nombres).toContain("Clonadores de voz");
  });

  test("Caso negativo: ?nivel=INVALIDO retorna 400 con error descriptivo", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=INVALIDO");

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("nivel");
  });

  test("Edge case: ?nivel=Confidencial excluye herramientas sin nivel asignado", async ({ request }) => {
    const response = await request.get("/api/herramientas?nivel=Confidencial");

    expect(response.status()).toBe(200);

    const { data } = await response.json();

    // Ninguna herramienta del resultado debe tener nivelMaximo null
    for (const h of data) {
      expect(h.nivelMaximo).toBe("Confidencial");
    }
  });

  test("Edge case: sin filtro retorna herramientas con nivelMaximo null (Odiseo)", async ({ request }) => {
    const response = await request.get("/api/herramientas");
    const { data } = await response.json();

    const sinNivel = data.filter((h: { nivelMaximo: string | null }) => h.nivelMaximo === null);
    expect(sinNivel.length).toBeGreaterThan(0);

    // Odiseo debe estar sin nivel
    const odiseo = data.find((h: { nombre: string }) => h.nombre === "Odiseo");
    expect(odiseo).toBeDefined();
    expect(odiseo.nivelMaximo).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-03: Ver detalle de una herramienta
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-03: GET /api/herramientas/[id] — Detalle", () => {
  test("Happy path: /1 retorna ChatGPT con todos los campos", async ({ request }) => {
    const response = await request.get("/api/herramientas/1");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.nombre).toBe("ChatGPT");
    expect(body.proveedor).toBe("OpenAI");
    expect(body.categoria).toBe("IA Generativa");
    expect(body.nivelMaximo).toBe("Interna");
    expect(body.estado).toBe("Activa");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");
    expect(body).toHaveProperty("retiradaEn");

    // Timestamps deben ser ISO 8601
    expect(body.creadoEn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(body.actualizadoEn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("Caso negativo: /999 retorna 404", async ({ request }) => {
    const response = await request.get("/api/herramientas/999");

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toBe("Herramienta no encontrada");
  });

  test("Caso negativo: /abc retorna 400 (id no numérico)", async ({ request }) => {
    const response = await request.get("/api/herramientas/abc");

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("id");
  });

  test("Caso negativo: /-1 retorna 400 (id negativo)", async ({ request }) => {
    const response = await request.get("/api/herramientas/-1");

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("id");
  });

  test("Edge case: herramienta retirada incluye razonRetiro", async ({ request }) => {
    // DeepSeek es id=31
    const response = await request.get("/api/herramientas/31");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.nombre).toBe("DeepSeek");
    expect(body.estado).toBe("Retirada");
    expect(body.razonRetiro).toBe("Bloqueado por firewall corporativo");
  });

  test("Edge case: Odiseo es Condicional con categoria y nivel null", async ({ request }) => {
    // Odiseo es id=27
    const response = await request.get("/api/herramientas/27");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.nombre).toBe("Odiseo");
    expect(body.estado).toBe("Condicional");
    expect(body.categoria).toBeNull();
    expect(body.nivelMaximo).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-05: Herramientas retiradas con razón de retiro
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-05: Herramientas retiradas vía API", () => {
  test("Happy path: filtrar ?estado=Retirada retorna las 4 retiradas con razón", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");

    expect(response.status()).toBe(200);

    const { data, count } = await response.json();
    expect(count).toBe(4);

    // Todas deben tener estado Retirada y razón de retiro
    for (const h of data) {
      expect(h.estado).toBe("Retirada");
      expect(h.razonRetiro).not.toBeNull();
    }

    // Verificar las 4 herramientas esperadas
    const nombres = data.map((h: { nombre: string }) => h.nombre).sort();
    expect(nombres).toEqual([
      "App Q",
      "DeepSeek",
      "Notion AI",
      "Windsurf / Cursor",
    ]);
  });

  test("Edge case: herramientas retiradas tienen categoria y nivel null", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Retirada");
    const { data } = await response.json();

    for (const h of data) {
      expect(h.categoria).toBeNull();
      expect(h.nivelMaximo).toBeNull();
    }
  });

  test("Caso negativo: ?estado=Inexistente retorna 400", async ({ request }) => {
    const response = await request.get("/api/herramientas?estado=Inexistente");

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("estado");
  });
});
