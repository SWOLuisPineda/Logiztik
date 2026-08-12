/**
 * Tests E2E de API — Catálogo de Herramientas AI
 *
 * Cubre US-01, US-02, US-03 (Must Have) usando APIRequestContext de Playwright.
 * Sin browser — solo HTTP request/response.
 *
 * Por cada user story: 1 happy path + 1 caso negativo + 1 edge case.
 */

import { test, expect, type APIRequestContext } from "@playwright/test";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getJSON(request: APIRequestContext, url: string) {
  const response = await request.get(url);
  return { response, body: await response.json() };
}

// ── US-01: Consultar el catálogo completo ─────────────────────────────────────

test.describe("US-01 — Consultar catálogo completo", () => {
  test("Happy path: GET /api/herramientas retorna 31 herramientas con shape correcto", async ({
    request,
  }) => {
    const { response, body } = await getJSON(request, "/api/herramientas");

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("count");

    // 27 activas/condicionales + 4 retiradas = 31 total
    expect(body.count).toBe(31);
    expect(body.data).toHaveLength(31);

    // Cada item tiene los campos requeridos por US-01
    const primera = body.data[0];
    expect(primera).toHaveProperty("id");
    expect(primera).toHaveProperty("nombre");
    expect(primera).toHaveProperty("proveedor");
    expect(primera).toHaveProperty("categoria");
    expect(primera).toHaveProperty("nivelMaximo");
    expect(primera).toHaveProperty("estado");
  });

  test("Negativo: las herramientas retiradas están presentes con estado Retirada", async ({
    request,
  }) => {
    const { response, body } = await getJSON(request, "/api/herramientas");

    expect(response.status()).toBe(200);

    const retiradas = body.data.filter(
      (h: { estado: string }) => h.estado === "Retirada",
    );
    expect(retiradas).toHaveLength(4);

    // Verificar que las 4 retiradas conocidas están presentes
    const nombresRetiradas = retiradas.map((h: { nombre: string }) => h.nombre);
    expect(nombresRetiradas).toContain("DeepSeek");
    expect(nombresRetiradas).toContain("Notion AI");
    expect(nombresRetiradas).toContain("Windsurf / Cursor");
    expect(nombresRetiradas).toContain("App Q");
  });

  test("Edge case: el orden es determinístico — Activas primero, Retiradas al final", async ({
    request,
  }) => {
    const { response, body } = await getJSON(request, "/api/herramientas");

    expect(response.status()).toBe(200);

    const estados = body.data.map((h: { estado: string }) => h.estado);

    // Encontrar el índice de la primera herramienta Retirada
    const primerRetiradaIdx = estados.indexOf("Retirada");
    // Encontrar el índice de la última Activa o Condicional
    const ultimaActivaIdx = estados.lastIndexOf("Activa");
    const ultimaCondicionalIdx = estados.lastIndexOf("Condicional");
    const ultimaNoRetiradaIdx = Math.max(ultimaActivaIdx, ultimaCondicionalIdx);

    // Si hay retiradas, deben aparecer DESPUÉS de todas las activas/condicionales
    if (primerRetiradaIdx !== -1 && ultimaNoRetiradaIdx !== -1) {
      expect(primerRetiradaIdx).toBeGreaterThan(ultimaNoRetiradaIdx);
    }
  });
});

// ── US-02: Filtrar por nivel de clasificación ─────────────────────────────────

test.describe("US-02 — Filtrar por nivel de clasificación", () => {
  test("Happy path: ?nivel=Publica retorna solo herramientas con nivelMaximo Publica", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=Publica",
    );

    expect(response.status()).toBe(200);

    // Todos los resultados deben tener nivelMaximo === "Publica"
    expect(body.data.length).toBeGreaterThan(0);
    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Publica");
    }

    // Los resultados conocidos de US-02 deben estar presentes
    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Gemini");
    expect(nombres).toContain("Gamma");
    expect(nombres).toContain("Perplexity");
    expect(nombres).toContain("Grok");

    // count debe coincidir con data.length
    expect(body.count).toBe(body.data.length);
  });

  test("Negativo: ?nivel=INVALIDO retorna 400 con código de error", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=INVALIDO",
    );

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("code", "INVALID_PARAM");
    // No expone stack trace
    expect(body).not.toHaveProperty("stack");
  });

  test("Edge case: herramientas con nivelMaximo null NO aparecen al filtrar por nivel", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=Interna",
    );

    expect(response.status()).toBe(200);

    // Ningún resultado debe tener nivelMaximo null cuando se filtra por nivel
    for (const h of body.data) {
      expect(h.nivelMaximo).not.toBeNull();
    }

    // Odiseo tiene nivelMaximo null — no debe aparecer en este filtro
    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).not.toContain("Odiseo");
  });

  test("Edge case: ?nivel=Restringida retorna herramientas conocidas de nivel restringido", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=Restringida",
    );

    expect(response.status()).toBe(200);

    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Agentes IA Seguridad (Sophos MDR)");
    expect(nombres).toContain("LM Studio");
    expect(nombres).toContain("Clonadores de voz");
  });

  test("Edge case: limpiar filtro — sin ?nivel retorna el catálogo completo", async ({
    request,
  }) => {
    const { response, body } = await getJSON(request, "/api/herramientas");

    expect(response.status()).toBe(200);
    expect(body.count).toBe(31);
  });

  test("Edge case: ?nivel=null como string literal retorna 400", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=null",
    );

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty("code", "INVALID_PARAM");
  });
});

// ── US-03: Ver detalle de una herramienta ─────────────────────────────────────

test.describe("US-03 — Ver detalle de herramienta", () => {
  test("Happy path: GET /api/herramientas/[id] retorna herramienta activa con todos los campos", async ({
    request,
  }) => {
    // Primero obtenemos el ID de GitHub Copilot desde el listado
    const { body: lista } = await getJSON(request, "/api/herramientas");
    const copilot = lista.data.find(
      (h: { nombre: string }) => h.nombre === "GitHub Copilot",
    );
    expect(copilot).toBeDefined();

    const { response, body } = await getJSON(
      request,
      `/api/herramientas/${copilot.id}`,
    );

    expect(response.status()).toBe(200);

    // Campos del DTO de detalle (HerramientaDetailDto)
    expect(body.nombre).toBe("GitHub Copilot");
    expect(body.proveedor).toBe("Microsoft / GitHub");
    expect(body.categoria).toBe("Desarrollo");
    expect(body.nivelMaximo).toBe("Confidencial");
    expect(body.estado).toBe("Activa");
    expect(body).toHaveProperty("dpa");
    expect(body).toHaveProperty("creadoEn");
    expect(body).toHaveProperty("actualizadoEn");

    // Los timestamps deben ser strings ISO 8601 válidos
    expect(new Date(body.creadoEn).toISOString()).toBe(body.creadoEn);
    expect(new Date(body.actualizadoEn).toISOString()).toBe(body.actualizadoEn);
  });

  test("Negativo: GET /api/herramientas/999 retorna 404", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas/999",
    );

    expect(response.status()).toBe(404);
    expect(body).toHaveProperty("error", "Herramienta no encontrada");
    expect(body).toHaveProperty("code", "NOT_FOUND");
  });

  test("Negativo: GET /api/herramientas/abc retorna 400", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas/abc",
    );

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty("code", "INVALID_PARAM");
  });

  test("Edge case: herramienta retirada incluye razonRetiro y no expone categoría ni nivelMaximo en la lógica de datos", async ({
    request,
  }) => {
    const { body: lista } = await getJSON(request, "/api/herramientas");
    const deepseek = lista.data.find(
      (h: { nombre: string }) => h.nombre === "DeepSeek",
    );
    expect(deepseek).toBeDefined();

    const { response, body } = await getJSON(
      request,
      `/api/herramientas/${deepseek.id}`,
    );

    expect(response.status()).toBe(200);
    expect(body.estado).toBe("Retirada");
    expect(body.razonRetiro).toBe("Bloqueado por firewall corporativo");
    // Las retiradas tienen categoria y nivelMaximo null (seed)
    expect(body.categoria).toBeNull();
    expect(body.nivelMaximo).toBeNull();
  });

  test("Edge case: GET /api/herramientas/0 retorna 400 (id debe ser positivo)", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas/0",
    );

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty("code", "INVALID_PARAM");
  });

  test("Edge case: GET /api/herramientas/-1 retorna 400 (id negativo)", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas/-1",
    );

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty("code", "INVALID_PARAM");
  });

  test("Edge case: herramienta Condicional (Odiseo) tiene nivelMaximo null y estado Condicional", async ({
    request,
  }) => {
    const { body: lista } = await getJSON(request, "/api/herramientas");
    const odiseo = lista.data.find(
      (h: { nombre: string }) => h.nombre === "Odiseo",
    );
    expect(odiseo).toBeDefined();

    const { response, body } = await getJSON(
      request,
      `/api/herramientas/${odiseo.id}`,
    );

    expect(response.status()).toBe(200);
    expect(body.estado).toBe("Condicional");
    expect(body.nivelMaximo).toBeNull();
  });
});

// ── US-02 combinado: filtros AND ──────────────────────────────────────────────

test.describe("US-02 — Filtros combinados", () => {
  test("?nivel=Confidencial&estado=Activa retorna intersección (AND)", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=Confidencial&estado=Activa",
    );

    expect(response.status()).toBe(200);

    for (const h of body.data) {
      expect(h.nivelMaximo).toBe("Confidencial");
      expect(h.estado).toBe("Activa");
    }
  });

  test("?estado=Retirada retorna exactamente 4 herramientas", async ({
    request,
  }) => {
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?estado=Retirada",
    );

    expect(response.status()).toBe(200);
    expect(body.count).toBe(4);
    expect(body.data).toHaveLength(4);

    for (const h of body.data) {
      expect(h.estado).toBe("Retirada");
    }
  });

  test("Filtro que no produce resultados retorna data=[] y count=0", async ({
    request,
  }) => {
    // Ninguna herramienta retirada tiene nivelMaximo asignado
    const { response, body } = await getJSON(
      request,
      "/api/herramientas?nivel=Publica&estado=Retirada",
    );

    expect(response.status()).toBe(200);
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
  });
});
