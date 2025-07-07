# Flujo de Implementación - Vista Description de Featured Product

## 📋 Contexto Inicial
**Módulo**: Featured Product  
**Elemento hijo**: Description  
**Objetivo**: Implementar vista de configuración para el bloque Description

## 🔍 FASE 1: INVESTIGACIÓN

### 1.1 Análisis de Documentación
**Archivos consultados**:
- `FLUJO-REAL-MODULOS.md` - Patrones y reglas para vistas de configuración
- `keypoints.md` - Sistema de traducciones y patrones del proyecto
- `FLUJO-REAL-MODULOS2.md` - Problemas resueltos y documentados

**Hallazgos clave**:
```
✅ Vistas de hijos deben tener scrollbar personalizado
✅ Header con flecha de regreso que va a 'blockList'
✅ Botón de menú (3 puntos) opcional
✅ Padding específico: 20px
✅ Labels: font-size: 13px, font-weight: 500, color: #5c5e60
```

### 1.2 Análisis de Módulos Existentes
**Módulo de referencia**: Multicolumn (para sistema de iconos)
- Sistema completo de iconos con categorías
- Select con optgroups para organización
- Iconos con emojis para preview visual

## 🚨 FASE 2: PROBLEMAS ENCONTRADOS

### Problema #1: Click en Description no abría la vista
**Síntoma**: Al hacer click en el bloque Description (hijo de Featured Product), no pasaba nada

**Investigación**:
```javascript
// website-builder.js línea 12691
// attachBlockListEventListeners() tenía handler para 'featured-product'
// PERO NO para 'featured-product-block' (los hijos)
```

**Fix implementado**:
```javascript
else if (blockType === 'featured-product-block') {
    const blockId = $(this).data('element-id');
    const block = currentSectionsConfig.featuredProduct?.blocks?.[blockId];
    
    if (blockId && block) {
        if (block.type === 'description') {
            switchSidebarView('descriptionSettings', block);
        }
    }
}
```

### Problema #2: Navegación incorrecta del back button
**Síntomas**:
1. La flecha de regreso llevaba a 'featuredProductSettings' (vista del padre)
2. Debía llevar a 'blockList' según documentación
3. El botón estaba muy pegado al título

**Investigación**:
```
FLUJO-REAL-MODULOS.md líneas 917-919:
"Back button should navigate to 'blockList'"

Líneas 815-820:
Estructura correcta del header con clase 'back-to-sections-btn'
```

**Fix implementado**:
```javascript
// Cambio de clase
DE: class="back-to-featured-product-btn"
A:  class="back-to-sections-btn"

// Cambio en handler
DE: window.switchSidebarView('featuredProductSettings');
A:  window.switchSidebarView('blockList');
```

### Problema #3: Botón guardar no se activa al hacer cambios
**Síntoma**: Al modificar cualquier campo en la vista Description, el botón "Guardar" permanecía deshabilitado

**Investigación**:
```javascript
// Línea 1378 en featured-product.js
window.hasPendingPageStructureChanges = true; // INCORRECTO
```

**Causa**: Asignación directa de la variable global en lugar de usar la función setter proporcionada por el sistema

**Fix implementado**:
```javascript
// INCORRECTO - No activa el botón guardar
window.hasPendingPageStructureChanges = true;

// CORRECTO - Usa la función setter que actualiza el estado
window.setHasPendingPageStructureChanges(true);
```

**Patrón correcto para actualizar configuración**:
```javascript
const updateDescriptionConfig = (key, value) => {
    // 1. Actualizar la configuración
    window.currentSectionsConfig.featuredProduct.blocks.description[key] = value;
    
    // 2. Marcar cambios pendientes (USAR FUNCIÓN SETTER)
    window.setHasPendingPageStructureChanges(true);
    
    // 3. Actualizar estado del botón guardar
    window.updateSaveButtonState();
    
    // 4. Re-renderizar preview
    window.renderPreview();
};
```

## ✅ FASE 3: IMPLEMENTACIÓN EXITOSA

### 3.1 Estructura HTML Implementada
```html
<div class="sidebar-view-header">
    <button class="back-to-sections-btn">
        <i class="material-icons">arrow_back</i>
    </button>
    <h3 data-i18n="featuredProduct.description.title">Description</h3>
    <button class="description-menu-btn">
        <i class="material-icons">more_vert</i>
    </button>
</div>
```

### 3.2 Campos Configurables
1. **Heading** - Input de texto
2. **Type** - Select con opciones:
   - Static (por defecto)
   - Expanded tab
   - Collapsed tab
3. **Icon** - Select con categorías (solo visible si type != 'static')
4. **Custom Icon** - Upload de imagen (solo si icon = 'none')

### 3.3 Sistema de Iconos
Implementado con categorías organizadas:
- General (home, star, favorite, etc.)
- Commerce (shopping_cart, store, etc.)
- Shipping (local_shipping, flight, etc.)
- Payment (credit_card, wallet, etc.)
- Communication (email, phone, chat, etc.)
- Devices (smartphone, computer)
- Ecology (eco, recycling, etc.)

## 🎯 RESULTADO FINAL

### Flujo de Usuario Funcional:
```
1. Click en Description (panel lateral)
   ↓
2. Se abre vista de configuración
   ↓
3. Usuario configura:
   - Heading
   - Type (Static/Expanded/Collapsed)
   - Icon (si aplica)
   ↓
4. Click en flecha ← regresa a blockList
   ↓
5. Cambios se guardan con botón Save
```

### Verificaciones:
✅ Click en Description abre la vista correctamente  
✅ Back button navega a blockList  
✅ Estilos siguen patrones de Shopify  
✅ Type selector muestra/oculta sección de iconos  
✅ Traducciones implementadas con data-i18n  
✅ Event handlers con namespaces para evitar duplicados  

## 📝 LECCIONES APRENDIDAS

1. **Nomenclatura consistente es crítica**:
   - Padre: `data-block-type="featured-product"`
   - Hijos: `data-block-type="featured-product-block"`

2. **Click handlers deben manejar ambos niveles**:
   - Handler para elementos padre
   - Handler separado para elementos hijo

3. **Navegación debe seguir documentación**:
   - Vistas de hijos → blockList
   - No al padre directo

4. **CSS ya existe para estilos comunes**:
   - `.sidebar-view-header` tiene padding correcto
   - `.back-to-sections-btn` tiene estilos definidos

5. **Gestión de estado y flags de cambios**:
   - NUNCA usar: `window.hasPendingPageStructureChanges = true`
   - SIEMPRE usar: `window.setHasPendingPageStructureChanges(true)`
   - Esto asegura que el botón guardar se active correctamente

## 📚 DOCUMENTACIÓN DE ESTILOS - TOGGLES SHOPIFY

### Estructura HTML del Toggle
```html
<label class="toggle-field">
    <span data-i18n="module.settings.toggleLabel">Label del toggle</span>
    <input type="checkbox" class="shopify-toggle" id="unique-toggle-id" ${condition ? 'checked' : ''}>
    <label for="unique-toggle-id" class="toggle-slider"></label>
</label>
```

### CSS del Toggle (website-builder.css líneas 2367-2415)
```css
/* Input checkbox oculto */
.shopify-toggle {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* Slider visual */
.toggle-slider {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    background-color: #c9cccf;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
}

/* Círculo interno */
.toggle-slider:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.2s;
}

/* Estado activo (checked) */
.shopify-toggle:checked + .toggle-slider {
    background-color: #008060; /* Verde Shopify */
}

/* Movimiento del círculo cuando está activo */
.shopify-toggle:checked + .toggle-slider:after {
    transform: translateX(16px);
}

/* Dark mode */
.dark-mode .toggle-slider {
    background-color: #616161;
}

.dark-mode .shopify-toggle:checked + .toggle-slider {
    background-color: #00a878;
}
```

### Implementación en JavaScript
```javascript
// Event listener para toggle
$('#unique-toggle-id').off('change.module').on('change.module', function() {
    const isChecked = $(this).is(':checked');
    updateConfig('settingName', isChecked);
});
```

### Características clave:
- **Tamaño**: 36px × 20px (slider), 16px (círculo)
- **Colores**: #c9cccf (inactivo), #008060 (activo)
- **Animación**: Transición suave de 0.2s
- **Dark mode**: Colores adaptados (#616161 / #00a878)
- **Estructura**: Checkbox oculto + label visual

---

*Implementación completada exitosamente siguiendo patrones establecidos*