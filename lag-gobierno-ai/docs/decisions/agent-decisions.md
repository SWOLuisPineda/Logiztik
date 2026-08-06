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
