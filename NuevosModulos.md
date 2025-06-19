# Guía de Estandarización para Nuevos Módulos - Website Builder

## Flujo General del Proceso

Cuando vayas a crear un nuevo módulo, el proceso comienza preparando la arquitectura modular en un archivo JavaScript separado dentro de la carpeta de módulos. Primero necesitas que te proporcione:
1. **La imagen del preview** que se mostrará cuando pases el mouse sobre la opción en el modal de agregar secciones
2. **La imagen del editor** que se mostrará en el preview del editor cuando se agregue el módulo por primera vez (antes de configurarlo)

Una vez que agregues el módulo desde el modal, este aparecerá en el panel lateral y también en el preview del editor. En ese momento necesitarás las vistas de configuración - una para el módulo principal y otra para sus elementos hijos si los tiene. Estas vistas permitirán configurar todos los aspectos del módulo, incluyendo la capacidad de agregar elementos hijos, reordenarlos mediante arrastre, y eliminarlos.

El módulo debe implementar el sistema de traducciones para que todos los textos sean dinámicos según el idioma seleccionado. También necesita el toggle de visibilidad (el ícono del ojo) para que el usuario pueda ocultar o mostrar la sección sin eliminarla. Todo se guarda automáticamente con el sistema unificado cuando el usuario presiona el botón guardar en la barra superior.

Para la apariencia visual, el módulo debe respetar los esquemas de color seleccionados por el usuario y aplicar la tipografía correcta del sistema - usando las fuentes de encabezado para títulos y las fuentes de cuerpo para el contenido general. Además, debe ser completamente responsivo, adaptándose a dispositivos móviles con tamaños de fuente reducidos y layouts optimizados.

Finalmente, cuando el usuario haga clic en el ícono del ojo en el header para ver el preview real de la página, tu módulo debe aparecer correctamente renderizado en esa vista, mostrando exactamente cómo se verá en el sitio web final sin los elementos de edición como las pestañas azules.

## PUNTO #1: ARQUITECTURA MODULAR OBLIGATORIA

### Mandato Crítico
**TODOS los módulos nuevos DEBEN implementarse como archivos separados**

- **NO** agregar código a website-builder.js (ya tiene 15,000+ líneas)
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
        return `<div>HTML del módulo</div>`;
    },
    renderSettings: function(config) { 
        // Renderizar panel de configuración lateral
        // config = configuración actual del módulo
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
**Ubicación**: La función `executeModuleFunction` ya existe al final de website-builder.js

En `switchSidebarView` (aprox. línea 2500), agregar caso para tu módulo:
```javascript
case 'nombreModuloSettings':
    executeModuleFunction('NombreModulo', 'renderSettings', data);
    // data = currentSectionsConfig.nombreModulo (configuración actual)
    break;
```

### Carga del Script
**IMPORTANTE**: Cargar DESPUÉS de website-builder.js en estos 3 archivos:

1. `/Views/WebsiteBuilder/Index.cshtml`
2. `/Views/WebsiteBuilder/PreviewTemplate.cshtml`  
3. `/Views/WebsiteBuilder/Preview.cshtml`

```html
<!-- Después de website-builder.js -->
<script src="~/js/website-builder/modules/nombre-modulo.js?v=@DateTime.Now.Ticks"></script>
```

### Verificación Rápida
- [ ] Archivo creado en `/wwwroot/js/website-builder/modules/`
- [ ] Estructura con las 4 funciones básicas
- [ ] Caso agregado en switchSidebarView
- [ ] Script cargado en los 3 archivos .cshtml
- [ ] NO se tocó website-builder.js (excepto el case en switch)

## PUNTO #2: PREVIEW HOVER Y AGREGADO AL MODAL

### ⚠️ VERIFICACIÓN CRÍTICA - LA MAYORÍA DE MÓDULOS YA ESTÁN EN EL MODAL

**IMPORTANTE: El 90% de los módulos ya están agregados al modal de "Add Section"**
- La mayoría de módulos comunes (Image with Text, Banner, Gallery, etc.) YA EXISTEN en el modal
- Solo necesitarás agregar al modal si es un módulo completamente NUEVO y CUSTOM

### 🔴 EXCEPCIÓN IMPORTANTE:
**Si el usuario te proporciona una imagen de preview = SIEMPRE implementar el preview**
- No importa si el módulo ya tiene un preview existente
- El usuario quiere actualizar/mejorar el preview actual
- Procede con la implementación completa del PUNTO #2

### ICONOS DE ACCIÓN EN EL PANEL LATERAL (CRÍTICO)

**TODOS los nuevos módulos deben tener estos 3 iconos de acción:**
1. **visibility** (ojo) - Toggle de visibilidad  
2. **add** (signo más) - Para agregar elementos hijos
3. **delete** (basurero) - Eliminar

**NO usar:**
- ❌ **settings** (engranaje) - Este NO se usa en módulos nuevos
- ❌ **config-icon** - No es el patrón correcto

### NAVEGACIÓN A LA VISTA DE CONFIGURACIÓN

**El click en el módulo (NO en un botón) debe abrir la vista de configuración:**

1. **Click en el texto del módulo** → Abre vista de configuración
2. **NO se necesita** botón de settings
3. **Event listener correcto** (ya existe globalmente):
```javascript
// Este handler YA EXISTE en website-builder.js (~línea 8900)
$(document).on('click', '.sidebar-subsection[data-block-type]', function(e) {
    // Si el click fue en un botón de acción, no hacer nada
    if ($(e.target).closest('.subsection-actions').length > 0) return;
    
    const blockType = $(this).data('block-type');
    window.switchSidebarView(blockType + 'Settings');
});
```

**IMPORTANTE**: Solo necesitas agregar el case en switchSidebarView, NO crear otro event listener.

**Código correcto para renderTemplateSections:**
```javascript
<div class="subsection-actions">
    <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" 
            data-section="nombreModulo" title="Toggle visibility">
        <i class="material-icons icon-visible">visibility</i>
        <i class="material-icons icon-hidden">visibility_off</i>
    </button>
    <button class="action-icon add-icon" data-section="nombreModulo" title="Add element">
        <i class="material-icons">add</i>
    </button>
    <button class="action-icon delete-section" data-section="nombreModulo" title="Delete">
        <i class="material-icons">delete</i>
    </button>
</div>
```

### Verificación Obligatoria:
1. **PRIMERO abre el Website Builder y verifica visualmente:**
   - Click en "Add Section" 
   - Busca si tu módulo ya aparece en la lista
   - Si ya está, SALTA este punto y continúa con el PUNTO #3

2. **Si no lo ves en el modal, verifica en el código:**
```bash
# Buscar en el array de secciones (alrededor de línea 9500-9700)
grep -n "{ id:" website-builder.js | grep -i "tu-modulo"

# Buscar traducciones
grep -i "sections.tuModulo" website-builder.js

# Buscar el handler del click
grep -A5 -B5 "sectionId === 'tu-modulo'" website-builder.js
```

### ⚠️ Si el módulo YA ESTÁ en el modal:
- **NO necesitas:** Agregar imagen preview, ni al array de secciones, ni handler de click
- **SÍ necesitas:** Verificar que el handler del click abra tu vista de configuración (PUNTO #3)
- **Continúa desde:** PUNTO #3 directamente

### Requisitos del Desarrollador (SOLO si el módulo NO existe)
Necesitas proporcionar:
1. **Imagen preview**: 300x200px aprox en `/wwwroot/TestImages/nombremodulo-preview.png`
2. **Estructura HTML**: Diseño que se mostrará en el editor

### Implementación del Preview Hover

#### 1. Agregar Imagen Preview
**UBICACIÓN CORRECTA**: `/wwwroot/TestImages/` (NO en `/TestImages/`)
```
/wwwroot/TestImages/nombremodulo-preview.png
```
**IMPORTANTE**: Si el nombre tiene espacios, usar %20 en la URL

#### 2. Agregar al Objeto Previews
**CRÍTICO**: Existen 2 objetos `previews` - usar el de línea ~9863 (NO el de ~9611)

```javascript
// Buscar alrededor de línea 9863
const previews = {
    'slideshow': '/TestImages/slideshowpreview.png',
    'multicolumn': '/TestImages/multicolumimage.png',
    'nombre-modulo': '/TestImages/nombremodulo-preview.png' // AGREGAR AQUÍ
};
```

#### 3. Event Handler del Click (CRÍTICO)
**Problema documentado**: El handler solo tiene código para 'slideshow'

Buscar el handler global (línea ~9595) y agregar tu módulo:
```javascript
$(document).on('click', '.add-section-modal .section-item', function(e) {
    const sectionId = $(this).data('section-id');
    
    if (group === 'template' && sectionId === 'slideshow') {
        // Código existente...
    } 
    else if (group === 'template' && sectionId === 'nombre-modulo') { // AGREGAR ESTO
        // Paso 1: Inicializar configuración
        if (!currentSectionsConfig.nombreModulo) {
            currentSectionsConfig.nombreModulo = {
                id: 'nombre-modulo',
                isHidden: false,
                config: {
                    // Configuración por defecto
                }
            };
        }
        
        // Paso 2: Agregar a sectionOrder (CRÍTICO - sin esto no aparece)
        if (!currentSectionsConfig.sectionOrder) {
            currentSectionsConfig.sectionOrder = [];
        }
        if (!currentSectionsConfig.sectionOrder.includes('nombre-modulo')) {
            currentSectionsConfig.sectionOrder.push('nombre-modulo');
        }
        
        // Paso 3: Actualizar UI
        const templateSectionsHtml = renderTemplateSections();
        $('#template-sections-container').html(templateSectionsHtml + /* botón agregar */);
        
        // Paso 4: Post-procesamiento
        setTimeout(applyTranslations, 0);
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview(); // CRÍTICO - actualiza el preview
        
        // Paso 5: Cerrar modal
        M.Modal.getInstance(document.querySelector('.add-section-modal')).close();
    }
});
```

#### 4. Actualizar AMBAS funciones renderTemplateSections
**Problema documentado**: Hay 2 funciones con el mismo nombre

**Primera función** (línea ~4892) - Ya maneja todos los módulos genéricamente
**Segunda función** (línea ~5080) - Solo maneja slideshow, DEBE actualizarse:

```javascript
// Agregar después del caso de slideshow
else if (sectionId === 'nombre-modulo' && currentSectionsConfig.nombreModulo) {
    html += renderTemplateSection('nombre-modulo', 'Nombre Módulo', 'icon_name');
}
```

### Problemas Comunes y Soluciones

1. **Preview no aparece al hover**
   - Verificar que usaste el objeto `previews` correcto (línea 9863)
   - Verificar ruta: `/TestImages/` no `/wwwroot/TestImages/`
   - Verificar Network tab para 404

2. **Click no agrega la sección**
   - Verificar que agregaste el `else if` en el handler
   - Verificar que agregaste a `sectionOrder`
   - Verificar `console.log(currentSectionsConfig.sectionOrder)`

3. **Sección no aparece en panel lateral**
   - Verificar que llamaste `renderTemplateSections()`
   - Verificar segunda función renderTemplateSections

### Verificación del Punto #2
- [ ] Imagen en `/wwwroot/TestImages/`
- [ ] Agregado al objeto `previews` correcto (línea ~9863)
- [ ] `else if` agregado en handler del click
- [ ] Inicialización incluye agregar a `sectionOrder`
- [ ] Actualizada segunda función `renderTemplateSections`
- [ ] Llamadas a `renderPreview()` y `updateSaveButtonState()`

## PUNTO #3: VISTAS DE CONFIGURACIÓN Y FUNCIONALIDAD COMPLETA

### ⚠️ SOLICITUD OBLIGATORIA AL USUARIO

**PASO 1 - Solicitar Vista Principal:**
```
"Necesito que me proporciones la vista de configuración principal del módulo [nombre]. 
Esta vista aparecerá en el panel lateral cuando se haga click en el módulo."
```

**ESPERAR** a que el usuario proporcione la imagen/diseño antes de continuar.

**PASO 2 - Solo si el módulo tiene elementos hijos:**
```
"Ahora necesito la vista de configuración para los elementos hijos de [nombre].
Esta vista aparecerá cuando se haga click en cada elemento hijo individual."
```

### Requisitos del Desarrollador
Necesitas proporcionar:
1. **Vista principal de configuración**: Panel de settings del módulo
2. **Vista de configuración de hijos** (si aplica): Settings individuales de elementos

⚠️ **NUNCA** implementar vistas de configuración sin que el usuario las proporcione primero

### 3.1 ESTRUCTURA CORRECTA DE VISTAS (EVITAR DOBLE SCROLL)

**Problema documentado**: Doble scroll infinito con espacio en blanco - 2+ horas perdidas

**ESTRUCTURA OBLIGATORIA**:
```javascript
// En tu módulo - función renderSettings
renderSettings: function(config) {
    return `
        <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
            <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                <button class="back-to-sections-btn" onclick="window.switchSidebarView('blockList')">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3 data-i18n="nombreModulo.settings.title">Configuración Nombre Módulo</h3>
            </div>
            
            <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                <!-- AQUÍ VA TODO EL CONTENIDO DE CONFIGURACIÓN -->
                ${renderModuleMainSettings(config)}
                ${config.hasChildren ? renderChildrenSection(config) : ''}
            </div>
        </div>
    `;
}
```

**CRÍTICO**:
- Contenedor principal: `overflow: hidden` (NUNCA auto o scroll)
- Header: SIEMPRE clase `sidebar-view-header`
- Contenido: `overflow-y: auto` y `height: calc(100% - 60px)`

### 3.2 IMPLEMENTAR BOTÓN "MÁS" PARA AGREGAR HIJOS

```javascript
// Dentro del contenido de configuración
function renderChildrenSection(config) {
    return `
        <div class="settings-group" style="margin-top: 30px;">
            <div class="settings-group-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 data-i18n="nombreModulo.children.title">Elementos</h4>
                <button class="add-child-btn" onclick="window.addModuleChild()" 
                        style="background: #2962ff; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">
                    <i class="material-icons" style="font-size: 16px; vertical-align: middle;">add</i>
                    <span data-i18n="nombreModulo.children.add">Agregar elemento</span>
                </button>
            </div>
            
            <div id="children-container" style="margin-top: 20px;">
                ${renderChildrenList(config)}
            </div>
        </div>
    `;
}

// Función global para agregar hijo
window.addModuleChild = function() {
    const childId = 'child-' + Date.now();
    
    if (!currentSectionsConfig.nombreModulo.children) {
        currentSectionsConfig.nombreModulo.children = {};
        currentSectionsConfig.nombreModulo.childOrder = [];
    }
    
    currentSectionsConfig.nombreModulo.children[childId] = {
        id: childId,
        // configuración por defecto del hijo
    };
    
    currentSectionsConfig.nombreModulo.childOrder.push(childId);
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Re-renderizar la vista
    window.switchSidebarView('nombreModuloSettings');
};
```

### 3.3 COLAPSADORES PARA ELEMENTOS HIJOS

**ESTRUCTURA EXACTA** (tipo Shopify):
```javascript
function renderChildItem(child, index) {
    return `
        <div class="child-item" data-child-id="${child.id}" style="margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 8px;">
            <div class="collapsible-header" data-target="child-content-${child.id}" 
                 style="padding: 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #fafafa;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="drag-handle material-icons" style="cursor: move; color: #8c9196;">drag_indicator</span>
                    <span class="material-icons collapse-icon">expand_more</span>
                    <span>Elemento ${index + 1}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="visibility-toggle" data-element-id="${child.id}">
                        <span class="material-icons">visibility</span>
                        <span class="material-icons" style="display: none;">visibility_off</span>
                    </button>
                    <button class="delete-child-btn" data-child-id="${child.id}" style="background: none; border: none; cursor: pointer;">
                        <span class="material-icons" style="color: #dc3545;">delete</span>
                    </button>
                </div>
            </div>
            
            <div id="child-content-${child.id}" class="collapsible-content" style="display: none; padding: 15px; border-top: 1px solid #e3e3e3;">
                ${renderChildSettings(child)}
            </div>
        </div>
    `;
}
```

**Event listeners para colapsadores**:
```javascript
// En attachEventListeners del módulo
$(document).on('click', '.collapsible-header', function() {
    const $header = $(this);
    const targetId = $header.data('target');
    const $content = $('#' + targetId);
    const $icon = $header.find('.collapse-icon');
    
    $content.slideToggle(200);
    $icon.text($icon.text() === 'expand_more' ? 'expand_less' : 'expand_more');
});
```

### 🔴 3.3.1 NAVEGACIÓN EN VISTAS DE CONFIGURACIÓN DE ELEMENTOS HIJOS (CRÍTICO)

**⚠️ ERROR COMÚN**: En todos los módulos se comete el mismo error con la flecha de navegación en las vistas de configuración de elementos hijos.

**PROBLEMA TÍPICO**: 
La flecha de retroceso lleva a la vista de configuración del módulo padre en lugar de volver al panel lateral (blockList).

**IMPLEMENTACIÓN CORRECTA**:

#### 1. En la función que renderiza la vista del hijo (ej: `renderBlockSettings`, `renderColumnSettings`):
```javascript
renderChildSettings: function(child, parentConfig) {
    return `
        <div class="settings-panel" style="display: flex; flex-direction: column; height: 100%;">
            <div class="settings-header" style="...">
                <!-- CORRECTO: usar clase en lugar de onclick -->
                <button class="back-to-sections-btn" 
                        style="background: none; border: none; cursor: pointer; padding: 4px;">
                    <i class="material-icons" style="font-size: 20px;">arrow_back</i>
                </button>
                <h3>Configuración del Elemento</h3>
            </div>
            <!-- resto del contenido -->
        </div>
    `;
}
```

**NO HACER**:
```javascript
<!-- INCORRECTO -->
<button onclick="window.backToParentSettings()">
<button onclick="window.switchSidebarView('parentModuleSettings')">
```

#### 2. En la función `attachChildEventListeners`:
```javascript
attachChildEventListeners: function(childId) {
    // CRÍTICO: Agregar este handler SIEMPRE
    $('.back-to-sections-btn').off('click').on('click', function() {
        window.switchSidebarView('blockList');
    });
    
    // Resto de event listeners...
}
```

**EJEMPLO REAL - Multicolumn (CORRECTO)**:
```javascript
// En multicolumn.js línea ~1346
$('.back-to-sections-btn').off('click').on('click', function() {
    window.switchSidebarView('blockList');
});
```

**RAZÓN**: 
- El usuario espera volver al panel lateral principal donde puede ver TODAS las secciones
- No tiene sentido volver a la vista del módulo padre ya que desde ahí vino
- Es consistente con el comportamiento de Shopify

**Verificación**:
- [ ] La flecha usa clase `back-to-sections-btn`, NO onclick
- [ ] Event listener agregado en `attachChildEventListeners`
- [ ] Navega a `'blockList'`, NO a la vista del padre
- [ ] Usa `.off('click').on('click')` para evitar duplicados

### 3.4 DRAG & DROP (CRÍTICO - EVITAR PROBLEMAS DOCUMENTADOS)

#### Para reordenar hijos dentro del módulo:
```javascript
// Inicializar sortable para hijos
function initializeChildrenSortable() {
    $('#children-container').sortable({
        items: '.child-item',
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
            $('.child-item').each(function() {
                newOrder.push($(this).data('child-id'));
            });
            currentSectionsConfig.nombreModulo.childOrder = newOrder;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        }
    });
}
```

#### Para reordenar módulo padre (CON HIJOS):
**USAR WRAPPER METHOD**:

1. **Envolver hijos en wrapper**:
```javascript
<div id="nombre-modulo-children-wrapper">
    <!-- todos los elementos hijos aquí -->
</div>
```

2. **En el sortable principal** (website-builder.js ~línea donde está el sortable de secciones):
```javascript
// Agregar a la función start del sortable existente
if (ui.item.attr('data-section-id') === 'nombre-modulo') {
    const $wrapper = $('#nombre-modulo-children-wrapper');
    if ($wrapper.length) {
        $wrapper.hide();
        ui.item.data('detached-wrapper', $wrapper.detach()); // CRÍTICO: detach, no hide
    }
}

// Agregar a la función stop
const $detachedWrapper = ui.item.data('detached-wrapper');
if ($detachedWrapper) {
    $detachedWrapper.insertAfter(ui.item).show();
    ui.item.removeData('detached-wrapper');
}
```

### 3.5 DELETE HANDLER (BORRAR PADRE E HIJOS) - CRÍTICO

**⚠️ PROBLEMA COMÚN**: 
1. Al eliminar una sección padre, los elementos hijos quedan huérfanos en el DOM si no se eliminan explícitamente primero
2. Múltiples event handlers para delete causan conflictos (doble click en modal)

**IMPLEMENTACIÓN CORRECTA** - Usar el handler unificado en `attachBlockListEventListeners` (~línea 8988):

```javascript
// Delete button for sections - use namespace to avoid duplicates
$(document).off('click.deleteSection').on('click.deleteSection', '.delete-icon, .delete-section', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    const $button = $(this);
    const section = $button.data('section');
    
    // Prevent multiple clicks
    if ($button.data('deleting')) {
        return false;
    }
    $button.data('deleting', true);
    
    if (confirm(confirmMessage)) {
        // Agregar el caso para tu módulo
        else if (section === 'nombreModulo' && currentSectionsConfig.nombreModulo) {
            console.log('[DEBUG] Deleting nombreModulo section');
            
            // CRÍTICO: Primero eliminar TODOS los elementos hijos del DOM
            $('#nombreModulo-children-wrapper').remove();
            $('.nombreModulo-child-item').remove();
            
            // Eliminar los datos (esto incluye todos los hijos)
            delete currentSectionsConfig.nombreModulo;
            
            // Remover del array de orden - verificar ambas convenciones
            if (currentSectionsConfig.sectionOrder) {
                let index = currentSectionsConfig.sectionOrder.indexOf('nombreModulo');
                if (index > -1) {
                    currentSectionsConfig.sectionOrder.splice(index, 1);
                }
                // También verificar versión con guiones
                index = currentSectionsConfig.sectionOrder.indexOf('nombre-modulo');
                if (index > -1) {
                    currentSectionsConfig.sectionOrder.splice(index, 1);
                }
            }
        }
        
        // Remove from DOM and update UI
        $button.closest('.sidebar-subsection').fadeOut(300, function() {
            $(this).remove();
            
            // Para secciones de template, actualizar el contenedor
            if (section === 'nombreModulo') {
                const templateSectionsHtml = renderTemplateSections();
                $('#template-sections-container').html(templateSectionsHtml + /* botón agregar */);
                setTimeout(applyTranslations, 0);
            }
            
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        });
    } else {
        // Reset deleting flag if cancelled
        $button.data('deleting', false);
    }
    
    return false;
});
```

**IMPORTANTE**: 
- NO crear un nuevo handler con `$(document).on('click', '.delete-section')`
- Agregar tu caso al handler existente en `attachBlockListEventListeners`
- Usar namespace (.deleteSection) para evitar duplicados
- Incluir flag de prevención de múltiples clicks

**PATRÓN CORRECTO**:
1. Usar el handler unificado existente
2. Eliminar wrapper e hijos antes que el padre
3. Verificar múltiples convenciones de nombres
4. Actualizar UI después de eliminar del DOM
5. Resetear flag si se cancela

**EVITAR**:
- Crear múltiples handlers para el mismo selector
- No usar namespace en event listeners
- Olvidar el flag de prevención de clicks

**Para borrar hijo individual**:
```javascript
$(document).on('click', '.delete-child-btn', function() {
    const childId = $(this).data('child-id');
    
    if (confirm('¿Eliminar este elemento?')) {
        // Borrar del objeto
        delete currentSectionsConfig.nombreModulo.children[childId];
        
        // Remover del array de orden
        const index = currentSectionsConfig.nombreModulo.childOrder.indexOf(childId);
        if (index > -1) {
            currentSectionsConfig.nombreModulo.childOrder.splice(index, 1);
        }
        
        // Actualizar UI
        $(this).closest('.child-item').fadeOut(300, function() {
            $(this).remove();
        });
        
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
});
```

### 3.6 PREVENIR MÚLTIPLES CLICKS EN MODALES

```javascript
// Usar flag para prevenir múltiples procesamiento
let isProcessingDelete = false;

$(document).on('click', '.confirm-delete', function() {
    if (isProcessingDelete) return;
    isProcessingDelete = true;
    
    // Procesar eliminación
    
    setTimeout(() => {
        isProcessingDelete = false;
    }, 500);
});
```

### 3.7 ESTRUCTURA DE TOGGLES CORRECTA

**NUNCA usar span para el slider**:
```html
<div class="settings-field" style="margin-bottom: 16px;">
    <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 13px; color: #202223;">Mostrar título</span>
        <input type="checkbox" id="show-title-toggle" class="shopify-toggle" ${config.showTitle ? 'checked' : ''}>
        <label for="show-title-toggle" class="toggle-slider"></label>
    </label>
</div>
```

### Verificación del Punto #3
- [ ] Vista principal usa estructura anti-doble-scroll
- [ ] Botón "más" implementado y funcional
- [ ] Colapsadores funcionando con estructura correcta
- [ ] Drag & drop hijos implementado
- [ ] Wrapper method para drag & drop del padre
- [ ] Delete handler agregado para el módulo
- [ ] Delete individual de hijos funcionando
- [ ] Toggles con estructura Shopify exacta
- [ ] initializeVisibilityToggles() llamado después de render
- [ ] Flags de cambios pendientes actualizadas

### Tiempos Estimados (basados en documentación)
- Siguiendo esta guía: 30-45 minutos
- Sin guía (problemas documentados): 3-4 horas

## PUNTO #4: SISTEMA DE TRADUCCIONES

### Variable Global Crítica
```javascript
// En website-builder.js - DEBE ser let, NO const
let currentLanguage = 'es'; // Se actualiza dinámicamente
```

### 4.1 AGREGAR TRADUCCIONES AL OBJETO GLOBAL

**En tu módulo**, agregar las traducciones:
```javascript
// Agregar al objeto translations existente
if (!translations.es.nombreModulo) translations.es.nombreModulo = {};
if (!translations.en.nombreModulo) translations.en.nombreModulo = {};

translations.es.nombreModulo = {
    // Vista principal
    "settings.title": "Configuración de [Nombre Módulo]",
    "settings.save": "Guardar cambios",
    "settings.back": "Volver",
    
    // Campos de configuración
    "fields.showTitle": "Mostrar título",
    "fields.titleText": "Texto del título",
    "fields.colorScheme": "Esquema de color",
    
    // Elementos hijos
    "children.title": "Elementos",
    "children.add": "Agregar elemento",
    "children.empty": "No hay elementos",
    "children.element": "Elemento",
    
    // Acciones
    "actions.delete": "Eliminar",
    "actions.deleteConfirm": "¿Eliminar este elemento?",
    "actions.visibility": "Visibilidad"
};

translations.en.nombreModulo = {
    // Main view
    "settings.title": "[Module Name] Settings",
    "settings.save": "Save changes",
    "settings.back": "Back",
    
    // Configuration fields
    "fields.showTitle": "Show title",
    "fields.titleText": "Title text",
    "fields.colorScheme": "Color scheme",
    
    // Child elements
    "children.title": "Elements",
    "children.add": "Add element",
    "children.empty": "No elements",
    "children.element": "Element",
    
    // Actions
    "actions.delete": "Delete",
    "actions.deleteConfirm": "Delete this element?",
    "actions.visibility": "Visibility"
};
```

### 4.2 USAR data-i18n EN HTML

**Tres tipos de atributos**:
```html
<!-- Contenido de texto -->
<h3 data-i18n="nombreModulo.settings.title">Configuración</h3>

<!-- Placeholder de input -->
<input type="text" data-i18n-placeholder="nombreModulo.fields.search" placeholder="Buscar...">

<!-- Tooltip/Title -->
<button data-i18n-title="nombreModulo.actions.deleteTooltip" title="Eliminar elemento">
    <span class="material-icons">delete</span>
</button>
```

### 4.3 APLICAR TRADUCCIONES DESPUÉS DE RENDERIZAR

**CRÍTICO**: Siempre después de modificar el DOM
```javascript
// En renderSettings del módulo
renderSettings: function(config) {
    const html = `...tu HTML con data-i18n...`;
    
    // Renderizar
    $('#sidebar-dynamic-content').html(html);
    
    // APLICAR TRADUCCIONES
    setTimeout(applyTranslations, 0);
    
    // Luego attachar event listeners
    this.attachEventListeners();
}

// También después de agregar elementos dinámicamente
window.addModuleChild = function() {
    // ... código para agregar hijo ...
    
    // Re-renderizar vista
    window.switchSidebarView('nombreModuloSettings');
    
    // Las traducciones se aplicarán automáticamente en renderSettings
};
```

### 4.4 TRADUCCIONES DINÁMICAS EN JAVASCRIPT

Para textos que se generan dinámicamente:
```javascript
// Obtener traducción con fallback
const deleteConfirmText = translations[currentLanguage]['nombreModulo.actions.deleteConfirm'] || '¿Eliminar este elemento?';

// En confirmaciones
if (confirm(deleteConfirmText)) {
    // proceder con eliminación
}

// En elementos generados
function renderChildTitle(index) {
    const elementText = translations[currentLanguage]['nombreModulo.children.element'] || 'Elemento';
    return `${elementText} ${index + 1}`;
}
```

### 4.5 ESCUCHAR CAMBIOS DE IDIOMA

**Si tu vista necesita re-renderizarse al cambiar idioma**:
```javascript
// En initialize del módulo
initialize: function() {
    $(window).on('languageChanged.nombreModulo', function(e, newLanguage) {
        currentLanguage = newLanguage;
        
        // Si la vista actual es la tuya, re-renderizar
        if (currentSidebarView === 'nombreModuloSettings') {
            window.switchSidebarView('nombreModuloSettings');
        }
    });
}

// Limpiar al cambiar de vista
$(window).off('languageChanged.nombreModulo');
```

### 4.6 EJEMPLO COMPLETO EN VISTA

```javascript
renderSettings: function(config) {
    return `
        <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
            <div class="sidebar-view-header">
                <button class="back-to-sections-btn" onclick="window.switchSidebarView('blockList')">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3 data-i18n="nombreModulo.settings.title">Configuración</h3>
            </div>
            
            <div style="padding: 20px; overflow-y: auto; flex: 1;">
                <!-- Toggle con traducción -->
                <div class="settings-field">
                    <label class="toggle-field">
                        <span data-i18n="nombreModulo.fields.showTitle">Mostrar título</span>
                        <input type="checkbox" id="show-title" class="shopify-toggle">
                        <label for="show-title" class="toggle-slider"></label>
                    </label>
                </div>
                
                <!-- Input con placeholder traducido -->
                <div class="settings-field">
                    <label data-i18n="nombreModulo.fields.titleText">Texto del título</label>
                    <input type="text" 
                           data-i18n-placeholder="nombreModulo.fields.titlePlaceholder"
                           placeholder="Ingrese el título"
                           value="${config.title || ''}">
                </div>
                
                <!-- Botón con tooltip -->
                <button class="save-btn" 
                        data-i18n="nombreModulo.settings.save"
                        data-i18n-title="nombreModulo.settings.saveTooltip"
                        title="Guardar todos los cambios">
                    Guardar cambios
                </button>
            </div>
        </div>
    `;
}
```

### Verificación del Punto #4
- [ ] Traducciones agregadas para es/en
- [ ] Todos los textos tienen data-i18n
- [ ] setTimeout(applyTranslations, 0) después de cada render
- [ ] Textos dinámicos usan translations[currentLanguage]
- [ ] Confirmaciones y alertas traducidas
- [ ] Event listener para languageChanged (si necesario)
- [ ] Placeholders y tooltips con atributos correctos

## PUNTO #5: TOGGLE DE VISIBILIDAD (ÍCONO DEL OJO)

### Problema Documentado y Solución
**Problema**: Después de guardar dinámicamente, se necesitaban dos clicks para cambiar el estado
**Causa**: Estados residuales y estilos inline que interferían
**Tiempo perdido**: 30+ minutos

### 5.1 ESTRUCTURA HTML DEL BOTÓN

```html
<!-- Para sección principal -->
<button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" 
        data-section="nombreModulo" 
        title="Toggle visibility">
    <i class="material-icons icon-visible">visibility</i>
    <i class="material-icons icon-hidden">visibility_off</i>
</button>

<!-- Para elementos hijos -->
<button class="visibility-toggle ${child.isHidden ? 'is-hidden' : ''}" 
        data-element-id="${child.id}"
        data-element-type="child">
    <i class="material-icons icon-visible">visibility</i>
    <i class="material-icons icon-hidden">visibility_off</i>
</button>
```

**CRÍTICO**: 
- Usar clases `icon-visible` e `icon-hidden`
- Aplicar clase `is-hidden` condicionalmente
- NO usar estilos inline

### 5.2 CSS REQUERIDO (YA EXISTE EN website-builder.css)

```css
/* El botón muestra visibility por defecto */
.visibility-toggle:not(.is-hidden) .icon-visible {
    display: block !important;
}

.visibility-toggle:not(.is-hidden) .icon-hidden {
    display: none !important;
}

/* Cuando tiene clase is-hidden, muestra visibility_off */
.visibility-toggle.is-hidden .icon-visible {
    display: none !important;
}

.visibility-toggle.is-hidden .icon-hidden {
    display: block !important;
}
```

### 5.3 HANDLER DEL TOGGLE (INTEGRAR EN attachEventListeners)

```javascript
// En attachEventListeners del módulo
$(document).on('click', '.visibility-toggle[data-section="nombreModulo"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const $button = $(this);
    
    // Prevenir clicks durante transición
    if ($button.data('transitioning')) return;
    $button.data('transitioning', true);
    
    // Toggle estado
    const isCurrentlyHidden = $button.hasClass('is-hidden');
    const newHiddenState = !isCurrentlyHidden;
    
    // SOLUCIÓN CRÍTICA: Limpiar estado completamente
    $button.removeClass('is-hidden');
    if (newHiddenState) {
        $button.addClass('is-hidden');
    }
    
    // SOLUCIÓN CRÍTICA: Remover estilos inline
    $button.find('.icon-visible').removeAttr('style');
    $button.find('.icon-hidden').removeAttr('style');
    
    // Actualizar modelo
    currentSectionsConfig.nombreModulo.isHidden = newHiddenState;
    
    // Actualizar preview inmediatamente
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Liberar flag después de animación
    setTimeout(() => {
        $button.data('transitioning', false);
    }, 300);
});

// Para elementos hijos
$(document).on('click', '.visibility-toggle[data-element-type="child"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const $button = $(this);
    const childId = $button.data('element-id');
    
    if ($button.data('transitioning')) return;
    $button.data('transitioning', true);
    
    const isCurrentlyHidden = $button.hasClass('is-hidden');
    const newHiddenState = !isCurrentlyHidden;
    
    // Limpiar y actualizar estado
    $button.removeClass('is-hidden');
    if (newHiddenState) {
        $button.addClass('is-hidden');
    }
    
    $button.find('.icon-visible').removeAttr('style');
    $button.find('.icon-hidden').removeAttr('style');
    
    // Actualizar modelo del hijo
    if (currentSectionsConfig.nombreModulo.children && 
        currentSectionsConfig.nombreModulo.children[childId]) {
        currentSectionsConfig.nombreModulo.children[childId].isHidden = newHiddenState;
    }
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    setTimeout(() => {
        $button.data('transitioning', false);
    }, 300);
});
```

### 5.4 SINCRONIZAR ESTADOS AL RENDERIZAR

```javascript
// Después de renderizar la vista (en renderSettings)
setTimeout(() => {
    // Sincronizar estado de toggles con datos guardados
    $('.visibility-toggle[data-section="nombreModulo"]').each(function() {
        const $button = $(this);
        const savedIsHidden = currentSectionsConfig.nombreModulo.isHidden;
        
        if (savedIsHidden && !$button.hasClass('is-hidden')) {
            $button.addClass('is-hidden');
        } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
            $button.removeClass('is-hidden');
        }
    });
    
    // Para hijos
    $('.visibility-toggle[data-element-type="child"]').each(function() {
        const $button = $(this);
        const childId = $button.data('element-id');
        const child = currentSectionsConfig.nombreModulo.children?.[childId];
        
        if (child) {
            const savedIsHidden = child.isHidden;
            
            if (savedIsHidden && !$button.hasClass('is-hidden')) {
                $button.addClass('is-hidden');
            } else if (!savedIsHidden && $button.hasClass('is-hidden')) {
                $button.removeClass('is-hidden');
            }
        }
    });
}, 100);
```

### 5.5 RESPETAR VISIBILIDAD EN RENDER

```javascript
// En la función render del módulo
render: function(config) {
    // No renderizar si está oculto
    if (!config || config.isHidden) {
        return '';
    }
    
    // Renderizar contenido normal
    let html = '<div class="module-container">';
    
    // Renderizar solo hijos visibles
    if (config.children && config.childOrder) {
        config.childOrder.forEach(childId => {
            const child = config.children[childId];
            if (child && !child.isHidden) {
                html += renderChild(child);
            }
        });
    }
    
    html += '</div>';
    return html;
}
```

### Verificación del Punto #5
- [ ] Estructura HTML con clases icon-visible/icon-hidden
- [ ] Clase is-hidden aplicada condicionalmente
- [ ] NO usar estilos inline en los botones
- [ ] Handler con flag transitioning
- [ ] removeAttr('style') en ambos iconos
- [ ] Actualizar isHidden en el modelo
- [ ] renderPreview() después del toggle
- [ ] Sincronización de estados al renderizar
- [ ] Respetar isHidden en función render

## PUNTO #6: SISTEMA DE GUARDADO UNIFICADO

### Variables Globales Críticas
```javascript
// Ya existen en website-builder.js - NO REDECLARAR
let hasPendingGlobalSettingsChanges = false;
let hasPendingPageStructureChanges = false;
```

### 6.1 FUNCIONES GLOBALES PARA MÓDULOS

**Estas funciones ya existen - USAR ESTAS**:
```javascript
window.setHasPendingPageStructureChanges(true);  // Marcar cambios
window.updateSaveButtonState();                   // Actualizar botón
window.renderPreview();                           // Actualizar preview
```

### 6.2 PATRÓN DE ACTUALIZACIÓN (COMO EN MULTICOLUMN)

```javascript
// Helper function dentro de attachEventListeners
const updateConfig = (key, value) => {
    if (window.currentSectionsConfig.nombreModulo && window.currentSectionsConfig.nombreModulo.config) {
        window.currentSectionsConfig.nombreModulo.config[key] = value;
        
        // SIEMPRE estas 3 líneas juntas
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    }
};

// Uso en event listeners
$('#module-input').on('change', function() {
    updateConfig('fieldName', $(this).val());
});
```

### 6.3 PARA CAMBIOS EN HIJOS

```javascript
const updateChild = (childId, key, value) => {
    if (window.currentSectionsConfig.nombreModulo.children && 
        window.currentSectionsConfig.nombreModulo.children[childId]) {
        
        window.currentSectionsConfig.nombreModulo.children[childId][key] = value;
        
        // Mismas 3 líneas
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    }
};
```

### 6.4 BOTÓN DE GUARDADO

**ID**: `#save-builder-btn-topbar` (en la barra superior)

**Estados del botón**:
- Sin cambios: "Guardado" (disabled)
- Con cambios: "Guardar cambios" (enabled)
- Guardando: "Guardando..." (loading)

### 6.5 QUÉ SE GUARDA Y DÓNDE

**Estructura de Página** (hasPendingPageStructureChanges):
- Toda la configuración de tu módulo
- Orden de secciones
- Contenido de módulos
- Se guarda automáticamente en `pageStructureJson`

**NO necesitas**:
- Crear endpoints propios
- Manejar el guardado manualmente
- Implementar promesas o llamadas API
- Preocuparte por el formato JSON

### 6.6 EJEMPLO COMPLETO DE INPUT

```javascript
// Text input
$('#title-input').on('input', function() {
    updateConfig('title', $(this).val());
});

// Select
$('#color-scheme').on('change', function() {
    updateConfig('colorScheme', $(this).val());
});

// Checkbox
$('#show-title').on('change', function() {
    updateConfig('showTitle', $(this).is(':checked'));
});

// Slider con input numérico
$('#padding-slider').on('input', function() {
    const value = $(this).val();
    $('#padding-value').val(value);  // Actualizar input numérico
    updateConfig('padding', parseInt(value));
});

$('#padding-value').on('change', function() {
    const value = $(this).val();
    $('#padding-slider').val(value);  // Actualizar slider
    updateConfig('padding', parseInt(value));
});
```

### 6.7 MANTENIMIENTO DE ESTADO

**NO recargar vista después de guardar**:
```javascript
// MAL - No hacer esto
saveChanges().then(() => {
    window.switchSidebarView('nombreModuloSettings'); // NO!
});

// BIEN - El estado se mantiene automáticamente
updateConfig('field', value); // Solo esto
```

### 6.8 FLUJO COMPLETO

1. Usuario cambia campo → `updateConfig()`
2. Se actualiza `currentSectionsConfig.nombreModulo`
3. Se marca `hasPendingPageStructureChanges = true`
4. Botón cambia a "Guardar cambios"
5. Preview se actualiza inmediatamente
6. Usuario hace click en guardar
7. Sistema guarda automáticamente todo
8. Botón vuelve a "Guardado"

### Verificación del Punto #6
- [ ] Usar funciones window globales (NO redeclarar)
- [ ] Helper updateConfig con las 3 líneas críticas
- [ ] Todos los inputs actualizan con updateConfig
- [ ] NO crear endpoints propios
- [ ] NO manejar guardado manualmente
- [ ] NO recargar vista después de guardar
- [ ] Sliders sincronizados con inputs numéricos

## PUNTO #7: CASO DE ESTUDIO - PROBLEMA Y SOLUCIÓN IMAGE-WITH-TEXT

### Problema Real Documentado
El módulo image-with-text no se renderizaba en el preview del editor aunque se agregaba correctamente al panel lateral.

### Causas Identificadas

#### 1. Inconsistencia de Nombres
- Modal usaba: `'images-with-text'` (con guiones, plural)
- Sistema esperaba: `'imageWithText'` (camelCase, singular)
- sectionOrder guardaba: `'images-with-text'`
- Configuración guardaba en: `currentSectionsConfig.imageWithText`

#### 2. Falta de Mapeo en Renderizadores
```javascript
// FALTABA en el objeto renderers
'images-with-text': window.WebsiteBuilderModules?.ImageWithText?.render || renderImageWithText
```

#### 3. Bloque No Agregado a blockOrder
```javascript
// Se creaba el bloque placeholder
currentSectionsConfig.imageWithText.blocks[blockId] = { ... };

// PERO FALTABA agregarlo al array
currentSectionsConfig.imageWithText.blockOrder.push(blockId); // LÍNEA CRÍTICA
```

#### 4. Falta de Función Fallback
No existía `renderImageWithText()` para cuando el módulo no estuviera cargado en el iframe.

#### 5. Error de Contexto `this`
```javascript
// ERROR en el módulo
blocksHtml += this.renderBlock(block, config, uniqueId);
// TypeError: this.renderBlock is not a function

// SOLUCIÓN: usar referencia completa
blocksHtml += window.WebsiteBuilderModules.ImageWithText.renderBlock(block, config, uniqueId);
```

### Soluciones Implementadas

#### 1. Agregado Mapeo de Configuración
```javascript
// En renderPreview() ~línea 1797
} else if (sectionId === 'images-with-text') {
    configKey = 'imageWithText';
}
```

#### 2. Agregado Soporte en Renderizado del Iframe
```javascript
// ~línea 1787
} else if (sectionId === 'imageWithText' || sectionId === 'images-with-text') {
    const config = currentSectionsConfig.imageWithText;
    // ... renderizado
}
```

#### 3. Creada Función Fallback
```javascript
function renderImageWithText(config) {
    if (!config || config.isHidden) return '';
    
    return `
        <div class="section-wrapper image-with-text-section" style="...">
            <!-- Contenido fallback simple -->
        </div>
    `;
}
```

#### 4. Corregido Error de Contexto
En el módulo, cambiar todas las referencias `this.method` a `window.WebsiteBuilderModules.ModuleName.method`.

### Lecciones Aprendidas

1. **Consistencia de IDs**: Usar el mismo ID en TODOS los lugares
   - Modal: `'imageWithText'`
   - sectionOrder: `'imageWithText'`
   - Configuración: `currentSectionsConfig.imageWithText`
   - Renderizadores: `'imageWithText'`

2. **Arrays de Orden Obligatorios**: Si tu módulo tiene sub-elementos:
   ```javascript
   // SIEMPRE agregar al array correspondiente
   config.blockOrder.push(blockId);
   config.columnOrder.push(columnId);
   config.slideOrder.push(slideId);
   ```

3. **Contexto en Módulos**: Evitar `this` en módulos que se ejecutan en diferentes contextos
   ```javascript
   // MAL
   this.renderBlock(...)
   
   // BIEN
   window.WebsiteBuilderModules.TuModulo.renderBlock(...)
   ```

4. **Función Fallback**: Siempre crear una versión simple para cuando el módulo no cargue

5. **Debugging Sistemático**: 
   - Verificar console.log en cada punto del flujo
   - Verificar qué se está agregando a sectionOrder
   - Verificar qué configuración se está creando
   - Verificar si el módulo está cargado en el iframe

### Checklist para Evitar Este Problema

Al implementar un nuevo módulo:

- [ ] Definir UN SOLO ID consistente (preferir camelCase: `myNewModule`)
- [ ] Usar ese ID en TODOS los lugares sin variación
- [ ] Si tiene sub-elementos, SIEMPRE agregarlos al array de orden
- [ ] Crear función fallback en website-builder.js
- [ ] Usar referencias completas en el módulo, no `this`
- [ ] Agregar mapeos necesarios en renderizadores
- [ ] Verificar que se agregue a sectionOrder
- [ ] Probar que renderice antes de continuar con configuración

### Tiempo Invertido
- Debugging del problema: ~45 minutos
- Implementación de soluciones: ~15 minutos
- **Total**: ~1 hora (evitable siguiendo este checklist)

## PUNTO #8: PROBLEMA Y SOLUCIÓN - SINCRONIZACIÓN DE VISIBILIDAD

### Problema Real Documentado
El ícono del ojo (toggle de visibilidad) no mantenía su estado visual correctamente después de guardar cambios. El estado se guardaba correctamente en la base de datos y funcionaba (las secciones se ocultaban/mostraban), pero el ícono aparecía en el estado incorrecto visualmente.

### Síntomas
1. Al ocultar una sección (ojo tachado), guardar, y recargar → el ojo aparecía sin tachar
2. Los cambios sí se guardaban (la sección estaba realmente oculta)
3. El problema era solo visual en el panel lateral
4. Afectaba tanto a secciones principales como a elementos hijos

### Causas Identificadas

#### 1. Falta de Sincronización Post-Guardado
Después de guardar y recargar datos del servidor, no se sincronizaban los estados visuales de los toggles.

#### 2. Estilos Inline Residuales
jQuery y animaciones dejaban estilos inline que interferían con las clases CSS:
```javascript
// Estos estilos inline quedaban después de animaciones
style="display: block;"  // Sobrescribía el CSS de .is-hidden
```

#### 3. Timing Issues
La sincronización se intentaba antes de que el DOM estuviera completamente renderizado.

### Solución Implementada

#### 1. Función Global de Sincronización Forzada
```javascript
// Nueva función global en website-builder.js (~línea 16978)
window.forceVisibilitySync = function(section, isHidden) {
    const $toggle = $(`.visibility-toggle[data-section="${section}"]`);
    if ($toggle.length > 0) {
        // CRÍTICO: Remover estilos inline
        $toggle.find('.icon-visible, .icon-hidden').removeAttr('style');
        
        // Forzar el estado correcto
        if (isHidden) {
            $toggle.addClass('is-hidden');
        } else {
            $toggle.removeClass('is-hidden');
        }
    }
};
```

#### 2. Sincronización Específica Post-Save para ImageWithText
```javascript
// En el handler de guardado (~línea 17154)
} else if (currentSidebarView === 'imageWithTextSettings') {
    loadCurrentWebsite().then(() => {
        window.switchSidebarView('blockList', window.getUpdatedPageData());
        
        // Sincronización forzada después de recargar
        setTimeout(() => {
            // Sincronizar sección principal
            const isHidden = currentSectionsConfig.imageWithText?.isHidden || false;
            window.forceVisibilitySync('imageWithText', isHidden);
            
            // Sincronizar bloques hijos
            $('.image-with-text-block-item .visibility-toggle').each(function() {
                const $button = $(this);
                const blockId = $button.attr('data-block-id');
                if (blockId && currentSectionsConfig.imageWithText?.blocks?.[blockId]) {
                    const blockHidden = currentSectionsConfig.imageWithText.blocks[blockId].isHidden || false;
                    $button.find('.icon-visible, .icon-hidden').removeAttr('style');
                    
                    if (blockHidden) {
                        $button.addClass('is-hidden');
                    } else {
                        $button.removeClass('is-hidden');
                    }
                }
            });
            
            // También llamar sync general
            syncVisibilityToggleStates();
        }, 200); // Delay mayor para asegurar DOM listo
    });
}
```

#### 3. Sincronización al Renderizar BlockList
```javascript
// En switchSidebarView (~línea 4830)
if (viewName === 'blockList') {
    dynamicContentArea.innerHTML = renderBlockListView(data || currentPageData);
    attachBlockListEventListeners();
    setTimeout(applyTranslations, 0);
    
    // Sincronización después de renderizar
    setTimeout(() => {
        syncVisibilityToggleStates();
        
        // Double-check específico para imageWithText
        if (currentSectionsConfig.imageWithText) {
            const isHidden = currentSectionsConfig.imageWithText.isHidden || false;
            window.forceVisibilitySync('imageWithText', isHidden);
        }
    }, 100);
}
```

#### 4. Sincronización al Cambiar Toggle
```javascript
// En el handler de visibility toggle (~línea 9894)
} else if (section === 'imageWithText' || blockType === 'imageWithText') {
    currentSectionsConfig.imageWithText.isHidden = newHiddenState;
    
    // Forzar sincronización inmediata
    if (window.forceVisibilitySync) {
        window.forceVisibilitySync('imageWithText', newHiddenState);
    }
}
```

### Patrón para Nuevos Módulos

Para evitar este problema en nuevos módulos:

#### 1. En el Handler de Toggle
```javascript
// Después de actualizar el modelo
currentSectionsConfig.tuModulo.isHidden = newHiddenState;

// Forzar sincronización visual
if (window.forceVisibilitySync) {
    window.forceVisibilitySync('tuModulo', newHiddenState);
}
```

#### 2. En el Handler Post-Save
```javascript
} else if (currentSidebarView === 'tuModuloSettings') {
    loadCurrentWebsite().then(() => {
        window.switchSidebarView('blockList', window.getUpdatedPageData());
        
        setTimeout(() => {
            const isHidden = currentSectionsConfig.tuModulo?.isHidden || false;
            window.forceVisibilitySync('tuModulo', isHidden);
            
            // Si tiene elementos hijos, sincronizarlos también
            $('.tu-modulo-child-item .visibility-toggle').each(function() {
                // ... lógica de sincronización de hijos
            });
        }, 200);
    });
}
```

#### 3. CSS Crítico (website-builder.css)
```css
/* Los iconos deben estar ocultos por defecto */
.visibility-toggle .icon-visible,
.visibility-toggle .icon-hidden {
    display: none;
}

/* Estados con !important para sobrescribir inline styles */
.visibility-toggle:not(.is-hidden) .icon-visible {
    display: block !important;
}

.visibility-toggle.is-hidden .icon-hidden {
    display: block !important;
}
```

### Puntos Clave

1. **SIEMPRE** remover estilos inline con `.removeAttr('style')`
2. **SIEMPRE** usar delays apropiados para asegurar DOM listo
3. **SIEMPRE** sincronizar después de:
   - Guardar y recargar datos
   - Renderizar vistas
   - Cambiar estados de visibilidad
4. **NUNCA** confiar solo en las clases CSS iniciales del render

### Verificación
- [ ] Función forceVisibilitySync disponible globalmente
- [ ] Sincronización en handler de toggle
- [ ] Sincronización post-save con delay apropiado
- [ ] Sincronización de elementos hijos si aplica
- [ ] removeAttr('style') en todos los puntos de sincronización
- [ ] CSS con !important para sobrescribir inline styles

### Tiempo Invertido
- Debugging del problema: ~2 horas
- Implementación de solución: ~30 minutos
- **Total**: ~2.5 horas (evitable siguiendo este patrón)