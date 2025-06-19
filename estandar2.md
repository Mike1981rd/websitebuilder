# Estándar de Desarrollo - Parte 2

## 17. Implementación de Toggles Estilo Shopify

### Estructura HTML Correcta

Los toggles deben seguir esta estructura específica para funcionar con los estilos globales del proyecto:

```html
<div class="settings-field" style="margin-bottom: 16px;">
    <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 13px; color: #202223;">Texto del toggle</span>
        <input type="checkbox" id="unique-toggle-id" class="shopify-toggle" ${isChecked ? 'checked' : ''}>
        <label for="unique-toggle-id" class="toggle-slider"></label>
    </label>
</div>
```

### Elementos Clave

1. **Contenedor Principal**: `<label class="toggle-field">`
   - Debe tener la clase `toggle-field`
   - Usar `display: flex` con `justify-content: space-between`

2. **Checkbox Input**: `<input type="checkbox" class="shopify-toggle">`
   - DEBE tener la clase `shopify-toggle`
   - Debe tener un `id` único
   - El checkbox es invisible (opacity: 0)

3. **Toggle Visual**: `<label for="[id]" class="toggle-slider">`
   - DEBE ser un `<label>` no un `<span>`
   - DEBE tener el atributo `for` que coincida con el `id` del checkbox
   - La clase `toggle-slider` aplica todos los estilos visuales

### Estilos CSS (website-builder.css)

```css
/* Checkbox invisible */
.shopify-toggle {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* Toggle visual */
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

/* Círculo del toggle */
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

/* Estado checked */
.shopify-toggle:checked + .toggle-slider {
    background-color: #008060;
}

.shopify-toggle:checked + .toggle-slider:after {
    transform: translateX(16px);
}
```

### Event Listeners

```javascript
// Forma correcta de escuchar cambios
$('#unique-toggle-id').on('change', function() {
    const isChecked = $(this).is(':checked');
    updateConfig('configKey', isChecked);
});
```

### Ejemplo Completo - Multicolumn Module

```javascript
// En renderSettings
const showArrows = configData.showArrows || false;

// HTML
`<div class="settings-field" style="margin-bottom: 16px;">
    <label class="toggle-field" style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 13px; color: #202223;">Show arrows</span>
        <input type="checkbox" id="show-arrows" class="shopify-toggle" ${showArrows ? 'checked' : ''}>
        <label for="show-arrows" class="toggle-slider"></label>
    </label>
</div>`

// Event listener
$('#show-arrows').on('change', function() {
    updateConfig('showArrows', $(this).is(':checked'));
});
```

### Errores Comunes a Evitar

1. **NO usar `<span>` para el toggle-slider**
   ```html
   <!-- INCORRECTO -->
   <span class="toggle-slider"></span>
   
   <!-- CORRECTO -->
   <label for="toggle-id" class="toggle-slider"></label>
   ```

2. **NO envolver en divs adicionales**
   ```html
   <!-- INCORRECTO -->
   <div class="shopify-toggle">
       <input type="checkbox">
       <span class="toggle-slider"></span>
   </div>
   
   <!-- CORRECTO -->
   <input type="checkbox" class="shopify-toggle">
   <label class="toggle-slider"></label>
   ```

3. **NO olvidar el atributo `for`**
   ```html
   <!-- INCORRECTO -->
   <label class="toggle-slider"></label>
   
   <!-- CORRECTO -->
   <label for="unique-id" class="toggle-slider"></label>
   ```

### Valores por Defecto

Para toggles que deben estar ON por defecto:
```javascript
// Usar !== false para que undefined se convierta en true
const showArrowsOnHover = configData.showArrowsOnHover !== false;

// Para OFF por defecto
const colorColumns = configData.colorColumns || false;
```

### Dark Mode

Los toggles se adaptan automáticamente al dark mode:
- Background OFF: #616161 (en lugar de #c9cccf)
- Background ON: #00a878 (en lugar de #008060)

### Checklist de Implementación

- [ ] Usar estructura HTML exacta con `<label class="toggle-field">`
- [ ] Checkbox con clase `shopify-toggle` e `id` único
- [ ] Label con clase `toggle-slider` y atributo `for`
- [ ] Event listener en el checkbox, no en el label
- [ ] Valores por defecto correctos (|| false o !== false)
- [ ] NO agregar CSS personalizado - usar estilos globales
- [ ] Verificar que funcione en dark mode

### Migración de Toggles Antiguos

Si encuentras toggles con estructura antigua:
```javascript
// Buscar
<div class="shopify-toggle">
    <input type="checkbox">
    <span class="toggle-slider"></span>
</div>

// Reemplazar con
<input type="checkbox" id="unique-id" class="shopify-toggle">
<label for="unique-id" class="toggle-slider"></label>
```

## 18. Color de Links en Esquemas de Color

### Campo Agregado a Color Schemes

Se agregó el campo `link` a cada esquema de color para proporcionar un color consistente para los enlaces:

```javascript
const colorSchemes = {
    'scheme1': { // Default/Classic scheme
        text: '#121212',
        background: '#FFFFFF',
        foreground: '#F0F0F0',
        border: '#DDDDDD',
        link: '#2c6ecb',  // Azul Shopify estándar
        // ... otros colores
    },
    'scheme2': { // Light Gray scheme
        link: '#1a73e8',  // Azul Google
    },
    'scheme3': { // Dark scheme
        link: '#4d9fff',  // Azul claro para fondo oscuro
    },
    'scheme4': { // Blue-Gray scheme
        link: '#87CEEB',  // Sky blue
    },
    'scheme5': { // Beige/Brown scheme
        link: '#8B4513',  // Marrón saddlebrown
    }
};
```

### Uso en Módulos

Para usar el color de link en cualquier módulo:

```javascript
// Obtener los colores del esquema
const schemeColors = getColorSchemeValues(config.colorScheme || 'scheme1');

// Renderizar un link
`<a href="${url}" 
    style="color: ${schemeColors.link}; 
           text-decoration: none; 
           transition: opacity 0.2s;"
    onmouseover="this.style.opacity='0.7'" 
    onmouseout="this.style.opacity='1'">
    ${linkText}
</a>`
```

### Consideraciones de Accesibilidad

1. **Contraste**: Los colores de link deben tener suficiente contraste con el fondo
   - Scheme 1 (claro): `#2c6ecb` sobre blanco
   - Scheme 3 (oscuro): `#4d9fff` sobre negro

2. **Estados del Link**: 
   - Normal: Color del esquema
   - Hover: Opacity 0.7
   - Visited: Usar el mismo color (no purple por defecto)

3. **Indicadores Visuales**:
   - Sin subrayado por defecto
   - Considerar agregar subrayado en hover para mejor accesibilidad
   - Iconos opcionales (arrow_forward) para indicar acción

### Migración de Links Existentes

Si encuentras links con colores hardcodeados:
```javascript
// Buscar
style="color: #b8860b;"
style="color: #2c6ecb;"

// Reemplazar con
style="color: ${schemeColors.link};"
```

### Ejemplo Completo - Multicolumn

```javascript
${column.linkLabel ? `
    <a href="${column.link || '#'}" 
       style="color: ${schemeColors.link}; 
              text-decoration: none; 
              font-size: 14px; 
              display: inline-flex; 
              align-items: center; 
              gap: 4px; 
              transition: opacity 0.2s;"
       onmouseover="this.style.opacity='0.7'" 
       onmouseout="this.style.opacity='1'">
        ${column.linkLabel}
        <span class="material-symbols-outlined" style="font-size: 16px;">
            arrow_forward
        </span>
    </a>
` : ''}
```

## 19. Problema y Solución: Image-with-Text No se Renderizaba en el Editor

### Problema Identificado

El módulo image-with-text no se renderizaba en el preview del editor cuando se agregaba desde el modal de plantillas. El módulo se agregaba correctamente al panel lateral pero no aparecía en el preview.

### Causa Raíz

Múltiples problemas de implementación:

1. **Inconsistencia de nombres**: El ID del módulo en el modal era `'images-with-text'` (con guiones y plural) pero el sistema esperaba `'imageWithText'` (camelCase y singular).

2. **Bloque no agregado al blockOrder**: El bloque placeholder se creaba pero no se agregaba al array `blockOrder`:
   ```javascript
   // FALTABA esta línea crítica:
   currentSectionsConfig.imageWithText.blockOrder.push(blockId);
   ```

3. **Falta de función fallback**: No existía `renderImageWithText()` para cuando el módulo no estuviera cargado.

4. **Mapeo incompleto en renderizadores**: El mapa de renderizadores no reconocía `'images-with-text'`.

5. **Error de contexto `this`**: Al llamar `this.renderBlock` desde el iframe, el contexto se perdía causando:
   ```
   Uncaught TypeError: this.renderBlock is not a function
   ```

### Solución Implementada

#### 1. Agregada línea crítica en website-builder.js (línea ~10627):
```javascript
// CRITICAL: Add the block to blockOrder so it renders
currentSectionsConfig.imageWithText.blockOrder.push(blockId);
```

#### 2. Agregado mapeo de renderizadores (línea ~1786):
```javascript
const renderers = {
    // ... otros renderizadores
    'imageWithText': window.WebsiteBuilderModules?.ImageWithText?.render || renderImageWithText,
    'images-with-text': window.WebsiteBuilderModules?.ImageWithText?.render || renderImageWithText
};
```

#### 3. Agregado mapeo de configuración (líneas ~1797-1798):
```javascript
} else if (sectionId === 'images-with-text') {
    configKey = 'imageWithText';
}
```

#### 4. Agregado manejo en renderizado del iframe (línea ~1787):
```javascript
} else if (sectionId === 'imageWithText' || sectionId === 'images-with-text') {
    const config = currentSectionsConfig.imageWithText;
    // ... renderizado
}
```

#### 5. Creada función fallback renderImageWithText (líneas ~1692-1711):
```javascript
function renderImageWithText(config) {
    if (!config || config.isHidden) {
        return '';
    }
    
    // Simple fallback - el módulo maneja el renderizado real
    return `
        <div class="section-wrapper image-with-text-section" data-section-id="imageWithText" style="padding: 40px 0; background: #f5f5f5;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <div style="text-align: center; color: #666;">
                    <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">image</i>
                    <h3>Image with Text</h3>
                    <p>This section will display your image with text content.</p>
                </div>
            </div>
        </div>
    `;
}
```

#### 6. Corregido error de contexto en image-with-text.js:
```javascript
// Cambiar de:
blocksHtml += this.renderBlock(block, config, uniqueId);

// A:
blocksHtml += window.WebsiteBuilderModules.ImageWithText.renderBlock(block, config, uniqueId);
```

### Verificación del Fix

Para verificar que funciona correctamente:
1. Click en "Agregar sección de plantilla"
2. Seleccionar "Image with text"
3. Debe aparecer en el panel lateral con los botones correctos
4. Debe renderizarse en el preview mostrando el diseño con 4 imágenes doradas

### Lecciones Aprendidas

1. **Consistencia de nombres es crítica**: Usar el mismo ID en todos los lugares (modal, sectionOrder, configuración, renderizadores).

2. **Arrays de orden son esenciales**: Si un módulo tiene sub-elementos (blocks, columns, slides), SIEMPRE agregar al array de orden correspondiente.

3. **Contexto en módulos**: Al usar `this` en módulos que se ejecutan en diferentes contextos (iframe), usar referencias completas: `window.WebsiteBuilderModules.ModuleName.method()`.

4. **Funciones fallback**: Siempre crear una función fallback simple para cuando el módulo no esté cargado.

5. **Debugging sistemático**: Usar console.log temporales para rastrear el flujo y verificar qué se está ejecutando.

### Patrón para Nuevos Módulos

Al agregar un nuevo módulo tipo image-with-text:

1. Definir ID consistente (preferir camelCase: `newModule`)
2. Crear entrada en modal de templates
3. Agregar event handler para cuando se selecciona
4. Crear estructura de configuración con arrays de orden
5. Agregar elementos por defecto a los arrays de orden
6. Agregar a sectionOrder
7. Crear función fallback
8. Agregar mapeos en renderizadores
9. Verificar que el módulo use referencias completas, no `this`

---

*Continuación de estandar.md - Este documento contiene estándares adicionales para mantener el límite de 1000 líneas por archivo*