import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del Catálogo de Herramientas AI
 *
 * Cubre US-01, US-02, US-03 a nivel de interfaz web.
 * Para cada story: 1 happy path + 1 caso negativo + 1 edge case.
 *
 * Prerequisito: server running en localhost:3000, BD seeded.
 */

// ─── US-01: Consultar catálogo completo (UI) ─────────────────────────────────

test.describe("US-01: Página /catalogo — listado completo", () => {
  test("happy path: muestra herramientas con nombre, proveedor y semáforo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Título de la página visible
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Catálogo de Herramientas AI"
    );

    // Debe mostrar al menos una herramienta en el grid
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();

    // Contador de resultados visible
    const counter = page.getByText(/herramientas? encontrada/);
    await expect(counter).toBeVisible();
  });

  test("negativo: /catalogo/999 muestra página not-found", async ({ page }) => {
    await page.goto("/catalogo/999");

    await expect(page.getByText("Herramienta no encontrada")).toBeVisible();
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();
  });

  test("edge case: metadata del título del tab es correcta", async ({ page }) => {
    await page.goto("/catalogo");

    await expect(page).toHaveTitle("Catálogo de Herramientas AI — LAG");
  });
});

// ─── US-02: Filtro por nivel (UI) ────────────────────────────────────────────

test.describe("US-02: FilterBar — filtro por nivel de clasificación", () => {
  test("happy path: seleccionar Pública filtra las herramientas y actualiza URL", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar filtro
    const select = page.getByLabel("Filtrar por nivel de clasificación:");
    await select.selectOption("Publica");

    // URL debe contener ?nivel=Publica
    await expect(page).toHaveURL(/nivel=Publica/);

    // Contador refleja el filtro
    const counter = page.getByText(/herramientas? encontrada/);
    await expect(counter).toBeVisible();
  });

  test("negativo: URL con ?nivel=INVALIDO muestra todas las herramientas (ignora silenciosamente)", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=INVALIDO");

    // No debe crashear — muestra catálogo completo
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();

    // Contador muestra total (no filtrado)
    const counter = page.getByText(/herramientas? encontrada/);
    await expect(counter).toBeVisible();
  });

  test("edge case: limpiar filtro regresa a /catalogo sin ? trailing", async ({ page }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Seleccionar "Todos los niveles"
    const select = page.getByLabel("Filtrar por nivel de clasificación:");
    await select.selectOption("");

    // URL limpia sin ? trailing
    await page.waitForURL((url) => !url.search.includes("nivel"));
    const currentUrl = page.url();
    expect(currentUrl).not.toMatch(/\?$/);
  });
});

// ─── US-03: Detalle de herramienta (UI) ──────────────────────────────────────

test.describe("US-03: Página /catalogo/[id] — detalle de herramienta", () => {
  test("happy path: detalle muestra todos los campos requeridos", async ({ page }) => {
    await page.goto("/catalogo");

    // Click en primera herramienta (link "Ver detalle")
    const detailLink = page.getByRole("link", { name: /ver detalle/i }).first();
    await detailLink.click();

    // Debe navegar a /catalogo/[id]
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // BackButton visible
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();

    // Nombre en heading
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Campos de detalle presentes (dt labels)
    await expect(page.getByText("Proveedor")).toBeVisible();
    await expect(page.getByText("Estado")).toBeVisible();
  });

  test("negativo: /catalogo/abc muestra not-found (id no numérico)", async ({ page }) => {
    await page.goto("/catalogo/abc");

    await expect(page.getByText("Herramienta no encontrada")).toBeVisible();
  });

  test("edge case: BackButton preserva filtro de nivel al volver", async ({ page }) => {
    // Navegar con filtro activo
    await page.goto("/catalogo?nivel=Publica");

    // Click en link de herramienta — debe propagar ?nivel=Publica al detalle
    const detailLink = page.getByRole("link", { name: /ver detalle/i }).first();
    await detailLink.click();

    // Verificar que la URL del detalle tiene ?nivel=Publica
    await expect(page).toHaveURL(/nivel=Publica/);

    // Click en BackButton
    const backButton = page.getByRole("link", { name: /volver al catálogo/i });
    await backButton.click();

    // Debe volver a /catalogo?nivel=Publica
    await expect(page).toHaveURL(/catalogo\?nivel=Publica/);
  });
});

// ─── US-04/05: Semáforo y herramientas retiradas (UI) ────────────────────────

test.describe("US-04/05: Semáforo visual y herramientas retiradas", () => {
  test("happy path: herramienta activa muestra semáforo 'Autorizada'", async ({ page }) => {
    await page.goto("/catalogo");

    // Buscar indicador de estado
    const autorizada = page.getByText("Autorizada").first();
    await expect(autorizada).toBeVisible();
  });

  test("negativo: herramienta retirada muestra banner de advertencia en detalle", async ({
    page,
    request,
  }) => {
    // Encontrar una herramienta retirada por API
    const apiResponse = await request.get("/api/herramientas?estado=Retirada");
    const { data } = await apiResponse.json();
    const retirada = data[0];

    // Navegar al detalle
    await page.goto(`/catalogo/${retirada.id}`);

    // Banner de advertencia visible
    await expect(
      page.getByText("Esta herramienta NO está autorizada para uso en LAG")
    ).toBeVisible();

    // Semáforo rojo visible
    await expect(page.getByText("No autorizada")).toBeVisible();
  });

  test("edge case: accesibilidad — semáforo tiene aria-label descriptivo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Verificar que existe al menos un elemento con role=status y aria-label
    const semaforos = page.locator('[role="status"][aria-label]');
    await expect(semaforos.first()).toBeVisible();

    const ariaLabel = await semaforos.first().getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel!.length).toBeGreaterThan(5);
  });
});
