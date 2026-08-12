# Requirements — Catálogo de Herramientas AI Aprobadas

> Fuente: Eventos de dominio del catálogo + datos reales LAG.
> Formato: User Stories con criterios de aceptación Gherkin.
> Priorización: MoSCoW (Must Have = MVP del taller, Should/Could = Backlog)

---

## Eventos de Dominio (Event Storming)

| # | Evento (pasado) | Comando | Actor |
|---|---|---|---|
| 1 | `CatalogoAccedido` | Acceder al catálogo | Empleado |
| 2 | `HerramientasListadas` | Listar herramientas | Sistema |
| 3 | `FiltroDeNivelAplicado` | Filtrar por nivel de clasificación | Empleado |
| 4 | `HerramientasFiltradas` | Buscar herramientas por nivel | Sistema |
| 5 | `FiltroLimpiado` | Limpiar filtros | Empleado |
| 6 | `DetalleDeHerramientaConsultado` | Consultar detalle de herramienta | Empleado |
| 7 | `EstadoDPAVerificado` | Verificar estado de DPA | Sistema |
| 8 | `SemaforoMostrado` | Mostrar semáforo de uso | Sistema |
| 9 | `HerramientaRetiradaIdentificada` | Identificar herramienta no autorizada | Empleado |
| 10 | `NavegacionAlCatalogoRealizada` | Volver al catálogo | Empleado |

---

## Stories Principales (Must Have — MVP)

---

### US-01: Consultar el catálogo completo de herramientas

**Prioridad:** Must Have

**User Story:** Como *empleado de LAG*, quiero *ver el listado completo de herramientas AI autorizadas y retiradas* para *saber qué herramientas puedo usar sin violar políticas de gobierno AI.*

**Eventos asociados:** `CatalogoAccedido` → `HerramientasListadas`

#### Criterios de Aceptación

```gherkin
Feature: Consultar catálogo completo de herramientas AI

  Scenario: Empleado visualiza las herramientas autorizadas
    Given el empleado accede al catálogo de herramientas AI
    When la vista se carga completamente
    Then se muestran las 27 herramientas con estado "Activa"
    And cada herramienta muestra: nombre, proveedor, categoría, nivel máximo y estado
    And las herramientas se presentan con semáforo visual (verde = Activa, rojo = Retirada)

  Scenario: Empleado visualiza las herramientas retiradas
    Given el empleado accede al catálogo de herramientas AI
    When filtra o navega a la sección de herramientas retiradas
    Then se muestran las 4 herramientas retiradas
    And cada herramienta retirada muestra: nombre, proveedor y razón de retiro
    And se indica visualmente con semáforo rojo que no deben usarse

  Scenario: Catálogo vacío o sin datos
    Given el empleado accede al catálogo de herramientas AI
    When no existen herramientas registradas en el sistema
    Then se muestra un mensaje informativo "No hay herramientas registradas actualmente"
    And no se muestran errores de sistema
```

---

### US-02: Filtrar herramientas por nivel de datos permitido

**Prioridad:** Must Have

**User Story:** Como *empleado de LAG*, quiero *filtrar las herramientas autorizadas por nivel de clasificación de datos (Pública, Interna, Confidencial, Restringida)* para *identificar rápidamente cuáles puedo usar según la sensibilidad de la información que voy a procesar.*

**Eventos asociados:** `FiltroDeNivelAplicado` → `HerramientasFiltradas` → `FiltroLimpiado`

#### Criterios de Aceptación

```gherkin
Feature: Filtrar herramientas por nivel de clasificación de datos

  Scenario: Empleado filtra por nivel "Pública"
    Given el empleado está en el catálogo de herramientas AI
    When selecciona el filtro de nivel "Pública"
    Then se muestran únicamente las herramientas con nivel máximo "Pública"
    And los resultados incluyen: Gemini, Gamma, Perplexity, Meta AI (WhatsApp), Grok
    And el conteo de resultados refleja la cantidad filtrada

  Scenario: Empleado filtra por nivel "Restringida"
    Given el empleado está en el catálogo de herramientas AI
    When selecciona el filtro de nivel "Restringida"
    Then se muestran únicamente las herramientas con nivel máximo "Restringida"
    And los resultados incluyen: Agentes IA Seguridad (Sophos MDR), LM Studio, Clonadores de voz
    And se muestra indicador visual amarillo/rojo de precaución por la sensibilidad del dato

  Scenario: Empleado entiende la lógica del nivel máximo
    Given el empleado filtra por nivel "Confidencial"
    When visualiza los resultados
    Then se muestran herramientas aprobadas hasta nivel Confidencial
    And se muestra una nota explicativa: "Estas herramientas pueden procesar datos hasta nivel Confidencial"

  Scenario: Empleado limpia los filtros
    Given el empleado tiene un filtro de nivel activo
    When selecciona "Todos los niveles" o limpia el filtro
    Then se muestran todas las herramientas autorizadas sin restricción de nivel

  Scenario: Filtro se preserva en la URL
    Given el empleado filtra por nivel "Confidencial"
    When copia la URL y la comparte con un colega
    Then el colega ve el catálogo filtrado por nivel "Confidencial"
    And el navegador mantiene el filtro al usar atrás/adelante
```

---

### US-03: Ver detalle de una herramienta

**Prioridad:** Must Have

**User Story:** Como *empleado de LAG*, quiero *ver el detalle completo de una herramienta (nombre, proveedor, nivel máximo de datos, y estado de DPA)* para *tomar una decisión informada sobre si puedo usarla con el tipo de dato que voy a procesar.*

**Eventos asociados:** `DetalleDeHerramientaConsultado` → `EstadoDPAVerificado` → `SemaforoMostrado` → `NavegacionAlCatalogoRealizada`

#### Criterios de Aceptación

```gherkin
Feature: Ver detalle de una herramienta AI

  Scenario: Empleado consulta detalle de herramienta activa
    Given el empleado está en el catálogo de herramientas AI
    When selecciona la herramienta "GitHub Copilot"
    Then se muestra la vista de detalle con:
      | Campo         | Valor              |
      | Nombre        | GitHub Copilot     |
      | Proveedor     | Microsoft / GitHub |
      | Categoría     | Desarrollo         |
      | Nivel máximo  | Confidencial       |
      | Estado        | Activa             |
      | DPA           | Vigente / No aplica / Pendiente |
    And se muestra el semáforo correspondiente al estado (verde para Activa)

  Scenario: Empleado consulta detalle de herramienta retirada
    Given el empleado está en el catálogo de herramientas AI
    When selecciona la herramienta "DeepSeek"
    Then se muestra la vista de detalle con:
      | Campo           | Valor                              |
      | Nombre          | DeepSeek                           |
      | Proveedor       | DeepSeek                           |
      | Estado          | Retirada                           |
      | Razón de retiro | Bloqueado por firewall corporativo |
    And se muestra semáforo rojo
    And se incluye mensaje: "Esta herramienta NO está autorizada para uso en LAG"

  Scenario: Empleado navega de vuelta al catálogo
    Given el empleado está en la vista de detalle de una herramienta
    When selecciona "Volver al catálogo"
    Then regresa a la vista de listado manteniendo los filtros previamente aplicados
```

---

## Stories Secundarias (Should Have / Could Have — Backlog)

---

### US-04: Visualizar semáforo de uso según estado de la herramienta

**Prioridad:** Should Have
**Nota:** Backlog — Fuera de MVP (el semáforo básico se incluye en US-01/US-03, pero la lógica extendida por nivel del dato del empleado es post-MVP)

**User Story:** Como *empleado de LAG*, quiero *ver un semáforo visual claro (verde/amarillo/rojo) en cada herramienta que refleje si puedo usarla con seguridad* para *decidir en menos de 5 segundos si una herramienta es apta para mi caso de uso sin leer toda la política.*

**Eventos asociados:** `SemaforoMostrado` → `HerramientaRetiradaIdentificada`

#### Criterios de Aceptación

```gherkin
Feature: Semáforo visual de uso por herramienta

  Scenario: Herramienta activa muestra semáforo verde
    Given el empleado visualiza una herramienta con estado "Activa"
    When el semáforo se renderiza
    Then se muestra un indicador verde con texto "Autorizada"
    And el indicador tiene aria-label descriptivo para lectores de pantalla
    And no depende solo del color para transmitir la información (incluye icono + texto)

  Scenario: Herramienta condicional muestra semáforo amarillo
    Given el empleado visualiza la herramienta "Odiseo" con estado "Activa (condicional)"
    When el semáforo se renderiza
    Then se muestra un indicador amarillo con texto "Condicional"
    And se incluye tooltip o nota: "Uso permitido con restricciones. Verificar condiciones."

  Scenario: Herramienta retirada muestra semáforo rojo
    Given el empleado visualiza una herramienta con estado "Retirada"
    When el semáforo se renderiza
    Then se muestra un indicador rojo con texto "No autorizada"
    And se muestra la razón de retiro visible sin necesidad de click adicional
```

---

### US-05: Ver herramientas retiradas con su razón de retiro

**Prioridad:** Should Have
**Nota:** Backlog — Fuera de MVP (las retiradas aparecen en el listado general de US-01, pero una vista dedicada es post-MVP)

**User Story:** Como *empleado de LAG*, quiero *ver un listado específico de herramientas retiradas junto con la razón por la que fueron retiradas* para *entender por qué no debo usarlas y evitar solicitar su re-evaluación innecesariamente.*

**Eventos asociados:** `HerramientaRetiradaIdentificada` → `HerramientasListadas`

#### Criterios de Aceptación

```gherkin
Feature: Listado de herramientas retiradas con razón de retiro

  Scenario: Empleado consulta las herramientas retiradas
    Given el empleado accede al catálogo de herramientas AI
    When aplica un filtro o navega a "Herramientas retiradas"
    Then se muestran las 4 herramientas retiradas:
      | Herramienta       | Proveedor           | Razón de retiro                    |
      | Windsurf / Cursor | Codeium / Anysphere | Sin uso activo registrado          |
      | App Q             | App Q               | Descontinuado                      |
      | Notion AI         | Notion              | Reemplazado por OneNote            |
      | DeepSeek          | DeepSeek            | Bloqueado por firewall corporativo |
    And todas muestran semáforo rojo

  Scenario: Herramienta retirada muestra mensaje de advertencia
    Given el empleado visualiza una herramienta retirada en el listado
    When lee la información de la herramienta
    Then se muestra un banner o aviso: "Esta herramienta NO está autorizada. No la utilice con datos de LAG."
    And la razón de retiro es visible sin necesidad de navegar al detalle
```

---

### US-06: Buscar herramienta por nombre o proveedor

**Prioridad:** Could Have
**Nota:** Backlog — Fuera de MVP

**User Story:** Como *empleado de LAG*, quiero *buscar una herramienta por nombre o proveedor escribiendo en un campo de texto* para *encontrar rápidamente una herramienta específica sin recorrer todo el listado cuando ya sé qué estoy buscando.*

**Eventos asociados:** (nuevo) `BusquedaRealizada` → `HerramientasFiltradas`

#### Criterios de Aceptación

```gherkin
Feature: Buscar herramienta por nombre o proveedor

  Scenario: Empleado busca por nombre exacto
    Given el empleado está en el catálogo de herramientas AI
    When escribe "Copilot" en el campo de búsqueda
    Then se muestran las herramientas que contienen "Copilot" en su nombre:
      | Herramienta            | Proveedor          |
      | GitHub Copilot         | Microsoft / GitHub |
      | Microsoft Copilot Chat | Microsoft          |
    And los resultados se actualizan en tiempo real (sin recargar página)

  Scenario: Empleado busca por proveedor
    Given el empleado está en el catálogo de herramientas AI
    When escribe "Microsoft" en el campo de búsqueda
    Then se muestran todas las herramientas cuyo proveedor contiene "Microsoft"
    And los resultados incluyen: Microsoft Copilot Chat, Power Automate / Power Apps, Visual Studio Code, entre otros

  Scenario: Búsqueda sin resultados
    Given el empleado está en el catálogo de herramientas AI
    When escribe "TikTok" en el campo de búsqueda
    Then se muestra un mensaje: "No se encontraron herramientas que coincidan con tu búsqueda"
    And se sugiere: "¿No encuentras la herramienta? Consulta el proceso de intake para solicitar su evaluación."
```

---

### US-07: Ver agrupación por categoría

**Prioridad:** Could Have
**Nota:** Backlog — Fuera de MVP

**User Story:** Como *empleado de LAG*, quiero *ver las herramientas agrupadas por categoría (IA Generativa, Desarrollo, Automatización, Seguridad, etc.)* para *explorar qué opciones aprobadas tengo dentro del tipo de herramienta que necesito.*

**Eventos asociados:** (nuevo) `FiltroPorCategoriaAplicado` → `HerramientasAgrupadasMostradas`

#### Criterios de Aceptación

```gherkin
Feature: Agrupación de herramientas por categoría

  Scenario: Empleado visualiza herramientas agrupadas por categoría
    Given el empleado está en el catálogo de herramientas AI
    When selecciona la vista "Por categoría" o aplica filtro de categoría
    Then se muestran las herramientas agrupadas en las categorías existentes:
      | Categoría                | Cantidad |
      | IA Generativa            | 5        |
      | Desarrollo               | 4        |
      | Automatización           | 2        |
      | Seguridad                | 1        |
      | Análisis documentos      | 1        |
      | RRHH / Reclutamiento     | 1        |
      | Diseño                   | 1        |
      | Presentaciones           | 1        |
      | Búsqueda                 | 1        |
      | Ventas / CRM             | 1        |
      | Mensajería               | 1        |
      | Modelos locales          | 1        |
      | Modelos / Desarrollo     | 1        |
      | Productividad            | 2        |
      | Procesamiento documental | 1        |
      | Documentación            | 1        |
      | Hardware / Productividad | 1        |
      | Audio / Voz              | 1        |
      | Imágenes                 | 1        |

  Scenario: Empleado filtra por una categoría específica
    Given el empleado está en el catálogo de herramientas AI
    When selecciona la categoría "IA Generativa"
    Then se muestran únicamente: ChatGPT, Gemini, Microsoft Copilot Chat, Claude, Grok
    And el conteo de resultados muestra 5 herramientas

  Scenario: Categoría se combina con filtro de nivel
    Given el empleado filtra por categoría "Desarrollo"
    When adicionalmente filtra por nivel "Confidencial"
    Then se muestran solo herramientas de categoría Desarrollo con nivel Confidencial
    And los resultados incluyen: GitHub Copilot, Visual Studio Code, Visual Studio Professional
```

---

## Resumen de cobertura

| Story | Actor | Prioridad | Evento de dominio principal | Dato clave |
|-------|-------|-----------|----------------------------|------------|
| US-01 | Empleado | Must Have | `HerramientasListadas` | 27 activas + 4 retiradas, semáforo visual |
| US-02 | Empleado | Must Have | `HerramientasFiltradas` | 4 niveles: Pública, Interna, Confidencial, Restringida |
| US-03 | Empleado | Must Have | `DetalleDeHerramientaConsultado` | nombre, proveedor, categoría, nivel máximo, DPA, estado |
| US-04 | Empleado | Should Have | `SemaforoMostrado` | Verde/Amarillo/Rojo + accesibilidad |
| US-05 | Empleado | Should Have | `HerramientaRetiradaIdentificada` | 4 retiradas + razón visible |
| US-06 | Empleado | Could Have | `BusquedaRealizada` | Texto libre por nombre/proveedor |
| US-07 | Empleado | Could Have | `FiltroPorCategoriaAplicado` | 19 categorías únicas |

---

## Trazabilidad: Eventos → Stories

| Evento de dominio | Stories que lo cubren |
|---|---|
| `CatalogoAccedido` | US-01 |
| `HerramientasListadas` | US-01, US-05 |
| `FiltroDeNivelAplicado` | US-02 |
| `HerramientasFiltradas` | US-02, US-06 |
| `FiltroLimpiado` | US-02 |
| `DetalleDeHerramientaConsultado` | US-03 |
| `EstadoDPAVerificado` | US-03 |
| `SemaforoMostrado` | US-01, US-03, US-04 |
| `HerramientaRetiradaIdentificada` | US-01, US-03, US-05 |
| `NavegacionAlCatalogoRealizada` | US-03 |
| `BusquedaRealizada` | US-06 |
| `FiltroPorCategoriaAplicado` | US-07 |

---

## Referencias

- `docs/company/catalogo-herramientas-datos.md` — Datos seed (27+4 herramientas)
- `docs/governance/clasificacion-datos.md` — Niveles de clasificación
- `docs/company/glossary.md` — Términos oficiales
- `spec/catalogo-herramientas/vision.md` — Visión del producto
- `spec/catalogo-herramientas/product-brief.md` — Alcance MVP
