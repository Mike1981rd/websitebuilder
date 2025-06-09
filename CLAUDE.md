# Memoria del Proyecto Hotel

## Reglas Importantes

### Migraciones de Entity Framework
- **REGLA CRÍTICA**: Los archivos de migración deben ser preparados por Claude
- Solo proporcionar el nombre de la migración al usuario
- El usuario ejecutará el comando de migración desde Visual Studio
- NO ejecutar comandos `dotnet ef` directamente

### Flujo de Trabajo con Prompts
- Siempre preparar archivos de migración y proporcionar solo el nombre
- Mantener responsividad en todas las vistas
- Las traducciones ya están implementadas en JavaScript - revisar implementación
- Trabajar a través de una serie de prompts fielmente
- Al terminar una tarea, solo responder con "siguiente prompt"

## Configuración de Base de Datos
- Base de datos: Hotel (PostgreSQL)
- Usuario: postgres
- Contraseña: 123456
- La base de datos ya está creada en pgAdmin

## Estructura del Proyecto
- ASP.NET Core 8.0
- Entity Framework Core con PostgreSQL
- Modelos creados: Room, RoomType, Guest, Reservation, Payment, Company
- DbContext: HotelDbContext

## Módulo Constructor de Sitios Web
- **Objetivo Principal:** Replicar UI y UX del editor de Shopify (tema Dawn de fábrica)
- **Contexto:** Módulo nuevo en app existente, una empresa por DB
- **UI Requerida:** Responsividad, preparación para traducciones (EN/ES)
- **Layout Especial:** _WebsiteBuilderLayout oculta sidebar principal
- **Estructura:** Barra superior tipo Shopify con selector de páginas y controles

## Notas Importantes de Desarrollo

1. **Migraciones**: Siempre preparar archivos de migración y proporcionar solo el nombre de la migración - el usuario ejecutará en Visual Studio
2. **Responsividad**: Mantener responsividad en todas las vistas
3. **Traducciones**: Las traducciones ya están implementadas en JavaScript - solo revisar la implementación del proyecto
4. **Flujo de Trabajo**: Trabajar a través de una serie de prompts fielmente
5. **Finalización de Tareas**: Al terminar una tarea, solo responder con "siguiente prompt"

## Patrones y Estándares Implementados

### Arquitectura y Patrones
1. **Single-Entity Pattern** (Empresa): FirstOrDefaultAsync(), crear si no existe
2. **Fechas PostgreSQL**: Usar `DateTime.UtcNow`
3. **Redirección Post-Save**: Siempre a `ExactIndex`
4. **Validaciones Opcionales**: Remove ModelState si campo vacío

### UI/UX
5. **Mensajes**: TempData["SuccessMessage"] y TempData["ErrorMessage"]
6. **Breadcrumbs**: Home/[Módulo] - Home enlaza a ExactIndex
7. **Dark Mode**: Fondo #282A42, cards color original
8. **Botones**: Solo un set al final, Guardar usa var(--primary)
9. **Requeridos**: `<span class="required-asterisk">*</span>`
10. **Traducciones**: Agregar en _MaterializeExactLayout translations object

## Website Builder - Implementación Correcta

### Sistema de Traducciones
1. **Variables**: Usar `let currentLanguage` (no const) en website-builder.js
2. **Estructura**: Objeto `translations` con keys es/en, cada vista necesita sus traducciones
3. **HTML**: Agregar `data-i18n="key"` a elementos traducibles
4. **Aplicar**: Llamar `applyTranslations()` después de renderizar vistas dinámicas
5. **Eventos**: Escuchar `languageChanged` del layout principal y re-renderizar si es necesario

### CSS - Orden Correcto
1. **Ubicación**: Estilos específicos en `/wwwroot/css/website-builder.css`
2. **Evitar**: NO poner CSS inline en JS - Materialize puede sobrescribir
3. **Especificidad**: Usar `!important` solo si Materialize interfiere
4. **Clases Shopify**: Prefijo `shopify-` para componentes específicos (shopify-slider, shopify-select)

### Renderizado de Vistas Dinámicas
1. **Función**: `switchSidebarView(viewName, data)` controla qué mostrar
2. **Render**: Cada vista tiene su función render (renderBlockListView, renderThemeSettingsView)
3. **Post-Render**: Siempre `setTimeout(applyTranslations, 0)` después de innerHTML
4. **Eventos**: Attachar event listeners específicos después de renderizar

## Patrones Críticos Website Builder

### Event Handlers
1. **Prevenir duplicados**: Usar `.off('click.namespace').on('click.namespace')` 
2. **Handlers globales**: Para elementos dinámicos usar `$(document).on()` FUERA de funciones
3. **Funciones globales**: `window.functionName = function()` para acceso desde cualquier contexto

### Jerarquía y Drag & Drop
1. **Estructura**: Elementos hijos como hermanos DOM con data attributes para relación
2. **Sortable padre-hijo**: En `start` ocultar hijos, en `stop` reinsertar después del padre
3. **Reinicializar**: Después de drag, reinicializar colapsadores y handlers en `setTimeout`

### Traducciones Dinámicas
1. **HTML**: `data-i18n="key"`, `data-i18n-placeholder="key"`, `data-i18n-title="key"`
2. **Aplicar**: `setTimeout(applyTranslations, 0)` después de cada `innerHTML`
3. **Texto dinámico**: `translations[currentLanguage]['key'] || 'Default'`

### CSS y Animaciones
1. **Centrado**: Usar flexbox no position absolute
2. **Toggle visibility**: `.css('display', 'value')` no `.show()/.hide()`
3. **Animaciones suaves**: Combinar fade+slide con delays escalonados (index * 40ms)