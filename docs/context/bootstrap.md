# Bootstrap — Leer antes de generar cualquier cosa

## Contexto obligatorio (SIEMPRE leer)
1. docs/company/company.md — Empresa, dominio, usuarios
2. docs/company/glossary.md — Términos consistentes
3. docs/company/catalogo-herramientas-datos.md — 27+4 herramientas con nivel y estado
4. docs/governance/principios.md — Principios de gobierno AI aprobados
5. docs/governance/intake-process.md — Proceso de solicitud de nuevas herramientas
6. docs/governance/clasificacion-datos.md — Niveles y ejemplos
7. docs/engineering/standards.md — Stack, reglas, patrones
8. docs/design/design-system.md — Colores LAG, componentes, accesibilidad

## Según tu rol
- BA/PM: + spec/[feature]/vision.md + product-brief.md
- Arquitecto: + spec/[feature]/requirements.md
- Developer: + docs/design/design-system.md + spec/[feature]/design.md + tasks.md
- QA: + spec/[feature]/requirements.md (criterios Gherkin)
- DevOps: + spec/[feature]/design.md + docs/engineering/standards.md

## Reglas universales
- NO generar código sin design.md aprobado
- NO inventar términos fuera del glossary.md
- NO modificar archivos en docs/ (fuente de verdad, solo lectura)
- Usar SIEMPRE los colores de docs/design/design-system.md
- Commits: Conventional Commits (feat:, fix:, docs:, test:, ci:)