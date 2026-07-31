# Instrucciones para GitHub Copilot — LAG Gobierno AI

## Contexto del proyecto
ANTES de cualquier generación, consulta:
- docs/context/bootstrap.md (índice de qué leer según rol)
- docs/company/company.md (empresa, dominio, usuarios)
- docs/company/glossary.md (términos consistentes)
- docs/engineering/standards.md (stack: Next.js 14, TypeScript, Prisma, Zod)
- docs/design/design-system.md (colores LAG: Lima #86B81C, tema light)

## Módulo actual
- spec/catalogo-herramientas/vision.md → por qué existe
- spec/catalogo-herramientas/product-brief.md → qué es
- spec/catalogo-herramientas/requirements.md → criterios de aceptación (Gherkin)
- spec/catalogo-herramientas/design.md → arquitectura técnica
- spec/catalogo-herramientas/tasks.md → plan de implementación

## Reglas obligatorias
- NO usar `any` en TypeScript
- NO generar código sin design.md
- Cada endpoint DEBE tener validación Zod
- Usar colores de docs/design/design-system.md (tema light, acento #86B81C)
- Usar términos del glosario — no inventar sinónimos
- Commits: Conventional Commits (feat:, fix:, docs:, test:, ci:)