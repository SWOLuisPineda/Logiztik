import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3200",
  },
  webServer: {
    command: "npm run db:seed && npx next dev -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
