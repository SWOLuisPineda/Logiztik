# Design — Catálogo de Herramientas AI Aprobadas

> Módulo: catalogo-herramientas
> Stack: Next.js 14 (App Router) · TypeScript · Prisma · Zod · Tailwind CSS
> Refs: requirements.md, product-brief.md, docs/engineering/standards.md

---

## 1. Componentes de UI

| Componente | Tipo | Responsabilidad |
|------------|------|-----------------|
| `CatalogoPage` | Server Component | Página principal. Consulta Prisma directamente (ver regla de acceso a datos abajo). Renderiza layout con filtros y listado. Ruta: `/catalogo` |
| `ToolList` | Server Component | Renderiza la tabla/grid de herramientas recibidas como props. Muestra nombre, proveedor, categoría, nivel, semáforo. Agrupa activas primero, retiradas al final. |
| `ToolCard` | Server Component | Tarjeta individual de herramienta en el listado. Incluye semáforo visual y link al detalle. Si retirada, muestra razón de retiro inline. |
| `SemaforoIndicator` | Server Component | Componente visual reutilizable. Verde = Activa, Rojo = Retirada, Amarillo = Condicional. Accesible (aria-label + texto alternativo). |
| `NivelBadge` | Server Component | Badge con color por nivel de clasificación (Pública, Interna, Confidencial, Restringida). Si nivel es null, muestra "Sin clasificar" en gris. |
| `FilterBar` | Client Component | Barra de filtros interactiva. Dropdown de nivel de clasificación. Mantiene estado de filtro con `useSearchParams`. Label accesible asociado al select. |
| `ToolDetailPage` | Server Component | Página de detalle. Fetch por ID, muestra todos los campos + semáforo + DPA. Ruta: `/catalogo/[id]` |
| `BackButton` | Client Component | Navegación de vuelta al catálogo. Usa `Link` con href `/catalogo` (no `router.back()`) para evitar salir del sitio si el usuario llegó por link directo. Preserva query param `nivel` si está presente en la URL actual. |
| `EmptyState` | Server Component | Mensaje informativo cuando no hay resultados (filtro vacío o catálogo sin datos). |
| `ErrorState` | Client Component | Mensaje de error amigable cuando falla el fetch a BD. No expone detalles internos. Incluye botón "Reintentar" (`reset()`). Es Client Component porque se usa dentro de `error.tsx` (que Next.js requiere como CC). |

### Jerarquía de rutas

```
src/app/
├── catalogo/
│   ├── page.tsx          → CatalogoPage (listado + filtros)
│   ├── loading.tsx       → Skeleton/spinner durante fetch
│   ├── error.tsx         → Error boundary (Client Component)
│   └── [id]/
│       ├── page.tsx      → ToolDetailPage (detalle)
│       ├── loading.tsx   → Skeleton para detalle
│       └── not-found.tsx → "Herramienta no encontrada"
```

### Regla de acceso a datos

| Consumidor | Accede vía | Razón |
|------------|-----------|-------|
| Server Components (`CatalogoPage`, `ToolDetailPage`) | Prisma directo (`import { prisma } from "@/lib/prisma"`) | No hay overhead de HTTP, acceso directo a BD desde el server. Es la forma idiomática en Next.js App Router. |
| API route handlers (`/api/herramientas/*`) | Prisma directo | Exponen datos para consumo externo (testing, futuros clientes mobile). |
| Client Components | No acceden a datos | Solo manejan interactividad (filtros, navegación). Reciben datos via props desde Server Components. |

> **Regla:** Los Server Components NUNCA llaman a los API routes propios (`fetch("/api/...")`). Usan Prisma directo. Los API routes existen para consumo externo y testing.

---

## 2. API Endpoints

### GET /api/herramientas

Lista todas las herramientas. Soporta filtro por nivel y por estado.

| Aspecto | Detalle |
|---------|---------|
| Método | `GET` |
| Ruta | `/api/herramientas` |
| Query params | `nivel?: "Publica" \| "Interna" \| "Confidencial" \| "Restringida"` |
| Query params | `estado?: "Activa" \| "Retirada" \| "Condicional"` |
| Response 200 | `{ data: Herramienta[], count: number }` |
| Response 400 | `{ error: string }` — parámetro inválido |
| Response 500 | `{ error: "Error interno del servidor" }` — nunca expone detalles |

**Response shape (200):**

```typescript
{
  data: [
    {
      id: number;
      nombre: string;
      proveedor: string;
      categoria: string | null;
      nivelMaximo: "Publica" | "Interna" | "Confidencial" | "Restringida" | null;
      estado: "Activa" | "Retirada" | "Condicional";
      razonRetiro: string | null;
    }
  ],
  count: number
}
```

**Orden por defecto:** Activas primero (ordenadas por nombre ASC), luego Condicionales, luego Retiradas.

---

### GET /api/herramientas/[id]

Detalle de una herramienta específica.

| Aspecto | Detalle |
|---------|---------|
| Método | `GET` |
| Ruta | `/api/herramientas/[id]` |
| Params | `id: number` |
| Response 200 | `Herramienta` (objeto completo con DPA) |
| Response 404 | `{ error: "Herramienta no encontrada" }` |
| Response 400 | `{ error: string }` — id inválido |
| Response 500 | `{ error: "Error interno del servidor" }` |

**Response shape (200):**

```typescript
{
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: "Publica" | "Interna" | "Confidencial" | "Restringida" | null;
  estado: "Activa" | "Retirada" | "Condicional";
  dpa: "Vigente" | "No aplica" | "Pendiente";
  razonRetiro: string | null;
  creadoEn: string; // ISO 8601
  actualizadoEn: string; // ISO 8601
}
```

---

## 3. Modelo de datos (Prisma)

```prisma
// schema.prisma

model Herramienta {
  id             Int       @id @default(autoincrement())
  nombre         String
  proveedor      String
  categoria      String?   // Nullable: herramientas en evaluación o retiradas pueden no tener
  nivelMaximo    String?   // Nullable: "Publica" | "Interna" | "Confidencial" | "Restringida" | null
  estado         String    // "Activa" | "Retirada" | "Condicional"
  dpa            String    @default("No aplica") // "Vigente" | "No aplica" | "Pendiente"
  razonRetiro    String?
  creadoEn       DateTime  @default(now())
  actualizadoEn  DateTime  @updatedAt

  @@unique([nombre, proveedor], name: "nombre_proveedor")
  @@map("herramientas")
}
```

### Decisiones del modelo (resuelve hallazgos de revisión)

| Dato real | Valor en BD | Razón |
|-----------|-------------|-------|
| Odiseo — estado "Activa (condicional)" | `estado: "Condicional"` | El enum normaliza a 3 valores. El seed transforma "Activa (condicional)" → "Condicional". |
| Odiseo — categoría "—" | `categoria: null` | Null indica "aún no clasificado". El UI muestra "Sin categoría". |
| Odiseo — nivel "—" | `nivelMaximo: null` | Null indica "aún no definido". El UI muestra "Sin clasificar". `NivelBadge` maneja null con badge gris. |
| Herramientas retiradas — sin categoría ni nivel en fuente | `categoria: null`, `nivelMaximo: null` | Los datos fuente no los proporcionan. Se acepta null en vez de inventar valores. |
| Unicidad | `@@unique([nombre, proveedor])` | Evita duplicados si el seed se ejecuta múltiples veces. El seed usa `upsert`. |

### Seed

El archivo `prisma/seed.ts` cargará las 27 herramientas activas + 4 retiradas desde `docs/company/catalogo-herramientas-datos.md` como datos iniciales.

**Reglas del seed:**
- Usar `prisma.herramienta.upsert()` (idempotente) con `where: { nombre_proveedor: { nombre: "...", proveedor: "..." } }`.
- Transformar `"Activa (condicional)"` → `"Condicional"`.
- Categoría `"—"` o vacía → `null`.
- Nivel `"—"` o vacío → `null`.
- Herramientas retiradas: `categoria: null`, `nivelMaximo: null`, `razonRetiro` según tabla fuente.
- DPA: `"No aplica"` para todas (no hay datos fuente de DPA en MVP).

---

## 4. Validaciones Zod

```typescript
// src/lib/validations/herramienta.ts

import { z } from "zod";

export const NivelClasificacion = z.enum([
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
]);

export const EstadoHerramienta = z.enum([
  "Activa",
  "Retirada",
  "Condicional",
]);

export const DpaEstado = z.enum([
  "Vigente",
  "No aplica",
  "Pendiente",
]);

// GET /api/herramientas — query params
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacion.optional(),
  estado: EstadoHerramienta.optional(),
});

// GET /api/herramientas/[id] — path param
export const GetHerramientaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Response shapes (para type inference)
export const HerramientaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  proveedor: z.string(),
  categoria: z.string().nullable(),
  nivelMaximo: NivelClasificacion.nullable(),
  estado: EstadoHerramienta,
  dpa: DpaEstado,
  razonRetiro: z.string().nullable(),
  creadoEn: z.string(),
  actualizadoEn: z.string(),
});

export const HerramientaListItemSchema = HerramientaSchema.omit({
  dpa: true,
  creadoEn: true,
  actualizadoEn: true,
});

export const ListHerramientasResponseSchema = z.object({
  data: z.array(HerramientaListItemSchema),
  count: z.number(),
});

export type Herramienta = z.infer<typeof HerramientaSchema>;
export type HerramientaListItem = z.infer<typeof HerramientaListItemSchema>;
export type ListHerramientasQuery = z.infer<typeof ListHerramientasQuerySchema>;
```

---

## 5. Manejo de errores

| Capa | Estrategia |
|------|-----------|
| **API route handlers** | `try/catch` con `NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })`. Nunca exponer stack traces ni mensajes de Prisma al cliente. Log del error real en `console.error` (server-side). |
| **Validación Zod** | Si `safeParse` falla, retornar 400 con mensaje descriptivo del campo inválido (ej: `"El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida"`). |
| **Prisma timeout** | Prisma usa connection timeout por defecto (5s SQLite, 10s PostgreSQL). Si falla, cae al catch genérico → 500. |
| **Server Components** | Usar `error.tsx` de Next.js como error boundary. Muestra `ErrorState` con mensaje amigable y botón de reintentar. |
| **Not found** | Página de detalle con ID inexistente: `notFound()` de Next.js → `not-found.tsx` personalizado. |

---

## 6. Seguridad (MVP)

| Aspecto | Decisión MVP | Post-MVP |
|---------|-------------|----------|
| **Autenticación** | Sin auth. El catálogo es de lectura pública para empleados. | Middleware con Azure AD (SSO corporativo). |
| **Autorización** | No aplica. No hay escritura. | Roles: `viewer` (todos) vs `admin` (CRUD). |
| **Rate limiting** | No implementado. 30 usuarios concurrentes max. | Implementar si se expone a internet. |
| **Exposición de datos** | El catálogo no contiene datos sensibles (es política pública interna). | Revisar si se agregan campos sensibles. |
| **Errores** | Nunca exponer detalles internos (stack, queries) en responses. | Misma política. |

---

## 7. Decisión técnica

### ¿Por qué esta arquitectura para este módulo?

| Decisión | Justificación |
|----------|---------------|
| **Read-only API (sin CRUD)** | El MVP es solo consulta. No hay endpoints de escritura. El catálogo se alimenta por seed/migración, no por UI. Esto simplifica seguridad (no hay auth en MVP) y reduce superficie de ataque. |
| **Server Components por defecto** | El catálogo es contenido estático que cambia con poca frecuencia. Server Components eliminan JS del bundle del cliente, mejoran SEO y performance. Solo `FilterBar` y `BackButton` son Client Components por requerir interactividad. |
| **SQLite en desarrollo** | 31 registros totales. SQLite es suficiente para dev/local y el seed. En staging/producción se usa PostgreSQL vía Neon (según `standards.md`). Prisma abstrae la diferencia. |
| **Filtro via query params (no estado local)** | Usar `searchParams` de Next.js permite URLs compartibles, back/forward del browser funcional, y SSR del resultado filtrado. El filtro viaja como `?nivel=Confidencial`. |
| **Zod como contrato único** | Un solo schema define validación de input Y type inference. Evita drift entre tipos TypeScript y validaciones runtime. Cumple regla obligatoria de `standards.md`. |
| **Semáforo como componente accesible** | El brief define semáforo visual. Se implementa con color + texto + aria-label para cumplir WCAG AA. No depende solo del color para transmitir información. |
| **Sin autenticación** | El brief indica explícitamente "Auth real con Azure AD se mockea". En MVP no hay auth. El catálogo es de consulta para todos los empleados. |
| **Campos nullable para datos incompletos** | Los datos reales tienen herramientas sin categoría ni nivel (Odiseo, retiradas). Se usa `null` en vez de valores inventados. El UI maneja nulls con labels "Sin categoría" / "Sin clasificar". |
| **Seed idempotente con upsert** | Permite re-ejecutar `prisma db seed` sin duplicar registros. Usa `@@unique([nombre, proveedor])` como clave de deduplicación. |
| **Orden determinístico en listado** | Activas primero, luego Condicionales, luego Retiradas. Dentro de cada grupo: orden alfabético por nombre. Esto cumple US-01 sin requerir que el frontend ordene. |
| **Filtros combinados con AND** | Si se pasa `?nivel=X&estado=Y`, la API aplica ambos con AND. Si no hay resultados que cumplan ambos criterios, retorna `{ data: [], count: 0 }`. Herramientas con `nivelMaximo: null` no aparecen cuando se filtra por nivel (comportamiento intencional: "sin clasificar" se excluye de filtros por nivel). |
| **Grid responsivo** | `ToolList` usa grid de tarjetas: 3 columnas en `lg:`, 2 en `md:`, 1 en default (mobile-first). Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`. |

### Trade-offs aceptados

- **Sin paginación:** 31 herramientas caben en una sola página. Si el catálogo crece >100, agregar paginación con `skip/take` en Prisma.
- **Sin caché explícito:** El dataset es pequeño y las queries son simples. Next.js maneja el caching vía fetch policies en Server Components.
- **Sin i18n:** El catálogo es solo en español (audiencia interna LAG).
- **DPA siempre "No aplica":** No hay datos reales de DPA en la fuente. El campo existe como placeholder para post-MVP (integración con sistema de contratos). Se documenta en la UI como "Información no disponible aún" si el valor es "No aplica".
- **ID autoincremental en URL:** Para 31 items internos, la predecibilidad no es un riesgo. Post-MVP considerar slugs si se expone externamente.

---

## Dependencias adicionales

Ninguna fuera del stack base (`standards.md`). No se requieren paquetes nuevos.

---

## Archivos a crear

```
src/
├── app/
│   ├── catalogo/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── not-found.tsx
│   └── api/
│       └── herramientas/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── components/
│   ├── ToolList.tsx
│   ├── ToolCard.tsx
│   ├── SemaforoIndicator.tsx
│   ├── NivelBadge.tsx
│   ├── FilterBar.tsx
│   ├── BackButton.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
├── lib/
│   ├── prisma.ts          → Singleton de PrismaClient
│   └── validations/
│       └── herramienta.ts
└── types/
    └── herramienta.ts
prisma/
├── schema.prisma
└── seed.ts
```
