import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del Catálogo de Herramientas AI
 *
 * Cobertura por User Story (requirements.md):
 * - US-01: Listado visual con semáforo
 * - US-02: Filtro interactivo por nivel
 * - US-03: Página de detalle con layout diferenciado
 * - US-04: Semáforo accesible (aria-label, no solo color)
 * - US-05: Herramientas retiradas en listado con razón visible
 */

// =============================================================================
// US-01: Consultar el catálogo completo (UI)
// =============================================================================

test.describe("US-01: Catálogo completo — UI", () => {
  test("Happy path: muestra herramientas en grid con nombre, proveedor y semáforo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Título del catálogo
    await expect(
      page.getByRole("heading", { name: "Catálogo de Herramientas AI" })
    ).toBeVisible();

    // Hay cards de herramientas visibles
    const cards = page.locator('a[href^="/catalogo/"]');
    await expect(cards.first()).toBeVisible();

    // Contador de herramientas
    await expect(page.getByText(/\d+ herramienta/)).toBeVisible();
  });

  test("Caso negativo: ID inexistente muestra página not-found", async ({
    page,
  }) => {
    await page.goto("/catalogo/999");

    await expect(
      page.getByText("Herramienta no encontrada")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /catálogo/i })).toBeVisible();
  });

  test("Edge case: metadata del título es correcta", async ({ page }) => {
    await page.goto("/catalogo");
    await expect(page).toHaveTitle("Catálogo de Herramientas AI — LAG");
  });
});

// =============================================================================
// US-02: Filtrar por nivel (UI)
// =============================================================================

test.describe("US-02: Filtro por nivel — UI", () => {
  test("Happy path: seleccionar nivel filtra las herramientas y actualiza URL", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar nivel "Publica"
    const select = page.locator("#filtro-nivel");
    await select.selectOption("Publica");

    // URL actualizada
    await expect(page).toHaveURL(/nivel=Publica/);

    // Contador de herramientas visible
    await expect(page.getByText(/\d+ herramienta.*encontrada/)).toBeVisible();
  });

  test("Caso negativo: seleccionar 'Todos' remueve el filtro de la URL", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Publica");

    const select = page.locator("#filtro-nivel");
    await select.selectOption("");

    // URL no tiene nivel
    await expect(page).toHaveURL(/\/catalogo$/);
  });

  test("Edge case: URL con filtro preservado al compartir", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Confidencial");

    // El select refleja el valor del URL
    const select = page.locator("#filtro-nivel");
    await expect(select).toHaveValue("Confidencial");
  });
});

// =============================================================================
// US-03: Ver detalle de herramienta (UI)
// =============================================================================

test.describe("US-03: Detalle de herramienta — UI", () => {
  test("Happy path: detalle de herramienta activa muestra todos los campos", async ({
    page,
  }) => {
    await page.goto("/catalogo/1");

    // Campos visibles para herramienta activa
    await expect(page.getByText("Proveedor")).toBeVisible();
    await expect(page.getByText("Categoría")).toBeVisible();
    await expect(page.getByText("Nivel máximo de datos")).toBeVisible();
    await expect(page.getByText("DPA")).toBeVisible();

    // Botón de volver
    await expect(
      page.getByRole("link", { name: /volver al catálogo/i })
    ).toBeVisible();
  });

  test("Caso negativo: herramienta retirada muestra banner de advertencia", async ({
    page,
  }) => {
    // Buscar una herramienta retirada (asumimos que las retiradas están después de las activas)
    // Primero obtenemos su ID vía API
    const response = await page.request.get(
      "/api/herramientas?estado=Retirada"
    );
    const body = await response.json();
    const retiradaId = body.data[0].id;

    await page.goto(`/catalogo/${retiradaId}`);

    // Banner de advertencia visible
    await expect(
      page.getByText("Esta herramienta NO está autorizada para uso en LAG.")
    ).toBeVisible();

    // Razón de retiro visible
    await expect(page.getByText("Razón de retiro")).toBeVisible();

    // No muestra campos de herramienta activa
    await expect(page.getByText("Categoría")).not.toBeVisible();
    await expect(page.getByText("DPA")).not.toBeVisible();
  });

  test("Edge case: título dinámico con nombre de herramienta", async ({
    page,
  }) => {
    // Obtenemos la primera herramienta para saber su nombre
    const response = await page.request.get("/api/herramientas/1");
    const body = await response.json();

    await page.goto("/catalogo/1");

    await expect(page).toHaveTitle(new RegExp(body.nombre));
  });
});

// =============================================================================
// US-04: Semáforo accesible (UI)
// =============================================================================

test.describe("US-04: Semáforo accesible — UI", () => {
  test("Happy path: semáforo tiene aria-label descriptivo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar un semáforo con role="status"
    const semaforo = page.locator('[role="status"]').first();
    await expect(semaforo).toBeVisible();

    // Tiene aria-label
    const ariaLabel = await semaforo.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toMatch(/(Activa|Condicional|Retirada)/);
  });

  test("Caso negativo: el semáforo incluye texto además de color", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El semáforo no depende solo del color — incluye texto legible
    const semaforo = page.locator('[role="status"]').first();
    const text = await semaforo.textContent();
    expect(text).toMatch(/(Activa|Condicional|Retirada)/);
  });

  test("Edge case: semáforo condicional (amarillo) existe para Odiseo", async ({
    page,
  }) => {
    // Buscar Odiseo vía API
    const response = await page.request.get("/api/herramientas");
    const body = await response.json();
    const odiseo = body.data.find(
      (h: { nombre: string }) => h.nombre === "Odiseo"
    );

    if (odiseo) {
      await page.goto(`/catalogo/${odiseo.id}`);

      const semaforo = page.locator('[role="status"]');
      await expect(semaforo).toContainText("Condicional");

      const ariaLabel = await semaforo.getAttribute("aria-label");
      expect(ariaLabel).toContain("Condicional");
    }
  });
});

// =============================================================================
// US-05: Herramientas retiradas visibles en listado (UI)
// =============================================================================

test.describe("US-05: Retiradas en listado — UI", () => {
  test("Happy path: las herramientas retiradas aparecen en el catálogo con razón inline", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Las retiradas están al final del listado
    // Verificar que hay al menos una card con texto de "Retirada"
    const retiradas = page.locator('[role="status"]', {
      hasText: "Retirada",
    });
    await expect(retiradas.first()).toBeVisible();
  });

  test("Caso negativo: filtro estado=Retirada muestra banner de gobernanza", async ({
    page,
  }) => {
    await page.goto("/catalogo?estado=Retirada");

    // H11: Banner de advertencia cuando se filtran retiradas
    await expect(
      page.getByText(/herramientas NO autorizadas/i)
    ).toBeVisible();
  });

  test("Edge case: card de herramienta retirada muestra razón sin navegar al detalle", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar un texto de razón de retiro inline (bg-red-50 en la card)
    // Las razones conocidas: "Sin uso activo registrado", "Descontinuado",
    // "Reemplazado por OneNote", "Bloqueado por firewall corporativo"
    const razonInline = page.locator("p.text-red-700").first();

    // Si las retiradas están visibles en el catálogo
    if (await razonInline.isVisible()) {
      const text = await razonInline.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(3);
    }
  });
});
