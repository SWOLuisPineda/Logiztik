/**
 * API smoke tests for `/api/herramientas` endpoints.
 *
 * Purpose:
 * - Fast contract sanity checks for list endpoint, query validation and id validation.
 * - Complements the full US-based suite in `catalogo-api.spec.ts`.
 */
import { expect, test } from "@playwright/test";

test("GET /api/herramientas retorna lista", async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/herramientas`);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
        data: Array<{ id: number; nombre: string }>;
        count: number;
    };

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.count).toBeGreaterThan(0);
    expect(body.count).toBe(body.data.length);
});

test("GET /api/herramientas rechaza query desconocida", async ({
    request,
    baseURL,
}) => {
    const response = await request.get(`${baseURL}/api/herramientas?foo=bar`);
    expect(response.status()).toBe(400);
});

test("GET /api/herramientas/[id] valida id", async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/herramientas/abc`);
    expect(response.status()).toBe(400);
});
