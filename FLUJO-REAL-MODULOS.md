# Flujo Real para Construcción de Módulos - Website Builder

## 🚨 ADVERTENCIAS CRÍTICAS - LEER ANTES DE EMPEZAR

### ⛔ ERRORES QUE SIEMPRE SE REPITEN:
1. **NO agregar sección de "agregar items" en vistas de configuración** - Esta funcionalidad YA EXISTE en el panel lateral con el ícono (+)
2. **NO usar títulos grandes** - Usar: `font-size: 13px; font-weight: 500; color: #5c5e60;`
3. **NO olvidar copiar imágenes a wwwroot/TestImages**
4. **NO mezclar nombres/IDs del módulo** - Usar UN SOLO nombre consistentemente

**Ver ETAPA 4.5 para detalles completos sobre estos errores críticos**

## Introducción
Este documento describe el flujo REAL y probado para construir módulos nuevos, siguiendo el orden exacto en que se desarrollan y con las soluciones integradas para evitar los problemas más comunes.

## ETAPA 1: RECEPCIÓN DE ASSETS
**Lo que recibes del usuario:**
- Imagen preview para el modal (hover)
- Imagen/estructura que se mostrará en el editor

### 🔴 ACCIÓN OBLIGATORIA: Copiar imágenes a wwwroot
```bash
# SIEMPRE ejecutar este comando para cada imagen recibida
cp "/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23/TestImages/NombreImagen.png" "/mnt/c/Users/hp/Documents/Visual Studio 2022/Projects/Hotel23/wwwroot/TestImages/"
```
**CRÍTICO**: Sin este paso, las imágenes darán error 404

### 🔴 PRE-CHECK OBLIGATORIO
Antes de escribir una sola línea de código:

1. **Elegir UN SOLO nombre/ID para el módulo**
   - Ejemplo: `accordion` (no accordion-faq, accordionFAQ, etc.)
   - Usar este MISMO nombre en TODOS lados

2. **Verificar consistencia:**
   ```
   Archivo: accordion.js
   Window: WebsiteBuilderModules.Accordion
   Config: currentSectionsConfig.accordion
   Order: sectionOrder.push('accordion')
   Modal: data-section-id="accordion"
   View: case 'accordionSettings'
   ```

## ETAPA 2: ACTIVACIÓN BÁSICA (Modal → Panel → Editor)

### Objetivo
Al hacer click en el modal, el módulo debe aparecer en:
1. Panel lateral izquierdo
2. Preview del editor (iframe central)

### ⚠️ PROBLEMAS COMUNES DETECTADOS

#### Problema 1: Preview hover no funciona
**Síntoma**: Al hacer hover sobre el módulo en el modal, no aparece el preview
**Causa**: Existen DOS objetos `previews` en website-builder.js
**Solución**: 
- El primero (~línea 10955) es para HTML complejo
- El segundo (~línea 11180) es para rutas de imágenes simples
- Para imágenes PNG, usar el segundo objeto

#### Problema 2: No aparece en panel lateral
**Síntoma**: Click en modal pero no se agrega al panel lateral
**Causa**: Falta agregar el módulo en `renderTemplateSections()` o inconsistencia en nombres
**Solución**: Agregar caso específico del módulo (~línea 5675)

**⚠️ CASO ESPECIAL - Inconsistencia kebab-case vs camelCase**:
Si tu módulo usa guiones en el HTML pero camelCase en JavaScript (ejemplo: `featured-product` vs `featuredProduct`), debes agregar un mapeo especial en `renderTemplateSections()`:

```javascript
// Special case for featured-product since it uses camelCase in config
if (sectionId === 'featured-product' && currentSectionsConfig.featuredProduct) {
    sectionConfig = currentSectionsConfig.featuredProduct;
}
```

**Por qué ocurre**: 
- En HTML/DOM: `data-section-id="featured-product"` (kebab-case)
- En JavaScript: `currentSectionsConfig.featuredProduct` (camelCase)
- La función busca `currentSectionsConfig['featured-product']` pero no existe

**Recomendación**: Mantener consistencia usando el mismo formato en todos lados

#### Problema 3: Error 404 - Preview image not found
**Síntoma**: Consola muestra "Failed to load resource: 404"
**Causa**: Las imágenes proporcionadas están en `/TestImages/` pero el servidor las busca en `/wwwroot/TestImages/`
**Solución CRÍTICA**: 
```bash
# SIEMPRE copiar las imágenes a wwwroot/TestImages
cp "/ruta/origen/imagen.png" "/mnt/c/.../Hotel23/wwwroot/TestImages/"
```
**IMPORTANTE**: 
- Usuario proporciona imágenes en: `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\`
- Deben copiarse a: `/wwwroot/TestImages/`
- La ruta en el código debe ser: `/TestImages/imagen.png` (sin wwwroot)

### 🔴 IMPLEMENTACIÓN CORRECTA

### ⚠️ CRÍTICO: Problema del Contexto 'this' en Módulos

**PROBLEMA COMÚN**: "Uncaught TypeError: this.methodName is not a function"

**CAUSA**: Cuando las funciones del módulo se ejecutan desde el iframe del preview o desde diferentes contextos, el `this` no apunta al objeto del módulo.

**❌ NUNCA HACER**:
```javascript
window.WebsiteBuilderModules.TuModulo = {
    render: function(config) {
        return `${this.renderHelper(data)}`;  // ❌ ERROR: this is undefined
    },
    renderHelper: function(data) {
        return `<div>${data}</div>`;
    }
}
```

**✅ SIEMPRE HACER**:
```javascript
window.WebsiteBuilderModules.TuModulo = {
    render: function(config) {
        return `${window.WebsiteBuilderModules.TuModulo.renderHelper(data)}`;  // ✅ CORRECTO
    },
    renderHelper: function(data) {
        return `<div>${data}</div>`;
    }
}
```

**APLICA PARA**:
- Llamadas entre métodos del mismo módulo
- Event handlers
- Callbacks 
- setTimeout/setInterval
- Cualquier referencia a métodos o propiedades del módulo

**EJEMPLO REAL** (featured-product.js):
```javascript
// ❌ MAL - Causó error en producción
render: function(config) {
    return `
        <div class="product-info">
            ${this.renderProductInfo(config, schemeColors)}  // ERROR!
        </div>
    `;
}

// ✅ BIEN - Solución correcta
render: function(config) {
    return `
        <div class="product-info">
            ${window.WebsiteBuilderModules.FeaturedProduct.renderProductInfo(config, schemeColors)}
        </div>
    `;
}
```

**TIEMPO PERDIDO SI NO SE DOCUMENTA**: 15-30 minutos de debugging

#### 2.1 Crear archivo base
```javascript
// /wwwroot/js/website-builder/modules/accordion.js
window.WebsiteBuilderModules = window.WebsiteBuilderModules || {};
window.WebsiteBuilderModules.Accordion = {
    render: function(config) {
        if (!config || config.isHidden) return '';
        
        const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
        const items = config.itemOrder || [];
        
        // CRÍTICO: Incluir section-header-tag para la pestaña azul al hover
        // La pestaña azul aparece al hacer hover sobre section-wrapper
        // CSS implementado en PreviewTemplate.cshtml líneas 109-143
        return `
            <div class="section-wrapper" data-section-id="accordion" style="padding: 40px 0; background-color: ${schemeColors.background};">
                <div class="section-header-tag">
                    <span class="material-symbols-outlined" style="font-size: 16px;">help</span>
                    ${window.translations && window.translations[window.currentLanguage] ? 
                        (window.translations[window.currentLanguage]['sections.accordion'] || 'Accordion/FAQ') : 
                        'Accordion/FAQ'}
                </div>
                <div class="container" style="max-width: 1200px; margin: 0 auto;">
                    ${items.length > 0 ? `
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h2 style="font-size: 36px; color: ${schemeColors.text};">FAQ</h2>
                            <p style="color: ${schemeColors.text};">Answers to most common questions about products, orders, shipments, and payments.</p>
                        </div>
                        ${items.map((itemId, index) => {
                            const item = config.items[itemId];
                            if (!item || item.isHidden) return '';
                            
                            const categoryTitle = index === 0 || index === 2 ? 'Category' : '';
                            
                            return `
                                ${categoryTitle ? `<h3 style="margin: 30px 0 20px 0; color: ${schemeColors.text};">${categoryTitle}</h3>` : ''}
                                <div style="background: #d4a574; padding: 15px 20px; margin-bottom: 10px; border-radius: 4px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #000;">Frequently asked question</span>
                                    <span style="color: #000; font-size: 20px;">+</span>
                                </div>
                            `;
                        }).join('')}
                    ` : `
                        <div style="text-align: center; padding: 60px 20px;">
                            <i class="material-icons" style="font-size: 48px; color: #999;">help_outline</i>
                            <p style="margin-top: 20px; color: #666;">Click the + button to add FAQ items</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    },
    renderSettings: function(config) {
        return `<div>Settings placeholder</div>`;
    },
    attachEventListeners: function() {},
    initialize: function() {}
};
```

#### 2.2 Cargar en los 3 archivos críticos
```html
<!-- Index.cshtml -->
<script src="~/js/website-builder/modules/accordion.js?v=@DateTime.Now.Ticks"></script>

<!-- PreviewTemplate.cshtml -->
<script src="~/js/website-builder/modules/accordion.js?v=@DateTime.Now.Ticks"></script>

<!-- Preview.cshtml -->
<script src="~/js/website-builder/modules/accordion.js?v=@DateTime.Now.Ticks"></script>
```

#### 2.3 Agregar al modal (website-builder.js ~línea 10700)
```javascript
{
    id: 'accordion',
    title: 'Accordion/FAQ',
    description: 'Preguntas frecuentes expandibles',
    icon: 'help',
    preview: 'accordion'
}
```

#### 2.4 Agregar preview hover (~línea 10707)
```javascript
const previews = {
    // ... otros
    'accordion': '/TestImages/accordion-preview.png'
};
```

#### 2.5 Handler del click (~línea 11000)
```javascript
} else if (group === 'template' && sectionId === 'accordion') {
    console.log('[DEBUG] Adding accordion section');
    
    if (!currentSectionsConfig.accordion) {
        currentSectionsConfig.accordion = {
            id: 'accordion',
            isHidden: false,
            colorScheme: 'scheme1',
            items: {},
            itemOrder: []
        };
    }
    
    if (!currentSectionsConfig.sectionOrder) {
        currentSectionsConfig.sectionOrder = [];
    }
    
    // CRÍTICO: usar nombre exacto
    if (!currentSectionsConfig.sectionOrder.includes('accordion')) {
        currentSectionsConfig.sectionOrder.push('accordion');
    }
    
    const templateSectionsHtml = renderTemplateSections();
    $('#template-sections-container').html(templateSectionsHtml + addSectionBtnHtml);
    
    setTimeout(applyTranslations, 0);
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    M.Modal.getInstance(document.querySelector('.add-section-modal')).close();
}
```

#### 2.6 Caso en renderPreview() (~línea 1820)
```javascript
} else if (sectionId === 'accordion') {
    const config = currentSectionsConfig.accordion;
    if (config && !config.isHidden) {
        const moduleRender = iframeWindow.WebsiteBuilderModules?.Accordion?.render;
        if (moduleRender) {
            finalHtml += moduleRender(config);
        } else if (iframeWindow.renderAccordion) {
            finalHtml += iframeWindow.renderAccordion(config);
        }
    }
}
```

#### 2.7 Función fallback (website-builder.js)
```javascript
function renderAccordion(config) {
    if (!config || config.isHidden) return '';
    
    return `
        <div class="section-wrapper accordion-section" data-section-id="accordion">
            <div class="section-header-tag">
                <span class="material-symbols-outlined">help</span>
                Accordion/FAQ
            </div>
            <div style="padding: 40px; text-align: center; background: #f5f5f5;">
                <p>Accordion/FAQ - Sin configurar</p>
            </div>
        </div>
    `;
}
```

#### 2.8 Agregar a renderers (~línea 1840)
```javascript
const renderers = {
    // ... otros
    'accordion': window.WebsiteBuilderModules?.Accordion?.render || renderAccordion
};
```

### ✅ VERIFICACIÓN ETAPA 2
- [ ] Click en modal → aparece en panel lateral
- [ ] Se ve algo en el preview del editor
- [ ] Console no muestra errores

## ETAPA 3: ICONOS DE ACCIÓN

### Iconos del Padre
- **Más (+)**: Agregar elementos FAQ
- **Ojo**: Toggle visibilidad
- **Zafacón**: Eliminar sección

### Iconos de los Hijos
- **Ojo**: Toggle visibilidad del item
- **Zafacón**: Eliminar item

### 🔴 IMPLEMENTACIÓN

#### 3.1 En renderTemplateSections (~línea 5400)
```javascript
} else if (sectionId === 'accordion' && currentSectionsConfig.accordion) {
    const config = currentSectionsConfig.accordion;
    html += `
        <div class="sidebar-subsection" data-block-type="accordion" data-section-id="accordion">
            <i class="material-icons drag-handle">drag_handle</i>
            <span class="subsection-text">Accordion/FAQ</span>
            <div class="subsection-actions">
                <button class="action-icon visibility-toggle ${config.isHidden ? 'is-hidden' : ''}" 
                        data-section="accordion" title="Toggle visibility">
                    <i class="material-icons icon-visible">visibility</i>
                    <i class="material-icons icon-hidden">visibility_off</i>
                </button>
                <button class="action-icon add-icon" data-section="accordion" title="Add FAQ">
                    <i class="material-icons">add</i>
                </button>
                <button class="action-icon delete-section" data-section="accordion" title="Delete">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    `;
}
```

#### 3.2 Handler del botón (+) - Agregar FAQ
```javascript
// En attachBlockListEventListeners() ~línea 9500
$(document).on('click', '.add-icon[data-section="accordion"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const itemId = 'faq-' + Date.now();
    
    if (!currentSectionsConfig.accordion.items) {
        currentSectionsConfig.accordion.items = {};
        currentSectionsConfig.accordion.itemOrder = [];
    }
    
    currentSectionsConfig.accordion.items[itemId] = {
        id: itemId,
        question: 'Nueva pregunta',
        answer: 'Nueva respuesta',
        isHidden: false
    };
    
    currentSectionsConfig.accordion.itemOrder.push(itemId);
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Abrir vista de configuración
    window.switchSidebarView('accordionSettings');
});
```

#### 3.3 Handler visibilidad (~línea 9800)
```javascript
} else if (section === 'accordion' || blockType === 'accordion') {
    currentSectionsConfig.accordion.isHidden = newHiddenState;
    console.log(`[DEBUG] Accordion saved as: ${newHiddenState ? 'hidden' : 'visible'}`);
    
    if (window.forceVisibilitySync) {
        window.forceVisibilitySync('accordion', newHiddenState);
    }
}
```

#### 🔴 CRÍTICO - FIX PARA EL ÍCONO DEL OJO (VISIBILIDAD)
**Problema común**: Después de guardar, se necesitan dos clicks para cambiar el estado del ícono del ojo.

**Causa**: La función `syncVisibilityToggleStates()` no incluye el nuevo módulo, por lo que no sincroniza el estado después de guardar.

**SOLUCIÓN OBLIGATORIA**: Agregar el módulo a `syncVisibilityToggleStates()` (~línea 9168):

```javascript
// En la función syncVisibilityToggleStates()
} else if (section === 'testimonials') {
    isHidden = currentSectionsConfig.testimonials?.isHidden || false;
} else if (section === 'accordion') {  // <-- AGREGAR ESTE CASO
    isHidden = currentSectionsConfig.accordion?.isHidden || false;
}

// Si el módulo tiene elementos hijos, también agregar:
} else if (blockType === 'accordion-item' && elementId) {
    isHidden = currentSectionsConfig.accordion?.items?.[elementId]?.isHidden || false;
} else if (elementType === 'faq' && elementId) {  // Alternativa para FAQ items
    isHidden = currentSectionsConfig.accordion?.items?.[elementId]?.isHidden || false;
}
```

**VERIFICACIÓN**: Buscar la función para asegurarse de agregar en el lugar correcto:
```bash
grep -n "function syncVisibilityToggleStates" website-builder.js
```

**SIN ESTE PASO**: El ícono del ojo mostrará estados incorrectos después de guardar.

#### 3.4 🔴 CRÍTICO - Handler delete (~línea 9080)
```javascript
} else if (section === 'accordion' && currentSectionsConfig.accordion) {
    console.log('[DEBUG] Deleting accordion section');
    
    // CRÍTICO: Eliminar hijos primero
    $('#accordion-items-wrapper').remove();
    $('.accordion-faq-item').remove();
    
    delete currentSectionsConfig.accordion;
    
    let index = currentSectionsConfig.sectionOrder.indexOf('accordion');
    if (index > -1) {
        currentSectionsConfig.sectionOrder.splice(index, 1);
    }
}
```

#### 3.5 🔴 CRÍTICO - Actualizar condición (~línea 9189)
```javascript
// OBLIGATORIO agregar accordion aquí
if (section === 'imageWithText' || section === 'multicolumn' || 
    section === 'slideshow' || section === 'accordion') {
    const templateSectionsHtml = renderTemplateSections();
    $('#template-sections-container').html(templateSectionsHtml + addSectionBtnHtml);
    setTimeout(applyTranslations, 0);
}
```

## 🔴 ETAPA 3.5: IMPLEMENTACIÓN COMPLETA DE DRAG & DROP (CRÍTICO)

### ⚠️ ADVERTENCIA IMPORTANTE
El drag & drop de elementos hijos es una de las partes más complejas y propensas a errores. Esta implementación requiere **3 PARTES OBLIGATORIAS** para funcionar correctamente.

### 📋 PROBLEMA COMÚN Y SOLUCIÓN
**Problema**: Los módulos tienen elementos hijos que se muestran en DOS vistas diferentes:
1. **Vista blockList** (panel lateral principal): Usa `#accordion-items-wrapper`
2. **Vista de configuración** (accordionSettings): Usa `#accordion-items-container`

**Solución**: Implementar sortable en AMBOS lugares con lógica específica para cada uno.

### 🔧 PARTE 1: DRAG & DROP EN EL MÓDULO (Vista de Configuración)

#### 1.1 Evitar el error de contexto 'this'
```javascript
// ❌ INCORRECTO - Causará "TypeError: this.initializeDragAndDrop is not a function"
attachEventListeners: function() {
    this.initializeDragAndDrop();
}

// ✅ CORRECTO - Usar referencia completa
attachEventListeners: function() {
    window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
}
```

#### 1.2 Implementación en el módulo (accordion.js)
```javascript
attachEventListeners: function() {
    // ... otros event listeners ...
    
    // Inicializar drag & drop
    window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
    
    // Reintentar si falla (DOM no listo)
    setTimeout(() => {
        const $container = $('#accordion-items-container');
        if ($container.length && !$container.hasClass('ui-sortable')) {
            console.log('[ACCORDION] Sortable not initialized, retrying...');
            window.WebsiteBuilderModules.Accordion.initializeDragAndDrop();
        }
    }, 500);
},

initializeDragAndDrop: function() {
    console.log('[ACCORDION] Initializing drag & drop...');
    
    // Verificar jQuery UI
    if (typeof $.fn.sortable !== 'function') {
        console.error('[ACCORDION] jQuery UI sortable not available!');
        return;
    }
    
    setTimeout(() => {
        const $container = $('#accordion-items-container'); // ⚠️ -container para config view
        
        if (!$container.length) {
            console.error('[ACCORDION] Container #accordion-items-container not found!');
            return;
        }
        
        // Destruir instancia previa si existe
        if ($container.hasClass('ui-sortable')) {
            $container.sortable('destroy');
        }
        
        $container.sortable({
            items: '.accordion-faq-item',
            handle: '.drag-handle',
            placeholder: 'sortable-placeholder',
            forcePlaceholderSize: true,
            cursor: 'move',
            tolerance: 'pointer',
            axis: 'y',
            containment: 'parent',
            start: function(e, ui) {
                console.log('[ACCORDION] Drag started');
                
                ui.placeholder.height(ui.item.outerHeight());
                ui.placeholder.css({
                    'visibility': 'visible',
                    'background': '#f0f0f0',
                    'border': '2px dashed #2962ff',
                    'border-radius': '8px',
                    'margin-bottom': '15px',
                    'opacity': '0.5'
                });
                
                // Colapsar contenido expandido
                const $content = ui.item.find('.collapsible-content');
                if ($content.is(':visible')) {
                    $content.slideUp(100);
                    ui.item.find('.collapse-icon').css('transform', 'rotate(0deg)');
                }
                
                ui.item.addClass('dragging');
            },
            stop: function(e, ui) {
                console.log('[ACCORDION] Drag stopped');
                
                ui.item.removeClass('dragging');
                
                const newOrder = [];
                $container.find('.accordion-faq-item').each(function() {
                    const itemId = $(this).data('item-id'); // ⚠️ data-item-id en config view
                    if (itemId) {
                        newOrder.push(itemId);
                    }
                });
                
                console.log('[ACCORDION] New order:', newOrder);
                
                if (window.currentSectionsConfig.accordion) {
                    window.currentSectionsConfig.accordion.itemOrder = newOrder;
                    
                    // CRÍTICO: Siempre estas 3 líneas juntas
                    window.setHasPendingPageStructureChanges(true);
                    window.updateSaveButtonState();
                    window.renderPreview();
                }
            }
        });
        
        console.log('[ACCORDION] Sortable initialized for', $container.find('.accordion-faq-item').length, 'items');
    }, 300);
}
```

### 🔧 PARTE 2: DRAG & DROP EN WEBSITE-BUILDER.JS (Vista blockList)

#### 2.1 Crear función específica para blockList (línea ~9685)
```javascript
// Agregar ANTES del handler de accordion add button
function initializeAccordionItemsSortable() {
    console.log('[ACCORDION] Initializing sortable for accordion items in block list');
    
    const $wrapper = $('#accordion-items-wrapper'); // ⚠️ -wrapper para blockList
    if (!$wrapper.length) {
        console.error('[ACCORDION] Items wrapper not found');
        return;
    }
    
    $wrapper.sortable({
        items: '.accordion-faq-item',
        handle: '.drag-handle',
        placeholder: 'sortable-placeholder',
        forcePlaceholderSize: true,
        cursor: 'move',
        tolerance: 'pointer',
        axis: 'y',
        containment: 'parent',
        start: function(e, ui) {
            console.log('[ACCORDION] Drag started for item:', ui.item.data('element-id'));
            
            ui.placeholder.height(ui.item.outerHeight());
            ui.placeholder.css({
                'visibility': 'visible',
                'background': '#f0f0f0',
                'border': '2px dashed #2962ff',
                'border-radius': '4px',
                'margin-bottom': '1px',
                'padding-left': '30px' // Importante para alineación
            });
        },
        stop: function(e, ui) {
            const newOrder = [];
            $wrapper.find('.accordion-faq-item').each(function() {
                const itemId = $(this).data('element-id'); // ⚠️ data-element-id en blockList
                if (itemId) {
                    newOrder.push(itemId);
                }
            });
            
            console.log('[ACCORDION] New order:', newOrder);
            
            if (currentSectionsConfig.accordion) {
                currentSectionsConfig.accordion.itemOrder = newOrder;
                
                hasPendingPageStructureChanges = true;
                updateSaveButtonState();
                renderPreview();
            }
        }
    });
    
    console.log('[ACCORDION] Sortable initialized for', $wrapper.find('.accordion-faq-item').length, 'items');
}
```

#### 2.2 Agregar inicialización en attachBlockListEventListeners (línea ~10705)
```javascript
// Initialize sortable for accordion items if they exist
if (currentSectionsConfig.accordion && currentSectionsConfig.accordion.itemOrder && currentSectionsConfig.accordion.itemOrder.length > 0) {
    console.log('[ACCORDION] Initializing sortable from attachBlockListEventListeners');
    console.log('[ACCORDION] Current item order:', currentSectionsConfig.accordion.itemOrder);
    setTimeout(() => {
        initializeAccordionItemsSortable();
    }, 100);
}
```

#### 2.3 Reinicializar después de agregar items (en window.addAccordionItem ~línea 19587)
```javascript
// Al final de la función addAccordionItem
console.log('[DEBUG] Accordion item added:', itemId);

// Si estamos en la vista blockList, reinicializar el sortable
if (currentSidebarView === 'blockList') {
    setTimeout(() => {
        initializeAccordionItemsSortable();
    }, 100);
}
```

### 🔧 PARTE 3: RENDERIZADO CORRECTO EN blockList

#### ⚠️ ERROR CRÍTICO MÁS COMÚN: OLVIDAR EL DRAG HANDLE
**Problema**: Los elementos hijos no se pueden arrastrar aunque el sortable esté configurado correctamente.
**Causa**: Falta el elemento `<i class="material-icons drag-handle">drag_handle</i>` en el HTML.
**Síntoma**: Todo parece estar bien, pero los elementos no responden al intento de arrastre.

#### 3.1 Estructura HTML OBLIGATORIA en renderTemplateSections (línea ~5731)
```javascript
if (hasItems) {
    html += '<div id="accordion-items-wrapper" style="position: relative;">'; // ⚠️ ID crítico
    currentSectionsConfig.accordion.itemOrder.forEach((itemId, index) => {
        const item = currentSectionsConfig.accordion.items[itemId];
        if (item) {
            const itemNumber = index + 1;
            html += `
                <div class="sidebar-subsection accordion-faq-item" 
                     data-block-type="accordion-item" 
                     data-element-id="${itemId}" 
                     style="padding-left: 30px;">
                    <i class="material-icons drag-handle">drag_handle</i>  <!-- ⚠️ CRÍTICO: SIN ESTO NO HAY DRAG -->
                    <span class="subsection-text" style="margin-left: 30px;">
                        ${translations[currentLanguage]?.['accordion.items.item'] || 'Pregunta'} ${itemNumber}
                    </span>
                    <div class="subsection-actions">
                        <!-- botones de acción -->
                    </div>
                </div>
            `;
        }
    });
    html += '</div>';
}
```

**⚠️ ELEMENTOS OBLIGATORIOS PARA DRAG & DROP**:
1. **Wrapper con ID específico**: `<div id="[modulo]-[items]-wrapper">`
2. **Clase del elemento hijo**: `.sidebar-subsection.[modulo]-item`
3. **Data attributes correctos**: `data-block-type` y `data-element-id`
4. **DRAG HANDLE**: `<i class="material-icons drag-handle">drag_handle</i>` (SIN ESTO NO FUNCIONA)
5. **Padding y márgenes**: `style="padding-left: 30px;"` en el div, `style="margin-left: 30px;"` en el span

### 📝 CHECKLIST DE VERIFICACIÓN

#### Antes de empezar:
- [ ] jQuery UI está cargado en `_WebsiteBuilderLayout.cshtml`
- [ ] El módulo está cargado DESPUÉS de website-builder.js

#### En el módulo:
- [ ] NO usar `this.initializeDragAndDrop()` - usar referencia completa
- [ ] Contenedor: `#accordion-items-container`
- [ ] Data attribute: `data-item-id`
- [ ] Timeout de 300ms para asegurar DOM listo

#### En website-builder.js:
- [ ] Función `initializeAccordionItemsSortable()` creada
- [ ] Contenedor: `#accordion-items-wrapper`
- [ ] Data attribute: `data-element-id`
- [ ] Inicialización en `attachBlockListEventListeners()`
- [ ] Reinicialización después de agregar items

#### Debug en consola:
```javascript
// Verificar que sortable esté disponible
$.fn.sortable

// Verificar contenedores
$('#accordion-items-wrapper').length // blockList
$('#accordion-items-container').length // config view

// Verificar si está inicializado
$('#accordion-items-wrapper').hasClass('ui-sortable')

// Forzar reinicialización manual
initializeAccordionItemsSortable() // blockList
window.WebsiteBuilderModules.Accordion.initializeDragAndDrop() // config
```

### ❌ ERRORES COMUNES Y SOLUCIONES

1. **"Los elementos hijos no se pueden arrastrar"** (EL MÁS COMÚN)
   - Causa: Falta el elemento drag handle en el HTML
   - Síntoma: Todo parece configurado pero nada se mueve
   - Solución: Agregar `<i class="material-icons drag-handle">drag_handle</i>` ANTES del texto
   - Verificar: Inspeccionar elemento en el navegador y buscar `.drag-handle`

2. **"TypeError: this.initializeDragAndDrop is not a function"**
   - Causa: Contexto `this` perdido
   - Solución: Usar `window.WebsiteBuilderModules.Accordion.initializeDragAndDrop()`

3. **"Container not found"**
   - Causa: IDs diferentes en cada vista
   - Solución: Verificar que usas el ID correcto para cada vista

4. **"Drag funciona pero no guarda el orden"**
   - Causa: Data attributes incorrectos
   - Solución: `data-item-id` en config, `data-element-id` en blockList

5. **"Solo funciona en una vista"**
   - Causa: Solo implementaste una parte
   - Solución: Implementar las 3 partes obligatorias

### 🎯 RESULTADO ESPERADO
- Arrastrar items en AMBAS vistas (blockList y configuración)
- El orden se mantiene al cambiar entre vistas
- El orden se guarda correctamente en la base de datos
- Los logs muestran la inicialización y los cambios de orden

## ETAPA 4: SISTEMA PADRE-HIJOS ✅ COMPLETADO

### Objetivo
- Click (+) agrega items FAQ ✅
- Items se muestran con colapsadores ✅
- Drag & drop para reordenar ✅
- Cada hijo tiene ojo y zafacón ✅

### 🔴 IMPLEMENTACIÓN REALIZADA

#### 4.1 Vista de configuración principal (en accordion.js)
```javascript
renderSettings: function(config) {
    const configData = config || {};
    
    return `
        <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
            <div class="sidebar-view-header" style="position: relative; z-index: 10;">
                <button class="back-to-sections-btn">
                    <i class="material-icons">arrow_back</i>
                </button>
                <h3 data-i18n="accordion.settings.title">Configuración Accordion/FAQ</h3>
            </div>
            
            <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
                ${this.renderMainSettings(configData)}
                ${this.renderItemsSection(configData)}
            </div>
        </div>
    `;
},

renderItemsSection: function(config) {
    const items = config.itemOrder || [];
    
    return `
        <div class="settings-group" style="margin-top: 30px;">
            <div class="settings-group-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 data-i18n="accordion.items.title">Preguntas FAQ</h4>
                <button class="add-faq-btn" onclick="window.addAccordionItem()" 
                        style="background: #2962ff; color: white; border: none; padding: 5px 15px; border-radius: 4px;">
                    <i class="material-icons" style="font-size: 16px;">add</i>
                    <span data-i18n="accordion.items.add">Agregar pregunta</span>
                </button>
            </div>
            
            <div id="accordion-items-wrapper" style="margin-top: 20px;">
                ${items.map((itemId, index) => this.renderItemCollapsible(config.items[itemId], index)).join('')}
            </div>
        </div>
    `;
},

renderItemCollapsible: function(item, index) {
    if (!item) return '';
    
    return `
        <div class="accordion-faq-item" data-item-id="${item.id}" style="margin-bottom: 15px; border: 1px solid #e3e3e3; border-radius: 8px;">
            <div class="collapsible-header" data-target="faq-content-${item.id}" 
                 style="padding: 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #fafafa;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="drag-handle material-icons" style="cursor: move;">drag_indicator</span>
                    <span class="material-icons collapse-icon">expand_more</span>
                    <span>Pregunta ${index + 1}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="visibility-toggle ${item.isHidden ? 'is-hidden' : ''}" 
                            data-element-id="${item.id}" data-element-type="faq">
                        <i class="material-icons icon-visible">visibility</i>
                        <i class="material-icons icon-hidden">visibility_off</i>
                    </button>
                    <button class="delete-faq-btn" data-item-id="${item.id}" 
                            style="background: none; border: none; cursor: pointer;">
                        <i class="material-icons" style="color: #dc3545;">delete</i>
                    </button>
                </div>
            </div>
            
            <div id="faq-content-${item.id}" class="collapsible-content" style="display: none; padding: 15px; border-top: 1px solid #e3e3e3;">
                ${this.renderItemSettings(item)}
            </div>
        </div>
    `;
}
```

#### 4.2 Función global para agregar items
```javascript
// En website-builder.js
window.addAccordionItem = function() {
    const itemId = 'faq-' + Date.now();
    
    if (!currentSectionsConfig.accordion.items) {
        currentSectionsConfig.accordion.items = {};
        currentSectionsConfig.accordion.itemOrder = [];
    }
    
    currentSectionsConfig.accordion.items[itemId] = {
        id: itemId,
        question: 'Nueva pregunta',
        answer: 'Nueva respuesta',
        isHidden: false
    };
    
    currentSectionsConfig.accordion.itemOrder.push(itemId);
    
    hasPendingPageStructureChanges = true;
    updateSaveButtonState();
    renderPreview();
    
    // Re-renderizar vista
    window.switchSidebarView('accordionSettings');
};
```

#### 4.3 Event listeners (en accordion.js)
```javascript
attachEventListeners: function() {
    // CRÍTICO: Navegación correcta
    $('.back-to-sections-btn').off('click').on('click', function() {
        window.switchSidebarView('blockList');
    });
    
    // Colapsadores
    $(document).on('click', '.collapsible-header', function() {
        const $header = $(this);
        const targetId = $header.data('target');
        const $content = $('#' + targetId);
        const $icon = $header.find('.collapse-icon');
        
        $content.slideToggle(200);
        $icon.text($icon.text() === 'expand_more' ? 'expand_less' : 'expand_more');
    });
    
    // Delete FAQ item
    $(document).on('click', '.delete-faq-btn', function() {
        const itemId = $(this).data('item-id');
        
        if (confirm('¿Eliminar esta pregunta?')) {
            delete currentSectionsConfig.accordion.items[itemId];
            
            const index = currentSectionsConfig.accordion.itemOrder.indexOf(itemId);
            if (index > -1) {
                currentSectionsConfig.accordion.itemOrder.splice(index, 1);
            }
            
            $(this).closest('.accordion-faq-item').fadeOut(300, function() {
                $(this).remove();
            });
            
            window.setHasPendingPageStructureChanges(true);
            window.updateSaveButtonState();
            window.renderPreview();
        }
    });
    
    // 🔴 IMPLEMENTACIÓN CRÍTICA DE DRAG & DROP - REQUIERE 3 PARTES
    // PARTE 1: Inicialización en el módulo (solo para vista de configuración)
    this.initializeDragAndDrop();
},

// Función de inicialización del drag & drop en el módulo
initializeDragAndDrop: function() {
    console.log('[ACCORDION] Initializing drag & drop...');
    
    // CRÍTICO: Usar referencias completas, NO 'this'
    setTimeout(() => {
        const $container = $('#accordion-items-container'); // Nota: -container para config view
        
        if (!$container.length) {
            console.error('[ACCORDION] Container not found!');
            return;
        }
        
        $container.sortable({
            items: '.accordion-faq-item',
            handle: '.drag-handle',
            placeholder: 'sortable-placeholder',
            forcePlaceholderSize: true,
            cursor: 'move',
            tolerance: 'pointer',
            axis: 'y',
            containment: 'parent',
            start: function(e, ui) {
                ui.placeholder.height(ui.item.outerHeight());
                ui.placeholder.css({
                    'visibility': 'visible',
                    'background': '#f0f0f0',
                    'border': '2px dashed #2962ff',
                    'border-radius': '8px',
                    'margin-bottom': '15px'
                });
                
                // Colapsar contenido expandido durante arrastre
                const $content = ui.item.find('.collapsible-content');
                if ($content.is(':visible')) {
                    $content.slideUp(100);
                    ui.item.find('.collapse-icon').css('transform', 'rotate(0deg)');
                }
            },
            stop: function(e, ui) {
                const newOrder = [];
                $container.find('.accordion-faq-item').each(function() {
                    const itemId = $(this).data('item-id');
                    if (itemId) {
                        newOrder.push(itemId);
                    }
                });
                
                if (window.currentSectionsConfig.accordion) {
                    window.currentSectionsConfig.accordion.itemOrder = newOrder;
                    window.setHasPendingPageStructureChanges(true);
                    window.updateSaveButtonState();
                    window.renderPreview();
                }
            }
        });
    }, 300);
}
```

## 🚨 ETAPA 4.5: ERRORES CRÍTICOS EN VISTAS DE CONFIGURACIÓN - EVITAR SIEMPRE

### ❌ ERROR #1: DUPLICAR FUNCIONALIDAD DE AGREGAR ITEMS
**PROBLEMA RECURRENTE**: En las vistas de configuración se incluye una sección para "agregar items" cuando esta funcionalidad YA EXISTE en el panel lateral con el ícono (+).

**SÍNTOMA**: 
```javascript
// ❌ NUNCA HACER ESTO en renderSettings()
${window.WebsiteBuilderModules.Accordion.renderItemsSection(configData)}
```

**SOLUCIÓN CORRECTA**:
```javascript
// ✅ La vista de configuración SOLO debe incluir:
renderSettings: function(config) {
    return `
        <div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
            ${window.WebsiteBuilderModules.Accordion.renderMainSettings(configData)}
            ${window.WebsiteBuilderModules.Accordion.renderContentSettings(configData)}
            ${window.WebsiteBuilderModules.Accordion.renderButtonSettings(configData)}
            ${window.WebsiteBuilderModules.Accordion.renderPaddingSettings(configData)}
            <!-- NO INCLUIR renderItemsSection() -->
        </div>
    `;
}
```

**REGLA**: La gestión de items hijos (agregar, eliminar, reordenar) se hace EXCLUSIVAMENTE desde el panel lateral principal mediante los íconos de acción.

### ❌ ERROR #2: TÍTULOS DEMASIADO GRANDES EN SECCIONES
**PROBLEMA RECURRENTE**: Los títulos de las secciones en la vista de configuración son demasiado grandes y poco estéticos.

**SÍNTOMA**:
```javascript
// ❌ INCORRECTO - Títulos muy grandes
<h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Content</h4>
```

**SOLUCIÓN CORRECTA**:
```javascript
// ✅ CORRECTO - Títulos sutiles y estéticos
<h4 style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #5c5e60;">Content</h4>
```

**ESPECIFICACIONES DE TÍTULOS**:
- **Font size**: 13px (no 14px o más)
- **Font weight**: 500 (no 600 o bold)
- **Margin bottom**: 12px (no 16px)
- **Color**: #5c5e60 (gris sutil, no negro)

### 📋 CHECKLIST OBLIGATORIO PARA VISTAS DE CONFIGURACIÓN
- [ ] NO incluir sección de "agregar items" en la vista de configuración
- [ ] Títulos de secciones con font-size: 13px, font-weight: 500
- [ ] Color de títulos: #5c5e60
- [ ] Margin inferior de títulos: 12px
- [ ] La gestión de items se hace desde el panel lateral con el ícono (+)

## ETAPA 5: VISTAS DE CONFIGURACIÓN

### 🔴 ESTRUCTURA ANTI-PROBLEMAS

#### 5.1 Vista del elemento hijo (FAQ individual)
```javascript
renderItemSettings: function(item) {
    return `
        <div class="settings-panel">
            <div class="settings-field" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    <span data-i18n="accordion.item.question">Pregunta</span>
                </label>
                <input type="text" id="question-${item.id}" 
                       value="${item.question || ''}"
                       data-item-id="${item.id}"
                       class="faq-question-input"
                       style="width: 100%; padding: 8px;">
            </div>
            
            <div class="settings-field">
                <label style="display: block; margin-bottom: 8px;">
                    <span data-i18n="accordion.item.answer">Respuesta</span>
                </label>
                <textarea id="answer-${item.id}" 
                          data-item-id="${item.id}"
                          class="faq-answer-input"
                          rows="4"
                          style="width: 100%; padding: 8px;">${item.answer || ''}</textarea>
            </div>
        </div>
    `;
}
```

#### 5.2 Caso en switchSidebarView (~línea 4815)
```javascript
case 'accordionSettings':
    executeModuleFunction('Accordion', 'renderSettings', currentSectionsConfig.accordion);
    break;
```

## ETAPA 6: FUNCIONALIDADES DE CONFIGURACIÓN

### 🔴 PATRÓN updateConfig

#### 6.1 Event listeners para campos (en accordion.js)
```javascript
// Agregar a attachEventListeners()

// Helper function
const updateConfig = (key, value) => {
    if (window.currentSectionsConfig.accordion) {
        window.currentSectionsConfig.accordion[key] = value;
        
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    }
};

const updateItem = (itemId, key, value) => {
    if (window.currentSectionsConfig.accordion.items && 
        window.currentSectionsConfig.accordion.items[itemId]) {
        
        window.currentSectionsConfig.accordion.items[itemId][key] = value;
        
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    }
};

// Color scheme
$('#accordion-color-scheme').on('change', function() {
    updateConfig('colorScheme', $(this).val());
});

// Preguntas
$(document).on('input', '.faq-question-input', function() {
    const itemId = $(this).data('item-id');
    updateItem(itemId, 'question', $(this).val());
});

// Respuestas
$(document).on('input', '.faq-answer-input', function() {
    const itemId = $(this).data('item-id');
    updateItem(itemId, 'answer', $(this).val());
});

// Visibilidad de items
$(document).on('click', '.visibility-toggle[data-element-type="faq"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const $button = $(this);
    const itemId = $button.data('element-id');
    
    if ($button.data('transitioning')) return;
    $button.data('transitioning', true);
    
    const isCurrentlyHidden = $button.hasClass('is-hidden');
    const newHiddenState = !isCurrentlyHidden;
    
    // Limpiar estado
    $button.removeClass('is-hidden');
    if (newHiddenState) {
        $button.addClass('is-hidden');
    }
    
    $button.find('.icon-visible, .icon-hidden').removeAttr('style');
    
    updateItem(itemId, 'isHidden', newHiddenState);
    
    setTimeout(() => {
        $button.data('transitioning', false);
    }, 300);
});
```

#### 6.2 Sincronización post-save (~línea 17300)
```javascript
} else if (currentSidebarView === 'accordionSettings') {
    loadCurrentWebsite().then(() => {
        window.switchSidebarView('blockList', window.getUpdatedPageData());
        
        setTimeout(() => {
            const isHidden = currentSectionsConfig.accordion?.isHidden || false;
            window.forceVisibilitySync('accordion', isHidden);
            
            // Sincronizar items
            $('.accordion-faq-item .visibility-toggle').each(function() {
                const $button = $(this);
                const itemId = $button.data('element-id');
                if (itemId && currentSectionsConfig.accordion?.items?.[itemId]) {
                    const itemHidden = currentSectionsConfig.accordion.items[itemId].isHidden || false;
                    $button.find('.icon-visible, .icon-hidden').removeAttr('style');
                    
                    if (itemHidden) {
                        $button.addClass('is-hidden');
                    } else {
                        $button.removeClass('is-hidden');
                    }
                }
            });
        }, 200);
    });
}
```

## ETAPA 7: RESPONSIVIDAD MÓVIL

### 🔴 IMPLEMENTACIÓN

#### 7.1 Actualizar función render() con media queries
```javascript
render: function(config) {
    if (!config || config.isHidden) return '';
    
    const uniqueId = 'accordion-' + Date.now();
    const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');
    const items = config.itemOrder || [];
    
    // Tipografía
    const headingTypography = currentGlobalThemeSettings?.typography?.heading || {};
    const bodyTypography = currentGlobalThemeSettings?.typography?.body || {};
    
    const headingFont = window.getFontNameFromValueSafe ? 
        window.getFontNameFromValueSafe(headingTypography.font || 'helvetica') : 
        'Helvetica';
    
    const bodyFont = window.getFontNameFromValueSafe ? 
        window.getFontNameFromValueSafe(bodyTypography.font || 'roboto') : 
        'Roboto';
    
    let html = `
        <style>
            #${uniqueId} {
                background-color: ${schemeColors.background};
                color: ${schemeColors.text};
                padding: 60px 0;
            }
            
            #${uniqueId} .faq-question {
                font-family: ${headingFont};
                font-size: ${headingTypography.fontSize || '18px'};
                font-weight: ${headingTypography.fontWeight || '600'};
                color: ${schemeColors.text};
            }
            
            #${uniqueId} .faq-answer {
                font-family: ${bodyFont};
                font-size: ${bodyTypography.fontSize || '16px'};
                color: ${schemeColors.text};
            }
            
            @media (max-width: 768px) {
                #${uniqueId} {
                    padding: 30px 0 !important;
                }
                
                #${uniqueId} .faq-question {
                    font-size: 16px !important;
                }
                
                #${uniqueId} .faq-answer {
                    font-size: 14px !important;
                }
            }
        </style>
        
        <div id="${uniqueId}" class="section-wrapper accordion-section" data-section-id="accordion">
            <div class="section-header-tag">
                <span class="material-symbols-outlined">help</span>
                ${window.translations && window.translations[window.currentLanguage] ? 
                    (window.translations[window.currentLanguage]['sections.accordion'] || 'Accordion/FAQ') : 
                    'Accordion/FAQ'}
            </div>
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    `;
    
    // Renderizar items visibles
    items.forEach(itemId => {
        const item = config.items[itemId];
        if (item && !item.isHidden) {
            html += `
                <div class="faq-item" style="margin-bottom: 20px; border-bottom: 1px solid ${schemeColors.border}; padding-bottom: 20px;">
                    <div class="faq-question" style="cursor: pointer; padding: 10px 0;">
                        <i class="material-icons" style="vertical-align: middle;">expand_more</i>
                        ${item.question}
                    </div>
                    <div class="faq-answer" style="display: none; padding: 10px 0 10px 30px;">
                        ${item.answer}
                    </div>
                </div>
            `;
        }
    });
    
    if (items.length === 0 || items.every(id => config.items[id]?.isHidden)) {
        html += `
            <div style="text-align: center; padding: 40px;">
                <p>No hay preguntas frecuentes configuradas</p>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}
```

## ETAPA 8: PREVIEW REAL

### 🔴 IMPLEMENTACIÓN FINAL

#### 8.1 Caso en Preview.cshtml (~línea 578)
```javascript
} else if (sectionId === 'accordion') {
    console.log('[PREVIEW] Processing accordion section');
    const accordionConfig = currentSectionsConfig.accordion;
    
    if (accordionConfig && !accordionConfig.isHidden) {
        if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.Accordion && window.WebsiteBuilderModules.Accordion.render) {
            console.log('[PREVIEW] Rendering accordion with module');
            finalHtml += window.WebsiteBuilderModules.Accordion.render(accordionConfig);
        } else {
            console.log('[PREVIEW] Accordion module not available');
        }
    }
```

#### 8.2 Event Listeners para Accordion en Preview Real (~línea 527)
```javascript
// Function to attach accordion event listeners
function attachAccordionEventListeners() {
    const faqHeaders = document.querySelectorAll('[data-accordion-toggle="true"]');
    console.log('[PREVIEW ACCORDION] Found', faqHeaders.length, 'FAQ headers');
    
    faqHeaders.forEach((header, index) => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemIndex = this.dataset.itemIndex;
            const accordionId = this.dataset.accordionId;
            const content = document.querySelector(`.faq-content-${accordionId}-${itemIndex}`);
            const isActive = this.classList.contains('active');
            
            // Get toggle icon element
            const toggleIcon = this.querySelector('.faq-toggle');
            
            // Get accordion config to know the toggle style
            const config = currentSectionsConfig.accordion;
            const toggleStyle = config?.toggleStyle || 'plus-minus';
            
            if (isActive) {
                this.classList.remove('active');
                if (content) {
                    content.classList.remove('active');
                    content.style.maxHeight = '0';
                }
                // Update toggle icon
                if (toggleIcon && window.WebsiteBuilderModules?.Accordion?.getToggleIcon) {
                    toggleIcon.textContent = window.WebsiteBuilderModules.Accordion.getToggleIcon(toggleStyle, false);
                }
            } else {
                this.classList.add('active');
                if (content) {
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                // Update toggle icon
                if (toggleIcon && window.WebsiteBuilderModules?.Accordion?.getToggleIcon) {
                    toggleIcon.textContent = window.WebsiteBuilderModules.Accordion.getToggleIcon(toggleStyle, true);
                }
            }
        });
    });
}
```

#### 8.3 Llamar a attachAccordionEventListeners después de renderizar (~línea 671)
```javascript
previewContent.innerHTML = finalHtml;

// Attach accordion event listeners
attachAccordionEventListeners();
```

## ETAPA 9: FUNCIONALIDADES AVANZADAS - TOGGLE STYLE

### 🔴 IMPLEMENTACIÓN DEL SELECTOR DE ESTILOS DE TOGGLE

#### 9.1 Helper Function para Iconos del Toggle
```javascript
// En accordion.js - Al inicio del módulo
window.WebsiteBuilderModules.Accordion = {
    getToggleIcon: function(style, isActive) {
        const toggleStyle = style || 'plus-minus';
        
        const icons = {
            'plus-minus': { closed: '+', open: '−' },
            'chevron': { closed: '›', open: '⌄' },
            'arrow': { closed: '→', open: '↓' },
            'caret': { closed: '▶', open: '▼' },
            'none': { closed: '', open: '' }
        };
        
        return icons[toggleStyle] ? (isActive ? icons[toggleStyle].open : icons[toggleStyle].closed) : '+';
    },
    // ... resto del módulo
```

#### 9.2 Agregar Select en Vista de Configuración
```javascript
// En renderSettings del módulo accordion.js (~línea 542)
<!-- Toggle style -->
<div class="settings-field">
    <label data-i18n="accordion.toggleStyle">Toggle style</label>
    <select class="shopify-select" id="accordion-toggle-style">
        <option value="plus-minus" ${config.toggleStyle === 'plus-minus' || !config.toggleStyle ? 'selected' : ''}>Plus/Minus (+/-)</option>
        <option value="chevron" ${config.toggleStyle === 'chevron' ? 'selected' : ''}>Chevron (›)</option>
        <option value="arrow" ${config.toggleStyle === 'arrow' ? 'selected' : ''}>Arrow (→)</option>
        <option value="caret" ${config.toggleStyle === 'caret' ? 'selected' : ''}>Caret (▶)</option>
        <option value="none" ${config.toggleStyle === 'none' ? 'selected' : ''}>None</option>
    </select>
</div>
```

#### 9.3 Event Listener para el Select
```javascript
// En attachEventListeners() del módulo accordion.js (~línea 1239)
// Toggle style
$('#accordion-toggle-style').off('change').on('change', function() {
    updateConfig('toggleStyle', $(this).val());
});
```

#### 9.4 Actualizar CSS Dinámico en render()
```javascript
// En la función render() del módulo accordion.js (~línea 171)
#${uniqueId} .faq-toggle {
    font-size: ${config.toggleStyle === 'chevron' || config.toggleStyle === 'arrow' ? '20px' : '24px'};
    color: ${schemeColors.text};
    transition: transform 0.3s ease;
    font-weight: ${config.toggleStyle === 'chevron' || config.toggleStyle === 'arrow' ? '400' : '300'};
    line-height: 1;
    width: 24px;
    text-align: center;
    display: ${config.toggleStyle === 'none' ? 'none' : 'inline-block'};
}

#${uniqueId} .faq-header.active .faq-toggle {
    transform: ${config.toggleStyle === 'plus-minus' ? 'rotate(45deg)' : 
                config.toggleStyle === 'caret' ? 'rotate(90deg)' : 
                'none'};
}
```

#### 9.5 Usar Helper en el HTML
```javascript
// En render() donde se genera el span del toggle
<span class="faq-toggle">${window.WebsiteBuilderModules.Accordion.getToggleIcon(config.toggleStyle, isExpanded)}</span>
```

#### 9.6 Actualizar Event Listeners del Preview
```javascript
// En website-builder.js - attachAccordionToggleListeners() (~línea 2117)
// Update toggle icon
if (toggleIcon && window.WebsiteBuilderModules?.Accordion?.getToggleIcon) {
    toggleIcon.textContent = window.WebsiteBuilderModules.Accordion.getToggleIcon(toggleStyle, false);
}
```

### 📝 RESULTADO
- Usuario puede elegir entre 5 estilos de toggle
- Los íconos cambian dinámicamente al expandir/colapsar
- Los estilos se aplican tanto en el editor como en el preview real
- El estado se guarda en la configuración del accordion

## RESUMEN DE IMPLEMENTACIÓN COMPLETA - ACCORDION

### ✅ CHECKLIST FINAL
- [x] Módulo creado como archivo separado en `/wwwroot/js/website-builder/modules/accordion.js`
- [x] Script cargado en Index.cshtml, PreviewTemplate.cshtml y Preview.cshtml
- [x] Caso agregado en switchSidebarView para 'accordionSettings'
- [x] Sistema padre-hijos con drag & drop implementado
- [x] Toggle de visibilidad sincronizado
- [x] Delete handler implementado
- [x] Preview en editor funcional con event listeners
- [x] Preview real funcional con event listeners
- [x] Selector de estilos de toggle implementado
- [x] Layouts "tabs to the right", "tabs to the left" y "tabs at the bottom" funcionando
- [x] Responsividad móvil implementada

### 🎯 FUNCIONALIDADES LOGRADAS
1. **Accordion básico** con preguntas y respuestas expandibles
2. **Gestión de items** con agregar, eliminar, ocultar y reordenar
3. **5 estilos de toggle** seleccionables por el usuario
4. **3 layouts diferentes** adaptándose a diferentes diseños
5. **Preview funcional** tanto en editor como en vista completa
6. **Persistencia completa** de todos los cambios en la base de datos

### 📋 NOTAS IMPORTANTES DE LA IMPLEMENTACIÓN
1. **Toggle Style**: Se agregó en la ETAPA 9 como funcionalidad avanzada
2. **Preview Real**: Requiere tanto el caso en renderPreviewContent() como los event listeners
3. **Layouts laterales**: No son tabs clickables, son acordeones con heading al lado
4. **Event Listeners**: Deben agregarse tanto en website-builder.js como en Preview.cshtml

window.translations.es.accordion = {
    'settings.title': 'Configuración Accordion/FAQ',
    'settings.colorScheme': 'Esquema de colores',
    'items.title': 'Preguntas FAQ',
    'items.add': 'Agregar pregunta',
    'item.question': 'Pregunta',
    'item.answer': 'Respuesta'
};

window.translations.en.accordion = {
    'settings.title': 'Accordion/FAQ Settings',
    'settings.colorScheme': 'Color scheme',
    'items.title': 'FAQ Items',
    'items.add': 'Add question',
    'item.question': 'Question',
    'item.answer': 'Answer'
};

// También agregar a las traducciones principales
window.translations.es['sections.accordion'] = 'Accordion/FAQ';
window.translations.en['sections.accordion'] = 'Accordion/FAQ';
```

## CHECKLIST FINAL DE VERIFICACIÓN

### Pre-implementación
- [ ] UN SOLO nombre elegido: `accordion`
- [ ] Archivos creados y cargados en 3 lugares

### Activación básica
- [ ] Click modal → aparece en panel
- [ ] Se ve en preview del editor
- [ ] No hay errores en consola

### Iconos de acción
- [ ] Padre: +, ojo, zafacón funcionan
- [ ] Hijos: ojo, zafacón funcionan
- [ ] Delete borra hijos primero
- [ ] **CRÍTICO**: Módulo agregado a syncVisibilityToggleStates()

### Sistema padre-hijos
- [ ] (+) agrega items
- [ ] Colapsadores funcionan
- [ ] Drag & drop reordena
- [ ] Flecha regresa a blockList

### Configuración
- [ ] Campos actualizan preview
- [ ] Cambios marcan pendientes
- [ ] Guardado funciona

### Responsividad
- [ ] Se ve bien en móvil
- [ ] Tamaños de fuente ajustados

### Preview real
- [ ] Aparece al hacer click en ojo
- [ ] Respeta configuración guardada
- [ ] Sin errores en consola

## PROBLEMAS RESUELTOS PREVENTIVAMENTE

1. **Delete no borra hijos**: Solucionado en línea 9080 con eliminación de wrapper primero
2. **Ícono del ojo**: forceVisibilitySync implementado desde inicio
3. **Flecha de regreso**: Usa clase correcta, navega a blockList
4. **No aparece en preview**: Todos los casos y fallbacks implementados
5. **Nombres inconsistentes**: Un solo nombre usado consistentemente
6. **Ícono drag handle pegado al texto en elementos hijos**: SIEMPRE agregar `style="margin-left: 30px;"` al span de texto en elementos hijos con drag handle (accordion items, testimonials, gallery images). Sin este margen, el texto se superpone con el ícono drag_indicator

7. **Contact Forms se reposicionan después de guardar**: 
   - **Síntoma**: Después de drag & drop y guardar, los contact forms vuelven a su posición original en el sidebar
   - **Causa**: Había una función `reconstructContactForms()` que manipulaba el DOM directamente después de guardar, ignorando el orden en `sectionOrder`
   - **Solución**: Eliminar todas las llamadas a `reconstructContactForms()` y dejar que `renderTemplateSections()` los renderice correctamente desde `sectionOrder` como todas las demás secciones
   - **Ubicación del fix**: website-builder.js líneas 6087-6114 ya tenían el código correcto, solo había que eliminar la interferencia
   - **Lección**: NO crear funciones especiales de reconstrucción DOM para secciones individuales. Usar el sistema de renderizado centralizado

## CONCLUSIÓN

Este flujo garantiza que cada etapa se construye sobre bases sólidas, con las soluciones a problemas comunes integradas desde el inicio. Siguiendo este orden exacto, el desarrollo de cualquier módulo nuevo debería tomar máximo 1 hora en lugar de 3-4 horas resolviendo problemas.