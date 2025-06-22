# Guía COMPLETA para Nuevos Módulos - Website Builder v2

## PUNTO #0: CONSISTENCIA DE NOMBRES - CRÍTICO ANTES DE EMPEZAR

### ⚠️ EL PROBLEMA MÁS COMÚN
El 90% de los problemas vienen por inconsistencia en el ID del módulo.

### Regla de Oro
Elegir UN SOLO ID y usarlo EXACTAMENTE igual en TODOS estos lugares:

1. **Archivo del módulo**: `/modules/imageWithText.js` (camelCase)
2. **Window object**: `window.WebsiteBuilderModules.ImageWithText` (PascalCase)
3. **sectionOrder**: `'imageWithText'` (camelCase)
4. **currentSectionsConfig**: `currentSectionsConfig.imageWithText` (camelCase)
5. **data-section-id en modal**: `'imageWithText'` (camelCase)
6. **switchSidebarView case**: `'imageWithTextSettings'` (camelCase + Settings)
7. **Handler de click del modal**: `sectionId === 'imageWithText'`
8. **Handler de delete**: `section === 'imageWithText'`
9. **renderPreview()**: `sectionId === 'imageWithText'`
10. **Preview.cshtml**: `sectionId === 'imageWithText'`

### ❌ EVITAR
- NO mezclar: 'image-with-text', 'images-with-text', 'imageWithText'
- NO usar plural/singular inconsistentemente
- NO usar guiones en algunos lugares y camelCase en otros

### Ejemplo de Mapeo Correcto (si necesitas soportar legacy)
```javascript
// En el handler del modal:
if (sectionId === 'images-with-text') {
    configKey = 'imageWithText'; // Normalizar al nombre correcto
}

// En Preview.cshtml al cargar datos:
currentSectionsConfig.sectionOrder = currentSectionsConfig.sectionOrder.map(id => {
    if (id === 'images-with-text') return 'imageWithText';
    return id;
});
```

## Flujo General del Proceso

Cuando vayas a crear un nuevo módulo, el proceso comienza preparando la arquitectura modular en un archivo JavaScript separado dentro de la carpeta de módulos. Primero necesitas proporcionar:
1. **La imagen del preview** que se mostrará cuando pases el mouse sobre la opción en el modal de agregar secciones
2. **La imagen del editor** que se mostrará en el preview del editor cuando se agregue el módulo por primera vez (antes de configurarlo)

Una vez que agregues el módulo desde el modal, este aparecerá en el panel lateral y también en el preview del editor. En ese momento necesitarás las vistas de configuración - una para el módulo principal y otra para sus elementos hijos si los tiene.

## PUNTO #1: ARQUITECTURA MODULAR OBLIGATORIA

### Mandato Crítico
**TODOS los módulos nuevos DEBEN implementarse como archivos separados**

- **NO** agregar código a website-builder.js (ya tiene 17,000+ líneas)
- **SÍ** crear archivo en `/wwwroot/js/website-builder/modules/[nombre-modulo].js`
- **Ejemplo exitoso**: Ver `/wwwroot/js/website-builder/modules/multicolumn.js`

### Estructura del Módulo
```javascript
// Archivo: /wwwroot/js/website-builder/modules/nombre-modulo.js
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.NombreModulo = {
    render: function(config) { 
        // Renderizar sección en el preview
        // config = configuración actual guardada del módulo
        if (!config || config.isHidden) return '';
        
        // Obtener color scheme
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        
        // CRÍTICO: Incluir section-header-tag para pestaña azul en hover
        return `
            <div class="section-wrapper" data-section-id="nombreModulo" style="padding: 40px 0;">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">icon_name</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.nombreModulo'] || 'Nombre Módulo') : 
                        'Nombre Módulo'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto;">
                    <!-- Contenido del módulo -->
                </div>
            </div>
        `;
    },
    renderSettings: function(config) { 
        // Renderizar panel de configuración lateral
        return `<div>HTML del panel de settings</div>`;
    },
    attachEventListeners: function() { 
        // Adjuntar event listeners después de renderSettings
        $('#modulo-input').on('change', function() { ... });
    },
    initialize: function() { 
        // Inicialización del módulo (si necesaria)
    }
};
```

### Integración con Código Existente

En `switchSidebarView` (aprox. línea 4815), agregar caso para tu módulo:
```javascript
case 'nombreModuloSettings':
    executeModuleFunction('NombreModulo', 'renderSettings', data);
    break;
```

### Carga del Script - CRÍTICO: 3 ARCHIVOS
**IMPORTANTE**: Cargar DESPUÉS de website-builder.js en estos 3 archivos:

1. `/Views/WebsiteBuilder/Index.cshtml` (Editor principal)
2. `/Views/WebsiteBuilder/PreviewTemplate.cshtml` (Preview del editor - iframe)
3. `/Views/WebsiteBuilder/Preview.cshtml` (Preview real - página completa)

```html
<!-- Después de website-builder.js y website-render-functions.js -->
<script src="~/js/website-builder/modules/nombre-modulo.js?v=@DateTime.Now.Ticks"></script>
```

## PUNTO #2: PREVIEW HOVER Y AGREGADO AL MODAL

### Verificar si el Módulo Ya Existe
```bash
# Buscar en el array de secciones
grep -n "{ id:" website-builder.js | grep -i "tu-modulo"
```

### Implementación del Preview Hover

#### 1. Agregar Imagen Preview
**UBICACIÓN CORRECTA**: `/wwwroot/TestImages/` (NO en `/TestImages/`)
```
/wwwroot/TestImages/nombremodulo-preview.png
```

#### 2. Agregar al Array de Secciones (línea ~10700)
```javascript
{
    id: 'nombreModulo',
    title: 'Nombre Módulo',
    description: 'Descripción del módulo',
    icon: 'icon_name',
    preview: 'nombreModulo'
}
```

#### 3. Agregar al Objeto Previews (línea ~10707)
```javascript
const previews = {
    'slideshow': '/TestImages/slideshowpreview.png',
    'multicolumn': '/TestImages/multicolumimage.png',
    'nombreModulo': '/TestImages/nombremodulo-preview.png' // AGREGAR AQUÍ
};
```

#### 4. Event Handler del Click (línea ~11000)
```javascript
} else if (group === 'template' && sectionId === 'nombreModulo') {
    console.log('[DEBUG] Adding nombreModulo section');
    
    // Inicializar configuración
    if (!currentSectionsConfig.nombreModulo) {
        currentSectionsConfig.nombreModulo = {
            id: 'nombreModulo',
            isHidden: false,
            colorScheme: 'scheme1',
            // Configuración por defecto
        };
    }
    
    // CRÍTICO: Agregar a sectionOrder con el nombre correcto
    if (!currentSectionsConfig.sectionOrder) {
        currentSectionsConfig.sectionOrder = [];
    }
    if (!currentSectionsConfig.sectionOrder.includes('nombreModulo')) {
        currentSectionsConfig.sectionOrder.push('nombreModulo');
    }
    
    // Actualizar UI
    const templateSectionsHtml = renderTemplateSections();
    $('#template-sections-container').html(templateSectionsHtml + /* botón agregar */);
    
    // Post-procesamiento
    setTimeout(applyTranslations, 0);
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview(); // CRÍTICO - actualiza el preview
    
    // Cerrar modal
    M.Modal.getInstance(document.querySelector('.add-section-modal')).close();
}
```

## PUNTO #3: VISTAS DE CONFIGURACIÓN

### Vista Principal de Configuración

**En el módulo** - función `renderSettings`:
```javascript
renderSettings: function(config) {
    const configData = config || {};
    
    return `
        <div class="settings-view">
            <div class="settings-header">
                <button class="back-to-sections-btn">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3 data-i18n="nombreModulo.settings.title">Configuración</h3>
            </div>
            
            <div class="settings-content">
                <!-- Campos de configuración -->
            </div>
        </div>
    `;
}
```

### CRÍTICO: Navegación Correcta
```javascript
// En attachEventListeners del módulo:
$(document).on('click', '.back-to-sections-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.switchSidebarView('blockList', window.getUpdatedPageData());
});
```

### Iconos de Acción en Panel Lateral
```javascript
// En renderBlockListView (línea ~5400):
<div class="subsection-actions">
    <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" 
            data-section="nombreModulo" title="Toggle visibility">
        <i class="material-icons icon-visible">visibility</i>
        <i class="material-icons icon-hidden">visibility_off</i>
    </button>
    <button class="action-icon add-icon" data-section="nombreModulo" title="Add">
        <i class="material-icons">add</i>
    </button>
    <button class="action-icon delete-section" data-section="nombreModulo" title="Delete">
        <i class="material-icons">delete</i>
    </button>
</div>
```

## PUNTO #4: SISTEMA DE TRADUCCIONES

### Agregar Traducciones al Módulo
```javascript
// En el módulo, antes de attachEventListeners:
if (!window.translations) window.translations = { es: {}, en: {} };
if (!window.translations.es.nombreModulo) window.translations.es.nombreModulo = {};
if (!window.translations.en.nombreModulo) window.translations.en.nombreModulo = {};

window.translations.es.nombreModulo = {
    'settings.title': 'Configuración de Nombre Módulo',
    'settings.colorScheme': 'Esquema de colores',
    // ... más traducciones
};

window.translations.en.nombreModulo = {
    'settings.title': 'Name Module Settings',
    'settings.colorScheme': 'Color scheme',
    // ... más traducciones
};
```

### Usar en HTML
```html
<h3 data-i18n="nombreModulo.settings.title">Configuración</h3>
```

## PUNTO #5: SISTEMA DE VISIBILIDAD

### Handler del Toggle (en website-builder.js ~línea 9800)
```javascript
} else if (section === 'nombreModulo' || blockType === 'nombreModulo') {
    currentSectionsConfig.nombreModulo.isHidden = newHiddenState;
    console.log(`[DEBUG] NombreModulo saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
    
    // Force sync the visibility toggle state
    if (window.forceVisibilitySync) {
        window.forceVisibilitySync('nombreModulo', newHiddenState);
    }
}
```

### Sincronización Post-Save (línea ~17300)
```javascript
} else if (currentSidebarView === 'nombreModuloSettings') {
    loadCurrentWebsite().then(() => {
        window.switchSidebarView('blockList', window.getUpdatedPageData());
        
        setTimeout(() => {
            const isHidden = currentSectionsConfig.nombreModulo?.isHidden || false;
            window.forceVisibilitySync('nombreModulo', isHidden);
        }, 200);
    });
}
```

## PUNTO #6: SISTEMA DE GUARDADO

### Variables Globales (NO REDECLARAR)
```javascript
// Ya existen en website-builder.js
let hasPendingGlobalSettingsChanges = false;
let hasPendingPageStructureChanges = false;
```

### Helper de Actualización en el Módulo
```javascript
const updateConfig = (key, value) => {
    if (window.currentSectionsConfig.nombreModulo) {
        window.currentSectionsConfig.nombreModulo[key] = value;
        
        // SIEMPRE estas 3 líneas juntas
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    }
};
```

## PUNTO #7: DELETE HANDLER

### 🔴 PASO CRÍTICO OBLIGATORIO: Actualizar condición de Template Sections

**PRIMERO, agregar el módulo a la condición (~línea 9189):**
```javascript
// For template sections, update the template sections container
if (section === 'imageWithText' || section === 'multicolumn' || section === 'slideshow' || section === 'nombreModulo') {
    // AGREGAR || section === 'nombreModulo' AL FINAL
```

**Sin este paso, el módulo reaparecerá después de guardar!**

### Agregar Caso en Handler (línea ~9080)
```javascript
} else if (section === 'nombreModulo' && currentSectionsConfig.nombreModulo) {
    console.log('[DEBUG] Deleting nombreModulo section');
    
    // Si tiene elementos hijos, eliminarlos primero
    $('#nombreModulo-items-wrapper').remove();
    $('.nombreModulo-child-item').remove();
    
    // Eliminar configuración
    delete currentSectionsConfig.nombreModulo;
    
    // Remover de sectionOrder
    let index = currentSectionsConfig.sectionOrder.indexOf('nombreModulo');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
    
    // También verificar nombres legacy si los hay
    index = currentSectionsConfig.sectionOrder.indexOf('nombre-modulo');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

## PUNTO #8: SISTEMA DE PREVIEW - DOS TIPOS

### Preview del Editor (iframe central)
- **Archivo**: `/Views/WebsiteBuilder/PreviewTemplate.cshtml`
- **Función**: `renderPreview()` en website-builder.js (línea ~1747)
- **Contexto**: Iframe dentro del editor

### Preview Real (página completa)
- **Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`
- **Ruta**: Se abre con el ícono del ojo en el header
- **Contexto**: Página independiente que simula el sitio final

### Agregar al renderPreview() (línea ~1820)
```javascript
} else if (sectionId === 'nombreModulo') {
    const config = currentSectionsConfig.nombreModulo;
    if (config && !config.isHidden) {
        const moduleRender = iframeWindow.WebsiteBuilderModules?.NombreModulo?.render;
        if (moduleRender) {
            finalHtml += moduleRender(config);
        } else if (iframeWindow.renderNombreModulo) {
            finalHtml += iframeWindow.renderNombreModulo(config);
        }
    }
}
```

### Crear Función Fallback (en website-builder.js)
```javascript
function renderNombreModulo(config) {
    console.log('[NOMBRE-MODULO FALLBACK] Rendering with config:', config);
    
    if (!config || config.isHidden) {
        return '';
    }
    
    return `
        <div class="section-wrapper nombre-modulo-section" 
             data-section-id="nombreModulo" 
             style="padding: 40px 0; background: #f5f5f5;">
            <div class="section-header-tag">
                <span class="material-symbols-outlined" style="font-size: 16px;">icon_name</span>
                ${translations[currentLanguage]?.['sections.nombreModulo'] || 'Nombre Módulo'}
            </div>
            <div class="container" style="max-width: 1200px; margin: 0 auto;">
                <div style="text-align: center; color: #666;">
                    <i class="material-icons" style="font-size: 48px;">widgets</i>
                    <h3>Nombre Módulo</h3>
                    <p>Esta sección mostrará el contenido del módulo.</p>
                </div>
            </div>
        </div>
    `;
}
```

### Agregar Mapeo de Renderizadores (línea ~1840)
```javascript
const renderers = {
    'announcement': renderAnnouncementBar,
    'header': renderHeader,
    'slideshow': renderSlideshow,
    'multicolumn': window.WebsiteBuilderModules?.Multicolumn?.render || renderMulticolumn,
    'imageWithText': window.WebsiteBuilderModules?.ImageWithText?.render || renderImageWithText,
    'nombreModulo': window.WebsiteBuilderModules?.NombreModulo?.render || renderNombreModulo
};
```

### En Preview.cshtml - Agregar Caso (línea ~535)
```javascript
} else if (sectionId === 'nombreModulo') {
    console.log('[PREVIEW] Processing nombreModulo section');
    const config = currentSectionsConfig.nombreModulo;
    
    if (config && !config.isHidden) {
        if (window.WebsiteBuilderModules?.NombreModulo?.render) {
            console.log('[PREVIEW] Rendering nombreModulo with module');
            finalHtml += window.WebsiteBuilderModules.NombreModulo.render(config);
        } else {
            console.log('[PREVIEW] Module not available, using fallback');
            finalHtml += `<div>Nombre Módulo cargando...</div>`;
        }
    }
}
```

### Helpers Necesarios en Preview.cshtml
```javascript
// Ya agregados en el fix:
window.getColorSchemeValues = function(schemeName) { ... }
window.getFontNameFromValueSafe = function(fontValue) { ... }
```

## PUNTO #9: ESTRUCTURA DE DATOS

### Dónde se Guardan los Datos
```javascript
// En la base de datos:
{
    sectionsConfigJson: {
        sectionOrder: ['header', 'nombreModulo', 'footer'],
        nombreModulo: {
            id: 'nombreModulo',
            isHidden: false,
            colorScheme: 'scheme1',
            // ... configuración específica
        }
    }
}
```

### Arrays de Orden para Sub-elementos
```javascript
// CRÍTICO: Si tu módulo tiene elementos hijos
currentSectionsConfig.nombreModulo = {
    items: { 
        'item1': { content: '...', isHidden: false },
        'item2': { content: '...', isHidden: false }
    },
    itemOrder: ['item1', 'item2'] // SIN ESTO NO SE RENDERIZAN
}

// Al agregar un nuevo item:
currentSectionsConfig.nombreModulo.items[newId] = { ... };
currentSectionsConfig.nombreModulo.itemOrder.push(newId); // NO OLVIDAR
```

### Normalización de Datos Legacy
```javascript
// Si guardaste con nombre incorrecto, en Preview.cshtml:
if (currentSectionsConfig.sectionOrder) {
    currentSectionsConfig.sectionOrder = currentSectionsConfig.sectionOrder.map(id => {
        if (id === 'nombre-modulo') return 'nombreModulo';
        return id;
    });
}
```

## PUNTO #10: DRAG & DROP

### Para Elementos Principales
```javascript
// En initializeDragAndDropSimple() (línea ~10200)
// Ya maneja automáticamente elementos con clase 'sidebar-subsection'
```

### Para Elementos Hijos

#### ⚠️ IMPORTANTE: Espaciado del Drag Handle
Cuando crees elementos hijos con drag handle, **SIEMPRE** agrega margen izquierdo al texto para evitar superposición:

```html
<div class="sidebar-subsection item-hijo" style="padding-left: 30px;">
    <i class="material-icons drag-handle">drag_handle</i>
    <span class="subsection-text" style="margin-left: 30px;">Texto del elemento</span>
    <!-- SIN margin-left: 30px el texto se superpone con el drag handle -->
</div>
```

```javascript
// En tu módulo, después de renderizar:
setTimeout(() => {
    $('#nombreModulo-items-container').sortable({
        items: '.nombreModulo-item',
        handle: '.drag-handle',
        placeholder: 'sortable-placeholder',
        start: function(e, ui) {
            // Si los hijos tienen sub-hijos, usar patrón wrapper
        },
        stop: function(e, ui) {
            // Actualizar itemOrder
            const newOrder = [];
            $('.nombreModulo-item').each(function() {
                newOrder.push($(this).data('item-id'));
            });
            currentSectionsConfig.nombreModulo.itemOrder = newOrder;
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        }
    });
}, 100);
```

## PUNTO #11: SISTEMA DE PREVIEW REAL (PÁGINA COMPLETA)

### Preview Real vs Preview Editor
**Preview Editor**: iframe dentro del editor (PreviewTemplate.cshtml)
**Preview Real**: página completa que simula el sitio final (Preview.cshtml)

### REQUISITOS PARA QUE APAREZCA EN PREVIEW REAL

1. **Cargar el módulo en Preview.cshtml**:
```html
<!-- En Preview.cshtml, después de otros módulos -->
<script src="~/js/website-builder/modules/nombre-modulo.js?v=@DateTime.Now.Ticks"></script>
```

2. **Estar en sectionOrder**: El módulo debe estar en el array `sectionOrder` con el nombre correcto

3. **No estar oculto**: `isHidden` debe ser false

4. **Tener caso en renderPreviewContent()**: En Preview.cshtml línea ~500:
```javascript
} else if (sectionId === 'nombreModulo' || sectionId === 'nombre-modulo') {
    const config = currentSectionsConfig.nombreModulo;
    if (config && !config.isHidden) {
        if (window.WebsiteBuilderModules?.NombreModulo?.render) {
            finalHtml += window.WebsiteBuilderModules.NombreModulo.render(config);
        }
    }
}
```

5. **Helpers disponibles**: Las funciones `getColorSchemeValues` y `getFontNameFromValueSafe` ya están agregadas

### DEBUGGING PREVIEW REAL
Si no aparece, verificar en consola:
```javascript
console.log('[PREVIEW] Section order:', currentSectionsConfig?.sectionOrder);
console.log('[PREVIEW] NombreModulo config:', currentSectionsConfig?.nombreModulo);
console.log('[PREVIEW] Module loaded?', window.WebsiteBuilderModules?.NombreModulo);
```

## CHECKLIST FINAL - VERIFICACIÓN COMPLETA

### Consistencia de Nombres
- [ ] UN SOLO ID elegido (preferir camelCase: `nombreModulo`)
- [ ] Usado consistentemente en TODOS los lugares listados en PUNTO #0
- [ ] NO hay mezcla de guiones/camelCase

### Archivos y Carga
- [ ] Módulo en `/wwwroot/js/website-builder/modules/nombre-modulo.js`
- [ ] Script cargado en Index.cshtml
- [ ] Script cargado en PreviewTemplate.cshtml
- [ ] Script cargado en Preview.cshtml
- [ ] Orden correcto: después de website-builder.js

### Modal y Preview Hover
- [ ] Imagen en `/wwwroot/TestImages/` (NO en `/TestImages/`)
- [ ] Agregado al array de secciones del modal
- [ ] Agregado al objeto previews
- [ ] Handler de click implementado
- [ ] Se agrega a sectionOrder con nombre correcto

### Panel Lateral
- [ ] Aparece después de agregar desde modal
- [ ] Tiene los 3 iconos: visibility, add, delete
- [ ] Click abre la vista de configuración
- [ ] Navegación de regreso funciona correctamente

### Configuración
- [ ] switchSidebarView tiene el caso para tu módulo
- [ ] Vista de configuración se renderiza
- [ ] Event listeners funcionan
- [ ] Cambios marcan hasPendingPageStructureChanges

### Preview del Editor (iframe)
- [ ] Caso agregado en renderPreview()
- [ ] Función fallback existe
- [ ] Se renderiza correctamente
- [ ] Respeta isHidden
- [ ] Section-header-tag incluido (pestaña azul en hover)

### Preview Real
- [ ] Módulo cargado en Preview.cshtml
- [ ] Caso agregado en renderPreviewContent()
- [ ] Helpers necesarios disponibles
- [ ] Se renderiza correctamente
- [ ] Maneja nombres legacy si es necesario

### Funcionalidades
- [ ] Toggle de visibilidad funciona
- [ ] Estado persiste después de guardar
- [ ] Delete elimina de sectionOrder
- [ ] Delete elimina elementos hijos si los tiene
- [ ] Delete actualiza template sections container (CRÍTICO)
- [ ] Drag & drop funciona (si aplica)

### Guardado
- [ ] Usa nombre correcto en configuración
- [ ] Arrays de orden actualizados (si tiene hijos)
- [ ] No sobrescribe con valores por defecto
- [ ] Se guarda en sectionsConfigJson

## PROBLEMAS COMUNES Y SOLUCIONES

### 1. "No aparece en el preview del editor"
**Síntomas**: Se agrega al panel pero no se ve en el iframe central
**Causas comunes**:
- No está en sectionOrder o está con nombre incorrecto
- Módulo no cargado en PreviewTemplate.cshtml
- Falta caso en renderPreview()
- isHidden está en true

**Solución**:
1. Verificar console.log en renderPreview()
2. Verificar que sectionOrder contenga el nombre correcto
3. Verificar que el módulo esté cargado en el iframe

### 2. "No aparece en el preview real"
**Síntomas**: Se ve en editor pero no al hacer click en el ojo
**Causas comunes**:
- Módulo no cargado en Preview.cshtml
- Falta caso en renderPreviewContent()
- Nombre incorrecto en sectionOrder guardado en BD
- Falta helper function (getColorSchemeValues)

**Solución**:
1. Agregar módulo a Preview.cshtml
2. Agregar caso en renderPreviewContent()
3. Normalizar nombres al cargar datos
4. Verificar logs en consola

### 3. "Toggle de visibilidad no mantiene estado"
**Síntomas**: El ojo se tacha pero después de guardar aparece sin tachar
**Causas comunes**:
- Falta sincronización después de guardar
- Estilos inline interfieren con clases CSS

**Solución**:
1. Agregar caso en handler de visibilidad
2. Usar forceVisibilitySync después de guardar
3. Agregar caso en sincronización post-save

### 4. "Delete no funciona"
**Síntomas**: Click en delete no hace nada o da error
**Causas comunes**:
- No agregaste caso en handler de delete
- data-section no coincide con el nombre

**Solución**:
1. Agregar caso específico en línea ~9080
2. Verificar que elimine de sectionOrder todos los nombres posibles

### 5. "Elementos hijos no se renderizan"
**Síntomas**: La configuración existe pero no aparecen los elementos
**Causas comunes**:
- Falta array de orden (itemOrder, blockOrder, etc.)
- No se agregó el elemento al array al crearlo

**Solución**:
```javascript
// Al crear elemento:
config.items[newId] = { ... };
config.itemOrder.push(newId); // CRÍTICO
```

### 6. "Cambios no persisten"
**Síntomas**: Haces cambios pero después de guardar vuelven los valores anteriores
**Causas comunes**:
- Vista se recarga y aplica valores por defecto
- Deep merge sobrescribe valores guardados

**Solución**:
1. NO recargar la vista después de guardar
2. Verificar que no estés inicializando con valores por defecto
3. Usar loadCurrentWebsite() antes de aplicar cambios

## MIGRANDO MÓDULOS EXISTENTES

Si tienes un módulo con problemas, sigue estos pasos:

### 1. Auditoría de Nombres
```bash
# Buscar todos los usos del nombre
grep -n "tu-modulo\|tuModulo\|tu_modulo" website-builder.js
```

### 2. Normalización
- Elegir UN nombre (preferir camelCase)
- Actualizar TODOS los lugares
- Agregar mapeo para nombres legacy

### 3. Verificar Carga
- Agregar a los 3 archivos .cshtml
- Verificar que las funciones render existan

### 4. Testing
- Agregar desde modal
- Verificar preview editor
- Verificar preview real
- Probar guardar y recargar
- Probar delete

## CONCLUSIÓN

Esta guía cubre TODOS los aspectos necesarios para implementar un módulo nuevo correctamente. Los problemas más comunes vienen de:

1. **Inconsistencia de nombres** (90% de los casos)
2. **No cargar en todos los archivos necesarios**
3. **No agregar casos en handlers críticos**
4. **No mantener arrays de orden**

Siguiendo esta guía paso a paso, deberías poder implementar cualquier módulo nuevo sin problemas.

**Tiempo estimado**: 
- Con esta guía: 45-60 minutos
- Sin guía (descubriendo problemas): 3-4 horas

**Recuerda**: La consistencia es clave. Un nombre, usado igual en todas partes.

## PUNTOS EXTRAS DE LA DOCUMENTACIÓN ANTERIOR

### PUNTO #7: COLOR SCHEMES CONFIGURATION

### Sistema de Color Schemes
El sistema usa 5 esquemas de color predefinidos (scheme1 a scheme5). Los módulos deben respetar estos esquemas seleccionados.

### 7.1 OBTENER COLORES DEL SCHEME

**Función helper existente** (website-render-functions.js):
```javascript
// Esta función ya existe - NO redefinir
function getColorSchemeValues(schemeName) {
    // Busca primero en configuración personalizada
    // Luego en esquemas predefinidos
    return schemeColors;
}
```

**Estructura de colores retornados**:
```javascript
{
    background: '#ffffff',
    text: '#333333',
    foreground: '#f0f0f0',
    border: '#e5e5e5',
    link: '#2c6ecb'
}
```

### 7.2 AGREGAR SELECT EN CONFIGURACIÓN

```javascript
// En renderSettings del módulo
<div class="settings-field" style="margin-bottom: 20px;">
    <label style="display: block; font-size: 13px; color: #202223; margin-bottom: 8px;">
        <span data-i18n="nombreModulo.fields.colorScheme">Esquema de color</span>
    </label>
    <select id="module-color-scheme" class="shopify-select" style="width: 100%;">
        <option value="scheme1" ${config.colorScheme === 'scheme1' ? 'selected' : ''}>Esquema 1</option>
        <option value="scheme2" ${config.colorScheme === 'scheme2' ? 'selected' : ''}>Esquema 2</option>
        <option value="scheme3" ${config.colorScheme === 'scheme3' ? 'selected' : ''}>Esquema 3</option>
        <option value="scheme4" ${config.colorScheme === 'scheme4' ? 'selected' : ''}>Esquema 4</option>
        <option value="scheme5" ${config.colorScheme === 'scheme5' ? 'selected' : ''}>Esquema 5</option>
    </select>
</div>
```

### PUNTO #8: SISTEMA DE TIPOGRAFÍA

### Tipos de Tipografía Disponibles
El sistema maneja **3 tipos de tipografía**:
- **`body`** - Textos generales y contenido
- **`heading`** - Títulos y encabezados
- **`menu`** - Elementos de navegación (raramente usado en módulos)

### 8.1 OBTENER TIPOGRAFÍA DEL SISTEMA

```javascript
// En función render del módulo
const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};

// Convertir valores a nombres de fuente reales
const headingFont = window.getFontNameFromValueSafe ? 
    window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
    'Helvetica';

const bodyFont = window.getFontNameFromValueSafe ? 
    window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
    'Roboto';
```

### PUNTO #9: RESPONSIVIDAD MÓVIL

### Concepto Crítico: ID Único
**SIEMPRE generar ID único para evitar conflictos de estilos**:
```javascript
const uniqueId = 'module-' + Date.now();
```

### 9.1 ESTRUCTURA BASE CON MEDIA QUERIES

```javascript
render: function(config) {
    const uniqueId = 'module-' + Date.now();
    
    return `
        <style>
            /* Media queries para móvil */
            @media (max-width: 768px) {
                #${uniqueId} {
                    padding: 30px 0 !important; /* vs 60px desktop */
                }
                
                #${uniqueId} h2 {
                    font-size: 24px !important; /* vs 36px desktop */
                }
            }
        </style>
        
        <div id="${uniqueId}" class="module-wrapper">
            <!-- Contenido del módulo -->
        </div>
    `;
}
```

### PUNTO #10: PREVIEW REAL (ÍCONO DEL OJO) - ACTUALIZADO

### Para que tu módulo aparezca en el preview real necesitas:

1. **Script cargado en Preview.cshtml**
2. **Estar en sectionOrder con el nombre correcto**
3. **Caso agregado en renderPreviewContent()**
4. **No estar marcado como isHidden**
5. **Helpers necesarios disponibles** (ya agregados en los fixes)

### Debugging si no aparece:
```javascript
// En Preview.cshtml, agregar logs:
console.log('[PREVIEW] Processing:', sectionId);
console.log('[PREVIEW] Config exists:', !!currentSectionsConfig.nombreModulo);
console.log('[PREVIEW] Module loaded:', !!window.WebsiteBuilderModules?.NombreModulo);
```

Esta documentación ahora contiene TODA la información necesaria para implementar correctamente un módulo nuevo, incluyendo todas las lecciones aprendidas de los problemas con imageWithText.