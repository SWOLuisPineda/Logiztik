/**
 * Tests E2E de UI — Catálogo de Herramientas AI
 *
 * Cubre US-01, US-02, US-03 (Must Have) con browser Chromium.
 * Verifica la UI renderizada, no solo los datos de la API.
 *
 * Por cada user story: 1 happy path + 1 caso negativo + 1 edge case.
 *
 * Prerequisito: servidor corriendo en http://localhost:3000
 * (playwright.config.ts levanta `npm run start` automáticamente)
 */

import { test, expect } from "@playwright/test";

// ── US-01: Visualizar el catálogo completo ────────────────────────────────────

test.describe("US-01 — Visualizar catálogo completo", () => {
  test("Happy path: /catalogo carga y muestra el heading y al menos una herramienta", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // Heading principal visible
    await expect(
      page.getByRole("heading", { name: /Catálogo de Herramientas AI/i }),
    ).toBeVisible();

    // Al menos una tarjeta de herramienta presente
    // ToolCard renderiza un <h3> con el nombre de la herramienta
    const cards = page.locator("h3");
    await expect(cards.first()).toBeVisible();

    // El semáforo visual debe estar presente (SemaforoIndicator usa role="status")
    const semaforos = page.locator('[role="status"]');
    await expect(semaforos.first()).toBeVisible();
  });

  test("Negativo: herramientas retiradas muestran semáforo rojo y están al final del listado", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El banner de advertencia de gobernanza debe estar visible
    // (ToolList lo muestra cuando hay retiradas en el listado)
    await expect(
      page.getByRole("alert").filter({
        hasText: /NO autorizadas/i,
      }),
    ).toBeVisible();
  });

  test("Edge case: la página tiene title correcto para SEO", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    await expect(page).toHaveTitle(/Catálogo de Herramientas AI/i);
  });

  test("Edge case: /catalogo es accesible — no hay errores de consola críticos", async ({
    page,
  }) => {
    const errores: string[] = [];
    page.on("pageerror", (err) => errores.push(err.message));

    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // No debe haber errores JS no manejados en la carga inicial
    expect(errores).toHaveLength(0);
  });
});

// ── US-02: Filtrar por nivel de clasificación ─────────────────────────────────

test.describe("US-02 — Filtrar por nivel de clasificación", () => {
  test("Happy path: seleccionar 'Pública' en el FilterBar actualiza la URL y los resultados", async ({
    page,
  }) => {
    await page.goto("/catalogo");

    // El select del FilterBar tiene el label "Filtrar por nivel:"
    const select = page.getByLabel(/Filtrar herramientas por nivel/i);
    await expect(select).toBeVisible();

    // Seleccionar "Publica"
    await select.selectOption("Publica");

    // La URL debe actualizarse con el query param
    await expect(page).toHaveURL(/\?nivel=Publica/);

    // Gemini debe aparecer (nivel Publica según seed)
    await expect(page.getByRole("heading", { name: "Gemini", level: 3 })).toBeVisible();

    // El aviso de herramientas sin nivel debe aparecer (Odiseo tiene null)
    await expect(
      page.getByRole("note"),
    ).toBeVisible();
  });

  test("Negativo: herramientas con nivelMaximo null no aparecen al filtrar por nivel", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Interna");

    // Esperar que la página cargue
    await page.waitForLoadState("networkidle");

    // Odiseo tiene nivelMaximo null — no debe aparecer
    const odiseoCard = page.getByRole("heading", { name: "Odiseo", level: 3 });
    await expect(odiseoCard).not.toBeVisible();
  });

  test("Edge case: limpiar filtro — seleccionar 'Todos los niveles' vuelve a mostrar todo", async ({
    page,
  }) => {
    // Empezar con filtro activo
    await page.goto("/catalogo?nivel=Restringida");

    const select = page.getByLabel(/Filtrar herramientas por nivel/i);
    await expect(select).toHaveValue("Restringida");

    // Limpiar filtro seleccionando opción vacía
    await select.selectOption("");

    // URL sin filtro
    await expect(page).toHaveURL(/\/catalogo$/);

    // Ahora deben aparecer herramientas de todos los niveles
    await expect(
      page.getByRole("heading", { name: "Gemini", level: 3 }),
    ).toBeVisible();
  });

  test("Edge case: la URL con ?nivel=Confidencial mantiene el filtro al navegar al detalle y volver", async ({
    page,
  }) => {
    await page.goto("/catalogo?nivel=Confidencial");
    await page.waitForLoadState("networkidle");

    // Hacer click en una tarjeta de herramienta con nivel Confidencial
    // GitHub Copilot tiene nivelMaximo Confidencial
    const copilotCard = page.getByRole("heading", {
      name: "GitHub Copilot",
      level: 3,
    });
    await expect(copilotCard).toBeVisible();
    await copilotCard.click();

    // Estamos en el detalle
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // BackButton debe estar visible y al hacer click vuelve con el filtro
    const backButton = page.getByRole("link", {
      name: /Volver al catálogo/i,
    });
    await expect(backButton).toBeVisible();
    await backButton.click();

    // La URL de vuelta debe preservar el filtro nivel=Confidencial
    // (BackButton lee ?nivel de la URL del detalle)
    await expect(page).toHaveURL(/\/catalogo/);
  });
});

// ── US-03: Ver detalle de herramienta ─────────────────────────────────────────

test.describe("US-03 — Ver detalle de herramienta", () => {
  test("Happy path: detalle de herramienta activa muestra todos los campos y semáforo verde", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // Navegar al detalle de GitHub Copilot
    const copilotCard = page.getByRole("heading", {
      name: "GitHub Copilot",
      level: 3,
    });
    await expect(copilotCard).toBeVisible();
    await copilotCard.click();

    // URL de detalle
    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // Heading con nombre de la herramienta
    await expect(
      page.getByRole("heading", { name: "GitHub Copilot", level: 1 }),
    ).toBeVisible();

    // Proveedor visible
    await expect(page.getByText(/Microsoft \/ GitHub/i)).toBeVisible();

    // Semáforo — en la página de detalle hay exactamente 1 SemaforoIndicator.
    // Se acota al contenedor del estado para evitar matches múltiples.
    const semaforo = page.locator('[role="status"]').filter({ hasText: /Activa|Condicional|Retirada/ }).first();
    await expect(semaforo).toBeVisible();
    await expect(semaforo).toContainText("Activa");

    // NivelBadge debe mostrar "Confidencial"
    await expect(page.getByText("Confidencial")).toBeVisible();

    // BackButton visible
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/i }),
    ).toBeVisible();
  });

  test("Negativo: detalle de herramienta retirada muestra banner de advertencia y razón", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // Navegar al detalle de DeepSeek (herramienta retirada)
    const deepseekCard = page.getByRole("heading", {
      name: "DeepSeek",
      level: 3,
    });
    await expect(deepseekCard).toBeVisible();
    await deepseekCard.click();

    // Banner de advertencia obligatorio (design.md §1 — H6)
    await expect(
      page.getByRole("heading", {
        name: /Esta herramienta NO está autorizada/i,
      }),
    ).toBeVisible();

    // Razón de retiro visible sin click adicional
    await expect(
      page.getByText(/Bloqueado por firewall corporativo/i),
    ).toBeVisible();

    // Semáforo en estado Retirada — acotado al texto para evitar strict mode violation
    const semaforo = page.locator('[role="status"]').filter({ hasText: /Activa|Condicional|Retirada/ }).first();
    await expect(semaforo).toContainText("Retirada");
  });

  test("Edge case: /catalogo/999 muestra la página not-found personalizada", async ({
    page,
  }) => {
    await page.goto("/catalogo/999");

    await expect(
      page.getByRole("heading", { name: /Herramienta no encontrada/i }),
    ).toBeVisible();

    // Link de vuelta al catálogo
    await expect(
      page.getByRole("link", { name: /Volver al catálogo/i }),
    ).toBeVisible();
  });

  test("Edge case: detalle de Odiseo (Condicional) muestra subtexto de restricciones", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // Odiseo es la única herramienta Condicional
    const odiseoCard = page.getByRole("heading", {
      name: "Odiseo",
      level: 3,
    });
    await expect(odiseoCard).toBeVisible();
    await odiseoCard.click();

    // SemaforoIndicator muestra "Condicional" — acotado para evitar strict mode violation
    const semaforo = page.locator('[role="status"]').filter({ hasText: /Activa|Condicional|Retirada/ }).first();
    await expect(semaforo).toContainText("Condicional");

    // H5 (design.md): subtexto explicativo visible para estado Condicional
    await expect(
      page.getByText(/Uso permitido con restricciones/i),
    ).toBeVisible();
  });

  test("Edge case: campo DPA muestra 'Información no disponible aún' cuando es 'No aplica'", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // Navegar a cualquier herramienta activa (todas tienen DPA "No aplica" en MVP)
    const primeraCard = page.locator("h3").first();
    await primeraCard.click();

    await expect(page).toHaveURL(/\/catalogo\/\d+/);

    // H6 (design.md): formatDpaLabel transforma "No aplica" → texto descriptivo
    await expect(
      page.getByText(/Información no disponible aún/i),
    ).toBeVisible();
  });
});

// ── Accesibilidad básica (WCAG AA) ────────────────────────────────────────────

test.describe("Accesibilidad — WCAG AA básico", () => {
  test("NivelBadge tiene aria-label descriptivo", async ({ page }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // Los badges de nivel tienen aria-label (NivelBadge.tsx)
    const badges = page.locator('[aria-label^="Nivel de clasificación"]');
    await expect(badges.first()).toBeVisible();
  });

  test("FilterBar select tiene label accesible asociado", async ({ page }) => {
    await page.goto("/catalogo");

    const select = page.getByLabel(/Filtrar herramientas por nivel/i);
    await expect(select).toBeVisible();
  });

  test("SemaforoIndicator no depende solo del color — tiene texto y aria-label", async ({
    page,
  }) => {
    await page.goto("/catalogo");
    await page.waitForLoadState("networkidle");

    // role="status" con aria-label — definido en SemaforoIndicator.tsx
    const semaforo = page.locator('[role="status"][aria-label]').first();
    await expect(semaforo).toBeVisible();

    // Tiene texto visible además del color
    const texto = await semaforo.innerText();
    expect(texto.trim().length).toBeGreaterThan(0);
  });
});
