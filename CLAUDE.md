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

### Drag & Drop con Elementos Padres-Hijos (CRÍTICO)
**Problema**: Cuando un elemento padre (ej: barra de anuncios) tiene hijos, el drag & drop del header falla.

**Solución definitiva**:
1. **Wrapper para hijos**: Envolver elementos hijos en un contenedor `<div id="announcement-items-wrapper">`
2. **Detach durante drag**: En `start`, hacer `.detach()` del wrapper completo (no solo `.hide()`)
3. **Reattach en stop**: Reinsertar wrapper después del elemento padre movido
4. **Sortables separados**: Crear sortable independiente para el wrapper de hijos

**Código clave**:
```javascript
// En start del sortable principal
if (ui.item.attr('data-element-id') === 'barra-anuncios') {
    const $wrapper = $('#announcement-items-wrapper');
    $wrapper.hide();
    ui.item.data('detached-wrapper', $wrapper.detach()); // CRÍTICO: detach previene interferencia
}

// En stop
const $detachedWrapper = ui.item.data('detached-wrapper');
if ($detachedWrapper) {
    $detachedWrapper.insertAfter(ui.item).show();
}
```

### Reinicialización Post-Drag
Después de drag, reinicializar colapsadores y handlers en `setTimeout`

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

## Problemas Resueltos - Website Builder

### Sistema de Fuentes y Tipografía
**Problema**: Las fuentes solo cambiaban entre 2 estilos sin importar la selección. El valor guardado ('roboto') no coincidía con el nombre real de la fuente ('Roboto').

**Solución implementada**:
1. Crear mapa global `window.globalFontMap` con todos los valores y nombres
2. Función helper `window.getFontNameFromValueSafe()` para conversión consistente
3. Event listener para `fontChanged` que actualiza preview inmediatamente
4. Carga automática de Google Fonts en iframe principal y preview
5. Usar la función helper en TODOS los lugares donde se renderiza tipografía

**Archivos clave**:
- `website-builder.js`: líneas ~15-82 (mapa global), ~8270-8277 (event handler), ~664-673 (renderizado)
- `Index.cshtml`: líneas ~108-125 (carga dinámica de fuentes)

### Toggle de Visibilidad (Ícono del Ojo)
**Problema**: Después de guardar, se necesitaban dos clicks para cambiar el estado del ícono del ojo. Funcionaba bien al recargar la página pero no después de guardar dinámicamente.

**Causa**: Estados residuales y estilos inline que quedaban después de recargar la vista dinámicamente interferían con el siguiente toggle.

**Solución implementada** (líneas ~4171-4182):
```javascript
// 1. Limpiar completamente el estado antes de aplicar el nuevo
$button.removeClass('is-hidden');
if (newHiddenState) {
    $button.addClass('is-hidden');
}

// 2. Remover TODOS los estilos inline (no solo vaciarlos)
$visibleIcon.removeAttr('style');
$hiddenIcon.removeAttr('style');

// 3. Prevenir clicks durante transición (líneas ~4136-4145)
if ($button.data('transitioning')) return;
$button.data('transitioning', true);
setTimeout(() => $button.data('transitioning', false), 300);
```

**CSS correcto** (website-builder.css ~870-896):
- Usar selectores específicos: `.visibility-toggle:not(.is-hidden)` y `.visibility-toggle.is-hidden`
- Todos los iconos con `display: none` por defecto, luego mostrar según estado
- Usar `!important` para asegurar precedencia sobre estilos inline residuales

## Sistema de Preview - Website Builder

### Arquitectura del Preview
**Vista principal**: `Views/WebsiteBuilder/Index.cshtml` contiene un iframe que carga `PreviewTemplate`
**Template del iframe**: `Views/WebsiteBuilder/PreviewTemplate.cshtml` - vista sin layout para el contenido
**Controlador**: `PreviewTemplate()` en `WebsiteBuilderController.cs` sirve la vista del iframe

### Funciones de Renderizado (website-builder.js)
1. **renderPreview()** (~línea 450): Función principal que orquesta el renderizado
   - Verifica que el iframe esté listo
   - Limpia contenido anterior
   - Itera por `sectionOrder` y llama a renderers específicos
   - Adjunta event listeners para clicks en secciones

2. **renderHeader()** (~línea 391): Renderiza el header con logo, menú y iconos
3. **renderAnnouncementBar()** (~línea 426): Renderiza barra con primer anuncio visible

### Interactividad del Preview
- Click en sección → Abre panel de configuración correspondiente
- Hover muestra etiqueta azul con nombre de sección
- Event listeners en línea ~490-516

### Estilos del Preview (PreviewTemplate.cshtml)
- Background: #F6F6F7 (gris claro Shopify)
- Selección: box-shadow azul #2962ff en hover
- Etiquetas: posición absoluta arriba, border-radius 6px
- Iconos: Material Symbols Outlined para aspecto moderno

### Momentos de Renderizado
1. Al cargar datos (`loadCurrentWebsite` línea ~232)
2. Cuando iframe termina de cargar (línea ~488)
3. Después de guardar cambios (línea ~8885)

## Implementaciones Clave - Guía Rápida para Nuevos Módulos

### 1. Sistema de Color Schemes
- **Solo usar Scheme 1-5**: Primary/Secondary/Contrasting están ocultos
- **Helper function**: `getColorSchemeValues(schemeName)` obtiene colores del scheme
- **Aplicación**: Los módulos deben leer el colorScheme seleccionado y usar los colores correspondientes
- **Estructura**: `currentGlobalThemeSettings.colorSchemes[schemeName]` contiene background, text, etc.

### 2. Configuración de Módulos (Announcement Bar como ejemplo)
**Campos configurables típicos**:
- Visibilidad condicional de elementos (showSocialMediaIcons, showLanguageSelector)
- Width: 'screen' vs 'container'
- Color scheme selection
- Navegación entre elementos múltiples
- Autoplay con timer configurable

**Patrón de renderizado**:
```javascript
function renderModule(config) {
    if (!config || config.isHidden) return '';
    const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
    // Aplicar colores: background-color: ${schemeColors.background}
}
```

### 3. Tipografía Dinámica
- **Body typography para textos**: Usar `currentGlobalThemeSettings.typography.body`
- **Cargar Google Fonts**: Implementado en Index.cshtml con `loadGoogleFont()`
- **Aplicar en módulos**: `font-family: ${bodyTypography.font}; font-size: ${bodyTypography.fontSize}`

**CRÍTICO - Conversión de valores de fuentes**:
- Los selectores guardan valores como 'roboto', 'playfair-display'
- Para renderizado usar `window.getFontNameFromValueSafe(fontValue)` que convierte a 'Roboto', 'Playfair Display'
- Mapa global de fuentes en `window.globalFontMap` (línea ~15)
- Al cambiar fuente: disparar `fontChanged` → actualiza modelo → renderiza preview → carga en iframe

### 4. Navegación y Estado de Vistas
- **NO duplicar `currentSidebarView`**: Ya existe globalmente
- **Mantener vista después de guardar**: Usar `sessionStorage` si necesitas persistencia
- **Pattern para no recargar vista**:
```javascript
if (currentSidebarView === 'tuVista') {
    // No hacer nada, mantener vista actual
}
```

### 5. Elementos Múltiples con Orden (Anuncios como ejemplo)
- **Arrays de orden**: `announcementOrder: ['id1', 'id2']`
- **Objetos de datos**: `announcements: { id1: {...}, id2: {...} }`
- **Visibilidad individual**: Cada elemento tiene `isHidden`
- **Navegación con índice**: `currentAnnouncementIndex` para tracking

### 6. Persistencia y Guardado
- **Un solo endpoint de guardado**: Todo en `globalThemeSettingsJson`
- **Flags de cambios**: `hasPendingGlobalSettingsChanges = true`
- **No crear endpoints extras**: Usar estructura existente

### 7. Preview en Tiempo Real
- **Renderizar después de cambios**: Llamar `renderPreview()`
- **Cargar fuentes en iframe**: `loadFontsInPreview()`
- **Event listeners en preview**: Attachar después de renderizar

### 8. Traducciones
- **Estructura**: `translations[currentLanguage]['key']`
- **Aplicar después de render**: `setTimeout(applyTranslations, 0)`
- **Data attributes**: `data-i18n="key"` en HTML

### Checklist para Nuevo Módulo
1. ✓ Declarar variables globales fuera de $(document).ready()
2. ✓ Crear función render que respete color schemes
3. ✓ Implementar configuración con campos comunes
4. ✓ Usar tipografía del sistema (body/heading según corresponda)
5. ✓ Agregar traducciones para todos los textos
6. ✓ Manejar visibilidad y orden si tiene elementos múltiples
7. ✓ No recargar vista innecesariamente después de guardar
8. ✓ Attachar event listeners con namespaces para evitar duplicados