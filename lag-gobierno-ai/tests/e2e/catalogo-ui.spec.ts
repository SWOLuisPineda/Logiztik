import { test, expect } from "@playwright/test";

/**
 * Tests E2E de UI — Catálogo de Herramientas AI
 *
 * Cobertura:
 *   US-01 — Listado completo + semáforo visual
 *   US-02 — Filtrar por nivel (dropdown + URL)
 *   US-03 — Detalle de herramienta + volver al catálogo
 *
 * Requiere: next start corriendo en localhost:3000
 */

// ---------------------------------------------------------------------------
// US-01 — Listado completo
// ---------------------------------------------------------------------------

test.describe("US-01 — Listado completo del catálogo", () => {
  test("happy path: /catalogo carga y muestra herramientas", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Título de la página
    await expect(page).toHaveTitle(/Catálogo de Herramientas AI/);

    // Heading principal
    await expect(
      page.getByRole("heading", { name: /Catálogo de Herramientas AI/i })
    ).toBeVisible();

    // Al menos una card visible
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();

    // Counter de resultados
    await expect(page.getByText(/herramientas encontradas/i)).toBeVisible();
  });

  test("happy path: cada card muestra nombre y proveedor", async ({ page }) => {
    await page.goto("/catalogo");
    const cards = page.locator("article");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Primera card tiene un enlace con el nombre de la herramienta
    const firstCard = cards.first();
    await expect(firstCard.getByRole("link")).toBeVisible();
    await expect(firstCard.locator("h3")).not.toBeEmpty();
  });

  test("happy path: ChatGPT aparece en el listado", async ({ page }) => {
    await page.goto("/catalogo");
    await expect(page.getByRole("heading", { name: "ChatGPT" })).toBeVisible();
  });

  test("caso negativo: URL inexistente muestra not-found de Next.js", async ({
    page,
  }) => {
    await page.goto("/catalogo/999");
    // Next.js renderiza not-found dentro del layout con status 200 en next start.
    // Verificamos el contenido, no el status HTTP.
    await expect(page.getByText(/no encontrada/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/i })
    ).toBeVisible();
  });

  test("edge case: /catalogo con parámetro desconocido carga sin error", async ({
    page,
  }) => {
    await page.goto("/catalogo?foo=bar");
    await expect(
      page.getByRole("heading", { name: /Catálogo/i })
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// US-02 — Filtrar por nivel
// ---------------------------------------------------------------------------

test.describe("US-02 — Filtrar por nivel de clasificación", () => {
  test("happy path: filtro Publica muestra 5 herramientas", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Seleccionar "Publica" en el dropdown
    await page.getByLabel(/Filtrar por nivel/i).selectOption("Publica");

    // URL debe contener ?nivel=Publica
    await expect(page).toHaveURL(/nivel=Publica/);

    // Counter muestra 5
    await expect(page.getByText(/5 herramientas encontradas/i)).toBeVisible();

    // Gemini debe estar visible
    await expect(
      page.getByRole("heading", { name: "Gemini" })
    ).toBeVisible();
  });

  test("happy path: limpiar filtro restaura las 31 herramientas", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Publica");

    // Seleccionar "Todos los niveles"
    await page.getByLabel(/Filtrar por nivel/i).selectOption("");

    // URL sin query param
    await expect(page).toHaveURL(/\/catalogo$/);

    // Counter vuelve a 31
    await expect(page.getByText(/31 herramientas encontradas/i)).toBeVisible();
  });

  test("happy path: filtro persiste en URL al navegar", async ({
    page,
    context,
  }) => {
    // Navegar directamente con ?nivel=Restringida (URL compartida)
    await page.goto("/catalogo?nivel=Restringida");

    await expect(page).toHaveURL(/nivel=Restringida/);
    await expect(
      page.getByText(/3 herramientas encontradas/i)
    ).toBeVisible();
  });

  test("caso negativo: nivel inválido en URL no explota — carga el listado completo", async ({
    page,
  }) => {
    // Un nivel inválido en la URL debe ser ignorado por CatalogoPage
    // (la validación del Server Component lo descarta silenciosamente)
    await page.goto("/catalogo?nivel=INVALIDO");
    await expect(
      page.getByRole("heading", { name: /Catálogo/i })
    ).toBeVisible();
    // Muestra todas las herramientas porque el filtro inválido se descarta
    await expect(page.getByText(/31 herramientas encontradas/i)).toBeVisible();
  });

  test("edge case: dropdown tiene label accesible asociado", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    // El select debe ser localizable por su label (WCAG AA)
    const select = page.getByLabel(/Filtrar por nivel/i);
    await expect(select).toBeVisible();
    await expect(select).toBeEnabled();
  });
});

// ---------------------------------------------------------------------------
// US-03 — Detalle de herramienta
// ---------------------------------------------------------------------------

test.describe("US-03 — Detalle de herramienta", () => {
  test("happy path: detalle de herramienta activa muestra campos completos", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Click en la primera herramienta del listado
    await page.locator("article h3 a").first().click();

    // Verificar que estamos en /catalogo/[id]
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // Campos esperados en la vista de detalle
    await expect(page.getByText(/Proveedor/i)).toBeVisible();
    await expect(page.getByText(/Nivel máximo/i)).toBeVisible();
    await expect(page.getByText(/DPA/i)).toBeVisible();

    // BackButton presente
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/i })
    ).toBeVisible();
  });

  test("happy path: detalle de DeepSeek muestra banner de retirada y razón", async ({
    page,
  }) => {
    // Obtener el id de DeepSeek via API y navegar directamente
    const res = await page.request.get(
      "/api/herramientas?estado=Retirada"
    );
    const body = await res.json();
    const deepseek = body.data.find(
      (h: { nombre: string }) => h.nombre === "DeepSeek"
    );
    expect(deepseek).toBeDefined();

    await page.goto(`/catalogo/${deepseek.id}`);

    // Banner de advertencia visible
    await expect(
      page.getByText(/NO está autorizada para uso en LAG/i)
    ).toBeVisible();

    // Razón de retiro visible
    await expect(
      page.getByText(/Bloqueado por firewall corporativo/i)
    ).toBeVisible();
  });

  test("happy path: BackButton preserva el filtro activo al volver", async ({
    page,
  }) => {
    // Navegar al catálogo con filtro
    await page.goto("/catalogo?nivel=Publica");
    await expect(page.getByText(/5 herramientas encontradas/i)).toBeVisible();

    // Click en la primera card
    await page.locator("article h3 a").first().click();
    await expect(page).toHaveURL(/\/catalogo\/\d+\?nivel=Publica/);

    // Click en BackButton
    await page.getByRole("link", { name: /Volver al catálogo/i }).click();

    // Debe volver con el filtro preservado
    await expect(page).toHaveURL(/nivel=Publica/);
    await expect(page.getByText(/5 herramientas encontradas/i)).toBeVisible();
  });

  test("caso negativo: ID inexistente muestra página not-found", async ({
    page,
  }) => {
    await page.goto("/catalogo/99999");
    await expect(page.getByText(/no encontrada/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/i })
    ).toBeVisible();
  });

  test("edge case: ID no numérico en URL → not-found (no error 500)", async ({
    page,
  }) => {
    await page.goto("/catalogo/abc");
    // No debe mostrar error 500 — el Server Component llama notFound()
    await expect(page.getByText(/no encontrada/i)).toBeVisible();
  });
});
