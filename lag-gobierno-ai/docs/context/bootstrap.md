# Bootstrap — Leer antes de generar cualquier cosa

## Contexto obligatorio (SIEMPRE leer)
1. docs/company/company.md — Empresa, dominio, usuarios
2. docs/company/glossary.md — Términos que deben usarse consistentemente
3. docs/engineering/standards.md — Stack, reglas de código, patrones

## Según tu rol
- BA/PM: + spec/[feature]/vision.md + product-brief.md
- Arquitecto: + spec/[feature]/requirements.md + docs/engineering/standards.md
- Developer: + docs/design/design-system.md + spec/[feature]/design.md + tasks.md
- QA: + spec/[feature]/requirements.md (criterios Gherkin)
- DevOps: + spec/[feature]/design.md (arquitectura) + docs/engineering/standards.md

## Reglas universales
- NO generar código sin que exista un design.md aprobado
- NO inventar términos fuera del glossary.md
- NO modificar archivos en docs/ (fuente de verdad, solo lectura)
- Usar SIEMPRE los colores y componentes de docs/design/design-system.md
- Commits: Conventional Commits (feat:, fix:, docs:, test:, ci:)