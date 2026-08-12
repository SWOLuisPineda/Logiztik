# Design System — Logiztik Alliance Group (LAG)

> Tema claro (light) con acentos de marca.

## Colores de marca

| Token          | Hex     | Uso                         |
| -------------- | ------- | --------------------------- |
| brand-primary  | #86B81C | CTAs, links, badges activos |
| bg-primary     | #FFFFFF | Fondo principal             |
| text-primary   | #383838 | Texto principal             |
| bg-secondary   | #F5F7F0 | Fondo alternativo           |
| border         | #E2E8E0 | Bordes, separadores         |
| text-secondary | #6B7280 | Labels, placeholders        |
| brand-dark     | #5C8314 | Hover/pressed               |

## Semáforo
- Verde (#86B81C): Activa, puede usarse
- Amarillo (#F59E0B): Activa con restricciones
- Rojo (#DC2626): Retirada

## Componentes Tailwind
- Cards: `rounded-lg bg-white border border-[#E2E8E0] shadow-sm p-6`
- Badges activos: `rounded-full px-3 py-1 text-sm font-medium bg-[#86B81C]/10 text-[#5C8314]`
- Badges retirados: `rounded-full px-3 py-1 text-sm font-medium bg-red-50 text-red-700`
- Botones primarios: `bg-[#86B81C] hover:bg-[#5C8314] text-white rounded-lg px-4 py-2`
- Tablas: header `bg-[#F5F7F0] text-[#383838] font-medium`, rows `border-b border-[#E2E8E0]`

## Tipografía
- Font: "Inter", system-ui, sans-serif
- Headings: 700 weight, #383838
- Body: 400 weight, #383838

## Accesibilidad
- Contraste #383838/#FFFFFF: 10.5:1 ✅
- Lima sobre blanco: 3.4:1 ⚠️ (solo texto grande o botones)
- El tema es LIGHT (claro)