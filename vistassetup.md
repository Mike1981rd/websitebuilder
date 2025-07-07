# Guía Definitiva: Implementación de Vistas de Configuración - Website Builder

## 📋 Índice
1. [Estructura HTML de la Vista](#1-estructura-html-de-la-vista)
2. [Estilos y Componentes](#2-estilos-y-componentes)
3. [Event Listeners y Gestión de Estado](#3-event-listeners-y-gestión-de-estado)
4. [Integración con el Sistema](#4-integración-con-el-sistema)
5. [Checklist de Implementación](#5-checklist-de-implementación)

---

## 1. Estructura HTML de la Vista

### 1.1 Contenedor Principal
```javascript
renderConfigurationView: function(configData) {
    const config = configData || {};
    
    return `
        <div style="display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
            <!-- Header -->
            <!-- Contenido con scroll -->
        </div>
    `;
}
```

### 1.2 Header Estándar
```html
<!-- Header con flecha de regreso -->
<div class="sidebar-view-header" style="position: relative; z-index: 10;">
    <button class="back-to-sections-btn">
        <i class="material-icons">arrow_back</i>
    </button>
    <h3 data-i18n="module.viewName.title">Título de la Vista</h3>
    <button class="view-menu-btn" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer; padding: 5px;">
        <i class="material-icons">more_vert</i>
    </button>
</div>
```

**Reglas críticas del header**:
- ✅ Usar clase `back-to-sections-btn` (NO crear clases custom como "back-to-module-btn")
- ✅ El botón SIEMPRE navega a `blockList`
- ✅ Botón de menú es opcional pero recomendado
- ✅ Usar `data-i18n` para todas las traducciones

### 1.3 Contenedor de Contenido
```html
<!-- Contenido con scroll -->
<div style="padding: 20px; overflow-y: auto; overflow-x: hidden; flex: 1; height: calc(100% - 60px); box-sizing: border-box;">
    <!-- Campos del formulario -->
</div>
```

**Estilos obligatorios**:
- Padding: `20px`
- Overflow: `overflow-y: auto; overflow-x: hidden`
- Altura: `height: calc(100% - 60px)`
- Box-sizing: `border-box`

---

## 2. Estilos y Componentes

### 2.1 Labels de Campos
```html
<label style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #5c5e60;" 
       data-i18n="module.field.label">Label del campo</label>
```

### 2.2 Inputs de Texto
```html
<input type="text" 
       id="unique-field-id" 
       value="${config.fieldName || ''}"
       placeholder="Placeholder text"
       data-i18n-placeholder="module.field.placeholder"
       style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
```

### 2.3 Selects (Dropdowns)
```html
<select class="shopify-select" id="unique-select-id" 
        style="width: 100%; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: white;">
    <option value="option1" ${config.field === 'option1' ? 'selected' : ''} 
            data-i18n="module.options.option1">Option 1</option>
    <option value="option2" ${config.field === 'option2' ? 'selected' : ''} 
            data-i18n="module.options.option2">Option 2</option>
</select>
```

### 2.4 Toggles (Switches)
```html
<label class="toggle-field">
    <span data-i18n="module.toggle.label">Toggle label</span>
    <input type="checkbox" class="shopify-toggle" id="unique-toggle-id" ${config.toggleField ? 'checked' : ''}>
    <label for="unique-toggle-id" class="toggle-slider"></label>
</label>
```

**Con texto de ayuda**:
```html
<div class="form-group">
    <label class="toggle-field">
        <span data-i18n="module.toggle.label">Toggle label</span>
        <input type="checkbox" class="shopify-toggle" id="unique-toggle-id" ${config.toggleField ? 'checked' : ''}>
        <label for="unique-toggle-id" class="toggle-slider"></label>
    </label>
    <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 0;">
        <span data-i18n="module.toggle.help">Texto de ayuda descriptivo</span>
    </div>
</div>
```

### 2.5 Radio Buttons Estilo Shopify
```html
<div style="display: flex; gap: 12px;">
    <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.style === 'option1' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
        <input type="radio" name="style-group" value="option1" ${config.style === 'option1' ? 'checked' : ''} style="display: none;">
        <span data-i18n="module.options.option1">Option 1</span>
    </label>
    <label class="radio-option-card" style="flex: 1; padding: 12px; border: 2px solid ${config.style === 'option2' ? '#2962ff' : '#e0e0e0'}; border-radius: 8px; cursor: pointer; text-align: center;">
        <input type="radio" name="style-group" value="option2" ${config.style === 'option2' ? 'checked' : ''} style="display: none;">
        <span data-i18n="module.options.option2">Option 2</span>
    </label>
</div>
```

### 2.6 Espaciado entre Grupos
```html
<div class="form-group" style="margin-top: 20px;">
    <!-- Contenido del grupo -->
</div>
```

---

## 3. Event Listeners y Gestión de Estado

### 3.1 Estructura de Event Listeners
```javascript
attachEventListeners: function() {
    // Apply translations PRIMERO
    setTimeout(applyTranslations, 0);
    
    // Back button - SIEMPRE navega a blockList
    $('.back-to-sections-btn').off('click.viewname').on('click.viewname', function() {
        window.switchSidebarView('blockList');
    });
    
    // Helper function para actualizar configuración
    const updateConfig = (key, value) => {
        // Inicializar estructura si no existe
        if (!window.currentSectionsConfig.moduleName) {
            window.currentSectionsConfig.moduleName = {};
        }
        if (!window.currentSectionsConfig.moduleName.blocks) {
            window.currentSectionsConfig.moduleName.blocks = {};
        }
        if (!window.currentSectionsConfig.moduleName.blocks.blockName) {
            window.currentSectionsConfig.moduleName.blocks.blockName = {
                type: 'block-type',
                isHidden: false
            };
        }
        
        // Actualizar valor
        window.currentSectionsConfig.moduleName.blocks.blockName[key] = value;
        
        // CRÍTICO: Usar función setter, NO asignación directa
        window.setHasPendingPageStructureChanges(true);
        window.updateSaveButtonState();
        window.renderPreview();
    };
    
    // Event listeners específicos...
}
```

### 3.2 Listeners para Diferentes Tipos de Campos

**Input de texto**:
```javascript
$('#field-id').off('input.viewname').on('input.viewname', function() {
    updateConfig('fieldName', $(this).val());
});
```

**Select**:
```javascript
$('#select-id').off('change.viewname').on('change.viewname', function() {
    updateConfig('fieldName', $(this).val());
});
```

**Toggle**:
```javascript
$('#toggle-id').off('change.viewname').on('change.viewname', function() {
    updateConfig('toggleField', $(this).is(':checked'));
});
```

**Radio buttons con actualización visual**:
```javascript
$('input[name="radio-group"]').off('change.viewname').on('change.viewname', function() {
    const selectedValue = $(this).val();
    updateConfig('fieldName', selectedValue);
    
    // Actualizar bordes visuales
    $('.radio-option-card').each(function() {
        const $card = $(this);
        const $radio = $card.find('input[type="radio"]');
        if ($radio.attr('name') === 'radio-group') {
            $card.css('border-color', $radio.is(':checked') ? '#2962ff' : '#e0e0e0');
        }
    });
});
```

### 3.3 Namespaces en Event Listeners
**SIEMPRE usar namespaces** para prevenir duplicación:
- `.off('click.viewname').on('click.viewname')`
- `.off('change.viewname').on('change.viewname')`
- `.off('input.viewname').on('input.viewname')`

---

## 4. Integración con el Sistema

### 4.1 Agregar Caso en switchSidebarView (website-builder.js)
```javascript
} else if (viewName === 'yourViewNameSettings') {
    console.log('[DEBUG] Rendering your view settings', data);
    const html = executeModuleFunction('ModuleName', 'renderYourViewSettings', data);
    
    if (html) {
        dynamicContentArea.innerHTML = html;
        executeModuleFunction('ModuleName', 'attachYourViewEventListeners');
        setTimeout(applyTranslations, 0);
    } else {
        console.error('[DEBUG] No HTML returned from your view renderSettings');
    }
}
```

### 4.2 Agregar Click Handler (en attachBlockListEventListeners)
```javascript
else if (blockType === 'parent-module-block') {
    const blockId = $(this).data('element-id');
    const block = currentSectionsConfig.parentModule?.blocks?.[blockId];
    
    if (blockId && block) {
        if (block.type === 'your-block-type') {
            console.log('[DEBUG] Opening your view settings for block:', blockId);
            switchSidebarView('yourViewNameSettings', block);
        }
    }
}
```

---

## 5. Checklist de Implementación

### Pre-implementación
- [ ] Definir nombre consistente para la vista (ej: `buyButtonsSettings`)
- [ ] Identificar todos los campos necesarios según mockup/imagen
- [ ] Planificar estructura de datos en `currentSectionsConfig`

### Implementación en el Módulo
- [ ] Crear función `renderYourViewSettings(configData)`
- [ ] Implementar header con clase `back-to-sections-btn`
- [ ] Agregar contenedor con scroll y padding 20px
- [ ] Implementar todos los campos con estilos correctos
- [ ] Usar `data-i18n` en todos los textos
- [ ] Crear función `attachYourViewEventListeners()`
- [ ] Implementar helper `updateConfig` con setter correcto
- [ ] Agregar listeners con namespaces

### Integración en website-builder.js
- [ ] Agregar caso en `switchSidebarView`
- [ ] Agregar handler en `attachBlockListEventListeners`
- [ ] Verificar que se llama a `applyTranslations`

### Testing
- [ ] Click en elemento abre la vista
- [ ] Back button navega a blockList
- [ ] Cambios activan botón guardar
- [ ] Valores se guardan correctamente
- [ ] Preview se actualiza al cambiar valores

---

## 🚨 Errores Comunes a Evitar

1. **NO usar asignación directa de flags**:
   ```javascript
   // ❌ INCORRECTO
   window.hasPendingPageStructureChanges = true;
   
   // ✅ CORRECTO
   window.setHasPendingPageStructureChanges(true);
   ```

2. **NO crear clases custom para back button**:
   ```javascript
   // ❌ INCORRECTO
   <button class="back-to-featured-product-btn">
   
   // ✅ CORRECTO
   <button class="back-to-sections-btn">
   ```

3. **NO olvidar namespaces en listeners**:
   ```javascript
   // ❌ INCORRECTO
   $('.button').on('click', function() {});
   
   // ✅ CORRECTO
   $('.button').off('click.viewname').on('click.viewname', function() {});
   ```

4. **NO navegar al padre en back button**:
   ```javascript
   // ❌ INCORRECTO
   window.switchSidebarView('parentModuleSettings');
   
   // ✅ CORRECTO
   window.switchSidebarView('blockList');
   ```

---

*Esta guía está basada en la implementación exitosa de las vistas Description y Buy Buttons del módulo Featured Product*