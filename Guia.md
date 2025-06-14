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

Esta gu�a debe actualizarse con cada problema cr�tico resuelto para mantener un registro hist�rico de soluciones.