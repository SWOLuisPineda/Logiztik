import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — LAG Gobierno AI
 *
 * Dos proyectos:
 *   api  — tests de API route handlers (sin browser, request context only)
 *   ui   — tests de UI con Chromium
 *
 * El servidor debe estar corriendo en localhost:3000 antes de ejecutar.
 * En CI: `next start` arranca el build de producción.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "api",
      // Sin browser — usa solo APIRequestContext de Playwright
      testMatch: "**/catalogo-api.spec.ts",
    },
    {
      name: "ui",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/catalogo-ui.spec.ts",
    },
  ],

  // Arrancar next start antes de los tests si no hay servidor activo
  webServer: {
    command: "npx next start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
