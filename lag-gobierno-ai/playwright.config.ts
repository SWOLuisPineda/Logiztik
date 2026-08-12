import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration — Catálogo de Herramientas AI
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",

  /* Timeout por test */
  timeout: 30_000,

  /* Reporters */
  reporter: [["html", { open: "never" }], ["list"]],

  /* Configuración global */
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },

  /* Proyectos de test */
  projects: [
    {
      /* Tests de API — usan APIRequestContext, sin browser */
      name: "api",
      testMatch: "**/catalogo-api.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      /* Tests de UI — usan browser completo */
      name: "ui-chromium",
      testMatch: "**/catalogo-ui.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Levantar el servidor Next.js antes de los tests */
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
