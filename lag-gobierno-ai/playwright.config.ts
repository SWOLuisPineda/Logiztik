import { defineConfig } from "@playwright/test";

/**
 * Playwright E2E config for Catálogo de Herramientas AI.
 *
 * - webServer: arranca Next.js dev server automáticamente
 * - baseURL: http://localhost:3000
 * - testDir: tests/e2e
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
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
