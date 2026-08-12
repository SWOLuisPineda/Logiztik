import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del Catálogo de Herramientas AI
 *
 * Cobertura por user story (requirements.md):
 * - US-01: Visualizar catálogo completo
 * - US-02: Filtrar por nivel (URL, UI)
 * - US-03: Navegar al detalle y volver
 * - US-04: Semáforo visual accesible
 * - US-05: Herramientas retiradas visibles
 */

// =============================================================================
// US-01: Consultar el catálogo completo
// =============================================================================

test.describe("US-01: Página /catalogo — Listado completo", () => {
  test("happy path: muestra herramientas en grid con nombre, proveedor y semáforo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Título principal visible
    await expect(
      page.getByRole("heading", { name: /catálogo de herramientas ai/i })
    ).toBeVisible();

    // Al menos una card de herramienta visible
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible();

    // Conteo de herramientas visible
    await expect(page.getByText(/^\d+ herramientas?$/)).toBeVisible();
  });

  test("negativo: ruta inexistente /catalogo/no-existe muestra not-found", async ({
    page,
  }) => {
    await page.goto("/catalogo/no-existe");

    await expect(page.getByText(/herramienta no encontrada/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();
  });

  test("edge case: metadata title es correcta", async ({ page }) => {
    await page.goto("/catalogo");

    await expect(page).toHaveTitle("Catálogo de Herramientas AI — LAG");
  });
});

// =============================================================================
// US-02: Filtrar por nivel de clasificación
// =============================================================================

test.describe("US-02: Filtro por nivel en /catalogo", () => {
  test("happy path: seleccionar nivel Publica filtra resultados y actualiza URL", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar filtro "Publica"
    await page.selectOption("#filter-nivel", "Publica");

    // URL debe contener el param
    await expect(page).toHaveURL(/nivel=Publica/);

    // Conteo de resultados filtrados visible (usa regex que no matchea el aviso H7)
    await expect(page.getByText(/^\d+ herramientas?$/)).toBeVisible();
  });

  test("negativo: URL con nivel inválido muestra todas las herramientas (filtro ignorado)", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Inventado");

    // El filtro no se aplica porque no es un valor reconocido
    // La página muestra todos los resultados (31)
    await expect(page.getByText(/31 herramientas/)).toBeVisible();
  });

  test("edge case: seleccionar Todos remueve el param de la URL", async ({
    page,
  }) => {
    // Empezar con filtro activo
    await page.goto("/catalogo?nivel=Publica");

    // Seleccionar "Todos"
    await page.selectOption("#filter-nivel", "");

    // URL no debe tener nivel
    await expect(page).not.toHaveURL(/nivel=/);
  });
});

// =============================================================================
// US-03: Ver detalle de una herramienta
// =============================================================================

test.describe("US-03: Página /catalogo/[id] — Detalle", () => {
  test("happy path: detalle de herramienta activa muestra todos los campos", async ({
    page,
  }) => {
    await page.goto("/catalogo/1");

    // Nombre como h1
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Campos de detalle visibles
    await expect(page.getByText(/categoría/i)).toBeVisible();
    await expect(page.getByText(/nivel máximo/i)).toBeVisible();
    await expect(page.getByText(/DPA/i)).toBeVisible();

    // Semáforo visible
    await expect(page.locator("[role='status']").first()).toBeVisible();

    // BackButton visible
    await expect(page.getByRole("link", { name: /volver al catálogo/i })).toBeVisible();
  });

  test("negativo: ID=999 muestra not-found page", async ({ page }) => {
    await page.goto("/catalogo/999");

    await expect(page.getByText(/herramienta no encontrada/i)).toBeVisible();
  });

  test("edge case: BackButton navega de vuelta a /catalogo", async ({
    page,
  }) => {
    await page.goto("/catalogo/1");

    await page.getByRole("link", { name: /volver al catálogo/i }).click();

    await expect(page).toHaveURL(/\/catalogo$/);
  });
});

// =============================================================================
// US-04: Semáforo visual accesible
// =============================================================================

test.describe("US-04: Semáforo — accesibilidad", () => {
  test("happy path: semáforo tiene role=status y aria-label descriptivo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    const semaforo = page.locator("[role='status']").first();
    await expect(semaforo).toBeVisible();

    const ariaLabel = await semaforo.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toMatch(/(Activa|Condicional|Retirada)/);
  });

  test("negativo: semáforo no depende solo de color (tiene texto visible)", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    const semaforo = page.locator("[role='status']").first();
    const text = await semaforo.textContent();

    // El texto debe contener el nombre del estado (no solo un dot de color)
    expect(text).toMatch(/(Activa|Condicional|Retirada)/);
  });

  test("edge case: herramienta retirada en detalle muestra banner de advertencia", async ({
    page,
    request,
  }) => {
    // Encontrar una herramienta retirada via API
    const apiResponse = await request.get("/api/herramientas?estado=Retirada");
    const { data } = await apiResponse.json();
    const retirada = data[0];

    await page.goto(`/catalogo/${retirada.id}`);

    // Banner de advertencia visible
    await expect(
      page.getByText(/NO está autorizada para uso en LAG/i)
    ).toBeVisible();

    // role=alert presente
    await expect(page.locator("[role='alert']")).toBeVisible();
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón
// =============================================================================

test.describe("US-05: Herramientas retiradas en UI", () => {
  test("happy path: herramienta retirada en listado muestra razón de retiro inline", async ({
    page,
    request,
  }) => {
    await page.goto("/catalogo");

    // Verificar que al menos una razón de retiro es visible en el listado
    await expect(page.getByText(/razón de retiro/i).first()).toBeVisible();
  });

  test("negativo: herramienta activa no muestra razón de retiro", async ({
    page,
  }) => {
    await page.goto("/catalogo/1");

    // Herramienta id=1 debería ser activa — no debe mostrar razón de retiro
    await expect(page.getByText(/razón de retiro/i)).not.toBeVisible();
  });

  test("edge case: detalle de retirada muestra razón sin click adicional", async ({
    page,
    request,
  }) => {
    // Encontrar una herramienta retirada
    const apiResponse = await request.get("/api/herramientas?estado=Retirada");
    const { data } = await apiResponse.json();
    const retirada = data[0];

    await page.goto(`/catalogo/${retirada.id}`);

    // La razón de retiro debe ser visible directamente
    await expect(page.getByText(/razón de retiro/i)).toBeVisible();
    await expect(page.getByText(retirada.razonRetiro)).toBeVisible();
  });
});
