# Tasks — Catálogo de Herramientas AI Aprobadas

> Generado desde: design.md (v3 — post 3 revisiones adversariales, 0 bloqueantes)
> Cada tarea es atómica (<2h), ordenada por dependencias.
> Criterio de hecho (Done) explícito en cada una.

---

## Fase 1: Infraestructura y modelo de datos

- [ ] **1. Crear singleton de PrismaClient**
  - Archivo: `src/lib/prisma.ts`
  - Exportar instancia única de PrismaClient con manejo de hot-reload en desarrollo (evitar múltiples instancias en dev con `globalThis`).
  - **Done:** Archivo compila. Import `import { prisma } from "@/lib/prisma"` funciona sin errores.

- [ ] **2. Crear schema Prisma con modelo `Herramienta`**
  - Archivo: `prisma/schema.prisma`
  - Campos: id, nombre, proveedor, categoria (`String?`), nivelMaximo (`String?`), estado, dpa (default "No aplica"), razonRetiro (`String?`), creadoEn, actualizadoEn.
  - Constraint: `@@unique([nombre, proveedor], name: "nombre_proveedor")`.
  - Tabla: `@@map("herramientas")`.
  - Datasource: SQLite para dev.
  - **Done:** `npx prisma validate` pasa sin errores. Campos nullable correctos. Constraint unique con nombre explícito presente.

- [ ] **3. Ejecutar migración inicial**
  - Comando: `npx prisma migrate dev --name init`
  - **Done:** Migración creada en `prisma/migrations/`, BD SQLite generada, Prisma Client regenerado.

- [ ] **4. Crear archivo seed idempotente con las 31 herramientas**
  - Archivo: `prisma/seed.ts`
  - Usar `prisma.herramienta.upsert()` con `where: { nombre_proveedor: { nombre: "...", proveedor: "..." } }`.
  - Transformaciones documentadas en design.md:
    - `"Activa (condicional)"` → `"Condicional"`
    - Categoría `"—"` → `null`
    - Nivel `"—"` → `null`
    - Retiradas: `categoria: null`, `nivelMaximo: null`, `razonRetiro` según fuente
    - DPA: `"No aplica"` para todas
  - Configurar `prisma.seed` en `package.json`.
  - **Done:** `npx prisma db seed` ejecuta sin errores. Se puede ejecutar 2 veces consecutivas sin duplicar. `SELECT COUNT(*) FROM herramientas` retorna 31.

---

## Fase 2: Validaciones y tipos compartidos

- [ ] **5. Crear schemas Zod de validación**
  - Archivo: `src/lib/validations/herramienta.ts`
  - Enums: `NivelClasificacion`, `EstadoHerramienta`, `DpaEstado`.
  - Schemas: `ListHerramientasQuerySchema` (con `nivel` y `estado` opcionales), `GetHerramientaParamsSchema`, `HerramientaSchema` (categoria y nivelMaximo nullable), `HerramientaListItemSchema`, `ListHerramientasResponseSchema`.
  - Tipos exportados: `Herramienta`, `HerramientaListItem`, `ListHerramientasQuery`.
  - **Done:** Archivo compila sin errores TS. Los schemas aceptan `null` para categoria y nivelMaximo. Tipos inferidos son importables.

- [ ] **6. Crear archivo de tipos complementarios**
  - Archivo: `src/types/herramienta.ts`
  - Re-exportar tipos Zod inferidos para uso en componentes.
  - **Done:** Archivo compila. Los tipos son importables desde `@/types/herramienta`.

---

## Fase 3: API endpoints

- [ ] **7. Implementar GET /api/herramientas**
  - Archivo: `src/app/api/herramientas/route.ts`
  - Validar query params `nivel` y `estado` con Zod `safeParse`.
  - Error 400: mensaje descriptivo (ej: "El parámetro 'nivel' debe ser: Publica, Interna, Confidencial o Restringida").
  - Filtrar con Prisma `where` según params (AND si ambos presentes).
  - Ordenar: Activas primero (nombre ASC), luego Condicionales (nombre ASC), luego Retiradas (nombre ASC).
  - Error 500: `{ error: "Error interno del servidor" }` + `console.error` server-side.
  - Retornar `{ data, count }`.
  - **Done:** `GET /api/herramientas` → 200 con 31 items ordenados. `?nivel=Publica` → 5 resultados. `?estado=Retirada` → 4 resultados. `?nivel=Invalido` → 400 con mensaje claro. BD caída → 500 sin exponer detalle.

- [ ] **8. Implementar GET /api/herramientas/[id]**
  - Archivo: `src/app/api/herramientas/[id]/route.ts`
  - Validar param `id` con Zod (entero positivo).
  - Buscar con `prisma.herramienta.findUnique`.
  - Retornar objeto completo incluyendo DPA y timestamps ISO 8601.
  - Errores: 400 (id inválido), 404 ("Herramienta no encontrada"), 500 (genérico).
  - **Done:** `/api/herramientas/1` → 200. `/api/herramientas/999` → 404. `/api/herramientas/abc` → 400. Fallo BD → 500.

---

## Fase 4: Componentes de UI — atómicos

- [ ] **9. Crear componente `SemaforoIndicator`**
  - Archivo: `src/components/SemaforoIndicator.tsx`
  - Server Component. Props: `estado: "Activa" | "Retirada" | "Condicional"`.
  - Colores: verde `#86B81C` (Activa), amarillo `#F59E0B` (Condicional), rojo `#DC2626` (Retirada).
  - Renderizar: círculo de color + texto ("Autorizada" / "Condicional" / "No autorizada") + `aria-label`.
  - **Done:** Renderiza 3 estados. Tiene aria-label descriptivo. No depende solo del color (WCAG AA).

- [ ] **10. Crear componente `NivelBadge`**
  - Archivo: `src/components/NivelBadge.tsx`
  - Server Component. Props: `nivel: string | null`.
  - Si null: badge gris con texto "Sin clasificar".
  - Si valor: badge con color diferenciado (Pública=verde claro, Interna=azul, Confidencial=amarillo, Restringida=rojo).
  - **Done:** Renderiza 5 variantes (4 niveles + null). Compila sin errores.

- [ ] **11. Crear componente `EmptyState`**
  - Archivo: `src/components/EmptyState.tsx`
  - Server Component. Mensaje: "No hay herramientas registradas actualmente".
  - **Done:** Renderiza mensaje. Sin props requeridos.

- [ ] **12. Crear componente `ErrorState`**
  - Archivo: `src/components/ErrorState.tsx`
  - Client Component (`"use client"`). Props: `reset: () => void`.
  - Mensaje: "Ocurrió un error al cargar los datos."
  - Botón "Reintentar" que llama a `reset()`.
  - Es CC porque se usa dentro de `error.tsx` (requerido por Next.js).
  - **Done:** Componente renderiza mensaje + botón. No expone detalles técnicos. Incluye `"use client"`.

- [ ] **13. Crear componente `BackButton`**
  - Archivo: `src/components/BackButton.tsx`
  - Client Component (`"use client"`). Usa `Link` de `next/link` con href a `/catalogo`.
  - Lee `useSearchParams()` para preservar param `nivel` si existe en la URL actual: `/catalogo?nivel=X`.
  - **Done:** Incluye `"use client"`. Renderiza link "Volver al catálogo". Navega a `/catalogo` (no `router.back()`). Preserva nivel si está presente.

- [ ] **14. Crear componente `FilterBar`**
  - Archivo: `src/components/FilterBar.tsx`
  - Client Component (`"use client"`).
  - `<label>` visible: "Filtrar por nivel de clasificación".
  - `<select>` con opciones: "Todos los niveles", Pública, Interna, Confidencial, Restringida.
  - Usa `useSearchParams` + `useRouter` para actualizar/remover query `?nivel=`.
  - **Done:** Seleccionar nivel actualiza URL. "Todos los niveles" remueve param. El select tiene label visible y asociado (`htmlFor`).

---

## Fase 5: Componentes de UI — compuestos

- [ ] **15. Crear componente `ToolCard`**
  - Archivo: `src/components/ToolCard.tsx`
  - Server Component. Props: `HerramientaListItem`.
  - Renderiza: nombre (link a `/catalogo/[id]`), proveedor, `SemaforoIndicator`, `NivelBadge`.
  - Si categoria null: muestra "Sin categoría" en texto secundario.
  - Si estado "Retirada": muestra `razonRetiro` inline con estilo advertencia.
  - Estilo: card según design-system (`rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6`).
  - **Done:** Muestra todos los campos. Link funcional. Maneja nulls sin errores. Card con estilos del design system.

- [ ] **16. Crear componente `ToolList`**
  - Archivo: `src/components/ToolList.tsx`
  - Server Component. Props: `herramientas: HerramientaListItem[]`.
  - Grid responsivo: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`.
  - Si array vacío → renderiza `EmptyState`.
  - **Done:** Renderiza N tarjetas en grid responsivo. Array vacío muestra `EmptyState`. 3 cols en desktop, 2 en tablet, 1 en mobile.

---

## Fase 6: Páginas y error boundaries

- [ ] **17. Crear loading.tsx para catálogo**
  - Archivo: `src/app/catalogo/loading.tsx`
  - Skeleton o spinner que Next.js muestra automáticamente durante fetch.
  - **Done:** Al navegar a `/catalogo`, se muestra skeleton antes del contenido real.

- [ ] **18. Crear error.tsx para catálogo**
  - Archivo: `src/app/catalogo/error.tsx`
  - Client Component (`"use client"`). Recibe prop `reset` de Next.js.
  - Renderiza `ErrorState` pasando `reset`.
  - **Done:** Si Prisma falla, muestra ErrorState con botón reintentar (no error críptico).

- [ ] **19. Implementar página `CatalogoPage`**
  - Archivo: `src/app/catalogo/page.tsx`
  - Server Component. Lee `searchParams.nivel`.
  - Consulta Prisma directamente (NO fetch a API — regla de acceso a datos).
  - Orden: Activas → Condicionales → Retiradas, nombre ASC dentro de cada grupo.
  - Renderiza `FilterBar` + `ToolList`.
  - Metadata: `export const metadata = { title: "Catálogo de Herramientas AI — LAG" }`.
  - **Done:** `/catalogo` muestra 31 herramientas en orden correcto. `?nivel=Publica` filtra. Título del tab correcto. Usa Prisma directo.

- [ ] **20. Crear loading.tsx para detalle**
  - Archivo: `src/app/catalogo/[id]/loading.tsx`
  - Skeleton para la página de detalle.
  - **Done:** Al navegar a `/catalogo/1`, se muestra skeleton durante el fetch.

- [ ] **21. Crear not-found.tsx para detalle**
  - Archivo: `src/app/catalogo/[id]/not-found.tsx`
  - Mensaje: "Herramienta no encontrada" + link a `/catalogo`.
  - **Done:** ID inexistente muestra not-found con link de vuelta.

- [ ] **22. Implementar página `ToolDetailPage`**
  - Archivo: `src/app/catalogo/[id]/page.tsx`
  - Server Component. Lee param `id`. Valida con Zod. Consulta Prisma `findUnique`.
  - Si no existe: `notFound()`.
  - Si existe: muestra todos los campos + `SemaforoIndicator` + `NivelBadge` + DPA + `BackButton`.
  - Si DPA es "No aplica": muestra "Información de DPA no disponible aún".
  - Si retirada: banner rojo "Esta herramienta NO está autorizada para uso en LAG" + razón.
  - Metadata dinámica: `generateMetadata` con nombre de herramienta.
  - **Done:** `/catalogo/1` → detalle completo. Retirada → banner. ID inexistente → not-found. Tab muestra nombre de herramienta.

---

## Fase 7: Layout y calidad final

- [ ] **23. Crear layout del módulo catálogo**
  - Archivo: `src/app/catalogo/layout.tsx`
  - Wrapper: `max-w-5xl mx-auto px-4 py-8`, fondo blanco, tipografía Inter.
  - **Done:** Layout aplica contenedor centrado. Páginas hijas heredan el estilo.

- [ ] **24. Verificar accesibilidad (WCAG AA)**
  - Checklist:
    - `SemaforoIndicator`: aria-label ✓, no solo color ✓
    - `FilterBar`: `<label>` visible asociado al `<select>` ✓
    - `ToolCard`: links con texto descriptivo (nombre de herramienta) ✓
    - `NivelBadge`: texto legible en cada variante ✓
    - Contraste texto/fondo: ratio ≥4.5:1 ✓
    - `ErrorState`: botón reintentar accesible ✓
  - **Done:** Todos los componentes interactivos tienen labels. Colores no son el único canal de información.

- [ ] **25. Smoke test manual de flujo completo**
  - Ejecutar: `npx prisma db seed` + `npm run dev`.
  - Flujo:
    1. `/catalogo` → verificar 31 herramientas en grid responsivo (orden: activas → condicionales → retiradas)
    2. Filtrar "Pública" → 5 resultados (Gemini, Gamma, Perplexity, Meta AI, Grok)
    3. Filtrar "Restringida" → 3 resultados (Sophos MDR, LM Studio, Clonadores de voz)
    4. "Todos los niveles" → 31 herramientas de vuelta
    5. Click en herramienta activa → detalle con DPA ("Información no disponible aún") + semáforo verde
    6. "Volver al catálogo" → regresa a `/catalogo`
    7. Click en herramienta retirada → detalle con banner rojo + razón de retiro
    8. Verificar Odiseo → semáforo amarillo + "Sin clasificar" + "Sin categoría"
  - Edge cases:
    - `/catalogo/999` → not-found.tsx
    - Resize browser → grid adapta columnas (1/2/3)
    - Título del tab muestra "Catálogo de Herramientas AI — LAG"
  - **Done:** Flujo completo sin errores en consola. Datos correctos. Nulls manejados. Grid responsivo. Metadata visible.

---

## Resumen

| Fase | Tareas | Foco | Duración est. |
|------|--------|------|---------------|
| 1 | 1–4 | Infraestructura BD + seed idempotente | ~3.5h |
| 2 | 5–6 | Validaciones Zod + tipos | ~1.5h |
| 3 | 7–8 | API endpoints con error handling | ~2h |
| 4 | 9–14 | Componentes atómicos (SC + CC) | ~5h |
| 5 | 15–16 | Componentes compuestos + grid responsivo | ~2h |
| 6 | 17–22 | Páginas + loading + error + not-found + metadata | ~4.5h |
| 7 | 23–25 | Layout, a11y, smoke test | ~2h |
| **Total** | **25 tareas** | | **~21h** |

---

## Trazabilidad: Tasks → Stories → Hallazgos resueltos

| Task | Cubre Story | Hallazgo adversarial resuelto |
|------|-------------|-------------------------------|
| 1 | Todas (infra) | — |
| 2 | Todas (infra) | v1#2,#3 (nullable), v1#9 (unique con name) , v2#2 (compound key syntax) |
| 3 | Todas (infra) | — |
| 4 | Todas (infra) | v1#1 (transformación estado), v1#2,#3 (nulls), v1#9 (upsert idempotente) |
| 5 | Todas (contratos) | v1#1 (enum Condicional), v1#2,#3 (nullable schemas) |
| 6 | Todas (contratos) | — |
| 7 | US-01, US-02 | v1#8 (filtro estado + orden), v2#8 (AND documentado) |
| 8 | US-03 | v1#4 (error genérico 500) |
| 9 | US-01, US-03, US-04 | — |
| 10 | US-01, US-02 | v1#2,#3 (manejo null → badge gris) |
| 11 | US-01 | — |
| 12 | Todas | v1#4 (error UI), v2#3 (CC por error.tsx) |
| 13 | US-03 | v2#7 (Link no router.back, fallback) |
| 14 | US-02 | v1#5 (label accesible) |
| 15 | US-01, US-05 | v1#3 (null categoria) |
| 16 | US-01 | v2#9 (grid responsivo definido) |
| 17 | Todas | v1#7 (loading state) |
| 18 | Todas | v1#4 (error boundary), v2#3 (CC) |
| 19 | US-01, US-02 | v2#1 (Prisma directo, no API), v3 (metadata) |
| 20 | US-03 | v1#7 (loading state) |
| 21 | US-03 | v1#4 (not found amigable) |
| 22 | US-03, US-05 | v1#6 (DPA placeholder), v3 (generateMetadata) |
| 23 | Todas (presentación) | — |
| 24 | US-04 (a11y) | — |
| 25 | US-01, US-02, US-03 | Integración + validación de todos los hallazgos |
