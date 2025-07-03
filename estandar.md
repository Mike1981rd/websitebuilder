# Estándar de Implementación - Website Builder

## 1. PROBLEMA CRÍTICO: Ubicación de Archivos de Preview

### Problema Documentado:
Al implementar multicolumn, el preview no se mostraba al hacer hover aunque el código era idéntico a slideshow.

### Causa Real:
- **Ubicación incorrecta**: El archivo estaba en `/TestImages/` 
- **Ubicación correcta**: DEBE estar en `/wwwroot/TestImages/`
- **Evidencia**: `slideshowpreview.png` estaba en `/wwwroot/TestImages/` y funcionaba

### Solución:
```bash
# Copiar archivo a la ubicación correcta
cp "/TestImages/archivo.png" "/wwwroot/TestImages/archivo.png"
```

### Lección Aprendida:
TODOS los archivos estáticos (imágenes, CSS, JS) DEBEN estar dentro de `/wwwroot/` para ser accesibles desde el navegador.

## 2. PROBLEMA: Funciones Duplicadas con Comportamiento Diferente

### Problema Documentado:
Existen DOS funciones `renderTemplateSections()`:
- **Primera** (línea 4846): Genérica, maneja todas las secciones
- **Segunda** (línea 5034): Solo maneja slideshow

### Impacto:
- Slideshow aparecía en el panel lateral
- Multicolumn NO aparecía porque la segunda función no lo conocía

### Solución Aplicada:
Agregar multicolumn a la segunda función (líneas 5096-5115)

### Estándar a Seguir:
- **NUNCA** duplicar funciones con el mismo nombre
- **SIEMPRE** verificar si existe una función antes de crear otra
- **USAR** nombres descriptivos: `renderTemplateSectionsForModal()` vs `renderAllTemplateSections()`

## 3. FLUJO CORRECTO: Agregar Nueva Sección desde Modal

### Prerrequisitos:
1. **Archivo de preview** en `/wwwroot/TestImages/`
2. **Definir sección** en array de secciones (línea ~6424)
3. **Agregar preview** al objeto previews (línea ~9854)
4. **Handler del click** para la nueva sección (línea ~10065)
5. **Actualizar** función `renderTemplateSections()` segunda versión

### Estructura del Preview:
```javascript
'nombreSeccion': '<div class="section-preview-image"><img src="/TestImages/archivo.png" alt="Nombre"></div>',
```

### Handler del Click:
```javascript
if (group === 'template' && sectionId === 'nombreSeccion') {
    if (!currentSectionsConfig.nombreSeccion) {
        // Inicializar configuración
        currentSectionsConfig.nombreSeccion = {
            id: 'nombreSeccion',
            isHidden: false,
            config: {
                // configuración por defecto
            }
        };
        
        // Agregar a sectionOrder
        if (!currentSectionsConfig.sectionOrder.includes('nombreSeccion')) {
            currentSectionsConfig.sectionOrder.push('nombreSeccion');
        }
        
        // Actualizar UI
        const templateSectionsHtml = renderTemplateSections();
        $('#template-sections-container').html(templateSectionsHtml + /* botón agregar */);
        
        // Marcar cambios
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
    }
}
```

## 4. ARQUITECTURA MODULAR OBLIGATORIA

### Para TODOS los módulos nuevos:
```
/wwwroot/js/website-builder/modules/[nombre-modulo].js
```

### Estructura del Módulo:
```javascript
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.NombreModulo = {
    render: function(config) { },
    renderSettings: function(config) { },
    attachEventListeners: function() { },
    initialize: function() { }
};
```

### Integración:
1. Cargar script en Index.cshtml, PreviewTemplate.cshtml y Preview.cshtml
2. Usar `executeModuleFunction()` en switchSidebarView
3. Verificar si módulo existe antes de usar funciones legacy

## 5. CHECKLIST DE VERIFICACIÓN

Antes de reportar que algo no funciona:

- [ ] ¿El archivo de preview está en `/wwwroot/TestImages/`?
- [ ] ¿La consola muestra el log "Hovering over section: [nombre]"?
- [ ] ¿Agregaste la sección a AMBAS funciones renderTemplateSections()?
- [ ] ¿El handler del click verifica el sectionId correcto?
- [ ] ¿Hay errores 404 en Network para la imagen?
- [ ] ¿Hiciste refresh completo con Ctrl+F5?
- [ ] ¿Verificaste que no hay espacios en el nombre del archivo?

## 6. DEBUGGING EFECTIVO

### Logs clave a buscar:
```javascript
console.log('Hovering over section:', sectionId);  // Al hacer hover
console.log('[DEBUG] Section item clicked');       // Al hacer click
console.log('[DEBUG] Adding [nombre] section');    // Al procesar
```

### Si no aparecen estos logs:
1. El evento no se está disparando
2. Verificar que el elemento tiene `data-section-id`
3. Verificar que el modal tiene clase `add-section-modal`

## 7. PROBLEMA: Botón Delete No Funciona para Nuevos Módulos

### Problema Documentado:
El botón de eliminar no funcionaba para multicolumn aunque sí para slideshow.

### Causa Real:
- El handler de delete (línea 8589) tiene lógica hardcodeada SOLO para slideshow
- No hay caso genérico para otros módulos
- Cada módulo nuevo debe agregarse manualmente al handler

### Código del Problema:
```javascript
// SOLO maneja slideshow
if (section === 'slideshow' && currentSectionsConfig.slideshow) {
    delete currentSectionsConfig.slideshow;
    // ... resto del código
}
// NO HAY ELSE para otros módulos!
```

### Solución Correcta:
```javascript
if (section === 'slideshow' && currentSectionsConfig.slideshow) {
    // ... código slideshow
} else if (section === 'multicolumn' && currentSectionsConfig.multicolumn) {
    delete currentSectionsConfig.multicolumn;
    const index = currentSectionsConfig.sectionOrder.indexOf('multicolumn');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

### Estándar a Seguir:
- **MEJOR**: Crear handler genérico que funcione con cualquier sección
- **ACTUAL**: Agregar cada módulo nuevo al if/else del delete handler

### IMPLEMENTACIÓN CORRECTA - Borrar Elemento del Panel:
Para que el botón delete funcione con un nuevo módulo, debes:

1. **Agregar el caso en el handler de delete** (línea ~8620):
```javascript
else if (section === 'tuModulo' && currentSectionsConfig.tuModulo) {
    delete currentSectionsConfig.tuModulo;
    // Remover del array de orden
    const index = currentSectionsConfig.sectionOrder.indexOf('tuModulo');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

2. **El botón delete en el HTML debe tener**:
```html
<button class="action-icon delete-section" data-section="tuModulo" title="Delete">
    <i class="material-icons">delete</i>
</button>
```

3. **Elementos críticos**:
- `data-section="tuModulo"` - DEBE coincidir con el nombre en currentSectionsConfig
- Clase `delete-section` - Para que el handler lo detecte
- El handler ya maneja: fadeOut, renderPreview(), y hasPendingPageStructureChanges

4. **NO OLVIDAR**:
- Borrar de `currentSectionsConfig.tuModulo`
- Borrar de `currentSectionsConfig.sectionOrder`
- El DOM se borra automáticamente con fadeOut

## 8. PROBLEMA: Orden de Secciones en Preview No Respeta Panel Lateral

### Problema Documentado:
Al agregar multicolumn, aparecía correctamente al final en el panel lateral pero en el preview aparecía justo después del header, desplazando otras secciones.

### Causa Real:
El código insertaba nuevas secciones justo después del header sin importar el orden visual:
```javascript
// PROBLEMA: Fuerza inserción después del header
const headerIndex = currentSectionsConfig.sectionOrder.indexOf('header');
if (headerIndex >= 0) {
    currentSectionsConfig.sectionOrder.splice(headerIndex + 1, 0, 'multicolumn');
}
```

### Solución Correcta:
```javascript
// CORRECTO: Agregar al final para respetar orden visual
if (!currentSectionsConfig.sectionOrder.includes('multicolumn')) {
    currentSectionsConfig.sectionOrder.push('multicolumn');
}
```

### Estándar a Seguir:
- **SIEMPRE** agregar nuevas secciones al final con `.push()`
- **NUNCA** forzar posiciones específicas a menos que el usuario lo pida
- El orden en `sectionOrder` debe coincidir con el orden visual del panel

## 9. PROBLEMA CRÍTICO: Doble Scroll en Vistas de Configuración

### Problema Documentado:
Las vistas de configuración mostraban doble scroll (uno interno y otro externo), creando un scroll infinito con espacio en blanco. Además, la flecha y título no se mostraban correctamente en horizontal.

### Causa Real:
- El contenedor `sidebar-dynamic-content` YA tiene su propio scroll
- Agregar otro contenedor con scroll crea conflicto
- Los estilos CSS de `.sidebar-view-header` requieren estructura específica

### Solución CORRECTA:
```javascript
return `
    <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
        <div class="sidebar-view-header" style="position: relative; z-index: 10;">
            <button class="back-to-sections-btn">
                <i class="material-icons">arrow_back</i>
            </button>
            <h3>Título</h3>
        </div>
        
        <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
            <!-- Contenido aquí -->
        </div>
    </div>
`;
```

### Elementos CRÍTICOS:
1. **Contenedor principal**: `overflow: hidden` (NO auto, NO scroll)
2. **Header**: Usar clase `sidebar-view-header` con estructura exacta
3. **Contenido**: 
   - `overflow-y: auto` para scroll vertical
   - `overflow-x: hidden` para evitar scroll horizontal
   - `height: calc(100% - 60px)` para restar altura del header
   - `box-sizing: border-box` para incluir padding en el cálculo

### NUNCA HACER:
- NO quitar el contenedor wrapper principal
- NO poner scroll en el contenedor principal
- NO usar estilos inline para el header (la clase CSS ya los tiene)
- NO olvidar el `calc(100% - 60px)` en el contenido

### Tiempo Perdido: 2+ HORAS
Por no entender que `sidebar-dynamic-content` ya maneja su propio scroll y que agregar otro contenedor con scroll crea el problema.

## 10. TIEMPO PERDIDO DOCUMENTADO

### Multicolumn - 2+ horas perdidas por:
1. **30 min** - Preview con imagen en carpeta incorrecta
2. **45 min** - Función renderTemplateSections duplicada
3. **45 min** - Diagnóstico incorrecto del problema
4. **15 min** - Espacios en nombres de archivo
5. **10 min** - Delete button no funcionaba (handler incompleto)

### Lección Principal:
**SIEMPRE** comparar línea por línea con un módulo que SÍ funciona antes de crear código nuevo.

## 11. PROBLEMA: Variables Globales No Accesibles desde Módulos

### Problema Documentado:
Al hacer click en columnas individuales del módulo multicolumn, aparecía el error:
```
[MULTICOLUMN] Multicolumn not found in currentSectionsConfig
[MULTICOLUMN] currentSectionsConfig: undefined
```

### Causa Real:
- `currentSectionsConfig` estaba declarado con `let` en el scope global de website-builder.js
- NO estaba asignado a `window`, por lo que los módulos externos no podían accederlo
- Los módulos en archivos separados no tienen acceso directo a las variables del archivo principal

### Código del Problema:
```javascript
// En website-builder.js
let currentSectionsConfig = { /* ... */ };

// En multicolumn.js
if (!window.currentSectionsConfig) { // undefined!
    console.error('[MULTICOLUMN] Multicolumn not found');
}
```

### Solución Aplicada:

1. **Hacer la variable accesible globalmente** (después de la declaración):
```javascript
let currentSectionsConfig = { /* ... */ };

// Make currentSectionsConfig globally accessible
window.currentSectionsConfig = currentSectionsConfig;
```

2. **Actualizar TODAS las reasignaciones**:
```javascript
// Cada vez que se reasigna
currentSectionsConfig = nuevaConfig;
window.currentSectionsConfig = currentSectionsConfig; // CRÍTICO!
```

3. **En el módulo, intentar ambos scopes**:
```javascript
// Try to access from parent scope or window
const sectionsConfig = (typeof currentSectionsConfig !== 'undefined' ? 
    currentSectionsConfig : window.currentSectionsConfig);
```

### Lugares Clave Actualizados:
- Línea ~134: Después de la declaración inicial
- Línea ~360: Después del $.extend con defaults
- Línea ~446: En el catch del error parsing
- Línea ~458: Cuando no hay datos y se usan defaults
- Línea ~488: Cuando se carga desde sectionsConfigJson

### Estándar a Seguir:
- **SIEMPRE** asignar variables globales a `window` si serán usadas por módulos externos
- **VERIFICAR** todas las reasignaciones para mantener sincronizado
- **MÓDULOS** deben intentar acceder tanto al scope local como a window

### Tiempo Perdido: 30+ minutos
Por no entender que los módulos en archivos separados no tienen acceso automático a las variables del archivo principal, incluso si son globales.

## 12. PROBLEMA: Hover con Pestaña Azul No Funciona en Todos los Bloques

### Problema Documentado:
Solo el módulo multicolumn mostraba la pestaña azul al hacer hover en el preview. Los demás bloques (header, announcement bar, slideshow) no mostraban la pestaña.

### Causa Real:
- Las funciones de render en `website-render-functions.js` no estaban envolviendo el contenido en la estructura correcta
- Multicolumn SÍ tenía el wrapper `section-wrapper` con `section-header-tag`
- Los otros bloques NO tenían esta estructura

### Estructura Requerida:
```javascript
return `
    <div class="section-wrapper" data-section-id="[section-id]">
        <div class="section-header-tag">
            <span class="material-symbols-outlined" style="font-size: 16px;">[icon]</span>
            ${sectionTitle}
        </div>
        <!-- Contenido del bloque aquí -->
    </div>
`;
```

### Solución Aplicada:

1. **renderHeader()** - Agregado wrapper con ícono `web_asset`
2. **renderAnnouncementBar()** - Agregado wrapper con ícono `campaign`  
3. **renderSlideshow()** - Agregado wrapper con ícono `view_carousel`

### CSS Crítico (en PreviewTemplate.cshtml):
```css
.section-wrapper:hover {
    box-shadow: 0 0 0 2px #2962ff;
}

.section-wrapper:hover .section-header-tag {
    display: flex !important;
    opacity: 1;
    visibility: visible;
}
```

### Estándar a Seguir:
- **TODAS** las secciones renderizadas DEBEN usar la estructura wrapper
- **SIEMPRE** incluir `data-section-id` en el wrapper
- **CADA** sección debe tener su ícono representativo
- **VERIFICAR** que PreviewTemplate.cshtml tenga los estilos CSS correctos

### Archivos Modificados:
- `/wwwroot/js/website-render-functions.js` - Líneas ~346-360 (renderHeader)
- `/wwwroot/js/website-render-functions.js` - Líneas ~487-505 (renderAnnouncementBar)
- `/wwwroot/js/website-render-functions.js` - Líneas ~1965-2025 (renderSlideshow)

### Tiempo Perdido: 20 minutos
Por no revisar la estructura HTML que generaban las funciones de render.

## 13. PROBLEMA CRÍTICO: Módulos No Pueden Activar Bandera de Cambios

### Problema Documentado:
Los módulos en archivos separados no podían activar el botón "Guardar cambios" aunque los cambios se aplicaban correctamente. El módulo multicolumn actualizaba el modelo pero el botón permanecía deshabilitado.

### Síntoma:
```javascript
// En multicolumn.js
window.hasPendingPageStructureChanges = true; // NO funcionaba
window.updateSaveButtonState(); // Error: función no existe
```

### Causa Real:
1. `hasPendingPageStructureChanges` era una variable local, no accesible desde módulos externos
2. `updateSaveButtonState()` no estaba asignada a `window`
3. `renderPreview()` tampoco estaba disponible globalmente

### Solución Implementada:

1. **Crear funciones setter/getter** (website-builder.js ~línea 9):
```javascript
// Functions to manage pending changes - accessible from modules
window.setHasPendingPageStructureChanges = function(value) {
    hasPendingPageStructureChanges = value;
};

window.getHasPendingPageStructureChanges = function() {
    return hasPendingPageStructureChanges;
};
```

2. **Hacer funciones accesibles globalmente**:
```javascript
// Después de la definición de updateSaveButtonState (~línea 16054)
window.updateSaveButtonState = updateSaveButtonState;

// Después de la definición de renderPreview (~línea 1881)
window.renderPreview = renderPreview;
```

3. **Actualizar módulos para usar las funciones globales**:
```javascript
// En lugar de:
window.hasPendingPageStructureChanges = true;

// Usar:
window.setHasPendingPageStructureChanges(true);
```

### Patrón Correcto para Módulos:
```javascript
const updateConfig = (key, value) => {
    if (window.currentSectionsConfig.moduleName?.config) {
        window.currentSectionsConfig.moduleName.config[key] = value;
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview(); // Si quieres preview inmediato
    }
};
```

### Funciones que DEBEN ser Globales para Módulos:
1. `window.currentSectionsConfig` - Ya implementado
2. `window.setHasPendingPageStructureChanges()` - Para activar bandera
3. `window.updateSaveButtonState()` - Para actualizar botón
4. `window.renderPreview()` - Para preview inmediato
5. `window.translations` - Para traducciones
6. `window.currentLanguage` - Para idioma actual

### Verificación Rápida:
Si un módulo no puede guardar cambios, verificar en consola:
```javascript
typeof window.setHasPendingPageStructureChanges // debe ser 'function'
typeof window.updateSaveButtonState // debe ser 'function'  
typeof window.renderPreview // debe ser 'function'
```

### Tiempo Perdido: 30 minutos
Por no entender que las funciones y variables locales de website-builder.js no son accesibles desde módulos externos sin asignarlas explícitamente a window.

## 14. IMPLEMENTACIÓN CORRECTA: Drag & Drop para Elementos Hijos (Multicolumn)

### Descripción:
Implementación funcional de drag & drop para reordenar elementos hijos (columnas) dentro de un módulo padre (multicolumn). Las columnas se pueden arrastrar y el nuevo orden se guarda correctamente.

### Estructura de Datos Necesaria:
```javascript
currentSectionsConfig.multicolumn = {
    id: 'multicolumn',
    isHidden: false,
    config: { /* configuración general */ },
    columns: {
        'column-123': { id: 'column-123', heading: 'Título', ... },
        'column-456': { id: 'column-456', heading: 'Otro', ... }
    },
    columnOrder: ['column-123', 'column-456'] // CRÍTICO: Array que define el orden
}
```

### 1. HTML - Estructura del Wrapper (renderTemplateSections):
```javascript
// CRÍTICO: Necesitas un wrapper con ID único para el sortable
if (hasColumns) {
    html += '<div id="multicolumn-columns-wrapper" style="position: relative;">';
    currentSectionsConfig.multicolumn.columnOrder.forEach((columnId, index) => {
        const column = currentSectionsConfig.multicolumn.columns[columnId];
        if (column) {
            html += `
                <div class="sidebar-subsection multicolumn-column-item" 
                     data-block-type="multicolumn-column" 
                     data-element-id="${columnId}" 
                     style="padding-left: 30px;">
                    <i class="material-icons drag-handle">drag_handle</i>
                    <span class="subsection-text">${column.heading || defaultText}</span>
                    <!-- botones de acción -->
                </div>
            `;
        }
    });
    html += '</div>';
}
```

### 2. Función de Inicialización del Sortable:
```javascript
function initializeMulticolumnColumnsSortable() {
    const $wrapper = $('#multicolumn-columns-wrapper');
    if ($wrapper.length === 0) return;
    
    // Destruir sortable existente para evitar duplicados
    if ($wrapper.data('ui-sortable')) {
        $wrapper.sortable('destroy');
    }
    
    // Inicializar jQuery UI sortable
    $wrapper.sortable({
        items: '.multicolumn-column-item',    // Selector de elementos arrastrables
        handle: '.drag-handle',               // Solo arrastrar desde el ícono
        axis: 'y',                           // Solo movimiento vertical
        placeholder: 'column-item-placeholder',
        tolerance: 'pointer',
        cursor: 'move',
        start: function(e, ui) {
            // Estilo del placeholder mientras se arrastra
            ui.placeholder.css({
                'height': ui.item.outerHeight(),
                'visibility': 'visible',
                'background': '#f0f0f0',
                'border': '1px dashed #999',
                'border-radius': '4px',
                'margin-bottom': '4px',
                'margin-left': '30px'  // Mismo margen que los items
            });
        },
        stop: function(e, ui) {
            // Actualizar el orden después de soltar
            const newOrder = [];
            $('#multicolumn-columns-wrapper .multicolumn-column-item').each(function() {
                const columnId = $(this).attr('data-element-id');
                if (columnId) {
                    newOrder.push(columnId);
                }
            });
            
            // CRÍTICO: Actualizar el array de orden en el modelo
            currentSectionsConfig.multicolumn.columnOrder = newOrder;
            
            // Opcional: Actualizar números o textos después del reorden
            $('#multicolumn-columns-wrapper .multicolumn-column-item').each(function(index) {
                // Actualizar display si es necesario
            });
            
            // Marcar cambios pendientes
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        }
    });
}
```

### 3. Cuándo Inicializar el Sortable:

**a) En attachBlockListEventListeners (cuando se carga la vista):**
```javascript
if (currentSectionsConfig.multicolumn && 
    currentSectionsConfig.multicolumn.columnOrder && 
    currentSectionsConfig.multicolumn.columnOrder.length > 0) {
    setTimeout(() => {
        initializeMulticolumnColumnsSortable();
    }, 100);  // Delay para asegurar que DOM esté listo
}
```

**b) Después de agregar un elemento:**
```javascript
// Después de agregar una columna y actualizar el HTML
setTimeout(() => {
    initializeMulticolumnColumnsSortable();
}, 100);
```

**c) Después de eliminar un elemento:**
```javascript
// Después de eliminar y re-renderizar
if (currentSectionsConfig.multicolumn.columnOrder.length > 0) {
    setTimeout(() => {
        initializeMulticolumnColumnsSortable();
    }, 100);
}
```

### 4. Elementos HTML Críticos:
- **Wrapper**: `<div id="[module]-[items]-wrapper">` - Contenedor único
- **Items**: Clase común para todos los elementos arrastrables
- **Handle**: `<i class="material-icons drag-handle">drag_handle</i>`
- **data-element-id**: Atributo con ID único de cada elemento

### 5. CSS Necesario (ya incluido en website-builder.css):
```css
.drag-handle {
    cursor: move;
    color: #6d7175;
}

.ui-sortable-helper {
    opacity: 0.8;
}

.column-item-placeholder {
    /* Estilos se aplican dinámicamente en start() */
}
```

### 6. Prevención de Conflictos:
- **Click vs Drag**: El sortable maneja esto automáticamente
- **Destruir antes de recrear**: Siempre hacer `.sortable('destroy')` primero
- **Namespaces en eventos**: Usar `.off().on()` para evitar duplicados

### 7. Depuración:
```javascript
console.log('[MODULE] New order:', newOrder);
console.log('[MODULE] Saved in config:', currentSectionsConfig.module.itemOrder);
```

### Checklist para Implementar Drag & Drop:
- [ ] Estructura de datos con array `itemOrder`
- [ ] HTML con wrapper único y data-element-id
- [ ] Función initialize[Module]Sortable()
- [ ] Inicializar en 3 momentos: carga, agregar, eliminar
- [ ] Actualizar modelo en stop()
- [ ] Marcar hasPendingPageStructureChanges = true
- [ ] CSS para drag handle incluido

### Tiempo de Implementación: 15-20 minutos
Siguiendo este patrón documentado, sin necesidad de debugging.

## 15. IMPLEMENTACIÓN CRÍTICA: Diseño Responsivo para Módulos

### Problema:
Los módulos del Website Builder DEBEN ser completamente responsivos. El módulo multicolumn no se adaptaba correctamente en vista móvil, mostrando las columnas en el mismo layout que desktop.

### Solución Implementada:

#### 1. Estructura con ID Único y Estilos Inline:
```javascript
render: function(config) {
    // CRÍTICO: Generar ID único para evitar conflictos entre múltiples instancias
    const uniqueId = 'multicolumn-' + Date.now();
    
    // Obtener configuración de layout móvil
    const mobileLayout = config.config?.mobileLayout || '1column';
    
    return `
        <style>
            /* CSS específico para esta instancia */
            @media (max-width: 768px) {
                #${uniqueId} .grid-class {
                    /* Estilos móviles */
                }
            }
        </style>
        <div id="${uniqueId}" class="section-wrapper">
            <!-- Contenido del módulo -->
        </div>
    `;
}
```

#### 2. Configuración de Layouts Móviles:

**a) Grid Responsivo Básico:**
```javascript
// Desktop
const gridColumns = columnCount === 1 ? '1fr' : 
                   columnCount === 2 ? '1fr 1fr' : 
                   columnCount === 3 ? '1fr 1fr 1fr' : 
                   'repeat(auto-fit, minmax(250px, 1fr))';

// Mobile
@media (max-width: 768px) {
    .multicolumn-grid {
        grid-template-columns: 1fr !important; /* Una columna */
    }
}
```

**b) Layout Carousel (Scroll Horizontal):**
```javascript
@media (max-width: 768px) {
    .multicolumn-grid {
        display: flex !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        gap: 15px !important;
    }
    
    .multicolumn-column {
        flex: 0 0 85% !important; /* Muestra parte de la siguiente */
        scroll-snap-align: start !important;
    }
}
```

#### 3. Media Queries Recomendadas:

```css
/* Tablet y móvil grande */
@media (max-width: 768px) {
    /* Ajustes principales */
    padding: 30px 0 !important;      /* Reducir padding */
    font-size: 24px !important;      /* Títulos más pequeños */
    margin-bottom: 15px !important;  /* Menos espacio */
}

/* Móvil pequeño */
@media (max-width: 480px) {
    /* Forzar una columna */
    grid-template-columns: 1fr !important;
    padding: 0 10px !important;      /* Padding mínimo */
    font-size: 20px !important;      /* Títulos aún más pequeños */
}
```

#### 4. Configuración en Panel Settings:

```javascript
<!-- Mobile Layout en configuración -->
<select id="module-mobile-layout" class="shopify-select">
    <option value="1column">1 column</option>
    <option value="carousel">Carousel</option>
    <option value="2columns">2 columns</option>
</select>

// Event listener
$('#module-mobile-layout').on('change', function() {
    updateConfig('mobileLayout', $(this).val());
});
```

#### 5. Ajustes Específicos para Móvil:

**Tamaños de Fuente:**
```css
/* Desktop */
h2 { font-size: 36px; }
p { font-size: 16px; }

/* Mobile */
@media (max-width: 768px) {
    h2 { font-size: 24px !important; }
    p { font-size: 14px !important; }
    
    /* Iconos más pequeños */
    svg {
        width: 36px !important;  /* vs 48px desktop */
        height: 36px !important;
    }
}
```

**Espaciado y Padding:**
```css
@media (max-width: 768px) {
    .container {
        padding: 0 15px !important;  /* vs 0 20px desktop */
    }
    
    .section-wrapper {
        padding: 30px 0 !important;  /* vs 60px 0 desktop */
    }
    
    /* Márgenes reducidos */
    margin-bottom: 15px !important;  /* vs 20-50px desktop */
}
```

#### 6. Características Especiales del Carousel:

```css
/* Scrollbar personalizado */
.grid::-webkit-scrollbar {
    height: 6px;
}

.grid::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 3px;
}

/* Indicador visual de más contenido */
.column {
    flex: 0 0 85% !important;  /* Muestra 85% de una columna */
}
```

#### 7. Consideraciones para la Pestaña Azul:

```css
@media (max-width: 768px) {
    .section-header-tag {
        font-size: 11px !important;  /* vs 13px desktop */
        padding: 2px 6px !important; /* vs 5px 10px desktop */
    }
}
```

### Patrón Completo para Nuevo Módulo:

```javascript
render: function(config) {
    const uniqueId = 'module-' + Date.now();
    const mobileLayout = config.config?.mobileLayout || 'default';
    
    // Determinar layout móvil
    let mobileStyles = '';
    switch(mobileLayout) {
        case 'carousel':
            mobileStyles = 'display: flex; overflow-x: auto;';
            break;
        case '2columns':
            mobileStyles = 'grid-template-columns: 1fr 1fr;';
            break;
        default:
            mobileStyles = 'grid-template-columns: 1fr;';
    }
    
    return `
        <style>
            @media (max-width: 768px) {
                #${uniqueId} {
                    padding: 30px 0 !important;
                }
                
                #${uniqueId} .grid {
                    ${mobileStyles}
                }
                
                #${uniqueId} h2 {
                    font-size: 24px !important;
                }
                
                #${uniqueId} p {
                    font-size: 14px !important;
                }
            }
            
            @media (max-width: 480px) {
                #${uniqueId} .grid {
                    grid-template-columns: 1fr !important;
                }
            }
        </style>
        <div id="${uniqueId}">
            <!-- Contenido -->
        </div>
    `;
}
```

### Checklist Responsivo:
- [ ] ID único para cada instancia del módulo
- [ ] Media queries para 768px y 480px mínimo
- [ ] Configuración de mobile layout en settings
- [ ] Reducción de tamaños de fuente en móvil
- [ ] Ajuste de padding y márgenes
- [ ] Iconos más pequeños en móvil
- [ ] Opción de carousel si aplica
- [ ] Test en preview móvil (ícono del celular)

### Tiempo Perdido Sin Esta Documentación: 45+ minutos
Por no entender la necesidad de IDs únicos y la estructura correcta de media queries inline.

## 16. IMPLEMENTACIÓN: Toggle de Visibilidad para Elementos Hijos

### Descripción:
Implementación del botón de visibilidad (ojo) para ocultar/mostrar elementos hijos individuales dentro de un módulo padre. Por ejemplo: columnas dentro de multicolumn, slides dentro de slideshow, etc.

### Requisitos en el Módulo JavaScript:

#### 1. Estructura de Datos con isHidden:
```javascript
currentSectionsConfig.multicolumn = {
    columns: {
        'column-123': { 
            id: 'column-123', 
            heading: 'Título',
            isHidden: false,  // CRÍTICO: Campo para controlar visibilidad
            // ... otros campos
        }
    },
    columnOrder: ['column-123', 'column-456']
}
```

#### 2. Filtrar Elementos Visibles en render():
```javascript
// En el módulo (multicolumn.js)
render: function(config) {
    const columns = config.columns || {};
    const columnOrder = config.columnOrder || [];
    
    // CRÍTICO: Filtrar solo elementos visibles
    const visibleColumns = columnOrder.filter(columnId => 
        columns[columnId] && !columns[columnId].isHidden
    );
    
    if (visibleColumns.length === 0) {
        return ''; // No renderizar si no hay elementos visibles
    }
    
    // Renderizar solo las columnas visibles
    const columnsHtml = visibleColumns.map((columnId) => {
        // ... renderizar columna
    });
}
```

### Implementación en website-builder.js:

#### 1. HTML del Botón en renderTemplateSections():
```javascript
// Dentro del loop de elementos hijos
html += `
    <div class="sidebar-subsection multicolumn-column-item" 
         data-block-type="multicolumn-column" 
         data-element-id="${columnId}">
        <span class="subsection-text">${column.heading || defaultText}</span>
        <div class="subsection-actions">
            <button class="action-icon visibility-toggle ${column.isHidden ? 'is-hidden' : ''}" 
                    data-column-id="${columnId}" 
                    title="Toggle visibility">
                <i class="material-icons icon-visible">visibility</i>
                <i class="material-icons icon-hidden">visibility_off</i>
            </button>
            <button class="action-icon delete-column" data-column-id="${columnId}">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>
`;
```

#### 2. Handler del Click (línea ~9314):
Agregar el caso para tu tipo de elemento:
```javascript
} else if (blockType === 'multicolumn-column' && elementId) {
    // Handle multicolumn column visibility
    if (currentSectionsConfig.multicolumn?.columns?.[elementId]) {
        currentSectionsConfig.multicolumn.columns[elementId].isHidden = newHiddenState;
        console.log(`[DEBUG] Column ${elementId} saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
        
        // CRÍTICO: Actualizar preview inmediatamente
        renderPreview();
    }
}
```

#### 3. Inicialización del Estado (línea ~9381):
Agregar el caso para sincronizar el estado visual:
```javascript
} else if (blockType === 'multicolumn-column' && elementId && 
           currentSectionsConfig.multicolumn?.columns?.[elementId]) {
    savedIsHidden = currentSectionsConfig.multicolumn.columns[elementId].isHidden || false;
}
```

### CSS Necesario (ya incluido en website-builder.css):
```css
/* El botón muestra visibility por defecto */
.visibility-toggle .icon-visible { display: inline; }
.visibility-toggle .icon-hidden { display: none; }

/* Cuando tiene clase is-hidden, muestra visibility_off */
.visibility-toggle.is-hidden .icon-visible { display: none; }
.visibility-toggle.is-hidden .icon-hidden { display: inline; }
```

### Flujo Completo:
1. Usuario hace click en el ojo → Handler actualiza `isHidden` en el modelo
2. Se agrega/quita clase `is-hidden` al botón → Cambia el ícono visual
3. Se llama a `renderPreview()` → El módulo filtra elementos ocultos
4. El preview se actualiza inmediatamente sin los elementos ocultos

### Checklist para Implementar:
- [ ] Campo `isHidden: false` en la estructura de datos de cada elemento hijo
- [ ] Filtrar elementos con `!element.isHidden` en la función render del módulo
- [ ] HTML del botón con clases correctas en renderTemplateSections
- [ ] Agregar caso en el handler de visibility toggle (~línea 9314)
- [ ] Agregar caso en la inicialización del estado (~línea 9381)
- [ ] Llamar a `renderPreview()` después de cambiar el estado
- [ ] Verificar que el botón tenga `data-block-type` correcto

### Errores Comunes:
1. **No filtrar en render()**: Si no filtras, los elementos seguirán apareciendo
2. **No llamar renderPreview()**: El cambio no se verá hasta guardar
3. **Usar el blockType incorrecto**: Debe coincidir con `data-block-type` del HTML
4. **No inicializar isHidden**: Puede causar comportamiento inconsistente

### Tiempo de Implementación: 10-15 minutos
Siguiendo este patrón, sin necesidad de debugging.