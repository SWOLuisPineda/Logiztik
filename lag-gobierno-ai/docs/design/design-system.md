# Design System — Logiztik Alliance Group (LAG)

> Basado en la identidad visual de LAG. Tema claro (light) con acentos de marca.

## Colores de marca

| Token | Hex | Nombre | Uso |
|-------|-----|--------|-----|
| brand-primary | #86B81C | Lima | Color principal de marca. CTAs, links, highlights, badges activos |
| bg-primary | #FFFFFF | White | Fondo principal de la app |
| text-primary | #383838 | Mine Shaft | Texto principal (alto contraste sobre blanco) |
| bg-secondary | #F5F7F0 | — | Fondo alternativo (derivado claro del Lima, 5% opacidad) |
| surface | #FFFFFF | White | Cards, modales, paneles (con sombra/borde para separar) |
| border | #E2E8E0 | — | Bordes y separadores (gris verdoso sutil) |
| text-secondary | #6B7280 | — | Texto auxiliar, labels, placeholders |
| brand-dark | #5C8314 | — | Hover/pressed del Lima (oscurecido 30%) |

## Colores funcionales (semáforo de herramientas)

| Token | Hex | Uso |
|-------|-----|-----|
| success | #86B81C | Semáforo verde — Herramienta activa (usa el Lima de marca) |
| warning | #F59E0B | Semáforo amarillo — Activa con restricciones |
| error | #DC2626 | Semáforo rojo — Herramienta retirada |

## Tipografía
- Font family: "Inter", system-ui, sans-serif (moderna, legible, amplia disponibilidad)
- Headings: font-weight 700, color #383838
- Body: font-weight 400, color #383838
- Small/labels: font-weight 500, color #6B7280

## Semáforo visual
- 🟢 Verde (#86B81C): Activa, puede usarse para el nivel indicado
- 🟡 Amarillo (#F59E0B): Activa con restricciones (requiere aprobación adicional)
- 🔴 Rojo (#DC2626): Retirada, prohibido su uso

## Componentes Tailwind
- Cards: `rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6`
- Badges activos: `rounded-full px-3 py-1 text-sm font-medium bg-[#86B81C]/10 text-[#5C8314]`
- Badges retirados: `rounded-full px-3 py-1 text-sm font-medium bg-red-50 text-red-700`
- Botones primarios: `bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2 font-medium`
- Botones secundarios: `bg-white border border-[#86B81C] text-[#5C8314] rounded-lg px-4 py-2`
- Tablas: header `bg-[#F5F7F0] text-[#383838] font-medium`, rows `border-b border-[#E2E8E0]`
- Inputs: `border border-[#E2E8E0] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#86B81C]/50`

## Layout
- Max width contenedor: 1200px
- Padding lateral: 24px (mobile) / 48px (desktop)
- Gap entre cards: 16px
- Border radius estándar: 8px (rounded-lg)

## Accesibilidad (WCAG AA)
- Contraste #383838 sobre #FFFFFF: 10.5:1 ✅
- Contraste #86B81C sobre #FFFFFF: 3.4:1 ⚠️ (solo para texto grande o decorativo, no para texto body)
- Contraste #FFFFFF sobre #86B81C (botón): 3.4:1 ⚠️ (usar font-weight 700 para compensar)
- Focus visible: ring de 2px en #86B81C con 50% opacidad
- Navegación completa por teclado
- aria-labels en iconos sin texto visible

## Notas para agentes
- El color Lima (#86B81C) es el ADN visual de LAG — usarlo como acento, no como fondo extenso
- Texto principal SIEMPRE en #383838 sobre fondo blanco (máximo contraste)
- No usar el Lima para texto body (contraste insuficiente) — solo para botones, badges, iconos
- El tema es LIGHT (claro), no dark — refleja la identidad actual de LAG