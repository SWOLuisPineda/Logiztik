import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del Catálogo de Herramientas AI
 *
 * Cubre User Stories: US-01, US-02, US-03, US-04, US-05
 * Framework: Playwright (browser tests)
 * Base URL: http://localhost:3000/catalogo
 */

// ═══════════════════════════════════════════════════════════════════════════════
// US-01: Consultar el catálogo completo
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-01: Página /catalogo — Catálogo completo", () => {
  test("Happy path: muestra las 31 herramientas en grid", async ({ page }) => {
    await page.goto("/catalogo");

    // Verificar título
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Catálogo de Herramientas AI"
    );

    // Verificar que hay cards visibles (al menos las primeras)
    const cards = page.locator("article");
    await expect(cards).toHaveCount(31);
  });

  test("Happy path: cada card muestra nombre, proveedor, categoría y semáforo", async ({ page }) => {
    await page.goto("/catalogo");

    // Verificar primera card contiene los campos esperados
    const primerCard = page.locator("article").first();
    await expect(primerCard).toBeVisible();

    // Debe tener un link con el nombre
    await expect(primerCard.locator("a").first()).toBeVisible();

    // Debe tener texto "Proveedor:"
    await expect(primerCard.getByText("Proveedor:")).toBeVisible();

    // Debe tener texto "Categoría:"
    await expect(primerCard.getByText("Categoría:")).toBeVisible();
  });

  test("Edge case: catálogo muestra el banner de advertencia por herramientas retiradas", async ({ page }) => {
    await page.goto("/catalogo");

    // El banner se muestra porque hay herramientas retiradas en el listado completo
    await expect(
      page.getByText("NO autorizadas")
    ).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-02: Filtrar por nivel de clasificación
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-02: Filtro por nivel en UI", () => {
  test("Happy path: filtrar por 'Publica' muestra solo 5 herramientas", async ({ page }) => {
    await page.goto("/catalogo");

    // Seleccionar filtro
    await page.locator("#filtro-nivel").selectOption("Publica");

    // Esperar navegación (URL cambia a ?nivel=Publica)
    await page.waitForURL("**/catalogo?nivel=Publica");

    // Verificar que solo hay 5 cards
    const cards = page.locator("article");
    await expect(cards).toHaveCount(5);
  });

  test("Happy path: limpiar filtro muestra todas las herramientas", async ({ page }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Seleccionar "Todos"
    await page.locator("#filtro-nivel").selectOption("");

    // Esperar que la URL se limpie
    await page.waitForURL("**/catalogo");

    // Verificar que vuelven las 31
    const cards = page.locator("article");
    await expect(cards).toHaveCount(31);
  });

  test("Edge case: filtro se preserva en la URL (shareable)", async ({ page }) => {
    // Navegar directamente con filtro en URL
    await page.goto("/catalogo?nivel=Restringida");

    // El select debe tener el valor correcto
    const select = page.locator("#filtro-nivel");
    await expect(select).toHaveValue("Restringida");

    // Solo 3 herramientas visibles
    const cards = page.locator("article");
    await expect(cards).toHaveCount(3);
  });

  test("Caso negativo: nivel inválido en URL muestra todas (ignora param)", async ({ page }) => {
    await page.goto("/catalogo?nivel=INVALIDO");

    // El page.tsx valida con Zod — si falla muestra todas
    const cards = page.locator("article");
    await expect(cards).toHaveCount(31);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-03: Ver detalle de herramienta
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-03: Página /catalogo/[id] — Detalle", () => {
  test("Happy path: detalle de herramienta activa muestra todos los campos", async ({ page }) => {
    await page.goto("/catalogo/1"); // ChatGPT

    // Título
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ChatGPT");

    // Proveedor
    await expect(page.getByText("OpenAI")).toBeVisible();

    // Estado con semáforo
    await expect(page.getByText("Activa")).toBeVisible();

    // Categoría
    await expect(page.getByText("IA Generativa")).toBeVisible();

    // DPA
    await expect(page.getByText("Acuerdo de Procesamiento de Datos")).toBeVisible();

    // Back button
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();
  });

  test("Happy path: detalle de herramienta retirada muestra banner y razón", async ({ page }) => {
    await page.goto("/catalogo/31"); // DeepSeek

    // Banner de advertencia
    await expect(
      page.getByText("NO está autorizada")
    ).toBeVisible();

    // Razón de retiro
    await expect(page.getByText("Bloqueado por firewall corporativo")).toBeVisible();

    // Semáforo rojo (texto "Retirada")
    await expect(page.getByText("Retirada")).toBeVisible();
  });

  test("Caso negativo: ID inexistente muestra not-found", async ({ page }) => {
    await page.goto("/catalogo/999");

    await expect(page.getByText("Herramienta no encontrada")).toBeVisible();
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();
  });

  test("Edge case: navegación de vuelta preserva el filtro si presente en URL", async ({ page }) => {
    // BackButton lee useSearchParams de la URL actual.
    // Si la URL de detalle incluye ?nivel=, lo preserva en el link de vuelta.
    await page.goto("/catalogo/1?nivel=Publica");

    // Verificar BackButton
    const backLink = page.getByRole("link", { name: /volver al catálogo/i });
    await expect(backLink).toBeVisible();

    // El href del backLink debe incluir ?nivel=Publica
    await expect(backLink).toHaveAttribute("href", /nivel=Publica/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-04: Semáforo visual accesible
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-04: Semáforo visual y accesibilidad", () => {
  test("Happy path: semáforo tiene texto visible y aria-label", async ({ page }) => {
    await page.goto("/catalogo/1"); // ChatGPT - Activa

    const semaforo = page.locator("[role='status']");
    await expect(semaforo).toBeVisible();

    // Tiene aria-label descriptivo
    await expect(semaforo).toHaveAttribute("aria-label", /Activa/);

    // Tiene texto visible "Activa" (no solo color)
    await expect(semaforo.getByText("Activa")).toBeVisible();
  });

  test("Edge case: Odiseo muestra semáforo amarillo (Condicional)", async ({ page }) => {
    await page.goto("/catalogo/27"); // Odiseo

    const semaforo = page.locator("[role='status']");
    await expect(semaforo).toHaveAttribute("aria-label", /Condicional/);
    await expect(semaforo.getByText("Condicional")).toBeVisible();
  });

  test("Caso negativo: FilterBar tiene label accesible asociado", async ({ page }) => {
    await page.goto("/catalogo");

    // Label existe y está asociado al select
    const label = page.locator("label[for='filtro-nivel']");
    await expect(label).toBeVisible();

    const select = page.locator("#filtro-nivel");
    await expect(select).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// US-05: Herramientas retiradas visibles con razón
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("US-05: Herramientas retiradas en UI", () => {
  test("Happy path: herramientas retiradas muestran razón de retiro inline", async ({ page }) => {
    await page.goto("/catalogo");

    // Buscar la card de DeepSeek (retirada)
    const deepseekCard = page.locator("article", { hasText: "DeepSeek" });
    await expect(deepseekCard).toBeVisible();

    // Debe mostrar razón de retiro
    await expect(
      deepseekCard.getByText("Bloqueado por firewall corporativo")
    ).toBeVisible();
  });

  test("Edge case: herramientas retiradas muestran 'Sin categoría' en gris", async ({ page }) => {
    await page.goto("/catalogo");

    // Las retiradas tienen categoria null → "Sin categoría"
    const retiradaCard = page.locator("article", { hasText: "Notion AI" });
    await expect(retiradaCard.getByText("Sin categoría")).toBeVisible();
  });

  test("Caso negativo: banner de advertencia no aparece si solo hay herramientas activas", async ({ page }) => {
    // Filtrar solo Publica — no hay retiradas con ese nivel
    await page.goto("/catalogo?nivel=Publica");

    // El banner NO debe estar visible
    await expect(
      page.getByText("NO autorizadas")
    ).not.toBeVisible();
  });
});
