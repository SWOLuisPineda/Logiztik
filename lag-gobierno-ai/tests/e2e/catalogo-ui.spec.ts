/**
 * UI E2E suite for Catálogo de Herramientas.
 *
 * Execution policy:
 * - Runs only when Chromium is available in the environment.
 * - Keeps US-06/US-07 as skipped backlog scenarios for requirement traceability.
 */
import fs from "node:fs";
import { chromium, expect, test } from "@playwright/test";

const chromiumInstalled = fs.existsSync(chromium.executablePath());

test.describe("UI Catalogo (si /catalogo existe)", () => {
    // Entornos sin browser instalado deben validar API; UI queda diferido de forma explícita.
    test.skip(!chromiumInstalled, "Chromium no está instalado; se ejecutan solo pruebas API.");

    test.describe("US-01 Consultar catálogo completo", () => {
        test("happy: carga /catalogo y muestra listado", async ({ page }) => {
            await page.goto("/catalogo");
            await expect(page.getByRole("heading", { name: "Catálogo de Herramientas AI" })).toBeVisible();
            await expect(page.getByText("ChatGPT")).toBeVisible();
        });

        test("negativo: detalle con id inválido muestra not-found", async ({ page }) => {
            await page.goto("/catalogo/0");
            await expect(page.getByText("Herramienta no encontrada")).toBeVisible();
        });

        test("edge: listado general muestra aviso de no autorizadas", async ({ page }) => {
            await page.goto("/catalogo");
            await expect(page.getByText("Estás viendo herramientas NO autorizadas")).toBeVisible();
        });
    });

    test.describe("US-02 Filtrar por nivel", () => {
        test("happy: filtro Publica actualiza URL y resultados", async ({ page }) => {
            await page.goto("/catalogo");
            await page.selectOption("#filtro-nivel", "Publica");
            await expect(page).toHaveURL(/nivel=Publica/);
            await expect(page.getByText("Gemini")).toBeVisible();
        });

        test("negativo: query inválida no rompe la vista", async ({ page }) => {
            await page.goto("/catalogo?nivel=FAKE");
            await expect(page.getByRole("heading", { name: "Catálogo de Herramientas AI" })).toBeVisible();
        });

        test("edge: con filtro activo aparece aviso de sin nivel", async ({ page }) => {
            await page.goto("/catalogo");
            await page.selectOption("#filtro-nivel", "Confidencial");
            await expect(page.getByText(/sin nivel asignado no se muestra/)).toBeVisible();
        });
    });

    test.describe("US-03 Ver detalle", () => {
        test("happy: detalle de herramienta activa", async ({ page }) => {
            await page.goto("/catalogo");
            await page.getByRole("link", { name: /GitHub Copilot/i }).click();
            await expect(page.getByRole("heading", { name: "GitHub Copilot" })).toBeVisible();
            await expect(page.getByText("Estado de DPA")).toBeVisible();
        });

        test("negativo: id inexistente muestra pantalla not-found", async ({ page }) => {
            await page.goto("/catalogo/999");
            await expect(page.getByText("Herramienta no encontrada")).toBeVisible();
        });

        test("edge: volver al catálogo preserva filtro", async ({ page }) => {
            await page.goto("/catalogo?nivel=Publica");
            await page.getByRole("link", { name: /Gemini/i }).click();
            await page.getByRole("link", { name: "Volver al catálogo" }).click();
            await expect(page).toHaveURL(/nivel=Publica/);
        });
    });

    test.describe("US-04 Semáforo", () => {
        test("happy: semáforo muestra texto de estado", async ({ page }) => {
            await page.goto("/catalogo");
            await expect(page.getByText("Autorizada").first()).toBeVisible();
        });

        test("negativo: no se renderiza estado desconocido", async ({ page }) => {
            await page.goto("/catalogo");
            await expect(page.getByText("Desconocido")).toHaveCount(0);
        });

        test("edge: estado condicional incluye nota de restricción", async ({ page }) => {
            await page.goto("/catalogo");
            await page.getByRole("link", { name: /Odiseo/i }).click();
            await expect(page.getByText("Condicional")).toBeVisible();
            await expect(page.getByText("Uso permitido con restricciones. Verificar condiciones.")).toBeAttached();
        });
    });

    test.describe("US-05 Retiradas con razón", () => {
        test("happy: tarjeta retirada muestra razón inline", async ({ page }) => {
            await page.goto("/catalogo");
            await expect(page.getByText("Razón de retiro: Bloqueado por firewall corporativo")).toBeVisible();
        });

        test("negativo: filtro Publica no muestra herramienta retirada DeepSeek", async ({ page }) => {
            await page.goto("/catalogo");
            await page.selectOption("#filtro-nivel", "Publica");
            await expect(page.getByText("DeepSeek")).toHaveCount(0);
        });

        test("edge: detalle retirada muestra advertencia de no autorizada", async ({ page }) => {
            await page.goto("/catalogo");
            await page.getByRole("link", { name: /DeepSeek/i }).click();
            await expect(page.getByText("Esta herramienta NO está autorizada para uso en LAG.")).toBeVisible();
        });
    });

    // US-06 y US-07 se mantienen en backlog funcional (ver auditoría en _bmad-output/implementation-artifacts).
});
