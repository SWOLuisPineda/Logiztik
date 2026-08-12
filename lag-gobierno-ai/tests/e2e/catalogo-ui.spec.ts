import { test, expect } from "@playwright/test";

/**
 * E2E — UI del Catálogo de Herramientas AI (browser Chromium)
 *
 * Cobertura por User Story (Must Have + Should Have del requirements.md):
 *   US-01: Catálogo completo — vista
 *   US-02: Filtrar por nivel — interacción
 *   US-03: Detalle de herramienta — navegación
 *   US-05: Herramientas retiradas — advertencia visual
 *
 * Cada US: 1 happy path · 1 negativo · 1 edge case
 */

// =============================================================================
// US-01: Consultar el catálogo completo — Vista
// =============================================================================

test.describe("US-01: Catálogo completo — UI", () => {
  test("Happy — /catalogo muestra heading, herramientas y semáforos", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    await expect(
      page.getByRole("heading", { name: /catálogo de herramientas ai/i })
    ).toBeVisible();

    // Al menos un card-link a detalle
    const cards = page.getByRole("link", { name: /ver detalle de/i });
    await expect(cards.first()).toBeVisible();

    // Semáforo visual presente (role=status)
    const semaforos = page.getByRole("status");
    await expect(semaforos.first()).toBeVisible();
  });

  test("Negativo — /catalogo/99999 muestra página not-found", async ({
    page,
  }) => {
    await page.goto("/catalogo/99999");

    await expect(page.getByText(/herramienta no encontrada/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /volver al catálogo/i })
    ).toBeVisible();
  });

  test("Edge — / redirige automáticamente a /catalogo", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/catalogo");
    await expect(page).toHaveURL(/\/catalogo/);
  });
});

// =============================================================================
// US-02: Filtrar por nivel — Interacción
// =============================================================================

test.describe("US-02: Filtrar por nivel — UI", () => {
  test("Happy — seleccionar Publica actualiza URL y filtra cards", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    const select = page.getByLabel(/filtrar por nivel/i);
    await select.selectOption("Publica");

    await expect(page).toHaveURL(/nivel=Publica/);

    // Cards siguen visibles (subset)
    const cards = page.getByRole("link", { name: /ver detalle de/i });
    await expect(cards.first()).toBeVisible();
  });

  test("Negativo — URL con nivel válido pero vacía de resultados no crashea", async ({
    page,
  }) => {
    // Restringida puede tener pocos o muchos — pero la página no debe romper
    await page.goto("/catalogo?nivel=Restringida");

    await expect(
      page.getByRole("heading", { name: /catálogo de herramientas ai/i })
    ).toBeVisible();

    const select = page.getByLabel(/filtrar por nivel/i);
    await expect(select).toHaveValue("Restringida");
  });

  test("Edge — limpiar filtro vuelve a mostrar todas", async ({ page }) => {
    await page.goto("/catalogo?nivel=Publica");

    const select = page.getByLabel(/filtrar por nivel/i);
    await select.selectOption("");

    // URL ya no tiene ?nivel
    await page.waitForURL((url) => !url.search.includes("nivel"));

    const cards = page.getByRole("link", { name: /ver detalle de/i });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});

// =============================================================================
// US-03: Ver detalle de herramienta — Navegación
// =============================================================================

test.describe("US-03: Detalle — UI", () => {
  test("Happy — click en card navega al detalle con nombre y proveedor", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    const firstCard = page
      .getByRole("link", { name: /ver detalle de/i })
      .first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // Proveedor visible en detalle
    await expect(page.getByText(/proveedor/i).first()).toBeVisible();
  });

  test("Negativo — /catalogo/abc muestra not-found", async ({ page }) => {
    await page.goto("/catalogo/abc");
    await expect(page.getByText(/herramienta no encontrada/i)).toBeVisible();
  });

  test("Edge — volver al catálogo preserva el filtro de nivel", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Navegar al detalle
    const firstCard = page
      .getByRole("link", { name: /ver detalle de/i })
      .first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // Click en volver
    await page.getByRole("link", { name: /volver al catálogo/i }).click();

    // El filtro se preserva
    await expect(page).toHaveURL(/nivel=Publica/);
  });
});

// =============================================================================
// US-05: Herramientas retiradas — Advertencia visual
// =============================================================================

test.describe("US-05: Retiradas — UI", () => {
  test("Happy — el catálogo muestra al menos una herramienta con badge Retirada", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    const retiredLabel = page.getByText("Retirada", { exact: true }).first();
    await expect(retiredLabel).toBeVisible();
  });

  test("Negativo — detalle de herramienta retirada muestra banner de alerta", async ({
    page,
  }) => {
    // Obtener ID de una retirada via API
    const apiRes = await page.request.get("/api/herramientas?estado=Retirada");
    const apiBody = await apiRes.json();
    const retiradaId = apiBody.data[0].id;

    await page.goto(`/catalogo/${retiradaId}`);

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(
      page.getByText(/no está autorizada para uso en lag/i)
    ).toBeVisible();
  });

  test("Edge — herramienta retirada no muestra campo DPA", async ({
    page,
  }) => {
    const apiRes = await page.request.get("/api/herramientas?estado=Retirada");
    const apiBody = await apiRes.json();
    const retiradaId = apiBody.data[0].id;

    await page.goto(`/catalogo/${retiradaId}`);

    // Razón de retiro visible
    await expect(page.getByText(/razón de retiro/i)).toBeVisible();

    // DPA no debe ser visible para retiradas
    const dpaElements = page.locator("dt", { hasText: "DPA" });
    await expect(dpaElements).toHaveCount(0);
  });
});
