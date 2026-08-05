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
| `FilterBar` | Client Component | Barra de filtros interactiva. Dropdown de nivel de clasificación. Mantiene estado de filtro con `useSearchParams`. Label accesible asociado al select. **H7:** Cuando hay un filtro de nivel activo y existen herramientas con `nivelMaximo: null` en el catálogo, muestra un aviso informativo debajo de los resultados: `"X herramienta(s) sin nivel asignado no se muestran en este filtro."` El conteo de herramientas sin nivel se recibe como prop `sinNivelCount: number` desde `CatalogoPage`. |
| `ToolDetailPage` | Server Component | Página de detalle. Llama a `GetHerramientaByIdHandler` (Application layer). **H6:** El layout varía según el estado de la herramienta — ver tabla de layout diferenciado más abajo. Ruta: `/catalogo/[id]` |
| `BackButton` | Client Component | Navegación de vuelta al catálogo. Usa `Link` con href `/catalogo` (no `router.back()`) para evitar salir del sitio si el usuario llegó por link directo. Preserva query param `nivel` si está presente en la URL actual. |
| `EmptyState` | Server Component | Mensaje informativo cuando no hay resultados (filtro vacío o catálogo sin datos). |
| `ErrorState` | Client Component | Mensaje de error amigable cuando falla el fetch a BD. No expone detalles internos. Incluye botón "Reintentar" (`reset()`). Es Client Component porque se usa dentro de `error.tsx` (que Next.js requiere como CC). |

### H6 — Layout diferenciado de `ToolDetailPage` (Activa/Condicional vs Retirada)

El `ToolDetailPage` renderiza campos distintos según el estado de la herramienta. No se muestra "Sin clasificar" para herramientas retiradas — se usa un label de indisponibilidad histórica.

| Campo | Herramienta Activa / Condicional | Herramienta Retirada |
|-------|----------------------------------|----------------------|
| Nombre | ✅ Siempre | ✅ Siempre |
| Proveedor | ✅ Siempre | ✅ Siempre |
| Categoría | ✅ Valor o "Sin categoría" (null) | ❌ No se muestra |
| Nivel máximo | ✅ Badge con valor o "Sin clasificar" (null) | ❌ No se muestra |
| Estado | ✅ Semáforo verde o amarillo | ✅ Semáforo rojo + banner de advertencia |
| DPA | ✅ "Vigente" / "No aplica" / "Pendiente" | ❌ No se muestra |
| Razón de retiro | ❌ No aplica | ✅ Siempre visible, sin click adicional |
| Banner de advertencia | ❌ No aplica | ✅ `"Esta herramienta NO está autorizada para uso en LAG."` |
| `retiradaEn` | ❌ No aplica | ✅ Si disponible; si null → `"Fecha no registrada"` |

**Regla de implementación:** `ToolDetailPage` recibe `HerramientaDetailDto` y evalúa `dto.estado === "Retirada"` para ramificar el layout. No son dos componentes separados — es condicional dentro del mismo Server Component.

---

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

// H5: Enums tipados — Prisma enforza valores válidos a nivel de BD.
// Elimina la clase de bugs donde un string arbitrario (typo, mayúsculas) pasa la validación.
enum NivelClasificacion {
  Publica
  Interna
  Confidencial
  Restringida
}

enum EstadoHerramienta {
  Activa
  Retirada
  Condicional
}

enum DpaEstado {
  Vigente
  NoAplica  // Se mapea al valor de display "No aplica" en el mapper
  Pendiente
}

model Herramienta {
  id             Int                @id @default(autoincrement())
  nombre         String
  proveedor      String
  categoria      String?            // Nullable: herramientas en evaluación o retiradas pueden no tener
  nivelMaximo    NivelClasificacion? // H5: Enum tipado. Null = aún no clasificada.
  estado         EstadoHerramienta  // H5: Enum tipado. Siempre requerido.
  dpa            DpaEstado          @default(NoAplica) // H5: Enum tipado.
  razonRetiro    String?
  retiradaEn     DateTime?          // H1: Cuándo fue retirada. Null si está activa o condicional.
  creadoEn       DateTime           @default(now())
  actualizadoEn  DateTime           @updatedAt

  @@unique([nombre, proveedor], name: "nombre_proveedor")
  @@map("herramientas")
}
```

> **Nota SQLite:** SQLite no soporta enums nativos. En desarrollo, Prisma los mapea a `String` con validación en la capa ORM. En producción (PostgreSQL/Neon), se crean como `ENUM` reales en BD. El comportamiento es idéntico para el código de aplicación.

### Decisiones del modelo (resuelve hallazgos de revisión)

| Dato real | Valor en BD | Razón |
|-----------|-------------|-------|
| Odiseo — estado "Activa (condicional)" | `estado: Condicional` | El enum normaliza a 3 valores. El seed transforma "Activa (condicional)" → `Condicional`. |
| Odiseo — categoría "—" | `categoria: null` | Null indica "aún no clasificado". El UI muestra "Sin categoría". |
| Odiseo — nivel "—" | `nivelMaximo: null` | Null indica "aún no definido". El UI muestra "Sin clasificar". `NivelBadge` maneja null con badge gris. |
| Herramientas retiradas — sin categoría ni nivel en fuente | `categoria: null`, `nivelMaximo: null` | Los datos fuente no los proporcionan. Se acepta null en vez de inventar valores. |
| Herramientas retiradas — `retiradaEn` | `retiradaEn: null` (MVP) | No hay fechas históricas en la fuente. Se acepta null. Post-MVP: registrar la fecha al momento del retiro vía CRUD admin. |
| Unicidad | `@@unique([nombre, proveedor])` | Evita duplicados si el seed se ejecuta múltiples veces. El seed usa `upsert`. |

### Seed

El archivo `prisma/seed.ts` cargará las 27 herramientas activas + 4 retiradas desde `docs/company/catalogo-herramientas-datos.md` como datos iniciales.

**Reglas del seed:**
- Usar `prisma.herramienta.upsert()` (idempotente) con `where: { nombre_proveedor: { nombre: "...", proveedor: "..." } }`.
- Transformar `"Activa (condicional)"` → `EstadoHerramienta.Condicional`.
- Categoría `"—"` o vacía → `null`.
- Nivel `"—"` o vacío → `null`.
- Herramientas retiradas: `categoria: null`, `nivelMaximo: null`, `razonRetiro` según tabla fuente, `retiradaEn: null`.
- DPA: `DpaEstado.NoAplica` para todas (no hay datos fuente de DPA en MVP).

**H9 — Validación de integridad post-seed:**

```typescript
// prisma/seed.ts (fragmento al final del seed)
const totalEsperado = 31; // 27 activas + 4 retiradas
const totalCargado = await prisma.herramienta.count();
if (totalCargado !== totalEsperado) {
  console.warn(
    `⚠️  SEED INTEGRITY WARNING: Se esperaban ${totalEsperado} registros, ` +
    `pero hay ${totalCargado} en BD. ` +
    `Verificar si catalogo-herramientas-datos.md fue actualizado sin re-ejecutar el seed.`
  );
}
```

Si el conteo no coincide, el proceso termina con `exit 1` en CI para forzar revisión manual.

---

## 4. Validaciones (por capa)

### Presentation Layer — Zod (input HTTP parsing)

```typescript
// src/presentation/validations/herramienta.validation.ts

import { z } from "zod";

// H10: NivelClasificacion y EstadoHerramienta se definen aquí para validar
// parámetros HTTP de entrada. DpaEstado NO se define aquí — no es un input HTTP.
// DpaEstado vive en el dominio como type (ver value-objects/dpa-estado.vo.ts).

export const NivelClasificacionSchema = z.enum([
  "Publica",
  "Interna",
  "Confidencial",
  "Restringida",
]);

export const EstadoHerramientaSchema = z.enum([
  "Activa",
  "Retirada",
  "Condicional",
]);

// GET /api/herramientas — query params
// H2: Se agrega `categoria` como filtro opcional (Post-MVP preparado).
// El repositorio lo recibirá pero la UI de MVP no lo expone todavía.
export const ListHerramientasQuerySchema = z.object({
  nivel: NivelClasificacionSchema.optional(),
  estado: EstadoHerramientaSchema.optional(),
  categoria: z.string().min(1).max(100).optional(), // Post-MVP: FilterBar de categoría
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

// H10: DpaEstado vive en el dominio, no en las validaciones de input HTTP.
// src/domain/herramienta/value-objects/dpa-estado.vo.ts
export type DpaEstado = "Vigente" | "No aplica" | "Pendiente";
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
  categoria?: string; // H2: Preparado para Post-MVP (US-07). MVP no lo usa en FilterBar.
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

### H4 — Clasificación de errores de Prisma

No todos los errores de BD son iguales. Se distinguen tres categorías para determinar si el botón "Reintentar" tiene sentido y cuánto detalle loguear:

| Categoría | Ejemplos de Prisma error codes | ¿Reintentable? | HTTP status |
|-----------|-------------------------------|----------------|-------------|
| **Transient** — BD no disponible o timeout | `P1001` (no alcanza el servidor), `P1002` (timeout de conexión), `P1008` (timeout de operación) | ✅ Sí | 503 |
| **Permanente** — error de datos o query | `P2025` (registro no encontrado, cubierto por `notFound()`), `P2002` (unique constraint — solo escritura) | ❌ No | 500 |
| **Configuración** — credenciales o schema inválido | `P1000` (autenticación BD), `P1003` (BD no existe) | ❌ No — requiere intervención ops | 500 |

**Regla para `ErrorState`:** El botón "Reintentar" (`reset()`) solo se muestra cuando el error es de categoría **Transient**. Para errores Permanentes y de Configuración, mostrar solo el mensaje amigable sin opción de reintentar.

Para exponer la categoría al componente `ErrorState`, el API route debe incluir un campo `retryable` en la respuesta 503/500:

```typescript
// Ejemplo en API route handler
import { Prisma } from "@prisma/client";

function classifyPrismaError(error: unknown): { status: number; retryable: boolean } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Errores de query conocidos — no reintentables
    return { status: 500, retryable: false };
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    // BD no alcanzable o credenciales inválidas
    const code = (error as Prisma.PrismaClientInitializationError).errorCode;
    const transient = ["P1001", "P1002", "P1008"].includes(code ?? "");
    return { status: transient ? 503 : 500, retryable: transient };
  }
  // Error desconocido — tratar como no reintentable
  return { status: 500, retryable: false };
}
```

### Estrategia por capa

| Capa | Estrategia |
|------|-----------|
| **API route handlers** | `try/catch` → `classifyPrismaError()`. Retornar `{ error: string, retryable: boolean }` con status 503 o 500 según categoría. Nunca exponer stack traces ni mensajes de Prisma al cliente. |
| **Logging server-side** | Formato estructurado mínimo: `{ timestamp, errorCode, errorCategory, path, method }`. Usar `console.error(JSON.stringify({...}))` en MVP. Post-MVP: reemplazar con logger de observabilidad (e.g. Pino, Datadog). |
| **Validación Zod** | Si `safeParse` falla → 400 con mensaje descriptivo del campo inválido (ej: `"El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida"`). No es error de BD, siempre 400 sin `retryable`. |
| **Server Components** | Usar `error.tsx` de Next.js como error boundary. Pasa `retryable` al `ErrorState`. Si `retryable: true`, mostrar botón "Reintentar". Si `retryable: false`, mostrar solo el mensaje y sugerir contactar soporte. |
| **Not found** | Página de detalle con ID inexistente: `notFound()` de Next.js → `not-found.tsx` personalizado. No es error de BD. |

### Formato de log estructurado (MVP)

```typescript
// Ejemplo de log en API route
console.error(JSON.stringify({
  timestamp: new Date().toISOString(),
  path: "/api/herramientas",
  method: "GET",
  errorCode: prismaError?.errorCode ?? "UNKNOWN",
  errorCategory: retryable ? "TRANSIENT" : "PERMANENT",
  message: error instanceof Error ? error.message : String(error),
}));
```

Post-MVP: este bloque se reemplaza por `logger.error({...})` cuando se integre un sistema de observabilidad centralizado.

---

## 6. Seguridad (MVP)

| Aspecto | Decisión MVP | Post-MVP |
|---------|-------------|----------|
| **Autenticación** | Sin auth. El catálogo es de lectura pública para empleados. | Middleware con Azure AD (SSO corporativo). |
| **Autorización** | No aplica. No hay escritura. | Roles: `viewer` (todos) vs `admin` (CRUD). |
| **Rate limiting** | No implementado. Carga esperada: ~30 usuarios concurrentes, red interna. | Obligatorio si el servicio se expone a internet o se agregan endpoints de escritura. |
| **Exposición de datos** | El catálogo no contiene datos sensibles (es política pública interna). | Revisar si se agregan campos sensibles. |
| **Errores** | Nunca exponer detalles internos (stack, queries) en responses. `retryable` flag sí se expone (no es información sensible). | Misma política. |
| **CORS** | Configurado como `same-origin` (default de Next.js). Los endpoints `/api/herramientas/*` no deben ser accesibles cross-origin. No se agrega `Access-Control-Allow-Origin: *`. | Si se requiere acceso desde otro dominio interno, definir lista blanca explícita en `next.config.js`. |

### H8 — Contexto de red y superficie de exposición

**Supuesto de despliegue MVP:** El servicio se despliega en red interna LAG (intranet corporativa o VPN). No es accesible desde internet público. Este supuesto debe ser validado por el equipo de infraestructura antes de go-live.

| Escenario | Impacto | Acción requerida |
|-----------|---------|-----------------|
| Servicio en intranet / VPN | Bajo riesgo. Rate limiting opcional. IDs autoincrementales aceptables. | ✅ Mantener decisiones MVP. |
| Servicio expuesto a internet | Riesgo medio-alto. Enumeración de IDs posible, sin throttle. | ⚠️ Agregar rate limiting, considerar slugs, revisar auth antes de publicar. |

Si el contexto de despliegue cambia (ej. se decide exponer el catálogo externamente), estas decisiones deben revisarse antes de implementar.

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
| **Filtros combinados con AND** | Si se pasa `?nivel=X&estado=Y`, la API aplica ambos con AND. Si no hay resultados que cumplan ambos criterios, retorna `{ data: [], count: 0 }`. Herramientas con `nivelMaximo: null` no aparecen cuando se filtra por nivel (comportamiento intencional: "sin clasificar" se excluye de filtros por nivel). **H11:** Si el filtro incluye `estado=Retirada` (solo o combinado con nivel), `ToolList` renderiza un banner de advertencia de gobernanza por encima de los resultados: `"Estás viendo herramientas NO autorizadas. No deben usarse con datos de LAG."` El banner usa el color de alerta del design-system (rojo semáforo) con icono y texto accesible. |
| **Grid responsivo** | `ToolList` usa grid de tarjetas: 3 columnas en `lg:`, 2 en `md:`, 1 en default (mobile-first). Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`. |

### Trade-offs aceptados

- **Sin paginación:** 31 herramientas caben en una sola página. Si el catálogo crece >100, agregar paginación con `skip/take` en Prisma.
- **Sin caché explícito:** El dataset es pequeño y las queries son simples. Next.js maneja el caching vía fetch policies en Server Components.
- **Sin i18n:** El catálogo es solo en español (audiencia interna LAG).
- **DPA siempre "No aplica":** No hay datos reales de DPA en la fuente. El campo existe como placeholder para post-MVP (integración con sistema de contratos). Se documenta en la UI como "Información no disponible aún" si el valor es "No aplica".
- **ID autoincremental en URL:** Para 31 items internos, la predecibilidad no es un riesgo. Post-MVP considerar slugs si se expone externamente.

---

## 8. Proceso de actualización del catálogo (H3)

El MVP no tiene CRUD en UI. El catálogo se actualiza mediante el proceso controlado descrito aquí. Este proceso **reemplaza** la ausencia de endpoints de escritura como mecanismo de control.

### Flujo de actualización

```
Solicitud de cambio (Gobernanza AI)
        ↓
Editar docs/company/catalogo-herramientas-datos.md (fuente de verdad)
        ↓
PR con revisión obligatoria (mínimo 1 aprobador del equipo de Gobernanza AI)
        ↓
Merge a main
        ↓
Ejecutar seed en el ambiente correspondiente
        ↓
Verificar check de integridad (conteo == 31 o N esperado)
```

### Responsables y permisos

| Acción | Responsable | Acceso requerido |
|--------|------------|-----------------|
| Proponer cambio al catálogo | Cualquier empleado | PR al repositorio (write en GitHub/Azure DevOps) |
| Aprobar cambio | Equipo de Gobernanza AI | Rol `reviewer` en el repositorio |
| Ejecutar seed en **desarrollo** | Cualquier desarrollador | Acceso al entorno local o CI |
| Ejecutar seed en **staging** | Desarrollador del equipo | Acceso a credenciales de staging (`.env.staging`) |
| Ejecutar seed en **producción** | Tech Lead + aprobación Gobernanza AI | Acceso a credenciales de producción (secretos en vault/CI) |

### Reglas de operación

- El seed **nunca** se ejecuta directamente en producción sin un PR aprobado que documente el cambio.
- Las credenciales de producción no deben estar en `.env` local de ningún desarrollador. Se gestionan vía CI secrets o vault.
- Si el check de integridad del seed falla en producción, se revierte el seed (BD anterior) y se investiga antes de reintentar.
- `docs/company/catalogo-herramientas-datos.md` es la fuente de verdad. La BD **deriva** de ese documento, no al revés.

### Cambios típicos y su impacto

| Tipo de cambio | Impacto en BD | Requiere migración Prisma |
|----------------|---------------|--------------------------|
| Nueva herramienta (agregar fila) | INSERT vía seed upsert | No |
| Cambio de estado (Activa → Retirada) | UPDATE vía seed upsert | No |
| Nuevo campo en el catálogo | ALTER TABLE + nuevo campo en schema.prisma | Sí — `prisma migrate dev` |
| Renombrar herramienta (nombre cambia) | El `@@unique([nombre, proveedor])` crea un nuevo registro. El anterior queda huérfano si no se elimina manualmente. | No, pero requiere script de limpieza |

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
│   │       ├── estado-herramienta.vo.ts      ← Type + constantes
│   │       └── dpa-estado.vo.ts              ← Type DpaEstado (H10: movido desde Zod)
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
