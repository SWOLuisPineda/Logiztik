/**
 * E2E/API contract suite for Catálogo de Herramientas.
 *
 * Coverage model:
 * - US-01..US-05: implemented in MVP (happy/negative/edge)
 * - US-06..US-07: backlog, kept as `test.skip` to preserve traceability
 *
 * Note: this suite validates API behavior against seeded workshop data (27 autorizadas + 4 retiradas).
 */
import { expect, test } from "@playwright/test";

type Herramienta = {
    id: number;
    nombre: string;
    proveedor: string;
    categoria: string | null;
    nivelMaximo: "Publica" | "Interna" | "Confidencial" | "Restringida" | null;
    estado: "Activa" | "Retirada" | "Condicional";
    razonRetiro: string | null;
};

type ListResponse = {
    data: Herramienta[];
    count: number;
};

test.describe("US-01 Consultar catálogo completo", () => {
    test("happy: lista completa incluye 31 herramientas (27 autorizadas + 4 retiradas)", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.count).toBe(31);
        expect(body.data).toHaveLength(31);

        const activas = body.data.filter((h) => h.estado === "Activa");
        const condicionales = body.data.filter((h) => h.estado === "Condicional");
        const retiradas = body.data.filter((h) => h.estado === "Retirada");

        expect(activas).toHaveLength(26);
        expect(condicionales).toHaveLength(1);
        expect(retiradas).toHaveLength(4);
        expect(activas.length + condicionales.length).toBe(27);
    });

    test("negativo: método no soportado responde 405", async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/herramientas`, {
            data: { foo: "bar" },
        });
        expect(response.status()).toBe(405);
    });

    test("edge: el catálogo incluye exactamente una herramienta condicional", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        const condicionales = body.data.filter((h) => h.estado === "Condicional");

        expect(condicionales).toHaveLength(1);
        expect(condicionales[0]?.nombre).toBe("Odiseo");
    });
});

test.describe("US-02 Filtrar por nivel", () => {
    test("happy: nivel Publica retorna subset esperado", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?nivel=Publica`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.count).toBeGreaterThan(0);

        const nombres = body.data.map((h) => h.nombre);
        expect(nombres).toEqual(
            expect.arrayContaining([
                "Gemini",
                "Gamma",
                "Perplexity",
                "Meta AI (WhatsApp)",
                "Grok",
            ])
        );
    });

    test("negativo: nivel inválido responde 400", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?nivel=FAKE`);
        expect(response.status()).toBe(400);
    });

    test("edge: al filtrar por nivel no aparecen herramientas sin clasificación", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?nivel=Confidencial`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.data.every((h) => h.nivelMaximo !== null)).toBe(true);
    });
});

test.describe("US-03 Ver detalle de herramienta", () => {
    test("happy: detalle de herramienta existente", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas/1`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as Record<string, unknown>;
        expect(body.id).toBe(1);
        expect(body).toHaveProperty("nombre");
        expect(body).toHaveProperty("proveedor");
        expect(body).toHaveProperty("estado");
        expect(body).toHaveProperty("dpa");
    });

    test("negativo: id inexistente responde 404", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas/999`);
        expect(response.status()).toBe(404);
    });

    test("edge: id inválido responde 400", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas/abc`);
        expect(response.status()).toBe(400);
    });
});

test.describe("US-04 Semáforo por estado", () => {
    test("happy: estados del catálogo están dentro del contrato", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        const estadosValidos = new Set(["Activa", "Retirada", "Condicional"]);
        expect(body.data.every((h) => estadosValidos.has(h.estado))).toBe(true);
    });

    test("negativo: estado inválido responde 400", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?estado=DESCONOCIDO`);
        expect(response.status()).toBe(400);
    });

    test("edge: filtro por estado condicional retorna Odiseo", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?estado=Condicional`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.count).toBe(1);
        expect(body.data[0]?.nombre).toBe("Odiseo");
    });
});

test.describe("US-05 Retiradas con razón", () => {
    test("happy: filtro retiradas devuelve 4 registros con razón", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?estado=Retirada`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.count).toBe(4);
        expect(body.data.every((h) => h.razonRetiro && h.razonRetiro.length > 0)).toBe(true);
    });

    test("negativo: combinación de filtros incompatible no rompe la API", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?estado=Retirada&nivel=Publica`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.count).toBe(0);
    });

    test("edge: retiradas no tienen categoría ni nivel asignado", async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/herramientas?estado=Retirada`);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as ListResponse;
        expect(body.data.every((h) => h.categoria === null && h.nivelMaximo === null)).toBe(true);
    });
});

// US-06 y US-07 se mantienen en backlog funcional (ver auditoría en _bmad-output/implementation-artifacts).
