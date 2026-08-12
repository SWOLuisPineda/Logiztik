import { test, expect } from "@playwright/test";

/**
 * Tests E2E de API — Catálogo de Herramientas AI
 *
 * Cobertura por User Story (Must Have):
 *   US-01 — Consultar catálogo completo
 *   US-02 — Filtrar por nivel de clasificación
 *   US-03 — Ver detalle de herramienta
 *   US-05 — Herramientas retiradas con razón de retiro
 *
 * Estructura por test: happy path + caso negativo + edge case
 * Sin browser — usa request context de Playwright (más rápido que fetch en Node)
 */

// ---------------------------------------------------------------------------
// US-01 — Consultar catálogo completo
// ---------------------------------------------------------------------------

test.describe("US-01 — Consultar catálogo completo", () => {
  test("happy path: retorna 31 herramientas con shape correcta", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas");

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("count", 31);
    expect(body.data).toHaveLength(31);

    // Shape del primer item
    const first = body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("nombre");
    expect(first).toHaveProperty("proveedor");
    expect(first).toHaveProperty("categoria");
    expect(first).toHaveProperty("nivelMaximo");
    expect(first).toHaveProperty("estado");
    expect(first).toHaveProperty("razonRetiro");
  });

  test("happy path: las 27 herramientas activas están presentes", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Activa");
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Al menos 26 activas (Odiseo es Condicional — no Activa)
    expect(body.count).toBeGreaterThanOrEqual(26);
    // Todas deben tener estado Activa
    for (const h of body.data as Array<{ estado: string }>) {
      expect(h.estado).toBe("Activa");
    }
  });

  test("happy path: las 4 herramientas retiradas están presentes", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Retirada");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(4);

    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("DeepSeek");
    expect(nombres).toContain("Notion AI");
    expect(nombres).toContain("Windsurf / Cursor");
    expect(nombres).toContain("App Q");
  });

  test("happy path: orden correcto — Activas primero, Retiradas al final", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas");
    expect(res.status()).toBe(200);
    const body = await res.json();

    const estados = body.data.map((h: { estado: string }) => h.estado);
    const primerRetiro = estados.lastIndexOf("Activa");
    const primerRetiradaIdx = estados.indexOf("Retirada");

    // Todas las Activas deben aparecer antes de cualquier Retirada
    expect(primerRetiro).toBeLessThan(primerRetiradaIdx);
  });

  test("caso negativo: método POST no permitido", async ({ request }) => {
    const res = await request.post("/api/herramientas", { data: {} });
    // Next.js retorna 405 para métodos no definidos en la route
    expect(res.status()).toBe(405);
  });

  test("edge case: endpoint responde aunque no se envíen query params", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(31);
  });
});

// ---------------------------------------------------------------------------
// US-02 — Filtrar por nivel de clasificación
// ---------------------------------------------------------------------------

test.describe("US-02 — Filtrar por nivel de clasificación", () => {
  test("happy path: filtro nivel=Publica retorna 5 herramientas", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Publica");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(5);

    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Gemini");
    expect(nombres).toContain("Gamma");
    expect(nombres).toContain("Perplexity");
    expect(nombres).toContain("Meta AI (WhatsApp)");
    expect(nombres).toContain("Grok");
  });

  test("happy path: filtro nivel=Restringida retorna 3 herramientas", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Restringida");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(3);

    const nombres = body.data.map((h: { nombre: string }) => h.nombre);
    expect(nombres).toContain("Agentes IA Seguridad (Sophos MDR)");
    expect(nombres).toContain("LM Studio");
    expect(nombres).toContain("Clonadores de voz");
  });

  test("happy path: filtro nivel=Confidencial retorna solo herramientas Confidencial", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Confidencial");
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Todas deben tener nivelMaximo Confidencial
    for (const h of body.data as Array<{ nivelMaximo: string }>) {
      expect(h.nivelMaximo).toBe("Confidencial");
    }
  });

  test("happy path: sin filtro retorna todas (limpiar filtro = 31)", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(31);
  });

  test("caso negativo: nivel inválido retorna 400 con mensaje descriptivo", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=FAKE");
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("nivel");
  });

  test("caso negativo: nivel con mayúsculas incorrectas retorna 400", async ({
    request,
  }) => {
    // "publica" (minúscula) no es un valor válido del enum
    const res = await request.get("/api/herramientas?nivel=publica");
    expect(res.status()).toBe(400);
  });

  test("edge case: filtro nivel=Interna retorna solo herramientas Interna", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Interna");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);
    for (const h of body.data as Array<{ nivelMaximo: string }>) {
      expect(h.nivelMaximo).toBe("Interna");
    }
  });

  test("edge case: filtro nivel con espacios en blanco retorna 400", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?nivel=Publica%20");
    expect(res.status()).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// US-03 — Ver detalle de herramienta
// ---------------------------------------------------------------------------

test.describe("US-03 — Ver detalle de herramienta", () => {
  test("happy path: herramienta activa retorna shape completa con DPA", async ({
    request,
  }) => {
    // id=1 es ChatGPT según el seed
    const res = await request.get("/api/herramientas/1");
    expect(res.status()).toBe(200);

    const h = await res.json();
    expect(h).toHaveProperty("id", 1);
    expect(h).toHaveProperty("nombre");
    expect(h).toHaveProperty("proveedor");
    expect(h).toHaveProperty("categoria");
    expect(h).toHaveProperty("nivelMaximo");
    expect(h).toHaveProperty("estado");
    expect(h).toHaveProperty("dpa");
    expect(h).toHaveProperty("creadoEn");
    expect(h).toHaveProperty("actualizadoEn");
    // creadoEn debe ser ISO 8601
    expect(() => new Date(h.creadoEn).toISOString()).not.toThrow();
  });

  test("happy path: herramienta retirada tiene razonRetiro poblada", async ({
    request,
  }) => {
    // Buscar DeepSeek por listado y luego pedir su detalle
    const listRes = await request.get("/api/herramientas?estado=Retirada");
    const list = await listRes.json();
    const deepseek = list.data.find(
      (h: { nombre: string }) => h.nombre === "DeepSeek"
    );
    expect(deepseek).toBeDefined();

    const res = await request.get(`/api/herramientas/${deepseek.id}`);
    expect(res.status()).toBe(200);

    const detail = await res.json();
    expect(detail.estado).toBe("Retirada");
    expect(detail.razonRetiro).toBe("Bloqueado por firewall corporativo");
  });

  test("happy path: herramienta con estado Condicional existe (Odiseo)", async ({
    request,
  }) => {
    const listRes = await request.get("/api/herramientas?estado=Condicional");
    const list = await listRes.json();
    expect(list.count).toBeGreaterThanOrEqual(1);

    const odiseo = list.data.find(
      (h: { nombre: string }) => h.nombre === "Odiseo"
    );
    expect(odiseo).toBeDefined();
    expect(odiseo.nivelMaximo).toBeNull();
  });

  test("caso negativo: id inexistente retorna 404", async ({ request }) => {
    const res = await request.get("/api/herramientas/999");
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("no encontrada");
  });

  test("caso negativo: id no numérico retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas/abc");
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  test("edge case: id cero retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas/0");
    expect(res.status()).toBe(400);
  });

  test("edge case: id negativo retorna 400", async ({ request }) => {
    const res = await request.get("/api/herramientas/-1");
    expect(res.status()).toBe(400);
  });

  test("edge case: id extremadamente grande retorna 404", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas/999999");
    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// US-05 — Herramientas retiradas con razón de retiro
// ---------------------------------------------------------------------------

test.describe("US-05 — Herramientas retiradas", () => {
  test("happy path: las 4 retiradas tienen razonRetiro poblada", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Retirada");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(4);

    for (const h of body.data as Array<{
      nombre: string;
      razonRetiro: string | null;
    }>) {
      expect(h.razonRetiro).not.toBeNull();
      expect(h.razonRetiro!.length).toBeGreaterThan(0);
    }
  });

  test("happy path: razones de retiro correctas según datos fuente", async ({
    request,
  }) => {
    const res = await request.get("/api/herramientas?estado=Retirada");
    const body = await res.json();

    const map = Object.fromEntries(
      body.data.map((h: { nombre: string; razonRetiro: string }) => [
        h.nombre,
        h.razonRetiro,
      ])
    );

    expect(map["DeepSeek"]).toBe("Bloqueado por firewall corporativo");
    expect(map["Notion AI"]).toBe("Reemplazado por OneNote");
    expect(map["Windsurf / Cursor"]).toBe("Sin uso activo registrado");
    expect(map["App Q"]).toBe("Descontinuado");
  });

  test("caso negativo: herramienta retirada no aparece en filtro de nivel", async ({
    request,
  }) => {
    // Las retiradas tienen nivelMaximo null → no aparecen en filtros por nivel
    const res = await request.get("/api/herramientas?nivel=Publica");
    const body = await res.json();
    const retiradas = body.data.filter(
      (h: { estado: string }) => h.estado === "Retirada"
    );
    expect(retiradas).toHaveLength(0);
  });

  test("edge case: combinación estado=Retirada + nivel retorna 0 (retiradas no tienen nivel)", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/herramientas?estado=Retirada&nivel=Publica"
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Ninguna retirada tiene nivelMaximo, así que el AND da 0
    expect(body.count).toBe(0);
  });
});
