# Documentación del Módulo Footer - Website Builder

## 🔧 Fix Crítico: Footer no se mostraba en el Editor Preview

### Problema Inicial
El footer se mostraba correctamente en el preview real pero NO aparecía en el editor preview del Website Builder.

### Síntomas
- Footer visible en preview real ✅
- Footer NO visible en editor preview ❌
- Configuración del footer existía en la base de datos
- Logs mostraban que se renderizaban todas las secciones EXCEPTO el footer

### Causa Raíz
El problema tenía múltiples capas:

1. **Array `sectionOrder` incompleto**: El footer no estaba incluido en el array que determina qué secciones renderizar
2. **Error de contexto `this`**: El módulo footer.js tenía referencias a `this` que perdían contexto
3. **Datos mockup no se mostraban**: La configuración guardada sobrescribía los datos de ejemplo

### Solución Implementada

#### 1. Agregar Footer al sectionOrder (website-builder.js ~línea 428)
```javascript
// CRITICAL: Ensure footer is in sectionOrder if it exists in config
if (currentSectionsConfig.footer && !currentSectionsConfig.sectionOrder.includes('footer')) {
    currentSectionsConfig.sectionOrder.push('footer');
    console.log('[DEBUG] Added footer to sectionOrder');
}
```

#### 2. Fix de Contexto en footer.js
Cambiar todas las referencias de `this.` a `window.WebsiteBuilderModules.Footer.`:

```javascript
// ANTES (causaba error)
${this.renderBlocks(blocks, blockOrder, schemeColors, columnCount)}

// DESPUÉS (funciona correctamente)
${window.WebsiteBuilderModules.Footer.renderBlocks(blocks, blockOrder, schemeColors, columnCount)}
```

Aplicado a:
- `renderBlocks`
- `renderBottomBar`
- `renderBlock` (múltiples lugares)
- `renderMainSettings`
- `renderBottomBarSettings`

#### 3. Forzar Estructura Completa con Datos Mockup
```javascript
// Always show the complete footer structure with mock data
const defaultBlocks = {
    'block-1': { type: 'text', title: 'Soporte', content: 'support@purrteam.com\n+1 809-637-4142' },
    'block-2': { type: 'text', title: 'Ventas', content: 'support@purrteam.com\n+1 809-637-4142' },
    'block-3': { type: 'menu', title: 'Menu', menuId: 'footer-menu' },
    'block-4': { type: 'text', title: 'Direccion', content: 'Calle Leonardo Da Vinci #87...' },
    'block-5': { type: 'social', title: 'Siguenos en' },
    'block-6': { type: 'newsletter', title: 'Subscribete' },
    'block-7': { type: 'logo', title: '' }
};

// Always use all 7 blocks for the complete structure
const blocks = defaultBlocks;
const blockOrder = ['block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6', 'block-7'];
```

### Archivos Modificados
1. `/wwwroot/js/website-builder.js`
   - Línea ~428: Agregar verificación para incluir footer en sectionOrder
   - Línea ~378-437: Configuración inicial del footer con bloques por defecto

2. `/wwwroot/js/website-builder/modules/footer.js`
   - Múltiples líneas: Cambiar `this.` por `window.WebsiteBuilderModules.Footer.`
   - Líneas 31-84: Forzar uso de bloques mockup completos

3. `/Views/WebsiteBuilder/PreviewTemplate.cshtml`
   - Líneas 277-288: Asegurar disponibilidad de módulos y funciones

### Lecciones Aprendidas

1. **Siempre verificar el `sectionOrder`**: Las secciones no se renderizan si no están en este array
2. **Cuidado con el contexto `this` en módulos**: Usar referencias completas al window
3. **Los datos guardados pueden sobrescribir defaults**: Considerar cuándo forzar estructura vs respetar configuración
4. **El iframe del preview tiene su propio contexto**: Asegurar que funciones y módulos estén disponibles

### Estado Actual
✅ Footer se muestra en editor preview con estructura completa de 7 bloques
✅ Footer se muestra en preview real
✅ Sin errores en consola
✅ Estructura coincide con la imagen de referencia

## 📋 Estructura del Footer

### Diseño Visual (4 columnas superiores + 3 columnas inferiores)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Soporte   │   Ventas    │    Menu     │  Dirección  │
├─────────────┴─────────┬───┴─────────────┬─────────────┤
│   Síguenos en        │   Subscríbete   │    Logo     │
└──────────────────────┴─────────────────┴─────────────┘
│                    Bottom Bar                          │
└────────────────────────────────────────────────────────┘
```

### Tipos de Bloques
1. **text**: Título + contenido de texto
2. **menu**: Enlaces de menú
3. **social**: Iconos de redes sociales
4. **newsletter**: Formulario de suscripción
5. **logo**: Logo con texto
6. **subscribe**: Campo de email con botón

## 🔧 Fix: Toggles mal implementados en configuración

### Problema
Los toggles en la vista de configuración del footer estaban usando una estructura incorrecta con `toggle-container` que no aplicaba los estilos correctos de Shopify.

### Estructura Incorrecta (❌)
```html
<label class="toggle-container">
    <span>Label text</span>
    <input type="checkbox" id="toggle-id">
    <span class="toggle-slider"></span>
</label>
```

### Estructura Correcta (✅)
```html
<label style="display: flex; align-items: center; justify-content: space-between;">
    <span>Label text</span>
    <div style="display: flex; align-items: center;">
        <input type="checkbox" id="toggle-id" class="shopify-toggle">
        <label for="toggle-id" class="toggle-slider"></label>
    </div>
</label>
```

### Cambios Clave
1. El input debe tener la clase `shopify-toggle`
2. El slider debe ser un `<label>` no un `<span>`
3. El label del slider debe tener el atributo `for` apuntando al ID del input
4. La estructura requiere un wrapper con flex para alineación correcta

### Toggles Corregidos
- Background color toggle
- Show separator toggle
- Show bottom bar toggle
- Show payment icons toggle

### Estilos CSS Aplicados (website-builder.css ~línea 2300)
```css
.shopify-toggle {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    background-color: #c9cccf;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.shopify-toggle:checked + .toggle-slider {
    background-color: #008060;
}

.toggle-slider:after {
    /* Círculo del toggle */
    transform: translateX(16px) when checked;
}
```

## 🔧 Fix: Radio buttons para selección de columnas

### Problema
Los radio buttons para seleccionar entre 3 o 4 columnas estaban:
1. Visualmente deshabilitados (no se podían clickear)
2. Usando estructura HTML incorrecta con `number-selector`
3. El cambio de columnas no reorganizaba el layout

### Estructura Incorrecta (❌)
```html
<div class="number-selector">
    <input type="radio" name="footer-column-count" value="3" id="footer-columns-3">
    <label for="footer-columns-3">3</label>
    <input type="radio" name="footer-column-count" value="4" id="footer-columns-4">
    <label for="footer-columns-4">4</label>
</div>
```

### Estructura Correcta (✅)
```html
<div class="radio-group">
    <label class="radio-label">
        <input type="radio" name="footer-column-count" value="3">
        <span>3</span>
    </label>
    <label class="radio-label">
        <input type="radio" name="footer-column-count" value="4">
        <span>4</span>
    </label>
</div>
```

### Implementación de Lógica de Columnas

#### Método `renderBlocks` actualizado:
```javascript
renderBlocks: function(blocks, blockOrder, schemeColors, columnCount) {
    if (columnCount === 3) {
        // Distribución 3-3-1 para 3 columnas
        const firstRowBlocks = blockOrder.slice(0, 3);   // Bloques 1-3
        const secondRowBlocks = blockOrder.slice(3, 6);  // Bloques 4-6
        const thirdRowBlocks = blockOrder.slice(6, 7);   // Bloque 7
        
        // Renderizar cada fila y agregar divs vacíos para completar el grid
    } else {
        // Distribución 4-3 para 4 columnas (default)
        const firstRowBlocks = blockOrder.slice(0, 4);   // Bloques 1-4
        const secondRowBlocks = blockOrder.slice(4, 7);  // Bloques 5-7
        
        // Renderizar y agregar un div vacío al final
    }
}
```

### Distribución Visual

#### Layout 3 Columnas:
```
┌─────────┬─────────┬─────────┐
│ Soporte │ Ventas  │  Menu   │  (Fila 1: 3 bloques)
├─────────┼─────────┼─────────┤
│Dirección│Síguenos │Subscribe│  (Fila 2: 3 bloques)
├─────────┼─────────┼─────────┤
│         │  Logo   │         │  (Fila 3: 1 bloque centrado)
└─────────┴─────────┴─────────┘
```

#### Layout 4 Columnas:
```
┌─────────┬─────────┬─────────┬─────────┐
│ Soporte │ Ventas  │  Menu   │Dirección│  (Fila 1: 4 bloques)
├─────────┼─────────┼─────────┼─────────┤
│Síguenos │Subscribe│  Logo   │         │  (Fila 2: 3 bloques + 1 vacío)
└─────────┴─────────┴─────────┴─────────┘
```

### Estilos CSS Aplicados (website-builder.css ~línea 4585)
```css
.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #202223;
}
```

### Event Listener
```javascript
$('input[name="footer-column-count"]').off('change').on('change', function() {
    updateConfig('desktopColumnCount', parseInt($(this).val()));
});
```

### Resultado
- ✅ Radio buttons visualmente habilitados y funcionales
- ✅ Cambio dinámico entre layouts de 3 y 4 columnas
- ✅ Todos los 7 bloques permanecen visibles en ambas configuraciones
- ✅ Grid CSS se ajusta automáticamente: `grid-template-columns: repeat(${columnCount}, 1fr)`

## 🔧 Implementación de Drag & Drop para Bloques del Footer

### Contexto
Los bloques del footer necesitaban poder reordenarse mediante drag & drop en el panel lateral, siguiendo el patrón establecido en FLUJO-REAL-MODULOS.md.

### Implementación Realizada

#### 1. Función de Sortable (ya existía en website-builder.js ~línea 14187)
```javascript
function initializeFooterBlocksSortable() {
    const $wrapper = $('#footer-blocks-wrapper');
    
    $wrapper.sortable({
        items: '.footer-block-item',
        handle: '.drag-handle',
        placeholder: 'sortable-placeholder',
        forcePlaceholderSize: true,
        cursor: 'move',
        tolerance: 'pointer',
        axis: 'y',
        containment: 'parent',
        stop: function(e, ui) {
            const newOrder = [];
            $wrapper.find('.footer-block-item').each(function() {
                const blockId = $(this).data('element-id');
                if (blockId) {
                    newOrder.push(blockId);
                }
            });
            
            // Actualizar orden en la configuración
            currentSectionsConfig.footer.blockOrder = newOrder;
            hasPendingPageStructureChanges = true;
            updateSaveButtonState();
            renderPreview();
        }
    });
}
```

#### 2. Inicialización en attachBlockListEventListeners (agregado ~línea 13218)
```javascript
// Initialize sortable for footer blocks if they exist
if (currentSectionsConfig.footer && currentSectionsConfig.footer.blockOrder && currentSectionsConfig.footer.blockOrder.length > 0) {
    console.log('[FOOTER] Initializing sortable from attachBlockListEventListeners');
    console.log('[FOOTER] Current block order:', currentSectionsConfig.footer.blockOrder);
    setTimeout(() => {
        initializeFooterBlocksSortable();
    }, 100);
}
```

#### 3. Estructura HTML (renderFooterBlocks ~línea 6438)
```html
<div id="footer-blocks-wrapper" style="position: relative;">
    <div class="sidebar-subsection footer-block-item" data-block-type="footer-block" data-element-id="${blockId}">
        <i class="material-icons drag-handle">drag_handle</i>
        <span class="subsection-text">${blockName}</span>
        <!-- botones de acción -->
    </div>
</div>
```

### Elementos Clave
- **Contenedor**: `#footer-blocks-wrapper`
- **Items arrastrables**: `.footer-block-item`
- **Manejador**: `.drag-handle` (ícono drag_handle)
- **Identificador**: `data-element-id` con el ID del bloque

### Estado Actual
✅ **Funciona en panel lateral**: Los 7 bloques mockup se pueden reordenar correctamente
❌ **No sincroniza con editor**: Los bloques mockup no tienen IDs únicos que coincidan con el orden guardado

### Pendiente para Próxima Sesión
- Asignar IDs únicos a los bloques mockup para que el reordenamiento se refleje en el editor
- Actualmente los bloques mockup son hardcodeados sin respetar el `blockOrder`

## 🚧 Pendientes y Mejoras Futuras

1. **Sistema de gestión de bloques**: Implementar agregar/eliminar/reordenar bloques
2. **Configuración individual de bloques**: Permitir editar cada bloque desde el panel
3. **Integración con menús reales**: Conectar con el sistema de menús del website
4. **Iconos de pago reales**: Reemplazar placeholders con iconos SVG reales
5. **Responsive móvil**: Mejorar el comportamiento en dispositivos pequeños
6. **Persistencia selectiva**: Decidir cuándo usar datos guardados vs mockups
7. **Sincronización drag & drop**: Hacer que el reorden en panel lateral se refleje en editor

## 🔴 PRÓXIMA SESIÓN - PUNTO DE RETORNO

### Contexto Actual
- **Fecha/Hora última sesión**: 2025-01-07
- **Estado**: Footer funciona al 90%, falta sincronización del drag & drop con el editor

### Problema Específico a Resolver
El drag & drop de bloques funciona en el panel lateral pero NO se refleja en el editor porque:
1. Los bloques mockup en `footer.js` están hardcodeados con IDs fijos ('block-1', 'block-2', etc.)
2. El método `renderBlocks()` no respeta el `blockOrder` guardado
3. Los bloques siempre se muestran en el mismo orden sin importar el reordenamiento

### Archivos a Modificar
1. **`/wwwroot/js/website-builder/modules/footer.js`**
   - Método `render()` línea ~31: Cambiar lógica de bloques mockup
   - Método `renderBlocks()` línea ~263: Respetar el blockOrder
   - Los bloques deben usar los IDs del `blockOrder` actual

### Solución Propuesta
```javascript
// En lugar de:
const blocks = defaultBlocks; // Siempre usa los mismos IDs

// Hacer:
const blocks = {};
const blockOrder = config.blockOrder || [];
blockOrder.forEach((blockId, index) => {
    blocks[blockId] = defaultBlocks[`block-${index + 1}`] || {};
    blocks[blockId].id = blockId; // Mantener el ID real
});
```

### Para Probar
1. Reordenar bloques en panel lateral
2. Verificar que el orden cambie en el editor preview
3. Guardar y recargar para verificar persistencia

### Comando para Empezar
"Claude, necesito continuar con la sincronización del drag & drop del footer. El problema está en que los bloques mockup no respetan el blockOrder. Ver sección 'PRÓXIMA SESIÓN' en FOOTER.md"

## 🔧 Fix: Vista de configuración Logo with Text mal implementada

### Contexto del Problema
La vista de configuración del bloque "Logo with text" del footer estaba mal implementada con varios problemas de UI/UX que no cumplían con las reglas establecidas en FLUJO-REAL-MODULOS.md.

### 🔴 UBICACIÓN CRÍTICA DEL CÓDIGO
**IMPORTANTE**: La vista del logo NO está en el módulo footer.js, está en el archivo principal:
- **Archivo**: `/wwwroot/js/website-builder.js`
- **Función**: `renderFooterLogoWithTextSettingsView` (línea ~6746)
- **Event Listeners**: `attachFooterLogoWithTextEventListeners` (línea ~6843)
- **Case en switchSidebarView**: línea ~5971

### Problemas Encontrados
1. **Estructura de scrollbar incorrecta**: Usaba `sidebar-view-content` sin la estructura flex correcta
2. **Títulos mal formateados**: Usaba `<h4>` sin estilos Shopify (debe ser `font-size: 13px; font-weight: 500; color: #5c5e60;`)
3. **Espaciado inconsistente**: Sin márgenes entre secciones
4. **Botones con onclick inline**: Violaba el patrón de event listeners
5. **Sin botón para remover imagen**: No había forma de eliminar un logo cargado

### Estructura Correcta Implementada

#### 1. Contenedor Principal con Scrollbar Correcto
```html
<div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
    <div class="sidebar-view-header" style="position: relative; z-index: 10;">
        <!-- Header fijo -->
    </div>
    
    <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
        <!-- Contenido scrollable -->
    </div>
</div>
```

**Por qué**: Esto evita el problema de doble scrollbar. El contenedor principal tiene `overflow: hidden` y solo el área de contenido tiene `overflow-y: auto`.

#### 2. Grupos de Configuración con Estilo Correcto
```html
<div class="settings-group">
    <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Logo</h4>
    <!-- Campos -->
</div>

<div class="settings-group" style="margin-top: 30px;">
    <h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Text</h4>
    <!-- Campos -->
</div>
```

#### 3. Upload de Imagen Mejorado
```html
<!-- Estado sin imagen -->
<div class="logo-placeholder" style="border: 1px dashed #c9cccf; border-radius: 4px; padding: 40px; text-align: center; background: #f9fafb; margin-bottom: 12px;">
    <i class="material-icons" style="font-size: 48px; color: #c9cccf;">image</i>
    <p style="margin: 8px 0 0 0; color: #6c7079; font-size: 13px;">No image selected</p>
</div>
<button class="shopify-button secondary logo-upload-btn" data-block-id="${blockId}">
    <span data-i18n="common.selectImage">Select image</span>
</button>

<!-- Estado con imagen -->
<div class="logo-preview" style="margin-bottom: 12px; border: 1px solid #e3e3e3; border-radius: 4px; padding: 20px; text-align: center; background: #f7f7f7;">
    <img src="${block.logo}" alt="Logo" style="max-width: 100%; max-height: 80px; object-fit: contain;">
</div>
<button class="shopify-button secondary logo-upload-btn" data-block-id="${blockId}">
    <span data-i18n="common.changeImage">Change image</span>
</button>
<button class="shopify-button secondary remove-logo-btn" data-block-id="${blockId}" style="margin-left: 8px;">
    <span data-i18n="common.removeImage">Remove</span>
</button>
```

#### 4. Event Listeners Correctos (NO onclick inline)
```javascript
// Back button
$('.back-to-sections-btn').off('click').on('click', function() {
    window.switchSidebarView('blockList');
});

// Logo upload button clicks
$('.logo-upload-btn').off('click').on('click', function() {
    const btnBlockId = $(this).data('block-id');
    $(`#footer-logo-input-${btnBlockId}`).click();
});

// Remove logo button
$('.remove-logo-btn').off('click').on('click', function() {
    const btnBlockId = $(this).data('block-id');
    if (currentSectionsConfig.footer?.blocks?.[btnBlockId]) {
        currentSectionsConfig.footer.blocks[btnBlockId].logo = '';
        hasPendingPageStructureChanges = true;
        updateSaveButtonState();
        renderPreview();
        window.switchSidebarView('footerLogoWithTextSettings', { blockId: btnBlockId });
    }
});
```

### Función Helper Agregada
Se creó `window.configureFooterBlock` (línea ~23455) para manejar la navegación a diferentes vistas de configuración de bloques del footer:

```javascript
window.configureFooterBlock = function(blockId, blockType) {
    // Valida que el bloque existe
    // Redirige a la vista correcta según el tipo
    switch(block.type) {
        case 'logo-with-text':
        case 'logo':
            window.switchSidebarView('footerLogoWithTextSettings', { blockId });
            break;
        // ... otros casos
    }
};
```

### Checklist para Futuras Vistas de Configuración
- [ ] Usar estructura flex con scrollbar solo en el contenido
- [ ] Headers de sección con estilo: `font-size: 13px; font-weight: 500; color: #5c5e60;`
- [ ] Espaciado entre grupos: `margin-top: 30px;`
- [ ] NO usar onclick inline - usar clases y event listeners
- [ ] Botón back debe usar clase `.back-to-sections-btn`
- [ ] Incluir opción de remover/limpiar cuando sea aplicable
- [ ] Validar existencia de datos antes de modificar: `if (currentSectionsConfig.footer?.blocks?.[blockId])`

### Búsqueda Rápida para Encontrar Vistas de Footer
```bash
# Buscar todas las vistas de configuración del footer
grep -n "function render.*Footer.*SettingsView" website-builder.js

# Buscar el switch case específico
grep -n "case 'footer.*Settings':" website-builder.js

# Buscar dónde se llama a una vista específica
grep -n "switchSidebarView('footerLogoWithTextSettings'" website-builder.js
```

### Lección Aprendida
Las vistas de configuración de bloques del footer NO están en el módulo `/modules/footer.js`, están en el archivo principal `website-builder.js`. Esto puede causar confusión al buscar el código.

---
*Documento creado: 2025-01-07*
*Última actualización: 2025-01-08*