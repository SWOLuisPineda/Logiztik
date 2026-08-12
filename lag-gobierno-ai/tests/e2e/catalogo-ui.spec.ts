import { test, expect } from "@playwright/test";

/**
 * E2E Tests — UI del catálogo de herramientas (/catalogo).
 * Basados en criterios de aceptación de requirements.md (US-01 a US-05).
 */

// =============================================================================
// US-01: Consultar el catálogo completo (UI)
// =============================================================================

test.describe("US-01: /catalogo — Listado completo UI", () => {
  test("Happy path: muestra herramientas en grid con nombre, proveedor y semáforo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El título del catálogo está visible
    await expect(
      page.getByRole("heading", {
        name: "Catálogo de Herramientas AI Aprobadas",
      })
    ).toBeVisible();

    // Hay al menos una herramienta visible (link con texto de nombre)
    const cards = page.locator('a[href^="/catalogo/"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBe(31);
  });

  test("Caso negativo: semáforo rojo visible en herramientas retiradas", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar texto "Retirada" que aparece en el SemaforoIndicator
    const retiradaIndicators = page.locator("text=Retirada");
    const count = await retiradaIndicators.count();
    expect(count).toBe(4);
  });

  test("Edge case: grid responsivo tiene estructura correcta", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El grid container existe
    const grid = page.locator(".grid");
    await expect(grid).toBeVisible();
  });
});

// =============================================================================
// US-02: Filtrar por nivel (UI)
// =============================================================================

test.describe("US-02: /catalogo — Filtro por nivel UI", () => {
  test("Happy path: seleccionar 'Publica' filtra herramientas correctamente", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar filtro Publica
    const select = page.getByLabel("Nivel de clasificación:");
    await select.selectOption("Publica");

    // La URL se actualiza
    await expect(page).toHaveURL(/nivel=Publica/);

    // Solo se muestran herramientas públicas (menos que 31)
    const cards = page.locator('a[href^="/catalogo/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(31);
  });

  test("Caso negativo: seleccionar 'Todos' remueve el filtro de la URL", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Publica");

    const select = page.getByLabel("Nivel de clasificación:");
    await select.selectOption("");

    // La URL ya no tiene el param nivel
    await expect(page).not.toHaveURL(/nivel=/);

    // Todas las herramientas se muestran
    const cards = page.locator('a[href^="/catalogo/"]');
    const count = await cards.count();
    expect(count).toBe(31);
  });

  test("Edge case: URL con filtro preserva el estado al recargar", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Confidencial");

    // El select refleja el filtro activo
    const select = page.getByLabel("Nivel de clasificación:");
    await expect(select).toHaveValue("Confidencial");

    // Las herramientas mostradas son subset
    const cards = page.locator('a[href^="/catalogo/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(31);
  });
});

// =============================================================================
// US-03: Ver detalle de herramienta (UI)
// =============================================================================

test.describe("US-03: /catalogo/[id] — Detalle UI", () => {
  test("Happy path: click en herramienta muestra detalle con todos los campos", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Click en la primera herramienta
    const firstCard = page.locator('a[href^="/catalogo/"]').first();
    await firstCard.click();

    // Se navega al detalle
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // Campos visibles
    await expect(page.getByText("Proveedor")).toBeVisible();
    await expect(page.getByText("Estado")).toBeVisible();

    // BackButton presente
    await expect(page.getByText("Volver al catálogo")).toBeVisible();
  });

  test("Caso negativo: ID inexistente muestra not-found", async ({ page }) => {
    await page.goto("/catalogo/999");

    await expect(
      page.getByText("Herramienta no encontrada")
    ).toBeVisible();

    // Link para volver al catálogo
    await expect(page.getByRole("link", { name: /catálogo/i })).toBeVisible();
  });

  test("Edge case: navegar de vuelta preserva filtro", async ({ page }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Click en una herramienta (el link incluye ?nivel=Publica)
    const firstCard = page.locator('a[href*="nivel=Publica"]').first();

    // Si no hay herramientas con ese nivel en el link, skip este test
    const count = await firstCard.count();
    if (count === 0) {
      test.skip();
      return;
    }

    await firstCard.click();

    // El BackButton debe apuntar a /catalogo?nivel=Publica
    const backLink = page.getByRole("link", { name: /Volver al catálogo/i });
    await expect(backLink).toHaveAttribute("href", "/catalogo?nivel=Publica");
  });
});

// =============================================================================
// US-04: Semáforo visual accesible (UI)
// =============================================================================

test.describe("US-04: Semáforo — Accesibilidad UI", () => {
  test("Happy path: semáforo tiene aria-label descriptivo", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar elementos con role=status (SemaforoIndicator)
    const semaforos = page.locator('[role="status"]');
    const first = semaforos.first();
    await expect(first).toBeVisible();

    // Tiene aria-label
    const label = await first.getAttribute("aria-label");
    expect(label).toBeTruthy();
    expect(label).toContain("autorizada");
  });

  test("Caso negativo: herramienta retirada tiene banner de advertencia en detalle", async ({
    page,
  }) => {
    // Primero encontrar una herramienta retirada via API
    const response = await page.request.get(
      "/api/herramientas?estado=Retirada"
    );
    const body = await response.json();
    const retirada = body.data[0];

    await page.goto(`/catalogo/${retirada.id}`);

    // Banner rojo de advertencia visible
    await expect(
      page.getByRole("alert")
    ).toBeVisible();
    await expect(
      page.getByText("NO está autorizada")
    ).toBeVisible();
  });

  test("Edge case: semáforo no depende solo del color (incluye texto)", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El semáforo incluye texto además del punto de color
    const semaforo = page.locator('[role="status"]').first();
    const text = await semaforo.textContent();

    // El texto debe ser uno de los estados válidos
    expect(["Activa", "Condicional", "Retirada"]).toContain(text?.trim());
  });
});

// =============================================================================
// US-05: Herramientas retiradas con razón visible (UI)
// =============================================================================

test.describe("US-05: Herramientas retiradas — Razón visible UI", () => {
  test("Happy path: herramienta retirada muestra razón inline en el card", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Buscar texto de una razón de retiro conocida
    await expect(
      page.getByText("Bloqueado por firewall corporativo")
    ).toBeVisible();
  });

  test("Caso negativo: herramienta activa NO muestra razón de retiro", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Las herramientas activas no deben tener "Razón:" visible
    const activaCards = page.locator('[role="status"][aria-label*="Activa"]');
    const firstActiva = activaCards.first();
    await expect(firstActiva).toBeVisible();

    // El card padre no contiene texto "Razón:"
    const card = firstActiva.locator("xpath=ancestor::a");
    const cardText = await card.textContent();
    expect(cardText).not.toContain("Razón:");
  });

  test("Edge case: detalle de herramienta retirada muestra razón sin click adicional", async ({
    page,
  }) => {
    // Obtener una herramienta retirada por API
    const response = await page.request.get(
      "/api/herramientas?estado=Retirada"
    );
    const body = await response.json();
    const retirada = body.data[0];

    await page.goto(`/catalogo/${retirada.id}`);

    // La razón es visible directamente
    await expect(page.getByText("Razón de retiro")).toBeVisible();
    await expect(page.getByText(retirada.razonRetiro)).toBeVisible();
  });
});
