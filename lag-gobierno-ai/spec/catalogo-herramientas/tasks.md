# Tasks — Catálogo de Herramientas AI Aprobadas

> Generado desde: design.md (Clean Architecture — 4 capas, 0 bloqueantes tras 4 revisiones)
> Cada tarea es atómica (<2h), ordenada por dependencias (capas internas primero).
> Criterio de hecho (Done) explícito en cada una.
> Composición: Pages en `src/app/` (idiomático Next.js), componentes y validaciones en `src/presentation/`.

---

## Fase 1: Domain Layer (cero dependencias externas)

- [x] **1. Crear value objects del dominio**
  - Archivos:
    - `src/domain/herramienta/value-objects/nivel-clasificacion.vo.ts`
    - `src/domain/herramienta/value-objects/estado-herramienta.vo.ts`
  - Tipos: `NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida"`, `EstadoHerramienta = "Activa" | "Retirada" | "Condicional"`.
  - Constantes array: `NIVELES_CLASIFICACION`, `ESTADOS_HERRAMIENTA`.
  - **Done:** Compilan sin imports externos. Importables desde `@/domain/herramienta/value-objects/`.

- [x] **2. Crear entidad `Herramienta` con factory method**
  - Archivo: `src/domain/herramienta/herramienta.entity.ts`
  - Constructor privado + `static create(props): Herramienta`.
  - Props: id, nombre, proveedor, categoria (null), nivelMaximo (null), estado, dpa, razonRetiro (null), creadoEn, actualizadoEn.
  - Getters readonly. Computed: `estaRetirada`, `esCondicional`.
  - **Done:** Compila. NO importa framework. Factory crea instancia. Getters funcionan.

- [x] **3. Crear interface `IHerramientaRepository` (PORT)**
  - Archivo: `src/domain/herramienta/herramienta.repository.ts`
  - Interface con `findAll(filters?: HerramientaFilters): Promise<Herramienta[]>` y `findById(id): Promise<Herramienta | null>`.
  - Type `HerramientaFilters = { nivelMaximo?: NivelClasificacion; estado?: EstadoHerramienta }`.
  - **Done:** Compila. Solo importa de entity y value-objects locales.

- [x] **4. Crear errores tipados del dominio**
  - Archivo: `src/domain/herramienta/herramienta.errors.ts`
  - `HerramientaNotFoundError`, `NivelInvalidoError` — cada uno con `code` y `message`.
  - **Done:** Compila. Errores instanciables con mensajes descriptivos.

---

## Fase 2: Application Layer (depende solo de Domain)

- [x] **5. Crear DTOs de response**
  - Archivos:
    - `src/application/herramientas/dtos/herramienta-list-item.dto.ts`
    - `src/application/herramientas/dtos/herramienta-detail.dto.ts`
  - `HerramientaListItemDto`: id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro (todos string|null serializable).
  - `HerramientaDetailDto`: extiende list item + dpa, creadoEn (ISO string), actualizadoEn (ISO string).
  - **Done:** Compilan. Interfaces planas sin dependencia externa.

- [x] **6. Crear `ListHerramientasHandler`**
  - Archivo: `src/application/herramientas/queries/list-herramientas.handler.ts`
  - Constructor: recibe `IHerramientaRepository`.
  - `execute(filters?)`: llama `repo.findAll(filters)` → mapea entity → `HerramientaListItemDto[]` → retorna `{ data, count }`.
  - **Done:** Compila. Solo importa de `@/domain/`. Retorna shape correcta.

- [x] **7. Crear `GetHerramientaByIdHandler`**
  - Archivo: `src/application/herramientas/queries/get-herramienta-by-id.handler.ts`
  - Constructor: recibe `IHerramientaRepository`.
  - `execute(id)`: llama `repo.findById(id)` → retorna `HerramientaDetailDto | null`.
  - Mapeo entity→DTO: timestamps `Date` → ISO string.
  - **Done:** Compila. Retorna null si no existe.

---

## Fase 3: Infrastructure Layer (implementa PORTs)

- [x] **8. Crear schema Prisma**
  - Archivo: `prisma/schema.prisma`
  - Modelo `Herramienta`: id, nombre, proveedor, categoria?, nivelMaximo?, estado, dpa (default "No aplica"), razonRetiro?, creadoEn, actualizadoEn.
  - `@@unique([nombre, proveedor], name: "nombre_proveedor")`, `@@map("herramientas")`.
  - **Done:** `npx prisma validate` pasa.

- [x] **9. Ejecutar migración inicial**
  - Comando: `npx prisma migrate dev --name init`
  - **Done:** Migración + BD SQLite + Prisma Client generados.

- [x] **10. Crear singleton PrismaClient**
  - Archivo: `src/infrastructure/database/prisma.client.ts`
  - Hot-reload safe con `globalThis`.
  - **Done:** Importable desde `@/infrastructure/database/prisma.client`.

- [x] **11. Crear mapper Prisma → Domain**
  - Archivo: `src/infrastructure/mappers/herramienta.mapper.ts`
  - `toDomain(prismaModel): Herramienta` — convierte Prisma row a entity de dominio.
  - **Done:** Mapea nulls y Date correctamente.

- [x] **12. Crear `PrismaHerramientaRepository` (ADAPTER)**
  - Archivo: `src/infrastructure/repositories/prisma-herramienta.repository.ts`
  - Implementa `IHerramientaRepository`.
  - `findAll(filters?)`: `prisma.herramienta.findMany` + where dinámico + orderBy custom (Activas→Condicionales→Retiradas, nombre ASC). Usa mapper `toDomain()`.
  - `findById(id)`: `prisma.herramienta.findUnique`. Null si no existe.
  - **Done:** Implementa interface. Filtros AND. Orden correcto. Compila.

- [x] **13. Crear composition root (container)**
  - Archivo: `src/infrastructure/container.ts`
  - Exporta handlers pre-instanciados con sus dependencias:
    ```ts
    export const listHerramientasHandler = new ListHerramientasHandler(new PrismaHerramientaRepository());
    export const getHerramientaByIdHandler = new GetHerramientaByIdHandler(new PrismaHerramientaRepository());
    ```
  - **Done:** Pages y API routes importan handlers de aquí sin conocer Infrastructure directamente.

- [x] **14. Crear seed idempotente**
  - Archivo: `prisma/seed.ts`
  - `upsert` con `where: { nombre_proveedor: { nombre, proveedor } }`.
  - Transformaciones: "Activa (condicional)"→"Condicional", "—"→null.
  - `package.json` → `prisma.seed`.
  - **Done:** Ejecuta 2 veces sin duplicar. 31 registros.

---

## Fase 4: Presentation — Validaciones y API routes

- [ ] **15. Crear Zod schemas de validación HTTP**
  - Archivo: `src/presentation/validations/herramienta.validation.ts`
  - `ListHerramientasQuerySchema` (nivel + estado opcionales), `GetHerramientaParamsSchema` (id entero positivo).
  - **Done:** `safeParse` valida correctamente.

- [ ] **16. Implementar GET /api/herramientas**
  - Archivo: `src/app/api/herramientas/route.ts`
  - Thin: Zod parse → import handler de container → `execute(filters)` → JSON response.
  - Errores: 400 descriptivo, 500 `"Error interno del servidor"` + `console.error`.
  - **Done:** 200 (31 items), `?nivel=Publica` (5), `?nivel=Invalido` (400), BD caída (500).

- [ ] **17. Implementar GET /api/herramientas/[id]**
  - Archivo: `src/app/api/herramientas/[id]/route.ts`
  - Thin: Zod parse id → handler.execute(id) → 200/404/400/500.
  - **Done:** `/1`→200, `/999`→404, `/abc`→400.

---

## Fase 5: Presentation — Componentes atómicos

- [ ] **18. Crear `SemaforoIndicator`**
  - Archivo: `src/presentation/components/SemaforoIndicator.tsx`
  - SC. Verde `#86B81C`, amarillo `#F59E0B`, rojo `#DC2626`. Texto + aria-label.
  - **Done:** 3 estados. WCAG AA (no solo color).

- [ ] **19. Crear `NivelBadge`**
  - Archivo: `src/presentation/components/NivelBadge.tsx`
  - SC. Null → gris "Sin clasificar". 4 niveles con color.
  - **Done:** 5 variantes.

- [ ] **20. Crear `EmptyState`**
  - Archivo: `src/presentation/components/EmptyState.tsx`
  - SC. "No hay herramientas registradas actualmente".
  - **Done:** Renderiza mensaje.

- [ ] **21. Crear `ErrorState`**
  - Archivo: `src/presentation/components/ErrorState.tsx`
  - CC. Props: `reset()`. Botón "Reintentar".
  - **Done:** `"use client"`. Mensaje + botón.

- [ ] **22. Crear `BackButton`**
  - Archivo: `src/presentation/components/BackButton.tsx`
  - CC. `Link` a `/catalogo`. Lee `useSearchParams` para preservar `?nivel=`.
  - **Done:** Navega correctamente. Preserva filtro.

- [ ] **23. Crear `FilterBar`**
  - Archivo: `src/presentation/components/FilterBar.tsx`
  - CC. `<label>` + `<select>`. `useSearchParams` + `useRouter`.
  - **Done:** Actualiza URL. "Todos" remueve param. Label accesible.

---

## Fase 6: Presentation — Componentes compuestos

- [ ] **24. Crear `ToolCard`**
  - Archivo: `src/presentation/components/ToolCard.tsx`
  - SC. Props: `HerramientaListItemDto`. Link, SemaforoIndicator, NivelBadge.
  - Retirada → razón inline. Null → "Sin categoría".
  - Card: `rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6`.
  - **Done:** Campos completos. Nulls manejados.

- [ ] **25. Crear `ToolList`**
  - Archivo: `src/presentation/components/ToolList.tsx`
  - SC. Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`. Vacío → EmptyState.
  - **Done:** Grid responsivo. EmptyState en vacío.

---

## Fase 7: Presentation — Páginas

- [ ] **26. Crear `loading.tsx` catálogo**
  - Archivo: `src/app/catalogo/loading.tsx`
  - **Done:** Skeleton visible durante fetch.

- [ ] **27. Crear `error.tsx` catálogo**
  - Archivo: `src/app/catalogo/error.tsx`
  - CC. Renderiza ErrorState con `reset`.
  - **Done:** BD falla → ErrorState, no error críptico.

- [ ] **28. Implementar `CatalogoPage`**
  - Archivo: `src/app/catalogo/page.tsx`
  - SC. Lee `searchParams.nivel`. Importa handler de `@/infrastructure/container`. Renderiza FilterBar + ToolList.
  - `export const metadata = { title: "Catálogo de Herramientas AI — LAG" }`.
  - **Done:** 31 herramientas. Filtro funciona. Metadata correcta. Usa handler (no Prisma directo).

- [ ] **29. Crear `loading.tsx` detalle**
  - Archivo: `src/app/catalogo/[id]/loading.tsx`
  - **Done:** Skeleton visible.

- [ ] **30. Crear `not-found.tsx` detalle**
  - Archivo: `src/app/catalogo/[id]/not-found.tsx`
  - "Herramienta no encontrada" + link a `/catalogo`.
  - **Done:** ID inexistente → not-found.

- [ ] **31. Implementar `ToolDetailPage`**
  - Archivo: `src/app/catalogo/[id]/page.tsx`
  - SC. Valida id. Handler de container. `notFound()` si null.
  - Todos los campos + SemaforoIndicator + NivelBadge + DPA + BackButton.
  - Retirada → banner rojo. DPA "No aplica" → "Información no disponible aún".
  - `generateMetadata` con nombre herramienta.
  - **Done:** Detalle completo. Banner. Not-found. Tab dinámico.

---

## Fase 8: Layout y calidad final

- [ ] **32. Crear layout catálogo**
  - Archivo: `src/app/catalogo/layout.tsx`
  - `max-w-5xl mx-auto px-4 py-8`. Inter.
  - **Done:** Contenedor centrado.

- [ ] **33. Verificar Dependency Rule**
  - Checklist:
    - `src/domain/` → 0 imports de application/infrastructure/presentation ✓
    - `src/application/` → 0 imports de infrastructure/presentation ✓
    - `src/infrastructure/` → 0 imports de presentation (excepto container que exporta) ✓
    - Pages → importan solo de `@/infrastructure/container` y `@/presentation/components/` ✓
  - **Done:** `tsc --noEmit` pasa. Ningún import viola la regla.

- [ ] **34. Verificar accesibilidad (WCAG AA)**
  - aria-labels, labels en forms, contraste ≥4.5:1, no solo color.
  - **Done:** Componentes accesibles.

- [ ] **35. Smoke test de flujo completo**
  - `npx prisma db seed` + `npm run dev`
  - Flujo: `/catalogo` → 31 herramientas (grid 3/2/1 cols) → filtrar "Pública" (5) → "Restringida" (3) → limpiar → detalle activa (DPA, semáforo verde) → volver → detalle retirada (banner rojo, razón) → Odiseo (amarillo, "Sin clasificar") → `/catalogo/999` (not-found)
  - **Done:** Flujo sin errores. Clean Architecture respetada. Datos correctos.

---

## Resumen

| Fase | Tareas | Capa | Duración est. |
|------|--------|------|---------------|
| 1 | 1–4 | Domain | ~2.5h |
| 2 | 5–7 | Application | ~2h |
| 3 | 8–14 | Infrastructure | ~5h |
| 4 | 15–17 | Presentation: API | ~2h |
| 5 | 18–23 | Presentation: componentes atómicos | ~3.5h |
| 6 | 24–25 | Presentation: componentes compuestos | ~1.5h |
| 7 | 26–31 | Presentation: páginas | ~4h |
| 8 | 32–35 | Layout, compliance, a11y, smoke test | ~2.5h |
| **Total** | **35 tareas** | | **~23h** |

---

## Trazabilidad

| Task | Capa | Story |
|------|------|-------|
| 1–4 | Domain | Todas (modelo de negocio) |
| 5–7 | Application | Todas (orquestación) |
| 8–14 | Infrastructure | Todas (persistencia + composición) |
| 15 | Presentation/validación | US-02, US-03 |
| 16 | Presentation/API | US-01, US-02 |
| 17 | Presentation/API | US-03 |
| 18 | Presentation/UI | US-01, US-03, US-04 |
| 19 | Presentation/UI | US-01, US-02 |
| 20 | Presentation/UI | US-01 |
| 21 | Presentation/UI | Todas (error handling) |
| 22 | Presentation/UI | US-03 |
| 23 | Presentation/UI | US-02 |
| 24 | Presentation/UI | US-01, US-05 |
| 25 | Presentation/UI | US-01 |
| 26–27 | Presentation/pages | Todas (UX) |
| 28 | Presentation/pages | US-01, US-02 |
| 29–30 | Presentation/pages | US-03 |
| 31 | Presentation/pages | US-03, US-05 |
| 32 | Layout | Todas |
| 33 | QA | Clean Architecture compliance |
| 34 | QA | US-04 (a11y) |
| 35 | QA | Integración completa |
