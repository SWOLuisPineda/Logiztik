# Product Brief — Catálogo de Herramientas AI

## Datos del dominio
- 27 herramientas autorizadas (activas)
- 4 herramientas retiradas
- 4 niveles: Pública, Interna, Confidencial, Restringida
- Campos por herramienta: nombre, proveedor, categoría, nivel máximo, estado, razón retiro

## MVP
1. Listado completo de herramientas aprobadas
2. Filtro por nivel de clasificación de datos
3. Detalle de herramienta (nombre, proveedor, nivel, estado)
4. Semáforo visual (verde/amarillo/rojo)

## Fuera de alcance
- CRUD administrativo (crear/editar herramientas)
- Auth real con Azure AD (se mockea)
- Notificaciones por cambios en el catálogo
- Historial de versiones
- Integración con DPA

## Timeline
- Día 14: BAs → requirements | Arqs → design + tasks
- Día 15: Devs → código desde tasks
- Día 16: QA → tests | DevOps → pipeline → deploy