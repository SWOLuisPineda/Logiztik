# Revisión Adversarial — Cumplimiento de Colores y Design System

> Fecha: 2026-08-11  
> Revisor: Agente Adversarial  
> Referencia normativa: `docs/design/design-system.md`  
> Alcance: Todos los archivos en `src/` + `tailwind.config.ts` + `globals.css` + `layout.tsx`

---

## Hallazgos

- **`globals.css` define `--foreground: #171717`** cuando el design system establece `text-primary: #383838`. El color base de texto del body no corresponde al estándar aprobado. Debe ser `#383838`.

- **`globals.css` incluye un media query `prefers-color-scheme: dark`** con variables oscuras (`#0a0a0a`, `#ededed`). El design system especifica explícitamente que el tema es **LIGHT (claro)**. No debe existir soporte para tema oscuro; ese bloque entero debe eliminarse.

- **`tailwind.config.ts` no centraliza los tokens del design system.** Solo define `background` y `foreground` como custom properties genéricas. Los 7 tokens de marca (`brand-primary`, `bg-primary`, `text-primary`, `bg-secondary`, `border`, `text-secondary`, `brand-dark`) y los 3 del semáforo deberían estar definidos aquí como extensiones del tema. Esto provoca que cada componente repita valores hexadecimales en crudo — un cambio de marca requeriría tocar decenas de archivos.

- **`layout.tsx` carga la fuente "Geist"** (`GeistVF.woff`, `GeistMonoVF.woff`). El design system establece `"Inter", system-ui, sans-serif`. La fuente está mal en toda la aplicación.

- **`layout.tsx` declara `lang="en"`** en el tag `<html>`. La aplicación está en español y el atributo debe ser `lang="es"`. Esto afecta accesibilidad (lectores de pantalla pronuncian contenido como si fuera inglés).

- **`NivelBadge.tsx` usa colores no definidos en el design system**: `bg-blue-50`, `text-blue-700` (nivel "Interna"), `bg-amber-50`, `text-amber-700` (nivel "Confidencial"), `bg-gray-100`, `text-gray-500` ("Sin clasificar"). Ninguno de estos valores existe en la paleta aprobada. El design system solo define 7 tokens + 3 del semáforo. Si se necesitan colores adicionales para niveles, deben documentarse primero en `design-system.md`.

- **`SemaforoIndicator.tsx` — el estado "Condicional" usa `bg: "bg-amber-50"` (Tailwind genérico)** mientras que "Activa" usa `bg-[#86B81C]/10` (token explícito). Inconsistencia: si el amarillo del semáforo es `#F59E0B`, el fondo debería ser `bg-[#F59E0B]/10` para mantener el mismo patrón.

- **`BackButton.tsx` invierte la jerarquía de colores hover/base.** Usa `text-[#5C8314]` (brand-dark) como color base y `hover:text-[#86B81C]` (brand-primary) como hover. El design system define `brand-dark: #5C8314` como "Hover/pressed" y `brand-primary: #86B81C` como color principal. Debe ser al revés: base `#86B81C`, hover `#5C8314`.

- **`ToolCard.tsx` usa `text-[#E2E8E0]` para el separador "·"**. El token `#E2E8E0` está definido como color de `border` (bordes, separadores), no como color de texto. Aplicar un color de borde como texto crea un contraste pésimo contra fondo blanco (ratio ~1.5:1). Debería usar `text-[#6B7280]` (text-secondary) o un carácter separador con el color adecuado.

- **Colores hardcodeados en todos los componentes sin centralización.** Cada archivo repite `#86B81C`, `#383838`, `#6B7280`, `#E2E8E0`, `#5C8314`, `#DC2626` directamente en las clases Tailwind. Si la marca LAG ajusta un solo color, hay que modificar 8+ archivos manualmente. Esto es un anti-patrón de mantenibilidad. Los colores deben centralizarse en `tailwind.config.ts` como tokens semánticos.

- **`ErrorState.tsx` usa `text-red-300`** para el icono SVG. Este valor no existe en el design system. El rojo aprobado es `#DC2626`. Debería usarse `text-[#DC2626]` o su variante con opacidad para iconos decorativos.

- **`not-found.tsx` y `EmptyState.tsx` usan `text-gray-300`** para iconos decorativos. El gris genérico de Tailwind no está en la paleta aprobada. Debe usarse `text-[#E2E8E0]` (border/separadores) o `text-[#6B7280]` (text-secondary) según la intención visual.

- **`layout.tsx` metadata dice "Create Next App"** — no es un hallazgo de color pero evidencia que la configuración base no fue personalizada. Debe reflejar "Catálogo AI — LAG" o similar.

---

## Resumen de acciones correctivas

| # | Archivo | Acción |
|---|---------|--------|
| 1 | `globals.css` | Cambiar `--foreground` a `#383838`. Eliminar bloque `prefers-color-scheme: dark`. |
| 2 | `tailwind.config.ts` | Agregar todos los tokens del design system como colores extendidos (`brand`, `brand-dark`, `surface`, `border-lag`, `text-primary`, `text-secondary`, semáforo). |
| 3 | `layout.tsx` | Reemplazar fuente Geist por Inter. Cambiar `lang="en"` a `lang="es"`. Actualizar metadata. |
| 4 | `BackButton.tsx` | Invertir colores: base `text-[#86B81C]`, hover `text-[#5C8314]`. |
| 5 | `ToolCard.tsx` | Cambiar `text-[#E2E8E0]` del separador a `text-[#6B7280]`. |
| 6 | `SemaforoIndicator.tsx` | Cambiar `bg-amber-50` a `bg-[#F59E0B]/10` para consistencia con el patrón de los otros estados. |
| 7 | `NivelBadge.tsx` | Documentar colores adicionales en design-system.md O reemplazarlos con tokens existentes + opacidad. |
| 8 | `ErrorState.tsx` | Cambiar `text-red-300` a un valor del design system (e.g. `text-[#DC2626]/30`). |
| 9 | `not-found.tsx`, `EmptyState.tsx` | Cambiar `text-gray-300` a `text-[#E2E8E0]` o `text-[#6B7280]`. |
| 10 | Todos los componentes | Una vez centralizado en tailwind.config.ts, migrar de `text-[#383838]` a `text-primary`, de `bg-[#86B81C]` a `bg-brand`, etc. |

---

## Prioridad sugerida

1. **Crítico (rompe contrato de marca):** Items 1, 3-fuente, 4, 5
2. **Alto (inconsistencia visual):** Items 2, 6, 7, 8, 9
3. **Medio (deuda técnica):** Items 3-metadata, 10
