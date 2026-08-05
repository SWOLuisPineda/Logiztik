# Tasks — Catálogo de Herramientas AI Aprobadas

> Generado desde: design.md (Clean Architecture — 4 capas)
> Cada tarea es atómica (<2h), ordenada por dependencias (capas internas primero).
> Criterio de hecho (Done) explícito en cada una.

---

## Fase 1: Domain Layer (cero dependencias externas)

- [ ] **1. Crear value objects del dominio**
  - Archivos:
    - `src/domain/herramienta/value-objects/nivel-clasificacion.vo.ts`
    - `src/domain/herramienta/value-objects/estado-herramienta.vo.ts`
  - Exportar types: `NivelClasificacion = "Publica" | "Interna" | "Confidencial" | "Restringida"` y `EstadoHerramienta = "Activa" | "Retirada" | "Condicional"`.
  - Exportar constantes array para iteración: `NIVELES`, `ESTADOS`.
  - **Done:** Archivos compilan. NO importan ningún paquete externo (ni Zod, ni Prisma). Los types son importables desde `@/domain/herramienta/value-objects/`.

- [ ] **2. Crear entidad `Herramienta` con factory method**
  - Archivo: `src/domain/herramienta/herramienta.entity.ts`
  - Clase con constructor privado + `static create(props): Herramienta`.
  - Props: id, nombre, proveedor, categoria (nullable), nivelMaximo (nullable), estado, dpa, razonRetiro (nullable), creadoEn, actualizadoEn.
  - Getters para cada campo. Computed: `estaRetirada`, `esCondicional`.
  - **Done:** Compila. NO importa nada externo. Factory method crea instancia correctamente. Getters retornan valores.

- [ ] **3. Crear interface de repositorio (PORT)**
  - Archivo: `src/domain/herramienta/herramienta.repository.ts`
  - Interface `IHerramientaRepository` con:
    - `findAll(filters?: HerramientaFilters): Promise<Herramienta[]>`
    - `findById(id: number): Promise<Herramienta | null>`
  - Type `HerramientaFilters = { nivelMaximo?: NivelClasificacion; estado?: EstadoHerramienta }`.
  - **Done:** Compila. Solo importa de `./herramienta.entity` y `./value-objects/`. Cero deps externas.

- [ ] **4. Crear errores tipados del dominio**
  - Archivo: `src/domain/herramienta/herramienta.errors.ts`
  - Exportar: `HerramientaNotFoundError`, `NivelInvalidoError`.
  - Cada error extiende Error con `code` y `description`.
  - **Done:** Compila. Errores tienen `name`, `code` y `message` descriptivos.

---

## Fase 2: Application Layer (depende solo de Domain)

- [ ] **5. Crear DTOs de response**
  - Archivos:
    - `src/application/herramientas/dtos/herramienta-list-item.dto.ts`
    - `src/application/herramientas/dtos/herramienta-detail.dto.ts`
  - `HerramientaListItemDto`: id, nombre, proveedor, categoria, nivelMaximo, estado, razonRetiro.
  - `HerramientaDetailDto`: extiende list item + dpa, creadoEn (ISO), actualizadoEn (ISO).
  - **Done:** Compilan. Son interfaces planas (serializables). No importan de Infrastructure ni Presentation.

- [ ] **6. Crear `ListHerramientasHandler` (query)**
  - Archivo: `src/application/herramientas/queries/list-herramientas.handler.ts`
  - Recibe `IHerramientaRepository` por constructor (DI).
  - Método `execute(filters?)`: llama `repository.findAll(filters)`, mapea entidades → DTOs, retorna `{ data, count }`.
  - Orden: Activas (nombre ASC) → Condicionales → Retiradas (lógica en el handler o delegada al repo).
  - **Done:** Compila. Solo importa de `@/domain/`. Retorna `{ data: HerramientaListItemDto[], count: number }`.

- [ ] **7. Crear `GetHerramientaByIdHandler` (query)**
  - Archivo: `src/application/herramientas/queries/get-herramienta-by-id.handler.ts`
  - Recibe `IHerramientaRepository` por constructor.
  - Método `execute(id: number)`: llama `repository.findById(id)`, retorna `HerramientaDetailDto | null`.
  - **Done:** Compila. Retorna null si no existe (el caller decide qué hacer). Solo importa de `@/domain/` y `../dtos/`.

---

## Fase 3: Infrastructure Layer (implementa PORTs)

- [ ] **8. Crear schema Prisma con modelo `Herramienta`**
  - Archivo: `prisma/schema.prisma`
  - Campos: id, nombre, proveedor, categoria (`String?`), nivelMaximo (`String?`), estado, dpa (default "No aplica"), razonRetiro (`String?`), creadoEn, actualizadoEn.
  - Constraint: `@@unique([nombre, proveedor], name: "nombre_proveedor")`.
  - Datasource: SQLite para dev.
  - **Done:** `npx prisma validate` pasa. Campos nullable correctos. Constraint con nombre explícito.

- [ ] **9. Ejecutar migración inicial**
  - Comando: `npx prisma migrate dev --name init`
  - **Done:** Migración creada. BD SQLite generada. Prisma Client regenerado.

- [ ] **10. Crear singleton de PrismaClient**
  - Archivo: `src/infrastructure/database/prisma.client.ts`
  - Exportar instancia única con manejo de hot-reload (`globalThis`).
  - **Done:** Importable desde `@/infrastructure/database/prisma.client`.

- [ ] **11. Crear mapper Prisma → Domain Entity**
  - Archivo: `src/infrastructure/mappers/herramienta.mapper.ts`
  - Función `toDomain(prismaModel): Herramienta` — convierte el model de Prisma a la entidad de dominio.
  - Función `toListItemDto(entity): HerramientaListItemDto` — convierte entidad a DTO de listado.
  - Función `toDetailDto(entity): HerramientaDetailDto` — convierte entidad a DTO de detalle (timestamps → ISO string).
  - **Done:** Compila. Mapea correctamente nulls y tipos Date → string ISO.

- [ ] **12. Crear `PrismaHerramientaRepository` (ADAPTER)**
  - Archivo: `src/infrastructure/repositories/prisma-herramienta.repository.ts`
  - Implementa `IHerramientaRepository`.
  - `findAll(filters?)`: Prisma `findMany` con `where` dinámico + `orderBy` (estado custom sort + nombre ASC). Mapea resultado con `herramientaMapper.toDomain()`.
  - `findById(id)`: Prisma `findUnique`. Retorna null si no existe.
  - **Done:** Implementa la interface. Filtros AND si ambos params presentes. Orden: Activas → Condicionales → Retiradas.

- [ ] **13. Crear archivo seed idempotente**
  - Archivo: `prisma/seed.ts`
  - `upsert` con `where: { nombre_proveedor: { nombre, proveedor } }`.
  - Transformaciones: "Activa (condicional)" → "Condicional", "—" → null.
  - Configurar `prisma.seed` en `package.json`.
  - **Done:** `npx prisma db seed` ejecuta 2 veces sin duplicar. 31 registros.

---

## Fase 4: Presentation Layer — Validaciones y API

- [ ] **14. Crear Zod schemas de validación HTTP**
  - Archivo: `src/presentation/validations/herramienta.validation.ts`
  - `ListHerramientasQuerySchema` (nivel + estado opcionales), `GetHerramientaParamsSchema` (id entero positivo).
  - **Done:** Compila. `safeParse` valida correctamente params válidos e inválidos.

- [ ] **15. Implementar GET /api/herramientas**
  - Archivo: `src/presentation/api/herramientas/route.ts` (o `src/app/api/herramientas/route.ts` con re-export)
  - Thin: parsea query params con Zod → instancia handler con repo → llama `execute(filters)` → retorna JSON.
  - Errores: 400 descriptivo, 500 genérico (`"Error interno del servidor"`), `console.error` server-side.
  - **Done:** `GET /api/herramientas` → 200 (31 items). `?nivel=Publica` → 5. `?nivel=Invalido` → 400. BD caída → 500.

- [ ] **16. Implementar GET /api/herramientas/[id]**
  - Archivo: `src/presentation/api/herramientas/[id]/route.ts`
  - Thin: valida id con Zod → handler.execute(id) → 200 o 404 o 400 o 500.
  - **Done:** `/1` → 200 completo. `/999` → 404. `/abc` → 400.

---

## Fase 5: Presentation Layer — Componentes atómicos

- [ ] **17. Crear componente `SemaforoIndicator`**
  - Archivo: `src/presentation/components/SemaforoIndicator.tsx`
  - Server Component. Props: `estado: EstadoHerramienta`.
  - Colores: verde `#86B81C`, amarillo `#F59E0B`, rojo `#DC2626`. Texto + aria-label.
  - **Done:** 3 estados renderizados. WCAG AA (no solo color).

- [ ] **18. Crear componente `NivelBadge`**
  - Archivo: `src/presentation/components/NivelBadge.tsx`
  - Server Component. Props: `nivel: string | null`.
  - Null → badge gris "Sin clasificar". 4 niveles con color diferenciado.
  - **Done:** 5 variantes (4 niveles + null).

- [ ] **19. Crear componente `EmptyState`**
  - Archivo: `src/presentation/components/EmptyState.tsx`
  - Mensaje: "No hay herramientas registradas actualmente".
  - **Done:** Renderiza mensaje.

- [ ] **20. Crear componente `ErrorState`**
  - Archivo: `src/presentation/components/ErrorState.tsx`
  - Client Component. Props: `reset: () => void`. Botón "Reintentar".
  - **Done:** Incluye `"use client"`. Renderiza mensaje + botón.

- [ ] **21. Crear componente `BackButton`**
  - Archivo: `src/presentation/components/BackButton.tsx`
  - Client Component. `Link` a `/catalogo` (no `router.back()`). Preserva `?nivel=` si presente.
  - **Done:** Navega a `/catalogo`. Preserva filtro.

- [ ] **22. Crear componente `FilterBar`**
  - Archivo: `src/presentation/components/FilterBar.tsx`
  - Client Component. `<label>` + `<select>` con opciones de nivel.
  - `useSearchParams` + `useRouter` para actualizar URL.
  - **Done:** Seleccionar nivel actualiza URL. "Todos" remueve param. Label accesible.

---

## Fase 6: Presentation Layer — Componentes compuestos

- [ ] **23. Crear componente `ToolCard`**
  - Archivo: `src/presentation/components/ToolCard.tsx`
  - Server Component. Props: `HerramientaListItemDto`.
  - Renderiza: nombre (link a `/catalogo/[id]`), proveedor, `SemaforoIndicator`, `NivelBadge`.
  - Retirada → razón inline. Null categoria → "Sin categoría".
  - Card: `rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6`.
  - **Done:** Campos completos. Link funcional. Nulls manejados.

- [ ] **24. Crear componente `ToolList`**
  - Archivo: `src/presentation/components/ToolList.tsx`
  - Server Component. Props: `HerramientaListItemDto[]`.
  - Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`.
  - Array vacío → `EmptyState`.
  - **Done:** Grid responsivo. EmptyState en vacío.

---

## Fase 7: Presentation Layer — Páginas

- [ ] **25. Crear loading.tsx para catálogo**
  - Archivo: `src/app/catalogo/loading.tsx`
  - Skeleton/spinner.
  - **Done:** Se muestra durante fetch.

- [ ] **26. Crear error.tsx para catálogo**
  - Archivo: `src/app/catalogo/error.tsx`
  - Client Component. Renderiza `ErrorState` con `reset`.
  - **Done:** BD falla → ErrorState visible, no error críptico.

- [ ] **27. Implementar página `CatalogoPage`**
  - Archivo: `src/app/catalogo/page.tsx`
  - Server Component. Lee `searchParams.nivel`.
  - Instancia `ListHerramientasHandler` con `PrismaHerramientaRepository` (composición en la page).
  - Renderiza `FilterBar` + `ToolList`.
  - `export const metadata = { title: "Catálogo de Herramientas AI — LAG" }`.
  - **Done:** `/catalogo` → 31 herramientas. `?nivel=Publica` → 5. Metadata correcta. Usa handler (no Prisma directo).

- [ ] **28. Crear loading.tsx para detalle**
  - Archivo: `src/app/catalogo/[id]/loading.tsx`
  - **Done:** Skeleton visible durante fetch.

- [ ] **29. Crear not-found.tsx para detalle**
  - Archivo: `src/app/catalogo/[id]/not-found.tsx`
  - "Herramienta no encontrada" + link a `/catalogo`.
  - **Done:** ID inexistente → not-found.

- [ ] **30. Implementar página `ToolDetailPage`**
  - Archivo: `src/app/catalogo/[id]/page.tsx`
  - Server Component. Valida `id`. Instancia `GetHerramientaByIdHandler`.
  - Si null → `notFound()`. Si existe → todos los campos + `SemaforoIndicator` + `NivelBadge` + DPA + `BackButton`.
  - Retirada → banner rojo. DPA "No aplica" → "Información no disponible aún".
  - `generateMetadata` dinámica.
  - **Done:** Detalle completo. Banner rojo en retiradas. Not-found para inexistentes. Tab muestra nombre.

---

## Fase 8: Layout y calidad final

- [ ] **31. Crear layout del módulo catálogo**
  - Archivo: `src/app/catalogo/layout.tsx`
  - `max-w-5xl mx-auto px-4 py-8`, fondo blanco, Inter.
  - **Done:** Contenedor centrado. Hijas heredan estilo.

- [ ] **32. Verificar accesibilidad (WCAG AA)**
  - Checklist: aria-labels, labels en forms, contraste ≥4.5:1, no solo color.
  - **Done:** Todos los componentes interactivos accesibles.

- [ ] **33. Verificar Dependency Rule**
  - Checklist:
    - `src/domain/` no importa de application, infrastructure, ni presentation ✓
    - `src/application/` no importa de infrastructure ni presentation ✓
    - `src/infrastructure/` no importa de presentation ✓
    - `src/presentation/` importa de application (handlers) e infrastructure (repo para DI) ✓
  - **Done:** Ningún import viola la dependency rule. `tsc --noEmit` pasa.

- [ ] **34. Smoke test manual de flujo completo**
  - `npx prisma db seed` + `npm run dev`
  - Flujo: `/catalogo` → filtrar → detalle → volver → retirada con banner → Odiseo con semáforo amarillo + "Sin clasificar"
  - Edge: `/catalogo/999` → not-found. Grid responsivo (1/2/3 cols).
  - **Done:** Flujo sin errores. Clean Architecture respetada. Datos correctos.

---

## Resumen

| Fase | Tareas | Capa | Duración est. |
|------|--------|------|---------------|
| 1 | 1–4 | Domain | ~3h |
| 2 | 5–7 | Application | ~2.5h |
| 3 | 8–13 | Infrastructure (BD + repo + seed) | ~4.5h |
| 4 | 14–16 | Presentation: API + validaciones | ~2.5h |
| 5 | 17–22 | Presentation: componentes atómicos | ~4h |
| 6 | 23–24 | Presentation: componentes compuestos | ~1.5h |
| 7 | 25–30 | Presentation: páginas + error boundaries | ~4h |
| 8 | 31–34 | Layout, a11y, dependency rule, smoke test | ~2.5h |
| **Total** | **34 tareas** | | **~25h** |

---

## Trazabilidad: Tasks → Capas → Stories

| Task | Capa | Cubre Story |
|------|------|-------------|
| 1–4 | Domain | Todas (modelo de negocio) |
| 5–7 | Application | Todas (orquestación) |
| 8–13 | Infrastructure | Todas (persistencia) |
| 14 | Presentation (validación) | US-02, US-03 |
| 15 | Presentation (API) | US-01, US-02 |
| 16 | Presentation (API) | US-03 |
| 17 | Presentation (UI) | US-01, US-03, US-04 |
| 18 | Presentation (UI) | US-01, US-02 |
| 19 | Presentation (UI) | US-01 |
| 20 | Presentation (UI) | Todas (error handling) |
| 21 | Presentation (UI) | US-03 |
| 22 | Presentation (UI) | US-02 |
| 23 | Presentation (UI) | US-01, US-05 |
| 24 | Presentation (UI) | US-01 |
| 25–26 | Presentation (pages) | Todas (UX loading/error) |
| 27 | Presentation (pages) | US-01, US-02 |
| 28–29 | Presentation (pages) | US-03 |
| 30 | Presentation (pages) | US-03, US-05 |
| 31 | Presentation (layout) | Todas |
| 32 | QA | US-04 (a11y) |
| 33 | QA | Clean Architecture compliance |
| 34 | QA | Integración completa |
