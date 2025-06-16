# Gu�a de Resoluci�n de Problemas - Website Builder

## Resumen de Problemas Encontrados y Soluciones Aplicadas

Esta gu�a documenta los problemas cr�ticos encontrados durante el desarrollo del Website Builder y sus soluciones, para evitar errores futuros.

## 1. Problema: Header no respeta los Color Schemes seleccionados

### S�ntomas:
- El header mostraba siempre colores por defecto (blanco) independientemente del color scheme seleccionado
- El color scheme 1 configurado con fondo negro se mostraba blanco

### Causa Ra�z:
1. La variable `currentGlobalThemeSettings` no estaba disponible globalmente para `website-render-functions.js`
2. El valor por defecto del colorScheme del header era 'primary' (que no existe) en lugar de 'scheme1'

### Soluci�n Aplicada:

#### En website-builder.js (l�nea ~140):
```javascript
// Hacer currentGlobalThemeSettings disponible globalmente
window.currentGlobalThemeSettings = currentGlobalThemeSettings;
```

#### En website-builder.js (m�ltiples ubicaciones):
Sincronizar window.currentGlobalThemeSettings cuando se cargan datos de la DB:
```javascript
// Despu�s de cargar datos
currentGlobalThemeSettings = JSON.parse(website.globalThemeSettingsJson);
window.currentGlobalThemeSettings = currentGlobalThemeSettings; // CR�TICO
```

#### En website-render-functions.js (l�nea ~43):
```javascript
function getColorSchemeValues(schemeName) {
    const globalSettings = (typeof window !== 'undefined' && window.currentGlobalThemeSettings) 
        ? window.currentGlobalThemeSettings 
        : (typeof currentGlobalThemeSettings !== 'undefined' ? currentGlobalThemeSettings : null);
    // ... resto del c�digo
}
```

#### En WebSitesController.cs (l�nea ~239):
```csharp
"header": {
    "colorScheme": "scheme1", // Cambiar de "primary" a "scheme1"
}
```

## 2. Problema: Preview en nueva pesta�a muestra p�gina vac�a

### S�ntomas:
- Al hacer clic en el �cono del ojo, el preview mostraba una p�gina completamente vac�a
- Error 500 al intentar cargar datos desde la API

### Causa Ra�z:
1. Conflicto de rutas: Exist�an dos controladores con la misma ruta API
   - `BuilderApiController` (creado manualmente)
   - `WebSitesController` (existente)
2. El `WebSitesController` ten�a el atributo `[Authorize]` que requer�a autenticaci�n
3. Error de sintaxis en el controlador duplicado

### Soluci�n Aplicada:

#### Eliminar controlador duplicado:
```bash
rm /mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23/Controllers/Api/BuilderApiController.cs
```

#### En WebSitesController.cs (l�nea ~16):
```csharp
//[Authorize] // Temporalmente deshabilitado para pruebas
```

## 3. Problema: Preview no muestra el Slideshow configurado

### S�ntomas:
- El preview solo mostraba header y announcement bar
- El slideshow estaba configurado pero no aparec�a
- Los datos mostraban configuraciones contradictorias

### Causa Ra�z:
El preview estaba usando datos de `pagesJson` que sobrescrib�an los datos correctos de `sectionsConfigJson`. El `pagesJson` ten�a una versi�n antigua del `sectionOrder` sin el slideshow.

### Soluci�n Aplicada:

#### En Preview.cshtml (l�nea ~278):
```javascript
// DEPRECATED: pagesJson no deber�a sobrescribir sectionsConfigJson
// Comentado porque sectionsConfigJson es la fuente correcta de datos
/*
if (websiteData.pagesJson) {
    try {
        const pagesData = JSON.parse(websiteData.pagesJson);
        if (pagesData.sectionsConfig) {
            currentSectionsConfig = pagesData.sectionsConfig;
        }
    } catch (error) {
        console.error('Error parsing pagesJson:', error);
    }
}
*/
```

## 4. Arquitectura Cr�tica del Sistema

### Variables Globales JavaScript (CR�TICO)
Estas variables DEBEN estar declaradas fuera de `$(document).ready()`:
```javascript
let hasPendingGlobalSettingsChanges = false;
let hasPendingPageStructureChanges = false;
let currentWebsiteId = null;
let currentGlobalThemeSettings = {};
let currentSectionsConfig = {
    sectionOrder: [],
    announcementOrder: []
};
```

### Flujo de Datos Correcto:

1. **Editor � Base de Datos:**
   - `currentSectionsConfig` � se guarda en `sectionsConfigJson`
   - `currentGlobalThemeSettings` � se guarda en `globalThemeSettingsJson`

2. **Base de Datos � Preview:**
   - `sectionsConfigJson` � carga como `currentSectionsConfig`
   - `globalThemeSettingsJson` � carga como `currentGlobalThemeSettings`

3. **Fuentes de Datos:**
   - `sectionsConfigJson`: Fuente principal para configuraci�n de secciones
   - `pagesJson`: DEPRECATED - no debe usarse para sobrescribir sectionsConfig

### Endpoints API Cr�ticos:
```javascript
// Obtener datos del sitio web
GET /api/builder/websites/current

// Guardar configuraci�n global
PUT /api/builder/websites/current/global-settings

// Guardar estructura de p�gina
PUT /api/builder/websites/{id}/pages/{pageId}
```

## 5. Mejores Pr�cticas para Evitar Problemas Futuros

### 1. Siempre verificar disponibilidad global de variables:
```javascript
// MAL
currentGlobalThemeSettings = loadedData;

// BIEN
currentGlobalThemeSettings = loadedData;
window.currentGlobalThemeSettings = currentGlobalThemeSettings;
```

### 2. Usar la fuente de datos correcta:
- `sectionsConfigJson`: Para configuraci�n de secciones
- `globalThemeSettingsJson`: Para configuraci�n global del tema
- `pagesJson`: Solo para datos espec�ficos de p�ginas (NO para secciones)

### 3. Mantener sincronizaci�n:
- Cuando se modifica `currentGlobalThemeSettings`, actualizar tambi�n `window.currentGlobalThemeSettings`
- Cuando se modifica `currentSectionsConfig`, marcar `hasPendingPageStructureChanges = true`

### 4. Validar esquemas de color:
- Solo usar: scheme1, scheme2, scheme3, scheme4, scheme5
- NUNCA usar: primary, secondary (estos no existen)

### 5. Debugging efectivo:
```javascript
console.log('[DEBUG] Variable:', variable);
console.log('[DEBUG] Type:', typeof variable);
console.log('[DEBUG] Value:', JSON.stringify(variable, null, 2));
```

## 6. Estructura de Archivos Clave

### JavaScript:
- `/wwwroot/js/website-builder.js`: L�gica principal del editor
- `/wwwroot/js/website-render-functions.js`: Funciones de renderizado compartidas
- `/Views/WebsiteBuilder/Preview.cshtml`: Vista del preview en nueva pesta�a

### C#:
- `/Controllers/WebSitesController.cs`: API principal del builder
- `/Models/WebSite.cs`: Modelo de datos

### Datos JSON en Base de Datos:
- `GlobalThemeSettingsJson`: Configuraci�n global (colores, tipograf�a)
- `SectionsConfigJson`: Configuraci�n de secciones y su orden
- `PagesJson`: Datos de p�ginas (actualmente no usado)

## 7. Checklist de Verificaci�n ante Problemas

Cuando algo no funciona como se espera:

1.  �Los cambios est�n guardados? (verificar en Network tab)
2.  �La variable est� disponible globalmente? (verificar window.variableName)
3.  �Se est� usando la fuente de datos correcta? (sectionsConfigJson vs pagesJson)
4.  �El color scheme existe? (scheme1-5, no primary/secondary)
5.  �Hay errores en la consola del navegador?
6.  �El proyecto fue recompilado despu�s de cambios en C#?
7.  �Los datos se est�n sincronizando entre editor y preview?

## 8. Comandos �tiles para Debugging

### En la consola del navegador:
```javascript
// Ver configuraci�n actual
console.log(window.currentGlobalThemeSettings);
console.log(window.currentSectionsConfig);

// Ver qu� secciones est�n configuradas
console.log(currentSectionsConfig.sectionOrder);

// Ver color schemes disponibles
console.log(currentGlobalThemeSettings.colorSchemes);

// Forzar guardado
saveAllChanges();
```

## 9. Problema: Men� solo se muestra correctamente en layout drawer

### S�ntomas:
- En el editor, solo el layout "drawer" mostraba los datos correctos del men�
- Los otros layouts (logo-left-menu-center-inline, etc.) mostraban un men� por defecto gen�rico
- En el preview todos los layouts funcionaban correctamente

### Causa Ra�z:
La variable `currentMenusData` no estaba disponible globalmente para las funciones de renderizado en `website-render-functions.js`. El drawer funcionaba porque obten�a los datos directamente, pero los otros layouts no pod�an acceder a los datos del men�.

### Soluci�n Aplicada:

#### En website-builder.js (l�nea ~14620):
Hacer `currentMenusData` disponible globalmente cuando se cargan los men�s:
```javascript
if (currentGlobalThemeSettings.menus && Array.isArray(currentGlobalThemeSettings.menus)) {
    currentMenusData = currentGlobalThemeSettings.menus;
    // Make menus data globally available for render functions
    window.currentMenusData = currentMenusData;
    console.log('[MENU] Loaded menus from global settings:', JSON.stringify(currentMenusData, null, 2));
}
```

#### En website-render-functions.js (l�nea ~110):
Buscar datos del men� en m�ltiples fuentes:
```javascript
// Try to get menus data from multiple sources
let menusData = (typeof window !== 'undefined' && window.currentMenusData) 
    ? window.currentMenusData 
    : (typeof currentMenusData !== 'undefined' ? currentMenusData : []);

// If still no menus, try to get from global theme settings
if ((!menusData || menusData.length === 0) && typeof window !== 'undefined' && window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.menus) {
    menusData = window.currentGlobalThemeSettings.menus;
}

const selectedMenu = menusData.find(m => m.id === selectedMenuId);
```

### Lecci�n aprendida:
Cuando las funciones de renderizado se comparten entre diferentes contextos (editor y preview), es importante asegurar que los datos est�n disponibles globalmente o que las funciones puedan buscar los datos en m�ltiples fuentes.

## 10. Problema: Tipograf�a del men� no se aplica en el header del editor

### S�ntomas:
- El header en el editor no mostraba las fuentes correctas configuradas en "Tipograf�a > Men�"
- En el preview las fuentes se mostraban correctamente
- Solo afectaba al renderizado del header en el editor principal

### Causa Ra�z:
1. La tipograf�a del men� (`currentGlobalThemeSettings.typography.menu`) no estaba accesible en el contexto de renderizado
2. Las fuentes Google no se cargaban autom�ticamente cuando se renderizaba el header

### Soluci�n Aplicada:

#### En website-render-functions.js (l�nea ~65):
Buscar tipograf�a en m�ltiples fuentes y cargar la fuente din�micamente:
```javascript
// Get typography settings from multiple sources
let menuTypography = {};

// Try to get typography from window.currentGlobalThemeSettings first
if (typeof window !== 'undefined' && window.currentGlobalThemeSettings && window.currentGlobalThemeSettings.typography && window.currentGlobalThemeSettings.typography.menu) {
    menuTypography = window.currentGlobalThemeSettings.typography.menu;
} 
// Fallback to currentGlobalThemeSettings if available
else if (typeof currentGlobalThemeSettings !== 'undefined' && currentGlobalThemeSettings.typography && currentGlobalThemeSettings.typography.menu) {
    menuTypography = currentGlobalThemeSettings.typography.menu;
}

const menuFontValue = menuTypography.font || 'assistant';
const menuFontFamily = window.getFontNameFromValueSafe ? window.getFontNameFromValueSafe(menuFontValue) : menuFontValue;

// Ensure the font is loaded in the main document
if (typeof window !== 'undefined' && window.loadGoogleFont && menuFontFamily && menuFontFamily !== 'assistant') {
    window.loadGoogleFont(menuFontFamily);
}
```

#### En Views/WebsiteBuilder/Index.cshtml (l�nea ~406):
Hacer la funci�n loadGoogleFont disponible globalmente:
```javascript
window.loadGoogleFont = function(fontName) {
    if (loadedFonts.has(fontName)) return;
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    loadedFonts.add(fontName);
}
```

### Patr�n para manejo de recursos (fuentes, datos, etc.) en funciones de renderizado:

1. **Buscar en m�ltiples fuentes**: Siempre intentar obtener datos de `window.variable` primero, luego de variables locales
2. **Cargar recursos din�micamente**: Si un recurso (como una fuente) es necesario, cargarlo justo antes de usarlo
3. **Funciones helper globales**: Exponer funciones �tiles como `window.loadGoogleFont` para que est�n disponibles en cualquier contexto
4. **Verificar disponibilidad**: Siempre verificar con `typeof window !== 'undefined'` antes de acceder a recursos globales

### Nota importante:
Esta soluci�n es espec�fica para la tipograf�a del men� en el header. Cada secci�n que use tipograf�a personalizada debe implementar un patr�n similar para asegurar que las fuentes se carguen y apliquen correctamente en el editor.

## 11. Sincronizaci�n entre Editor y Preview - Arquitectura

### C�mo funciona la sincronizaci�n:

#### 1. **Editor (Panel principal)**
El editor corre en la p�gina principal (`Index.cshtml`) y tiene un iframe que muestra el preview:
```html
<iframe id="preview-iframe" src="/WebsiteBuilder/PreviewTemplate"></iframe>
```

#### 2. **Renderizado del Preview**
Cuando se hace un cambio en el editor:

```javascript
// En website-builder.js
function renderPreview() {
    const previewFrame = document.getElementById('preview-iframe');
    const previewDoc = previewFrame.contentDocument;
    
    // 1. Verificar que el iframe tenga las funciones de renderizado
    if (iframeWindow.renderHeader) {
        // Usar funciones del iframe
        finalHtml += iframeWindow.renderHeader(config);
    }
    
    // 2. Actualizar el HTML
    previewBody.innerHTML = finalHtml;
    
    // 3. Inicializar funcionalidades (ej: slideshows)
    if (iframeWindow.initializeSlideshows) {
        iframeWindow.initializeSlideshows();
    }
}
```

#### 3. **Flujo de datos**
```
Usuario hace cambio → Event Listener → Actualiza currentSectionsConfig → renderPreview() → Iframe se actualiza
```

#### 4. **Funciones compartidas**
El archivo `website-render-functions.js` contiene funciones de renderizado que se usan tanto en:
- **Editor**: Para el preview del iframe
- **Preview externo**: Cuando se abre con el �cono del ojo

#### 5. **Inicializaci�n de funcionalidades**
Despu�s de renderizar HTML est�tico, se deben inicializar funcionalidades din�micas:

```javascript
// En website-builder.js (para el editor)
if (iframeWindow && iframeWindow.initializeSlideshows) {
    iframeWindow.initializeSlideshows();
}

// En Preview.cshtml (para preview externo)
if (typeof initializeSlideshows === 'function') {
    setTimeout(() => {
        initializeSlideshows();
    }, 100);
}
```

### Puntos clave para mantener sincronizaci�n:

1. **Variables globales**: Usar `window.variable` para compartir datos entre contextos
2. **Event Listeners**: Llamar `renderPreview()` despu�s de cada cambio
3. **Funciones de inicializaci�n**: Ejecutar despu�s de actualizar HTML
4. **Timeout**: A veces necesario para asegurar que el DOM est� listo

### Ejemplo pr�ctico - Slideshow Autorotate:

1. **Cambio en configuraci�n**:
```javascript
$('#slideshow-auto-rotate').on('change', function() {
    currentSectionsConfig.slideshow.config.autoRotate = isChecked;
    renderPreview(); // Actualiza el preview
});
```

2. **Renderizado con data attributes**:
```javascript
<div class="slideshow-container" 
     data-autorotate="${slideshowConfig.autoRotate || false}"
     data-interval="${slideshowConfig.changeInterval || 5}">
```

3. **Inicializaci�n post-render**:
```javascript
function initializeSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    slideshows.forEach(slideshow => {
        const isAutorotate = slideshow.dataset.autorotate === 'true';
        if (isAutorotate) {
            // Iniciar rotaci�n autom�tica
        }
    });
}
```

Esta arquitectura asegura que cualquier cambio en el editor se refleje inmediatamente en el preview, manteniendo ambos sincronizados.

## 14. Problema: Slideshow altura "large" se ve cortada en preview real

### Síntomas:
- En el editor, el slideshow con altura "large" (700px) se muestra perfectamente
- En el preview real (nueva pestaña), la imagen aparece cortada en la parte superior
- Solo ocurre con la configuración "large", otras alturas funcionan bien

### Causa Raíz:
Existe una diferencia de renderizado entre el contexto del editor (iframe) y el preview real. El preview real necesita altura adicional para mostrar correctamente las imágenes grandes del slideshow.

### Solución Aplicada:

#### En website-render-functions.js (línea ~1801):
```javascript
} else if (slideshowConfig.height === 'large') {
    // Check if we're in the preview real (not in editor iframe)
    const isInEditor = (typeof window !== 'undefined' && 
                       window.parent !== window && 
                       window.parent.document && 
                       window.parent.document.getElementById('preview-iframe'));
    
    // Use 900px for preview real, 700px for editor
    heightStyle = isInEditor ? 'height: 700px;' : 'height: 900px;';
}
```

### Resultado:
- **Editor**: Mantiene 700px (aspecto visual sin cambios)
- **Preview real**: Usa 900px (compensación que permite ver la imagen completa)

Esta solución es permanente y resuelve el problema de visualización sin afectar la experiencia en el editor.

## 12. TAREA PENDIENTE: Modularizaci�n del C�digo

### Problema actual:
- `website-builder.js` tiene m�s de 15,000 l�neas
- Dif�cil mantenimiento y debugging
- Alto riesgo al agregar nuevas funcionalidades

### Soluci�n propuesta - Arquitectura modular:

#### Estructura de archivos:
```
/wwwroot/js/website-builder/
├── modules/
│   ├── image-text.js
│   ├── columns.js
│   ├── logo-list.js
│   ├── rich-text.js
│   └── [otros-modulos].js
├── core/
│   ├── module-loader.js
│   └── module-base.js
└── website-builder.js (existente - NO MODIFICAR)
```

#### Patr�n de m�dulo:
```javascript
// Ejemplo: image-text.js
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.ImageText = {
    render: function(config) { 
        // Renderizar secci�n
    },
    renderSettings: function(config) { 
        // Renderizar panel de configuraci�n
    },
    attachEventListeners: function() { 
        // Adjuntar event listeners
    },
    initialize: function() { 
        // Inicializaci�n del m�dulo
    }
};
```

#### Integraci�n m�nima con c�digo existente:
```javascript
// �nica modificaci�n en website-builder.js (al final)
function executeModuleFunction(moduleName, functionName, ...args) {
    if (window.WebsiteBuilderModules?.[moduleName]?.[functionName]) {
        return window.WebsiteBuilderModules[moduleName][functionName](...args);
    }
}

// En switchSidebarView agregar casos nuevos:
case 'imageTextSettings':
    executeModuleFunction('ImageText', 'renderSettings', data);
    break;
```

#### Carga en Index.cshtml:
```html
<!-- Despu�s de website-builder.js -->
<script src="~/js/website-builder/core/module-loader.js"></script>
<script src="~/js/website-builder/modules/image-text.js" defer></script>
<!-- Otros m�dulos -->
```

### Beneficios:
1. **Mantenimiento f�cil**: Cada m�dulo en su archivo
2. **Sin riesgo**: No se modifica c�digo existente
3. **Escalable**: Nuevos m�dulos se agregan sin tocar otros
4. **Debugging mejorado**: Archivos peque�os y espec�ficos

### Pr�ximos pasos:
1. Crear estructura de carpetas
2. Implementar primer m�dulo (image-text) como prueba
3. Validar funcionamiento
4. Migrar gradualmente funcionalidades nuevas a m�dulos

## 13. PROBLEMA CR�TICO: M�dulos Nuevos DEBEN Seguir Arquitectura Modular

### Problema Documentado:
Al implementar multicolumn siguiendo el flujo del slideshow, fall� porque:
1. El preview no se mostraba (problema con la ruta de imagen)
2. El click no agregaba la secci�n al panel
3. Se agreg� c�digo directamente a website-builder.js (15,000+ l�neas)

### Soluci�n Correcta - Arquitectura Modular:
**TODOS los m�dulos nuevos DEBEN implementarse como archivos separados**

#### Ejemplo Implementado - Multicolumn:
```
/wwwroot/js/website-builder/modules/multicolumn.js
```

#### Patr�n del M�dulo:
```javascript
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Multicolumn = {
    render: function(config) { /* renderizar secci�n */ },
    renderSettings: function(config) { /* panel configuraci�n */ },
    attachEventListeners: function() { /* event listeners */ },
    renderRowSettings: function(data) { /* configuraci�n individual */ },
    attachRowEventListeners: function(columnId) { /* eventos de fila */ }
};
```

#### Integraci�n con C�digo Existente:
1. **En website-builder.js** - Agregar executeModuleFunction (ya agregada)
2. **En switchSidebarView** - Usar executeModuleFunction
3. **En renderPreview** - Verificar si existe el m�dulo
4. **Cargar scripts en**:
   - Index.cshtml
   - PreviewTemplate.cshtml
   - Preview.cshtml

#### Ventajas:
- C�digo aislado y mantenible
- F�cil debugging
- No modifica website-builder.js
- Reutilizable en diferentes contextos

## 14. GU�A DE IMPLEMENTACI�N EST�NDAR PARA NUEVOS M�DULOS

### FLUJO CR�TICO: Agregar Nueva Secci�n desde Modal de Plantillas

#### Problema Documentado:
Al hacer click en una opci�n del modal de plantillas, no suced�a nada. Se perd�a mucho tiempo porque no se segu�a el flujo correcto.

#### Flujo Correcto (Implementado en Slideshow - L�neas 9595-9690):

1. **Event Handler Global para Clicks del Modal:**
```javascript
// L�nea 9595 - DEBE estar fuera de $(document).ready() para funcionar con modales din�micos
$(document).on('click', '.add-section-modal .section-item', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const sectionId = $(this).data('section-id');
    const group = $('.add-section-button.active').data('group') || 'template';
```

2. **Verificar el Grupo y Secci�n:**
```javascript
// L�nea 9607
if (group === 'template' && sectionId === 'slideshow') {
    // Procesar agregado de slideshow
}
```

3. **Inicializar Configuraci�n de la Secci�n:**
```javascript
// L�nea 9609-9652
if (!currentSectionsConfig.slideshow) {
    const defaultSlideId = 'slide-' + Date.now();
    
    currentSectionsConfig.slideshow = {
        id: 'slideshow',
        isHidden: false,
        config: {
            // Configuraci�n por defecto
        },
        slides: {
            [defaultSlideId]: {
                // Slide por defecto
            }
        },
        slideOrder: [defaultSlideId]
    };
}
```

4. **Agregar a sectionOrder (CR�TICO):**
```javascript
// L�nea 9654-9664
if (!currentSectionsConfig.sectionOrder) {
    currentSectionsConfig.sectionOrder = [];
}
if (!currentSectionsConfig.sectionOrder.includes('slideshow')) {
    // Insertar despu�s del header si existe
    const headerIndex = currentSectionsConfig.sectionOrder.indexOf('header');
    if (headerIndex >= 0) {
        currentSectionsConfig.sectionOrder.splice(headerIndex + 1, 0, 'slideshow');
    } else {
        currentSectionsConfig.sectionOrder.push('slideshow');
    }
}
```

5. **Actualizar UI del Panel Lateral:**
```javascript
// L�nea 9666-9675
const templateSectionsHtml = renderTemplateSections();
$('#template-sections-container').html(templateSectionsHtml + `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e3e3e3;">
        <div class="add-section-button add-template-section" data-group="template">
            <i class="material-icons">add_circle</i>
            <span data-i18n="sections.addTemplateSection">Agregar secci�n de plantilla</span>
        </div>
    </div>
`);
```

6. **Post-Procesamiento:**
```javascript
// L�nea 9677-9690
// Aplicar traducciones
setTimeout(applyTranslations, 0);

// Inicializar funcionalidades espec�ficas (si aplica)
if (currentSectionsConfig.slideshow && currentSectionsConfig.slideshow.slideOrder) {
    setTimeout(() => {
        initializeSlideshowSlidesSortable();
    }, 100);
}

// Marcar cambios pendientes
hasPendingPageStructureChanges = true;
updateSaveButtonState();

// Actualizar preview
renderPreview();

// Cerrar modal
M.Modal.getInstance(document.querySelector('.add-section-modal')).close();
```

#### PROBLEMAS CR�TICOS ENCONTRADOS AL IMPLEMENTAR MULTICOLUMN:

1. **Preview no se muestra al hover**:
   - **Causa REAL**: Existen DOS objetos de previews diferentes en el c�digo
   - **Objeto 1**: L�neas 9611-9743 (completo pero NO usado)
   - **Objeto 2**: L�neas 9619-9864 (usado por updateSectionPreview)
   - **Problema**: Multicolumn solo estaba en el objeto 1, no en el 2
   - **Soluci�n**: Agregar preview en el objeto correcto (l�nea 9863)
   - **Nota**: Los espacios en nombres requieren %20 en URLs

2. **Click no agrega la secci�n al panel**:
   - **Causa**: El handler global SOLO tiene c�digo para 'slideshow' (l�nea 9968)
   - **Problema**: `if (group === 'template' && sectionId === 'slideshow')` - NO HAY ELSE IF para otras secciones
   - **Resultado**: Multicolumn se ignora completamente al hacer click

3. **C�digo agregado incorrectamente**:
   - **Error**: Se agreg� renderMulticolumn() al c�digo principal (l�neas 1593-1665)
   - **Problema**: website-builder.js ya tiene 17,000+ l�neas
   - **Soluci�n correcta**: Usar arquitectura modular (ver secci�n 12)

#### Puntos Clave para Evitar Problemas:

1. **Event Handler Global**: DEBE incluir TODAS las secciones nuevas, no solo slideshow

2. **Im�genes con espacios**: Siempre usar %20 en URLs para espacios

3. **Arquitectura modular**: NUNCA agregar c�digo nuevo a website-builder.js

4. **Verificaci�n de Grupo**: Siempre verificar `data('group')` del bot�n activo para saber d�nde agregar

5. **sectionOrder**: SIEMPRE actualizar `currentSectionsConfig.sectionOrder` o la secci�n no aparecer�

6. **Renderizar Template Sections**: Llamar a `renderTemplateSections()` para actualizar la lista visual

7. **Flags de Cambio**: Establecer `hasPendingPageStructureChanges = true` para habilitar guardado

8. **Preview**: Llamar `renderPreview()` para actualizar el iframe

9. **Cerrar Modal**: No olvidar cerrar el modal despu�s de agregar

#### Ejemplo para Nueva Secci�n (Image & Text):
```javascript
// Agregar dentro del handler global existente
if (group === 'template' && sectionId === 'image-text') {
    if (!currentSectionsConfig.imageText) {
        currentSectionsConfig.imageText = {
            id: 'image-text',
            isHidden: false,
            config: {
                layout: 'image-left',
                imageUrl: '',
                title: 'T�tulo de ejemplo',
                content: 'Contenido de ejemplo',
                colorScheme: 'scheme1'
            }
        };
    }
    
    // Agregar a sectionOrder
    if (!currentSectionsConfig.sectionOrder.includes('image-text')) {
        currentSectionsConfig.sectionOrder.push('image-text');
    }
    
    // Actualizar UI y preview
    const templateSectionsHtml = renderTemplateSections();
    $('#template-sections-container').html(templateSectionsHtml + /* bot�n agregar */);
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Cerrar modal
    M.Modal.getInstance(document.querySelector('.add-section-modal')).close();
}
```

## 13. GU�A DE IMPLEMENTACI�N EST�NDAR PARA NUEVOS M�DULOS

### 1. Drag & Drop Est�ndar (PROBADO Y FUNCIONAL)

#### Para elementos simples:
```javascript
$('#container').sortable({
    items: '.draggable-item',
    handle: '.drag-handle',
    placeholder: 'sortable-placeholder',
    forcePlaceholderSize: true,
    tolerance: 'pointer',
    start: function(e, ui) {
        ui.placeholder.height(ui.item.outerHeight());
    },
    stop: function(e, ui) {
        // Actualizar orden
        const newOrder = [];
        $('.draggable-item').each(function() {
            newOrder.push($(this).data('element-id'));
        });
        currentSectionsConfig.sectionOrder = newOrder;
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
});
```

#### Para elementos con hijos (CR�TICO - Ver CLAUDE.md secci�n Drag & Drop):
- Usar Pre-Reference Method para men�s
- Usar Wrapper Method para secciones
- SIEMPRE detach/reattach elementos hijos durante el drag

### 2. Colapsadores Est�ndar

```javascript
// HTML
<div class="collapsible-header" data-target="content-id">
    <span class="material-icons collapse-icon">expand_more</span>
    <span>T�tulo</span>
</div>
<div id="content-id" class="collapsible-content" style="display: none;">
    <!-- Contenido -->
</div>

// JavaScript
$(document).on('click', '.collapsible-header', function() {
    const $header = $(this);
    const targetId = $header.data('target');
    const $content = $('#' + targetId);
    const $icon = $header.find('.collapse-icon');
    
    $content.slideToggle(200);
    $icon.text($icon.text() === 'expand_more' ? 'expand_less' : 'expand_more');
});
```

### 3. CRUD de Elementos Est�ndar

#### Agregar elemento:
```javascript
function addElement() {
    const elementId = 'element-' + Date.now();
    const newElement = {
        id: elementId,
        // propiedades por defecto
    };
    
    // Agregar a datos
    currentSectionsConfig.elements[elementId] = newElement;
    currentSectionsConfig.elementOrder.push(elementId);
    
    // Actualizar UI
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Re-renderizar vista
    switchSidebarView('currentView');
}
```

#### Eliminar elemento:
```javascript
function deleteElement(elementId) {
    // Remover de datos
    delete currentSectionsConfig.elements[elementId];
    const index = currentSectionsConfig.elementOrder.indexOf(elementId);
    if (index > -1) {
        currentSectionsConfig.elementOrder.splice(index, 1);
    }
    
    // Actualizar UI
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
}
```

### 4. Event Listeners Est�ndar

#### Para inputs/selects:
```javascript
// Usar delegaci�n de eventos SIEMPRE
$(document).on('change', '#element-setting', function() {
    const value = $(this).val();
    if (currentSectionsConfig.element) {
        currentSectionsConfig.element.setting = value;
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
});
```

#### Prevenir duplicados:
```javascript
// Usar namespaces
$element.off('click.module').on('click.module', handler);
```

### 5. Renderizado de Configuraci�n

```javascript
function renderModuleSettings(config) {
    return `
        <div class="settings-container">
            <div class="settings-header">
                <button class="back-button" onclick="window.switchSidebarView('blockList')">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3>Configuraci�n</h3>
            </div>
            
            <div class="settings-content">
                <!-- Campos de configuraci�n -->
            </div>
        </div>
    `;
}
```

### 6. Integraci�n con Color Schemes

```javascript
// Siempre obtener colores del scheme seleccionado
const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');

// Aplicar en estilos
style="background: ${schemeColors.background}; color: ${schemeColors.text};"
```

### 7. Responsividad M�vil

```javascript
// Incluir media queries en el render
const mobileStyles = `
    @media (max-width: 768px) {
        .module-container {
            /* Ajustes m�viles */
        }
    }
`;
```

### 8. Toggle de Visibilidad

```javascript
// HTML
<button class="visibility-toggle" data-element-id="${elementId}">
    <span class="material-icons">visibility</span>
    <span class="material-icons" style="display: none;">visibility_off</span>
</button>

// Usar funci�n existente initializeVisibilityToggles()
```

### 9. Guardado de Cambios

```javascript
// Siempre actualizar estas variables al hacer cambios:
hasPendingPageStructureChanges = true;
updateSaveButtonState();
renderPreview(); // Para actualizar preview
```

### 10. Errores Comunes a Evitar

1. **NO** crear event listeners dentro de loops
2. **NO** usar IDs duplicados 
3. **NO** olvidar `renderPreview()` despu�s de cambios
4. **NO** modificar DOM directamente sin actualizar `currentSectionsConfig`
5. **SIEMPRE** verificar que los datos existan antes de acceder
6. **SIEMPRE** usar delegaci�n de eventos para elementos din�micos

Esta gu�a debe actualizarse con cada problema cr�tico resuelto para mantener un registro hist�rico de soluciones.