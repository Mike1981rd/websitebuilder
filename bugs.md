# Bugs Arreglados - Sesión del 03/08/2025

## 1. Error de Tipo de Datos en Módulo Testimonials

### Descripción del Bug
Los inputs de tipo `number` en el módulo testimonials estaban recibiendo valores de string como "heading3" y "body3", causando warnings en la consola del navegador:
```
The specified value "heading3" cannot be parsed, or is out of range.
The specified value "body3" cannot be parsed, or is out of range.
```

### Causa Raíz
Durante la implementación del plan `velocidadpagina.md`, se cambió el sistema de tipografía pero el módulo testimonials no fue actualizado para manejar el nuevo formato.

### Solución Implementada

#### Archivo: `/wwwroot/js/website-builder/modules/testimonials.js`

**Líneas 579-605**: Conversión de valores string a numéricos en el renderizado
```javascript
// Antes:
<input type="number" value="${configData.headingSize || 3}">

// Después:
<input type="number" value="${(() => {
    if (typeof configData.headingSize === 'number') return configData.headingSize;
    const match = configData.headingSize?.match(/heading(\d)/);
    return match ? parseInt(match[1]) - 1 : 3;
})()}">
```

**Líneas 1225-1254**: Conversión de valores numéricos a string en event handlers
```javascript
// Antes:
updateConfig('headingSize', parseInt(value));

// Después:
const headingValue = `heading${parseInt(value) + 1}`;
updateConfig('headingSize', headingValue);
```

---

## 2. Header No Guardaba Cambios de Color Scheme

### Descripción del Bug
Al cambiar el color scheme del header y guardar, los cambios revertían inmediatamente a la configuración anterior. El guardado funcionaba (se veía al refrescar la página) pero la UI no mantenía los cambios.

### Causa Raíz
Después de guardar, el código recargaba los datos desde el servidor (`loadCurrentWebsite()`), sobrescribiendo los cambios recién guardados con los datos antiguos antes de que el servidor procesara completamente la actualización.

### Solución Implementada

#### Archivo: `/wwwroot/js/website-builder.js`

**Líneas 27756-27768**: Eliminar recarga desde servidor para headerSettings
```javascript
// Antes:
loadCurrentWebsite().then(() => {
    window.switchSidebarView('headerSettings');
});

// Después:
// Don't reload from server, just refresh the view with current data
window.switchSidebarView('headerSettings');
```

**Líneas 25045-25046**: Agregar actualización de checkboxes de visibilidad
```javascript
// Agregado:
$('#header-show-search-icon').prop('checked', config.sectionVisibility?.searchIcon !== false);
$('#header-show-account-icon').prop('checked', config.sectionVisibility?.accountIcon !== false);
```

---

## 3. Preview No Se Actualizaba Después de Guardar

### Descripción del Bug
Después de guardar cambios en el header o announcement bar, el preview del editor no mostraba los cambios inmediatamente. Era necesario guardar dos veces o refrescar para ver los cambios.

### Causa Raíz
Faltaba la llamada a `renderPreview()` después de guardar en ciertas vistas.

### Solución Implementada

#### Archivo: `/wwwroot/js/website-builder.js`

**Líneas 27764-27768**: Agregar renderPreview después de guardar header
```javascript
// Force re-render preview to show the changes
setTimeout(() => {
    console.log('[DEBUG] Force re-rendering preview after header save');
    window.renderPreview();
}, 100);
```

**Líneas 27776-27780**: Agregar renderPreview después de guardar announcement bar
```javascript
// Force re-render preview first
setTimeout(() => {
    console.log('[DEBUG] Force re-rendering preview after announcement bar save');
    window.renderPreview();
}, 100);
```

---

## 4. Cache del Navegador Impedía Ver Cambios en Preview Real

### Descripción del Bug
En el preview real (página pública), los cambios no se reflejaban sin hacer un hard reload y limpiar cache del navegador. Esto ocurría tanto en desarrollo como sería en producción.

### Causa Raíz
El plan `velocidadpagina.md` implementó cache agresivo para mejorar el rendimiento, pero no implementó cache busting para cuando hay cambios.

### Solución Implementada

#### Archivo: `/Controllers/WebsiteBuilderController.cs`

**Líneas 9-14**: Inyección de dependencias
```csharp
private readonly HotelDbContext _context;

public WebsiteBuilderController(HotelDbContext context)
{
    _context = context;
}
```

**Líneas 35-47**: Obtener timestamp dinámico para cache busting
```csharp
// Get the website to use its UpdatedAt as cache version
var website = await _context.WebSites.FirstOrDefaultAsync();
if (website != null)
{
    ViewBag.CacheVersion = ((DateTimeOffset)website.UpdatedAt).ToUnixTimeSeconds();
}
else
{
    ViewBag.CacheVersion = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
}
```

**Líneas 110-126**: Headers de cache inteligentes
```csharp
// Only add no-cache headers if we're in development or if it's accessed from the editor
var referrer = Request.Headers["Referer"].ToString();
var isFromEditor = referrer.Contains("/WebsiteBuilder") || referrer.Contains("/websitebuilder");
var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

if (isDevelopment || isFromEditor)
{
    Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    Response.Headers["Pragma"] = "no-cache";
    Response.Headers["Expires"] = "0";
}
else
{
    Response.Headers["Cache-Control"] = "public, max-age=300"; // Cache for 5 minutes
}
```

#### Archivo: `/Views/WebsiteBuilder/Preview.cshtml`

**Líneas 3-4**: Usar versión dinámica en lugar de hardcodeada
```csharp
// Antes:
var version = "1.0.1";

// Después:
var version = ViewBag.CacheVersion ?? DateTimeOffset.UtcNow.ToUnixTimeSeconds();
```

**Líneas 11-13**: Meta tags de no-cache
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

**Líneas 405-406**: Cache busting en API call
```javascript
// Antes:
const response = await fetch('/api/builder/websites/current');

// Después:
const timestamp = new Date().getTime();
const response = await fetch(`/api/builder/websites/current?_t=${timestamp}`);
```

---

## 5. Featured Collection Requería Recargar Página para Ver Cambios

### Descripción del Bug
Al hacer cambios en la configuración de Featured Collection y guardar, los cambios no se reflejaban en el editor hasta refrescar la página. Similar al bug del header.

### Causa Raíz
Featured Collection no tenía un caso específico en el manejo post-guardado, por lo que estaba cayendo en el comportamiento por defecto que recarga los datos desde el servidor, sobrescribiendo los cambios locales.

### Solución Implementada

#### Archivo: `/wwwroot/js/website-builder.js`

**Líneas 28092-28104**: Agregar caso específico para featured collection
```javascript
} else if (currentSidebarView === 'featuredCollectionSettings') {
    // Mantener la vista de featured collection abierta después de guardar
    console.log('[DEBUG] Staying in featured collection settings view after save');
    // Don't reload from server, just refresh the view with current data
    const sectionId = window.currentFeaturedCollectionId;
    window.switchSidebarView('featuredCollectionSettings');
    
    // Force re-render preview to show the changes
    setTimeout(() => {
        console.log('[DEBUG] Force re-rendering preview after featured collection save');
        window.renderPreview();
    }, 100);
}
```

Este fix:
- Evita la recarga desde el servidor
- Mantiene los datos locales actualizados
- Refresca la vista con los cambios
- Actualiza el preview inmediatamente

---

## 6. Contact Form Perdía ID Entre Guardados (Multi-Instancia)

### Descripción del Bug
Contact Form es un módulo multi-instancia (puede haber varios formularios con IDs únicos como `contact-form-1234`, `contact-form-5678`). Al guardar cambios, funcionaba la primera vez pero fallaba en guardados subsecuentes porque perdía el ID del formulario específico.

### Causa Raíz
A diferencia de otros módulos singleton, Contact Form necesita mantener el ID específico del formulario que se está editando. El código intentaba obtener el ID de diferentes fuentes pero no lo mantenía persistente entre guardados.

### Solución Implementada - Patrón Variable Global

#### Archivo: `/wwwroot/js/website-builder.js`

**Línea 21**: Declarar variable global para el ID
```javascript
let currentContactFormId = null; // Track current contact form ID being edited
```

**Líneas 8055-8057**: Guardar ID cuando se renderiza la vista
```javascript
// Store the current contact form ID globally
currentContactFormId = contactFormId;
console.log('[DEBUG] Stored currentContactFormId:', currentContactFormId);
```

**Líneas 15995-15997**: Guardar ID cuando se hace click desde sidebar
```javascript
// Store the current contact form ID globally
currentContactFormId = contactFormId;
console.log('[DEBUG] Contact form clicked, stored ID:', currentContactFormId);
```

**Líneas 3635-3637**: Guardar ID cuando se hace click desde preview
```javascript
// Store the current contact form ID globally
currentContactFormId = contactFormId;
console.log('[DEBUG] Contact form preview clicked, stored ID:', currentContactFormId);
```

**Líneas 28122-28124**: Usar ID guardado en post-guardado
```javascript
// Use the globally stored contact form ID
const contactFormId = currentContactFormId;
console.log('[DEBUG] Using stored contactFormId:', contactFormId);
```

### Diferencias con el Fix Estándar
Este fix es diferente porque:
1. **Requiere variable global** para mantener el ID específico
2. **Múltiples puntos de captura** del ID (vista, sidebar, preview)
3. **Validación del ID** antes de refrescar la vista
4. **Manejo de multi-instancia** vs módulos singleton

### Patrón Reusable para Módulos Multi-Instancia
```javascript
// 1. Declarar variable global
let currentModuleInstanceId = null;

// 2. Capturar ID en todos los puntos de entrada
// - Al renderizar vista
// - Al hacer click desde sidebar
// - Al hacer click desde preview

// 3. Usar ID guardado en post-guardado
const instanceId = currentModuleInstanceId;
```

---

## 7. Rich Text Settings No Se Ejecutaba el Handler Post-Guardado

### Descripción del Bug
Rich Text tenía los mismos síntomas que otros módulos (requería recargar página después del segundo guardado), pero el fix inicial no funcionó porque el caso `else if` estaba en la ubicación incorrecta del código.

### Causa Raíz - Problema de Ubicación de Código
El código tiene una estructura compleja de guardado con múltiples niveles:
```javascript
if (allOk) {
    // Línea 27717: Aquí es donde se ejecutan los handlers
    if (currentSidebarView === 'blockList') {
        // ...
    } else if (currentSidebarView === 'headerSettings') {
        // ...
    } // ... más casos
}
// Línea 28140+: UBICACIÓN INCORRECTA - fuera del bloque if(allOk)
```

**El problema**: Agregué inicialmente el caso de Rich Text DESPUÉS del cierre del bloque `if (allOk)`, por lo que nunca se ejecutaba.

### Por Qué Fue Difícil de Diagnosticar
1. **Estructura del código muy larga**: El bloque `if (allOk)` tiene más de 400 líneas
2. **Múltiples niveles de anidación**: Difícil ver dónde termina cada bloque
3. **Sin caso por defecto**: No había un `else` final que capturara casos no manejados
4. **Logs engañosos**: El log `Current sidebar view after save: richTextSettings` aparecía, pero los handlers específicos no

### Solución Implementada - Caso en Ubicación Correcta

#### Archivo: `/wwwroot/js/website-builder.js`

**Líneas 27970-27982**: Agregar caso en la cadena principal
```javascript
} else if (currentSidebarView === 'richTextSettings') {
    // Mantener la vista de rich text abierta después de guardar
    console.log('[DEBUG] Staying in rich text settings view after save');
    console.log('[DEBUG] Current richText config:', JSON.stringify(currentSectionsConfig.richText, null, 2));
    
    // Don't reload from server, just refresh the view with current data
    window.switchSidebarView('richTextSettings');
    
    // Force re-render preview to show the changes
    setTimeout(() => {
        console.log('[DEBUG] Force re-rendering preview after rich text save');
        window.renderPreview();
    }, 100);
}
```

**Líneas 28140-28175**: Eliminar caso duplicado mal ubicado

### Diferencia con Otros Fixes
1. **Problema de ubicación**: Otros módulos tenían casos en el lugar correcto pero con lógica incorrecta
2. **Sin caso existente**: Rich Text no tenía ningún caso en la cadena principal
3. **Debug más complejo**: Requirió rastrear el flujo de ejecución a través de cientos de líneas

### Lecciones Aprendidas
1. **Siempre verificar la ubicación del código** en estructuras grandes
2. **Agregar logs antes y después** del bloque donde se espera que entre
3. **Considerar agregar un caso else por defecto** para detectar vistas no manejadas
4. **En archivos grandes**, usar búsqueda para confirmar que no hay casos duplicados

---

## 8. Multicolumn Requería Recargar Página en Segundo Guardado

### Descripción del Bug
Multicolumn mostraba el mismo síntoma que otros módulos: después del primer guardado funcionaba bien, pero el segundo guardado requería refrescar la página para ver los cambios.

### Causa Raíz
Multicolumn es un **módulo externo** (no código inline) que requiere:
1. Re-renderizar la vista con `switchSidebarView()`
2. Re-adjuntar event listeners después de refrescar el DOM
3. El módulo perdía sus bindings después del primer guardado

### Diferencia con Otros Módulos
- **Módulos inline** (header, rich text): Solo necesitan `switchSidebarView()` y `renderPreview()`
- **Módulos externos** (multicolumn, testimonials): Necesitan además re-ejecutar `attachEventListeners()`

### Solución Implementada

#### Archivo: `/wwwroot/js/website-builder.js`

**Líneas 27956-27974**: Agregar re-attach de event listeners
```javascript
} else if (currentSidebarView === 'multicolumnSettings') {
    // Mantener la vista de multicolumn abierta después de guardar
    console.log('[DEBUG] Staying in multicolumn settings view after save');
    console.log('[DEBUG] Current multicolumn config:', JSON.stringify(currentSectionsConfig.multicolumn, null, 2));
    
    // Don't reload from server, just refresh the view with current data
    window.switchSidebarView('multicolumnSettings');
    
    // Force re-render preview to show the changes
    setTimeout(() => {
        console.log('[DEBUG] Force re-rendering preview after multicolumn save');
        window.renderPreview();
        
        // Also re-attach event listeners for the module
        if (window.WebsiteBuilderModules?.Multicolumn?.attachEventListeners) {
            console.log('[DEBUG] Re-attaching Multicolumn event listeners');
            window.WebsiteBuilderModules.Multicolumn.attachEventListeners();
        }
    }, 100);
}
```

### Patrón para Módulos Externos
Cuando un módulo usa `WebsiteBuilderModules`, después de guardar:
1. Refrescar vista con `switchSidebarView()`
2. Actualizar preview con `renderPreview()`
3. **Re-adjuntar event listeners** con `WebsiteBuilderModules.ModuleName.attachEventListeners()`

### Módulos que Probablemente Necesiten Este Patrón
- Testimonials (ya tiene algo similar)
- Gallery
- Contact Form
- Cualquier módulo que use `WebsiteBuilderModules`

---

## Error Pendiente en Producción

### Error 413 - Request Entity Too Large
Este error ocurre en producción cuando el JSON del website builder es muy grande. La solución requiere aumentar el límite en la configuración de Nginx:

```nginx
client_max_body_size 10M;
```

Este cambio debe hacerse en el servidor de producción.

---

## Resumen de Impacto

1. **Módulo Testimonials**: Ahora funciona correctamente sin warnings en consola
2. **Guardado de Header**: Los cambios persisten inmediatamente en la UI
3. **Preview del Editor**: Se actualiza automáticamente después de guardar
4. **Cache del Preview**: 
   - En desarrollo: Sin cache (cambios inmediatos)
   - Desde el editor: Sin cache (cambios inmediatos)
   - Visitantes públicos: Cache de 5 minutos (buen rendimiento)

## Testing Recomendado

1. **En Desarrollo**:
   - ✅ Verificar que no hay warnings en consola al abrir testimonials
   - ✅ Cambiar color scheme del header y verificar que persiste
   - ✅ Verificar que el preview se actualiza sin refrescar

2. **En Producción**:
   - Verificar que visitantes públicos tienen buen rendimiento
   - Verificar que desde el editor los cambios son inmediatos
   - Configurar Nginx para resolver error 413