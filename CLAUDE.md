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

## Arquitectura Crítica Website Builder - Settings y Guardado

### Variables Globales JavaScript (CRÍTICO)
```javascript
// DEBEN estar fuera de $(document).ready() para acceso global
let hasPendingGlobalSettingsChanges = false;
let hasPendingPageStructureChanges = false;
let currentWebsiteId = null;
let currentGlobalThemeSettings = {};
```

### Patrón de Guardado Unificado
1. **Botón único**: `#save-builder-btn-topbar` maneja TODOS los cambios
2. **Verificar flags**: Siempre revisar ambas: `hasPendingGlobalSettingsChanges` y `hasPendingPageStructureChanges`
3. **Guardado paralelo**: Usar `Promise.all()` para múltiples endpoints

### Patrón de Event Handlers para Settings
```javascript
function handleGlobalSettingChange(settingName, value) {
    hasPendingGlobalSettingsChanges = true;
    applyGlobalStylesToPreview(currentGlobalThemeSettings);
    updateSaveButtonState();
}
```

### API Endpoints Website Builder
- `GET /api/builder/websites/current` → Obtiene sitio con GlobalThemeSettingsJson
- `PUT /api/builder/websites/current/global-settings` → Actualiza settings globales
- `PUT /api/builder/websites/{id}/pages/{pageId}` → Actualiza estructura de página

### Verificación Preview Iframe
```javascript
// SIEMPRE verificar antes de aplicar estilos
if (!previewFrame) {
    console.log('[DEBUG] Preview iframe not found. Skipping...');
    return;
}
```

### Modelo WebSite
- **GlobalThemeSettingsJson**: string → jsonb PostgreSQL
- **Default**: `"{}"` para evitar nulls
- **Backend**: Sin validación de campos (flexibilidad máxima)

## Lecciones Críticas - Evitar Problemas Comunes

### Formularios Dinámicos
1. **Event Listeners**: Usar `data-field` no `name`. Escuchar `input`, `change`, `blur`
2. **Delegación**: `$(document).on('event', 'selector')` para elementos creados dinámicamente

### Validación de Inputs
3. **Color Hex**: Validar con `/^#[0-9A-F]{6}$/i` antes de asignar a `input[type="color"]`
4. **Campos RGBA**: Usar solo `input[type="text"]` para valores rgba()

### Backend JSON
5. **Deserialización**: Agregar `[JsonPropertyName("camelCase")]` si frontend envía camelCase
6. **Debug**: Leer request body manualmente si hay problemas de deserialización

### Estado y Carga de Datos
7. **NO reinicializar**: Al abrir secciones, NO llamar funciones que sobrescriban valores DB
8. **Populate**: Incluir TODOS los campos (appearance Y colors) en función de carga

## Patrón de Guardado Website Builder - Guía Rápida

### Para agregar nueva sección de settings:
1. **HTML**: Agregar IDs únicos a todos los inputs/selects/checkboxes
2. **Estructura JS** (~línea 6650): `if (!currentGlobalThemeSettings.newSection) currentGlobalThemeSettings.newSection = {};`
3. **Defaults** (~línea 6700): Crear objeto con valores por defecto y aplicar con loop
4. **Event Listeners** (~línea 7000+):
   - Select/Input: `.on('change')` → actualizar objeto → `handleGlobalSettingChange()`
   - Checkbox: `.on('change')` → `$(this).is(':checked')` → guardar
   - Color: sincronizar picker y text input
5. **Inicializar desde BD** (~línea 6400+): Llenar campos con valores guardados

**CRÍTICO**: Todo se guarda automáticamente en `globalThemeSettingsJson` al hacer click en botón guardar. NO crear endpoints adicionales.

## Patrones Críticos - Módulo de Secciones Website Builder

### Variables y Estructuras de Datos
1. **Variables globales necesarias**: Declarar SIEMPRE fuera de `$(document).ready()`:
   ```javascript
   let currentSidebarView = 'blockList'; // Track vista actual
   let currentSectionsConfig = {
       sectionOrder: [], // Orden de secciones principales
       announcementOrder: [] // Orden de anuncios
   };
   ```

2. **Datos actualizados**: NUNCA usar `window.currentPageData` directamente
   - Crear función helper: `window.getUpdatedPageData()` que devuelva datos actuales
   - Usar en todos los back buttons y recargas de vista

### Persistencia y Guardado de Secciones
1. **Drag & Drop**: SIEMPRE actualizar arrays de orden en stop handler:
   ```javascript
   stop: function(e, ui) {
       const newOrder = [];
       $('.sidebar-subsection[data-block-type]').each(function() {
           newOrder.push($(this).data('element-id'));
       });
       currentSectionsConfig.sectionOrder = newOrder;
       hasPendingPageStructureChanges = true;
   }
   ```

2. **Eliminar elementos**: Actualizar TANTO DOM como estructura de datos:
   ```javascript
   $element.remove(); // Remover del DOM
   delete currentSectionsConfig.announcements[elementId]; // Remover de datos
   // Actualizar array de orden si existe
   ```

3. **Renderizado con orden**: Funciones render deben respetar orden guardado:
   - Usar arrays `sectionOrder` y `announcementOrder`
   - Si no existe orden, usar orden por defecto

### Problemas Comunes y Soluciones
1. **Vista se corta/colapsa**: 
   - EVITAR radio buttons en formularios dinámicos
   - Preferir select dropdowns para evitar problemas de altura
   - NO usar `overflow: hidden` en contenedores flex dinámicos

2. **Funciones duplicadas**: SIEMPRE buscar antes de crear:
   ```bash
   grep -n "functionName" website-builder.js
   ```

3. **Recargar vista después de guardar**: Agregar casos para cada vista:
   ```javascript
   if (currentSidebarView === 'headerSettings') {
       window.switchSidebarView('headerSettings');
   }
   ```

### Debugging Tips
1. **Variables undefined**: Verificar declaración global
2. **Cambios no persisten**: Verificar actualización de `currentSectionsConfig`
3. **Vista cortada**: Revisar CSS del contenedor padre (`#sidebar-dynamic-content`)