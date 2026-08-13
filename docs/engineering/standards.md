# Estándares de Ingeniería

## Stack
- Framework: Next.js 14 (App Router)
- Lenguaje: TypeScript (strict)
- Styling: Tailwind CSS
- ORM: Prisma
- BD Dev: SQLite | BD Staging: PostgreSQL (Neon)
- Validaciones: Zod
- Tests Unit: Vitest
- Tests E2E: Playwright
- CI/CD: GitHub Actions

## Reglas de código
- NO usar `any` — siempre tipos explícitos
- NO instalar deps sin justificación en design.md
- Cada endpoint DEBE tener validación Zod del input
- Cada componente DEBE ser accesible (WCAG AA)
- Commits: Conventional Commits (feat:, fix:, docs:, test:, ci:)

## Estructura de archivos
- API routes: src/app/api/[recurso]/route.ts
- Componentes: src/components/[Nombre].tsx (PascalCase)
- Validaciones: src/lib/validations/[recurso].ts
- Types: src/types/[nombre].ts
- Specs: spec/[feature-name]/

## Patrones
- Server Components por defecto, Client solo con interactividad
- Zod schemas como contrato de input/output
- Error handling: try/catch con NextResponse.json() en route handlers