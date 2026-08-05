# Design — Catálogo de Herramientas AI Aprobadas

> Módulo: catalogo-herramientas
> Stack: Next.js 14 (App Router) · TypeScript · Prisma · Zod · Tailwind CSS
> Paradigma: Clean Architecture (4 capas) — ver `docs/engineering/Clean-Architecture-Unify.md`
> Refs: requirements.md, product-brief.md, docs/engineering/standards.md

---

## 1. Componentes de UI

| Componente | Tipo | Responsabilidad |
|------------|------|-----------------|
| `CatalogoPage` | Server Component | Página principal. Llama a `ListHerramientasHandler` (Application layer) para obtener datos. Renderiza layout con filtros y listado. Ruta: `/catalogo` |
| `ToolList` | Server Component | Renderiza la tabla/grid de herramientas recibidas como props. Muestra nombre, proveedor, categoría, nivel, semáforo. Agrupa activas primero, retiradas al final. |
| `ToolCard` | Server Component | Tarjeta individual de herramienta en el listado. Incluye semáforo visual y link al detalle. Si retirada, muestra razón de retiro inline. |
| `SemaforoIndicator` | Server Component | Componente visual reutilizable. Verde = Activa, Rojo = Retirada, Amarillo = Condicional. Accesible (aria-label + texto alternativo). |
| `NivelBadge` | Server Component | Badge con color por nivel de clasificación (Pública, Interna, Confidencial, Restringida). Si nivel es null, muestra "Sin clasificar" en gris. |
| `FilterBar` | Client Component | Barra de filtros interactiva. Dropdown de nivel de clasificación. Mantiene estado de filtro con `useSearchParams`. Label accesible asociado al select. |
| `ToolDetailPage` | Server Component | Página de detalle. Llama a `GetHerramientaByIdHandler` (Application layer), muestra todos los campos + semáforo + DPA. Ruta: `/catalogo/[id]` |
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

### Regla de acceso a datos (Clean Architecture — Dependency Rule)

```
┌─────────────────────────────────────────────────────────────┐
│            Presentation Layer (src/presentation/)            │
│  Pages, API Routes, UI Components, Zod input validation     │
├─────────────────────────────────────────────────────────────┤
│            Infrastructure Layer (src/infrastructure/)        │
│  PrismaClient, Repository implementations, Mappers          │
├─────────────────────────────────────────────────────────────┤
│            Application Layer (src/application/)              │
│  Query Handlers, DTOs, Use Case orchestration               │
├─────────────────────────────────────────────────────────────┤
│            Domain Layer (src/domain/)                        │
│  Entity, Value Objects, Repository interface (PORT), Errors  │
└─────────────────────────────────────────────────────────────┘
```

| Capa | Responsabilidad | Depende de | NO depende de |
|------|----------------|-----------|--------------|
| **Domain** | Entidad `Herramienta`, value objects (`NivelClasificacion`, `EstadoHerramienta`), interface `IHerramientaRepository`, errores tipados | Nada | Framework, Prisma, Zod, Next.js |
| **Application** | Query handlers (`ListHerramientas`, `GetHerramientaById`), DTOs de response | Solo Domain | Infrastructure, Presentation |
| **Infrastructure** | `PrismaHerramientaRepository` (implementa el PORT), singleton PrismaClient, mappers | Domain, Application | Presentation |
| **Presentation** | Pages (Server Components), API routes (thin), UI components, Zod validation | Application (via query handlers) | Domain directo, Infrastructure directo |

> **Dependency Rule:** Las dependencias SIEMPRE apuntan hacia adentro. Domain no tiene dependencias externas.

| Consumidor | Accede vía | Patrón |
|------------|-----------|--------|
| Server Components (`CatalogoPage`, `ToolDetailPage`) | Query Handler → Repository interface → Prisma impl | Application → Domain port → Infrastructure adapter |
| API route handlers (`/api/herramientas/*`) | Mismo: Query Handler | Presentation thin → Application |
| Client Components | No acceden a datos | Solo interactividad. Reciben datos via props. |

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

## 4. Validaciones (por capa)

### Presentation Layer — Zod (input HTTP parsing)

```typescript
// src/presentation/validations/herramienta.validation.ts

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
```

### Domain Layer — Entity con factory method + Value Objects

```typescript
// src/domain/herramienta/herramienta.entity.ts

import { NivelClasificacion } from "./value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "./value-objects/estado-herramienta.vo";

export interface HerramientaProps {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: NivelClasificacion | null;
  estado: EstadoHerramienta;
  dpa: string;
  razonRetiro: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export class Herramienta {
  private constructor(private readonly props: HerramientaProps) {}

  static create(props: HerramientaProps): Herramienta {
    return new Herramienta(props);
  }

  get id() { return this.props.id; }
  get nombre() { return this.props.nombre; }
  get proveedor() { return this.props.proveedor; }
  get categoria() { return this.props.categoria; }
  get nivelMaximo() { return this.props.nivelMaximo; }
  get estado() { return this.props.estado; }
  get dpa() { return this.props.dpa; }
  get razonRetiro() { return this.props.razonRetiro; }
  get creadoEn() { return this.props.creadoEn; }
  get actualizadoEn() { return this.props.actualizadoEn; }

  get estaRetirada(): boolean { return this.estado === "Retirada"; }
  get esCondicional(): boolean { return this.estado === "Condicional"; }
}
```

```typescript
// src/domain/herramienta/value-objects/nivel-clasificacion.vo.ts
export type NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida";

// src/domain/herramienta/value-objects/estado-herramienta.vo.ts
export type EstadoHerramienta = "Activa" | "Retirada" | "Condicional";
```

### Domain Layer — Repository interface (PORT)

```typescript
// src/domain/herramienta/herramienta.repository.ts

import { Herramienta } from "./herramienta.entity";
import { NivelClasificacion } from "./value-objects/nivel-clasificacion.vo";
import { EstadoHerramienta } from "./value-objects/estado-herramienta.vo";

export interface HerramientaFilters {
  nivelMaximo?: NivelClasificacion;
  estado?: EstadoHerramienta;
}

export interface IHerramientaRepository {
  findAll(filters?: HerramientaFilters): Promise<Herramienta[]>;
  findById(id: number): Promise<Herramienta | null>;
}
```

### Application Layer — Query Handlers + DTOs

```typescript
// src/application/herramientas/dtos/herramienta-list-item.dto.ts
export interface HerramientaListItemDto {
  id: number;
  nombre: string;
  proveedor: string;
  categoria: string | null;
  nivelMaximo: string | null;
  estado: string;
  razonRetiro: string | null;
}

// src/application/herramientas/dtos/herramienta-detail.dto.ts
export interface HerramientaDetailDto extends HerramientaListItemDto {
  dpa: string;
  creadoEn: string; // ISO 8601
  actualizadoEn: string; // ISO 8601
}
```

```typescript
// src/application/herramientas/queries/list-herramientas.handler.ts

import { IHerramientaRepository, HerramientaFilters } from "@/domain/herramienta/herramienta.repository";
import { HerramientaListItemDto } from "../dtos/herramienta-list-item.dto";

export class ListHerramientasHandler {
  constructor(private readonly repository: IHerramientaRepository) {}

  async execute(filters?: HerramientaFilters): Promise<{ data: HerramientaListItemDto[]; count: number }> {
    const herramientas = await this.repository.findAll(filters);
    const data = herramientas.map(h => ({
      id: h.id,
      nombre: h.nombre,
      proveedor: h.proveedor,
      categoria: h.categoria,
      nivelMaximo: h.nivelMaximo,
      estado: h.estado,
      razonRetiro: h.razonRetiro,
    }));
    return { data, count: data.length };
  }
}
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
| **Clean Architecture (4 capas)** | El proyecto seguirá creciendo (intake, CRUD admin, notificaciones). Invertir en la estructura ahora evita refactoring costoso post-MVP. Domain puro habilita tests unitarios sin BD. Repository pattern permite swap de Prisma sin tocar lógica. |
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

## Archivos a crear (Clean Architecture)

```
src/
├── domain/                                    ← CAPA DOMAIN (cero dependencias externas)
│   ├── herramienta/
│   │   ├── herramienta.entity.ts             ← Entidad con factory method
│   │   ├── herramienta.repository.ts         ← Interface PORT (IHerramientaRepository)
│   │   ├── herramienta.errors.ts             ← Errores tipados del dominio
│   │   └── value-objects/
│   │       ├── nivel-clasificacion.vo.ts     ← Type + constantes
│   │       └── estado-herramienta.vo.ts      ← Type + constantes
│   └── abstractions/
│       └── result.ts                         ← Result<T> pattern (para post-MVP commands)
│
├── application/                               ← CAPA APPLICATION (depende solo de Domain)
│   └── herramientas/
│       ├── queries/
│       │   ├── list-herramientas.handler.ts  ← Orquesta: repo.findAll → map → DTOs
│       │   └── get-herramienta-by-id.handler.ts
│       └── dtos/
│           ├── herramienta-list-item.dto.ts  ← Shape del listado (sin DPA)
│           └── herramienta-detail.dto.ts     ← Shape del detalle (con DPA + timestamps)
│
├── infrastructure/                            ← CAPA INFRASTRUCTURE (implementa PORTs)
│   ├── database/
│   │   └── prisma.client.ts                  ← Singleton PrismaClient
│   ├── repositories/
│   │   └── prisma-herramienta.repository.ts  ← ADAPTER: implementa IHerramientaRepository
│   └── mappers/
│       └── herramienta.mapper.ts             ← Prisma model → Domain entity
│
├── presentation/                              ← CAPA PRESENTATION (UI + API, thin)
│   ├── api/
│   │   └── herramientas/
│   │       ├── route.ts                      ← GET /api/herramientas (parsea → handler → responde)
│   │       └── [id]/
│   │           └── route.ts                  ← GET /api/herramientas/[id]
│   ├── pages/
│   │   └── catalogo/
│   │       ├── page.tsx                      ← CatalogoPage (SC, llama handler)
│   │       ├── loading.tsx                   ← Skeleton
│   │       ├── error.tsx                     ← Error boundary (CC)
│   │       └── [id]/
│   │           ├── page.tsx                  ← ToolDetailPage
│   │           ├── loading.tsx               ← Skeleton detalle
│   │           └── not-found.tsx             ← "Herramienta no encontrada"
│   ├── components/
│   │   ├── ToolList.tsx
│   │   ├── ToolCard.tsx
│   │   ├── SemaforoIndicator.tsx
│   │   ├── NivelBadge.tsx
│   │   ├── FilterBar.tsx
│   │   ├── BackButton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   └── validations/
│       └── herramienta.validation.ts         ← Zod schemas (solo parseo HTTP input)
│
prisma/
├── schema.prisma
└── seed.ts
```

### Nota sobre Next.js App Router + Clean Architecture

Next.js requiere que las páginas estén en `src/app/` para el routing. Se usa un **re-export pattern**:

```typescript
// src/app/catalogo/page.tsx (Next.js routing requirement)
export { default } from "@/presentation/pages/catalogo/page";
export { metadata } from "@/presentation/pages/catalogo/page";
```

Alternativamente, si el equipo prefiere colocar las pages directamente en `src/app/` (más idiomático para Next.js), la capa Presentation se divide:
- `src/app/` → Solo pages y API routes (thin wrappers que llaman handlers)
- `src/presentation/components/` → UI components
- `src/presentation/validations/` → Zod schemas

Ambos approaches cumplen la Dependency Rule. El equipo elige durante implementación.
