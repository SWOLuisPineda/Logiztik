# Decisiones de Implementación del Agente

> Registro de dependencias instaladas fuera de lo especificado en `docs/engineering/standards.md` o `spec/catalogo-herramientas/design.md`.

## Dependencias agregadas

| Task | Paquete | Versión | Razón | En design.md |
|:----:|:--------|:--------|:------|:------------:|
| 8-9 | `@prisma/adapter-libsql` | ^7.9.1 | Prisma 7 eliminó el motor de queries interno. Los driver adapters son ahora obligatorios para conectar a cualquier BD. Este adapter habilita SQLite vía libSQL (pure JS, sin native compilation). | No |
| 8-9 | `@libsql/client` | ^0.17.4 | Dependencia peer de `@prisma/adapter-libsql`. Provee el driver libSQL que el adapter usa internamente para hablar con SQLite. | No |
| 13 | `tsx` (devDep) | ^4.23.8 | Runner de TypeScript requerido para ejecutar `prisma/seed.ts` y `prisma.config.ts`. Prisma 7 usa config en TypeScript y necesita un TS runner para el seed command. Alternativa era `ts-node` pero tsx es más rápido y sin config. | No |

## Dependencias removidas (instaladas por error y limpiadas)

| Paquete | Razón de remoción |
|:--------|:------------------|
| `@prisma/adapter-better-sqlite3` | Se instaló inicialmente para SQLite pero requiere native compilation (node-gyp) que fallaba. Reemplazado por `@prisma/adapter-libsql` (pure JS). |
| `better-sqlite3` | Dependencia de `@prisma/adapter-better-sqlite3`. Ya no necesaria. |
| `@types/better-sqlite3` | Tipos para better-sqlite3. Ya no necesaria. |

## Nota para design.md

El `design.md` dice "Dependencias adicionales: Ninguna fuera del stack base". Esto debería actualizarse para Prisma 7 ya que el adapter es obligatorio (no opcional). Recomiendo agregar:

```
## Dependencias adicionales (requeridas por Prisma 7)
- @prisma/adapter-libsql — Driver adapter obligatorio para SQLite
- @libsql/client — Driver libSQL (peer dependency del adapter)
- tsx (devDep) — TS runner para seed y prisma.config.ts
```

---

## Correcciones post-revisión adversarial

| # | Criticidad | Hallazgo | Corrección aplicada |
|---|:----------:|----------|---------------------|
| 1 | Alta | `BackButton` no preservaba filtro (leía searchParams de URL de detalle que nunca tiene `?nivel=`) | Rediseñado: ahora recibe `nivel` como prop desde `ToolDetailPage`. No depende de searchParams. |
| 2 | Alta | `prisma.client.ts` dependía de `process.cwd()` que puede fallar en producción | Ahora usa `process.env.DATABASE_URL` como fuente primaria, con fallback a cwd solo si la env var no existe (desarrollo). |
| 3 | — | `BackButton` usaba `&larr;` (HTML entity) inconsistente con design system | Reemplazado por SVG chevron inline (Heroicons arrow-left-20-solid). Consistente con el sistema de iconos del proyecto. |
| 4 | Media | API route importaba `HerramientaFilters` de `@/domain/` violando Dependency Rule | Eliminado import de Domain. Se usa tipo local inline `{ nivelMaximo?: string; estado?: string }` en la route. |
| 5 | Media | Mapper silenciaba estados inválidos como "Activa" sin advertencia | Agregado `console.warn` con contexto (id, nombre, valor inválido) cuando un type guard falla. |
| 6 | Media | `SemaforoIndicator` tenía `aria-label` que duplicaba el texto visible | Eliminado `aria-label`. Cambiado `<span role="status">` por `<output>` (mejor semántica accesible). Props marcadas `readonly`. |
| 7 | Baja | DTOs usaban `string` genérico para `estado` y `nivelMaximo` | Cambiado a union types del dominio (`EstadoHerramienta`, `NivelClasificacion | null`) para type safety end-to-end. |
| 8 | Baja | `FilterBar` hardcodeaba `/catalogo` en `router.push()` | Reemplazado por `usePathname()` para construir URL relativa al pathname actual. |
| 9 | Baja | Zod schemas no rechazaban params desconocidos | Agregado `.strict()` a ambos schemas para que params extra generen error 400. |
| 10 | Baja (backlog) | Domain errors nunca se usan | Documentado como preparación para post-MVP (CRUD commands). No se eliminan. |
| 11 | Baja (backlog) | Sin barrel exports (`index.ts`) en capas | Bajo impacto con 31 registros y 4 archivos por capa. Se agregará cuando el proyecto crezca. |

---

## Correcciones post-revisión adversarial (Fases 6-8)

| # | Criticidad | Hallazgo (design.md ref) | Corrección aplicada |
|---|:----------:|--------------------------|---------------------|
| 12 | Alta | H9 — Seed no validaba integridad (conteo vs esperado) | Agregado check `if (count !== 31) { process.exit(1) }` al final del seed. CI fallará si conteo no coincide. |
| 13 | Alta | H11 — `ToolList` no mostraba banner de gobernanza para herramientas retiradas | Agregado banner condicional con `role="alert"`: "Estás viendo herramientas NO autorizadas..." Se muestra cuando `herramientas.some(h => h.estado === "Retirada")`. Usa color rojo semáforo + icono SVG. |
| 14 | Alta | H7 — `FilterBar`/`CatalogoPage` no mostraba aviso de herramientas sin nivel excluidas | `CatalogoPage` calcula `sinNivelCount` cuando hay filtro activo y lo pasa a `ToolList`. `ToolList` muestra aviso: "X herramienta(s) sin nivel asignado no se muestran en este filtro." |
| 15 | — | `CatalogoPage` importaba de `@/domain/` (violaba Dependency Rule) | Reemplazado: ahora usa `NivelClasificacionSchema.options` de `@/presentation/validations/` para obtener los niveles válidos. Cero imports de Domain en pages. |

| 16 | Media | H4 — API routes no clasificaban errores de Prisma (siempre 500 genérico) | Creado `src/infrastructure/errors/classify-prisma-error.ts` con categorías Transient/Permanent/Configuration. Routes ahora retornan `{ error, retryable }` con status 503 (transient) o 500 (permanent). |
| 17 | Media | Doble query en ToolDetailPage (generateMetadata + componente) | Envuelto `getHerramientaByIdHandler.execute` en `React.cache()`. Misma query se de-duplica dentro del mismo request. |
| 18 | Media | H6 `retiradaEn` no implementado (campo no existe en schema) | Documentado como pospuesto: no hay datos fuente de fechas de retiro. Se implementará cuando se agregue CRUD admin que registre la fecha. No modifica schema ni UI en MVP. |
| 19 | Baja | Font `font-[Inter,system-ui,sans-serif]` inválido en layout Tailwind | Removido. La tipografía Inter se hereda del layout raíz (globals.css). El layout del catálogo solo aplica contenedor. |
| 20 | Baja | FilterBar sin Suspense boundary (warning de Next.js 14 con useSearchParams) | Envuelto `<FilterBar />` en `<Suspense fallback={null}>` dentro de CatalogoPage. |
| 21 | Baja | H2 `categoria` en Zod vs `.strict()` | El schema implementado NO incluye `categoria` (correcto para MVP). El `.strict()` rechazará `?categoria=X` con 400. Si se activa post-MVP, agregar al schema Zod. |
| 22 | Baja | Jerarquía de headings (text-2xl para page title) | Cambiado a `text-3xl` para page titles (CatalogoPage, ToolDetailPage). Crea jerarquía visual clara. |

| 23 | Alta (runtime) | `SQLITE_ERROR: no such table: main.herramientas` — la app no encontraba la BD correcta | **Causa raíz:** Existían 2 archivos `dev.db` (raíz y prisma/) porque `.env`, `prisma.config.ts` y `prisma.client.ts` usaban paths diferentes. **Fix:** (1) Unificar `DATABASE_URL=file:./prisma/dev.db` en `.env` como única fuente. (2) `prisma.config.ts` lee de `env("DATABASE_URL")`. (3) `prisma.client.ts` resuelve paths relativos a absolutos con `path.resolve(cwd, ...)`. (4) Eliminado `dev.db` huérfano de la raíz. (5) Agregado check de existencia del archivo con mensaje de error descriptivo. |

### Mejoras preventivas aplicadas

| Mejora | Archivo | Qué previene |
|--------|---------|-------------|
| Resolución de paths relativos a absolutos | `prisma.client.ts` | libsql en Windows interpreta mal los paths relativos en runtime |
| Check de existencia del archivo pre-conexión | `prisma.client.ts` | Error críptico "no such table" se reemplaza por mensaje: "BD no encontrada. Ejecuta npm run db:seed" |
| `DATABASE_URL` como single source of truth | `.env` + `prisma.config.ts` + `prisma.client.ts` | Elimina drift entre CLI y runtime — ambos leen la misma variable |
| `prisma/dev.db` en `.gitignore` | `.gitignore` | El archivo de BD no se versiona — cada dev lo regenera con migrate+seed |
| Eliminado `dev.db` huérfano de la raíz | — | Confusión de "cuál BD tiene la tabla" |


---

## Aplicación del Design System LAG (post-revisión visual)

| # | Criticidad | Problema | Fix aplicado |
|---|:----------:|----------|-------------|
| 24 | Alta | Font Inter NO configurada (usaba Arial/Geist) | `layout.tsx` ahora importa Inter de `next/font/google`. Variable `--font-inter` + `font-sans` en Tailwind. |
| 25 | Alta | Tailwind sin tokens del design system | `tailwind.config.ts` reescrito con tokens: `brand-primary`, `brand-dark`, `lag-bg-primary/secondary`, `lag-text-primary/secondary`, `lag-border`, `semaforo-verde/amarillo/rojo`. |
| 26 | Alta | Dark mode activo (design dice tema LIGHT fijo) | `globals.css` simplificado: eliminado `prefers-color-scheme: dark`. Body usa colores LAG fijos. |
| 27 | Alta | Tailwind `content` no escaneaba `src/presentation/` | Agregado `./src/presentation/**/*.{js,ts,jsx,tsx,mdx}` al content array. |
| 28 | Media | Metadata raíz "Create Next App" | Cambiado a "Gobierno AI — LAG" con descripción de la plataforma. |
| 29 | Media | `lang="en"` (catálogo en español) | Cambiado a `lang="es"`. |
| 30 | Media | Sin header/branding LAG | Agregado header global con ícono `AI`, texto "Gobierno AI — LAG", fondo `bg-secondary`, borde inferior. |
| 31 | Media | Sin contraste visual entre secciones | Zona de filtros ahora usa `bg-lag-bg-secondary` con borde y rounded. `EmptyState`/`ErrorState` también. |
| 32 | Baja | NivelBadge "Interna" usaba azul (no existe en design system) | Cambiado a `bg-lag-bg-secondary text-lag-text-primary` con borde (neutro, dentro del sistema). |
| 33 | Baja | Cards sin hover de color de marca | Agregado `hover:border-brand-primary/40` a `ToolCard` para indicar interactividad con color de marca. |
| 34 | Baja | EmptyState/ErrorState sin icono ni fondo diferenciado | Agregados SVG icons, fondo `bg-lag-bg-secondary`, borde y rounded. |

### Archivos modificados

- `tailwind.config.ts` — Tokens completos del design system
- `src/app/globals.css` — Tema light fijo, sin dark mode
- `src/app/layout.tsx` — Inter font, lang="es", metadata LAG, header con branding
- `src/app/catalogo/page.tsx` — Zona de filtros con bg-secondary
- `src/app/catalogo/[id]/page.tsx` — Tokens en vez de hex hardcodeado
- `src/app/catalogo/[id]/not-found.tsx` — Tokens + fondo alternativo
- `src/presentation/components/` — Todos los componentes migrados a tokens Tailwind

---

## Correcciones de Brechas (2026-08-10)

| # | Criticidad | Hallazgo | Acción ejecutada |
|---|:----------:|----------|------------------|
| 35 | Alta | No había pruebas automáticas unitarias ni e2e para respaldar Task 34/35 | Se agregaron `vitest.config.ts` y pruebas en `tests/unit/` para validaciones Zod + mapper de dominio. |
| 36 | Alta | E2E inexistente y dependiente de instalación manual de navegador | Se agregó `playwright.config.ts` con estrategia de API tests (`tests/e2e/herramientas.api.test.ts`) usando `request` + `webServer`, sin dependencia de Chromium para correr la suite básica. |
| 37 | Media | `.env.example` mal formado e inconsistente con path real de SQLite | Se normalizó a formato estándar: `DATABASE_URL="file:./prisma/dev.db"` y variables con comillas. |
| 38 | Media | Semáforo no cumplía completamente criterio de a11y de requerimientos (estado condicional) | `SemaforoIndicator` ahora tipa estado con union literal, agrega `aria-label` y nota SR-only para restricciones del estado condicional. |
| 39 | Media | Filtro estricto de query en API no rechazaba params desconocidos al filtrar entradas manualmente | `GET /api/herramientas` ahora valida `Object.fromEntries(searchParams.entries())` completo, permitiendo que Zod `.strict()` rechace claves extra con 400. |
| 40 | Media | Inconsistencia de contrato en DPA (string suelto) | `Herramienta` y `HerramientaDetailDto` migrados a `DpaEstado`; mapper valida DPA y normaliza inválidos a `No aplica` con warning. |
| 41 | Media | Fallback inseguro en mapper de estado inválido | Se cambió fallback de `Activa` a `Retirada` para fail-safe de gobierno. |
| 42 | Baja | Error boundary no usaba `error` y botón siempre visible | `catalogo/error.tsx` ahora usa `error` (log + heurística retryable) y `ErrorState` renderiza botón solo cuando aplica, con `type="button"`. |
| 43 | Baja | En E2E, `next dev` no pudo validar TLS al descargar Inter desde Google Fonts (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`) | Documentado como condición de entorno corporativo. Impacto: no bloquea APIs ni pruebas E2E (Next usa fallback font). Mantener monitoreo para pruebas visuales UI estrictas. |

---

## Corrección de compilación (2026-08-10)

| # | Criticidad | Hallazgo | Acción ejecutada |
|---|:----------:|----------|------------------|
| 44 | Alta | `next build` fallaba al descargar `Inter` vía `next/font/google` por `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` | Se eliminó la dependencia de `next/font/google` en `src/app/layout.tsx`. La app usa `font-sans` con stack `Inter, system-ui, sans-serif` definido en Tailwind, sin fetch de red en build. |
| 45 | Media | Durante `next build`, las API routes registraban falsos errores `Dynamic server usage` al intentar participar en render estático | Se agregó `export const dynamic = "force-dynamic"` a `src/app/api/herramientas/route.ts` y `src/app/api/herramientas/[id]/route.ts` para declarar explícitamente que son rutas dinámicas. |
| 46 | Alta | `next build` en GitHub Actions intentaba prerenderizar páginas de catálogo que consultan BD (`/catalogo` y `/catalogo/[id]`), acoplando el build a `DATABASE_URL` y al estado de la BD del runner | Se agregó `export const dynamic = "force-dynamic"` a `src/app/catalogo/page.tsx` y `src/app/catalogo/[id]/page.tsx` para mover esas queries a runtime request-time y desacoplar el build de CI de la BD. |
| 47 | Alta | `Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'` al compilar con dependencias recién instaladas | Causa raíz: faltaba `node_modules/.prisma/client`, así que `@prisma/client` quedaba como reexport roto. Se agregó `postinstall: prisma generate` en `package.json` para regenerar Prisma Client automáticamente tras `npm install` / `npm ci`. |
| 48 | Alta | Regresión en configuración de Prisma impedía regenerar el cliente: `prisma.config.ts` intentaba resolver `env("file:./prisma/dev.db")` y `prisma/schema.prisma` había quedado con `provider = "postgresql"` pese a que migraciones, seed y runtime usan SQLite en dev | Se corrigió `prisma.config.ts` para usar `process.env.DATABASE_URL ?? "file:./prisma/dev.db"`, se restauró `provider = "sqlite"` en `prisma/schema.prisma` y se recreó `.env.example` con `DATABASE_URL="file:./prisma/dev.db"`. |
| 49 | Alta | El workflow de CI mezclaba dos estrategias E2E incompatibles: Playwright ya levanta `next dev` en `3200`, pero el job además hacía `npm start` en `3000` con `sleep 5`. Además, GitHub Actions no reconoce `env.*` dentro de expresiones en `jobs.<job>.env` | Se refactorizó `.github/workflows/ci-cd.yml` para centralizar variables compartidas, usar fallback literal de `DATABASE_URL` en `jobs.<job>.env` y dejar que Playwright gestione por sí solo el web server de E2E. |
| 50 | Alta | El job `test-e2e` ejecutaba `db:seed` sobre la SQLite fallback sin crear antes el esquema, provocando `SQLITE_ERROR: no such table: main.herramientas` | Se agregó el paso `npx prisma migrate deploy` antes de `npm run test:e2e` en `.github/workflows/ci-cd.yml` para que Playwright siembre una base ya migrada. |

### Patrón repetitivo identificado

- En entornos corporativos con inspección TLS o certificados locales no confiados por Node.js, cualquier uso de `next/font/google` puede romper `next build`.
- Para este repositorio, preferir fuentes sin fetch remoto en build: stack local (`font-sans`) o `next/font/local` con archivos versionados en el repo.
- Cuando una route handler usa `nextUrl`, query params o acceso a BD por request, declararla como dinámica evita ruido y diagnósticos falsos durante compilación.

### Impacto en verificación de Tasks

- Task 34: ahora tiene verificación automatizada parcial por unit tests de contratos y validaciones.
- Task 35: ahora tiene verificación automatizada API e2e del flujo mínimo de catálogo.
- Nota técnica: la suite e2e implementada en esta iteración valida endpoints HTTP (no UI browser) para evitar dependencia de instalación de Chromium en entornos restringidos.
