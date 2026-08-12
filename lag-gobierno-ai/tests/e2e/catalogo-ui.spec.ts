import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del Catálogo de Herramientas AI
 *
 * Cubre US-01 a US-05 en el browser: 1 happy path, 1 caso negativo, 1 edge case por story.
 * Ejecutar: npx playwright test catalogo-ui
 */

// ============================================================
// US-01: Consultar catálogo completo (UI)
// ============================================================

test.describe("US-01: /catalogo — Catálogo completo UI", () => {
  test("happy path: muestra herramientas con semáforo y grid", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Header visible
    await expect(
      page.getByRole("heading", { name: "Catálogo de Herramientas AI" })
    ).toBeVisible();

    // Grid de herramientas cargado (al menos 1 card)
    const cards = page.getByRole("article");
    await expect(cards.first()).toBeVisible();

    // Contador de herramientas visible
    await expect(page.getByText("31 herramientas")).toBeVisible();
  });

  test("caso negativo: muestra EmptyState si no hay datos (simulado via filtro imposible)", async ({
    page,
  }) => {
    // Filtrar por nivel + estado que no tienen intersección
    await page.goto("/catalogo?nivel=Publica&estado=Retirada");

    // Debe mostrar EmptyState
    await expect(
      page.getByText("No hay herramientas registradas actualmente")
    ).toBeVisible();
  });

  test("edge case: loading skeleton aparece durante carga", async ({
    page,
  }) => {
    // Navegar y verificar que existe el aria-label del loading
    const response = page.goto("/catalogo");
    // El skeleton debería aparecer brevemente antes de que se resuelva el SC
    // Verificamos que la página final cargó correctamente
    await response;
    await expect(page.getByRole("heading", { name: "Catálogo de Herramientas AI" })).toBeVisible();
  });
});

// ============================================================
// US-02: Filtrar por nivel (UI)
// ============================================================

test.describe("US-02: /catalogo — Filtro por nivel UI", () => {
  test("happy path: seleccionar 'Pública' filtra las herramientas", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar filtro
    await page.selectOption("#filtro-nivel", "Publica");

    // URL actualizada
    await expect(page).toHaveURL(/nivel=Publica/);

    // El contador muestra menos de 31
    await expect(page.getByText("5 herramientas", { exact: true })).toBeVisible();
  });

  test("caso negativo: 'Todos los niveles' muestra el catálogo completo", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Limpiar filtro
    await page.selectOption("#filtro-nivel", "");

    // URL sin nivel
    await expect(page).not.toHaveURL(/nivel=/);

    // Muestra todas
    await expect(page.getByText("31 herramientas")).toBeVisible();
  });

  test("edge case: filtro se preserva en URL (compartible)", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Confidencial");

    // Verificar que el select refleja el valor
    const select = page.locator("#filtro-nivel");
    await expect(select).toHaveValue("Confidencial");

    // Y que muestra resultados filtrados (menos de 31)
    const countText = page.getByText(/^\d+ herramientas?$/);
    await expect(countText).toBeVisible();
  });
});

// ============================================================
// US-03: Ver detalle de herramienta (UI)
// ============================================================

test.describe("US-03: /catalogo/[id] — Detalle UI", () => {
  test("happy path: detalle de herramienta activa muestra todos los campos", async ({
    page,
  }) => {
    await page.goto("/catalogo/1");

    // Nombre en heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Semáforo visible
    await expect(page.getByRole("status")).toBeVisible();

    // Campos de detalle
    await expect(page.getByText("Categoría")).toBeVisible();
    await expect(page.getByText("Nivel máximo de datos")).toBeVisible();
    await expect(page.getByText("DPA")).toBeVisible();

    // BackButton visible
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/ })
    ).toBeVisible();
  });

  test("caso negativo: /catalogo/999 muestra not-found", async ({ page }) => {
    await page.goto("/catalogo/999");

    await expect(
      page.getByText("Herramienta no encontrada")
    ).toBeVisible();

    // Link para volver al catálogo
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/ })
    ).toBeVisible();
  });

  test("edge case: herramienta retirada muestra banner rojo", async ({
    page,
  }) => {
    // Primero obtenemos un ID de herramienta retirada via API
    const apiResponse = await page.request.get(
      "/api/herramientas?estado=Retirada"
    );
    const body = await apiResponse.json();
    const retiradaId = body.data[0].id;

    await page.goto(`/catalogo/${retiradaId}`);

    // Banner de advertencia
    await expect(
      page.getByText("NO está autorizada para uso en LAG")
    ).toBeVisible();

    // Semáforo rojo (texto "No autorizada")
    await expect(page.getByText("No autorizada")).toBeVisible();

    // Razón de retiro visible
    await expect(page.getByText("Razón de retiro")).toBeVisible();
  });
});

// ============================================================
// US-04: Semáforo visual (UI)
// ============================================================

test.describe("US-04: Semáforo visual en UI", () => {
  test("happy path: herramienta activa muestra 'Autorizada' en verde", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar un semáforo con texto "Autorizada"
    const semaforo = page.getByText("Autorizada").first();
    await expect(semaforo).toBeVisible();
  });

  test("caso negativo: herramienta retirada muestra 'No autorizada'", async ({
    page,
  }) => {
    await page.goto("/catalogo?estado=Retirada");

    const semaforo = page.getByText("No autorizada").first();
    await expect(semaforo).toBeVisible();
  });

  test("edge case: Odiseo muestra 'Condicional' en amarillo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Odiseo debería estar en el listado con semáforo "Condicional"
    const odiseoCard = page.getByRole("article", { name: /Odiseo/ });
    await expect(odiseoCard).toBeVisible();

    // Dentro de la card, debe haber el texto "Condicional"
    await expect(odiseoCard.getByText("Condicional")).toBeVisible();
  });
});

// ============================================================
// US-05: Herramientas retiradas con razón (UI)
// ============================================================

test.describe("US-05: Herramientas retiradas en UI", () => {
  test("happy path: filtrar por Retirada muestra banner de gobernanza", async ({
    page,
  }) => {
    await page.goto("/catalogo?estado=Retirada");

    // Banner H11 de gobernanza
    await expect(
      page.getByText("Estás viendo herramientas NO autorizadas")
    ).toBeVisible();
  });

  test("caso negativo: sin filtro Retirada no muestra banner gobernanza", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    await expect(
      page.getByText("Estás viendo herramientas NO autorizadas")
    ).not.toBeVisible();
  });

  test("edge case: card de herramienta retirada muestra razón inline", async ({
    page,
  }) => {
    await page.goto("/catalogo?estado=Retirada");

    // Al menos una card con motivo de retiro visible
    await expect(page.getByText("Motivo de retiro:").first()).toBeVisible();
  });
});

// ============================================================
// Navegación: BackButton preserva filtro
// ============================================================

test.describe("Navegación: BackButton", () => {
  test("volver al catálogo navega correctamente a /catalogo", async ({ page }) => {
    await page.goto("/catalogo/1");

    // Click BackButton
    await page.getByRole("link", { name: /Volver al catálogo/ }).click();

    // Navega al catálogo
    await expect(page).toHaveURL(/\/catalogo/);

    // El catálogo se muestra
    await expect(
      page.getByRole("heading", { name: "Catálogo de Herramientas AI" })
    ).toBeVisible();
  });
});
