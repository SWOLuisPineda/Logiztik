import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — E2E tests para Catálogo de Herramientas AI LAG.
 *
 * Levanta el dev server de Next.js antes de ejecutar los tests.
 * API tests no requieren browser (usan request context directo).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api",
      testMatch: /.*api\.spec\.ts/,
      use: {},
    },
    {
      name: "ui-chromium",
      testMatch: /.*ui\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
