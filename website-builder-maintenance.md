# Guía de Mantenimiento - Website Builder

## 🎯 Objetivo
Esta guía proporciona instrucciones paso a paso para mantener y extender el Website Builder sin romper funcionalidad existente.

## 📋 Checklist: Agregar Nueva Sección Fija (como Cart)

### 1. **Traducciones** ✏️
- [ ] Abrir `website-builder.js`
- [ ] Ir a línea ~4640 (sección español)
- [ ] Agregar después de `'sections.footer': 'Pie de página',`:
  ```javascript
  'sections.cart': 'Carrito',
  ```
- [ ] Ir a línea ~5488 (sección inglés)
- [ ] Agregar después de `'sections.footer': 'Footer',`:
  ```javascript
  'sections.cart': 'Cart',
  ```

### 2. **HTML en Lista de Bloques** 🎨
- [ ] Buscar función `renderBlockListView` (~línea 6400)
- [ ] Localizar el HTML del footer (~línea 6480)
- [ ] Agregar después del footer:
  ```javascript
  <!-- Cart -->
  <div class="sidebar-subsection" data-block-type="cart">
      <div class="subsection-header">
          <i class="material-icons">shopping_cart</i>
          <span data-i18n="sections.cart">Carrito</span>
      </div>
  </div>
  ```

### 3. **Click Handler** 🖱️
- [ ] Buscar `attachBlockListEventListeners` (~línea 13400)
- [ ] Encontrar el handler del footer (~línea 13440)
- [ ] Agregar después:
  ```javascript
  // Handle cart click
  else if (blockType === 'cart') {
      console.log('[DEBUG] Cart section clicked, opening settings');
      switchSidebarView('cartSettings');
  }
  ```

### 4. **Vista de Configuración** ⚙️
- [ ] Buscar `switchSidebarView` (~línea 6900)
- [ ] Encontrar el caso de footer (~línea 23000)
- [ ] Agregar nuevo caso:
  ```javascript
  } else if (viewName === 'cartSettings') {
      console.log('[DEBUG] Rendering cart settings');
      dynamicContentArea.innerHTML = renderCartSettings();
      attachCartEventListeners();
      setTimeout(applyTranslations, 0);
  ```

### 5. **Función de Renderizado** 📄
- [ ] Ir al final de las funciones de settings (después de footer ~línea 24000)
- [ ] Agregar nueva función:
  ```javascript
  function renderCartSettings() {
      const settings = currentSectionsConfig.cart || {};
      return `<!-- HTML de configuración -->`;
  }
  ```

### 6. **Event Listeners** 🎧
- [ ] Después de la función de renderizado
- [ ] Agregar:
  ```javascript
  function attachCartEventListeners() {
      // Event listeners específicos
  }
  ```

### 7. **Preview** 👁️
- [ ] Buscar función `renderPreview` (~línea 390)
- [ ] En el loop de sectionOrder
- [ ] Agregar caso para cart

## 🚨 Puntos Críticos a Verificar

### Antes de Guardar
1. **Sintaxis**: Verificar comas, llaves y paréntesis
2. **Traducciones**: Ambos idiomas (es/en)
3. **Console.logs**: Agregar para debugging

### Después de Implementar
1. **Click funciona**: La sección responde al click
2. **Vista se carga**: No hay errores en consola
3. **Traducciones aparecen**: Cambiar idioma y verificar
4. **Guardar funciona**: Los cambios se persisten

## 🔍 Comandos Útiles de Búsqueda

### En VS Code
- `Ctrl+F`: Buscar en archivo
- `Ctrl+G`: Ir a línea específica
- `Ctrl+Shift+F`: Buscar en todo el proyecto

### Patrones de búsqueda útiles
- `'sections.`: Para encontrar traducciones
- `else if (blockType`: Para click handlers
- `} else if (viewName`: Para casos en switchSidebarView
- `function render`: Para funciones de renderizado

## 📝 Plantilla de Documentación Post-Implementación

Después de agregar una nueva sección, actualizar `website-builder-lines.md`:

```markdown
## Cart Implementation
- Traducciones (es): Línea XXXX
- Traducciones (en): Línea XXXX
- Click handler: Línea XXXX
- Vista settings: Línea XXXX
- Función render: Línea XXXX
- Event listeners: Línea XXXX
```

## ⚠️ Reglas de Oro

1. **NUNCA** borrar código existente sin estar 100% seguro
2. **SIEMPRE** agregar console.log para debugging
3. **SIEMPRE** probar en ambos idiomas
4. **SIEMPRE** verificar que no se rompió nada más
5. **DOCUMENTAR** números de línea inmediatamente

## 🆘 Troubleshooting Común

### "Vista no carga"
- Verificar que el caso existe en switchSidebarView
- Verificar nombre exacto ('cartSettings' vs 'cartSetting')
- Verificar console.log aparece

### "Click no funciona"
- Verificar data-block-type en HTML
- Verificar else if en attachBlockListEventListeners
- Verificar que no hay error de sintaxis antes

### "Traducciones no aparecen"
- Verificar data-i18n correcto
- Verificar que se llama applyTranslations
- Verificar coma después de cada traducción

## 🐛 Problemas Resueltos con Múltiples Páginas

### Problema: Multicolumn no se agregaba después de implementar múltiples páginas
**Fecha**: 2025-01-15
**Síntomas**:
- Al hacer click en multicolumn desde el modal, no aparecía en el panel lateral ni en el editor
- Otros módulos funcionaban correctamente
- No se activaba el botón de guardar (pending changes flag no se establecía)

**Causa Raíz**:
Cuando se implementó el sistema de múltiples páginas, se separaron las secciones en dos grupos:
- **Grupo "template"**: Secciones globales (header, footer, announcement, multicolumn)
- **Grupo "default"**: Secciones específicas de página

El handler de multicolumn carecía de código esencial que otros módulos del grupo "template" sí tenían.

**Solución Implementada**:
Se agregó el código faltante en el handler de multicolumn:

1. **Actualización del panel lateral** (líneas ~18690-18692):
   ```javascript
   const templateSectionsHtml = renderTemplateSections();
   $('#template-sections-container').html(templateSectionsHtml + /* add button HTML */);
   ```

2. **Flags de cambios pendientes** (líneas ~18694-18695):
   ```javascript
   hasPendingPageStructureChanges = true;
   updateSaveButtonState();
   ```

3. **Renderizado del preview** (línea ~18697):
   ```javascript
   renderPreview();
   ```

4. **Cierre del modal** (líneas ~18699-18701):
   ```javascript
   $('.add-section-overlay').fadeOut(200, function() {
       $(this).remove();
   });
   ```

5. **Return temprano** (línea ~18703):
   ```javascript
   return; // Exit early for multicolumn
   ```

**Archivos Modificados**:
- `/wwwroot/js/website-builder.js` - Líneas 18590-18710 (handler de multicolumn)

**Lecciones Aprendidas**:
- Al cambiar de arquitectura (single page → multiple pages), todos los handlers deben actualizarse consistentemente
- Los módulos del grupo "template" requieren manejo especial y completo
- La falta de actualización del DOM era la causa principal del problema visual

### Problema: Contact Form se agregaba después del footer
**Fecha**: 2025-01-15
**Síntomas**:
- Al agregar un contact form desde el modal, aparecía debajo del footer
- Este problema había sido resuelto en el sistema de una sola página
- El problema reapareció después de implementar múltiples páginas

**Causa Raíz**:
El módulo contact-form no fue actualizado para manejar correctamente la inserción respecto al footer cuando se migró a múltiples páginas. Mientras otros módulos (multicolumn, featured-collection) verificaban la posición del footer antes de insertar, contact-form simplemente agregaba al final del array.

**Código Problemático**:
```javascript
// Add to section order
window.currentSectionsConfig.sectionOrder.push(contactFormId);
```

**Solución Implementada**:
Se actualizó la función `addContactForm` para verificar la existencia del footer e insertar antes de él:

**Ubicación**: `/wwwroot/js/website-builder/modules/contact-form.js` (líneas 322-335)

```javascript
// Add to section order - insert before footer if it exists
if (!window.currentSectionsConfig.sectionOrder) {
    window.currentSectionsConfig.sectionOrder = [];
}

// Find footer position and insert before it
const footerIndex = window.currentSectionsConfig.sectionOrder.indexOf('footer');
if (footerIndex > -1) {
    // Insert before footer
    window.currentSectionsConfig.sectionOrder.splice(footerIndex, 0, contactFormId);
} else {
    // No footer, add at the end
    window.currentSectionsConfig.sectionOrder.push(contactFormId);
}
```

**Archivos Modificados**:
- `/wwwroot/js/website-builder/modules/contact-form.js` - Líneas 322-335 (función addContactForm)

**Patrón Correcto para Nuevos Módulos**:
Todos los módulos deben seguir este patrón al agregar secciones:
1. Verificar si `sectionOrder` existe, si no, inicializarlo
2. Buscar la posición del footer con `indexOf('footer')`
3. Si existe footer, usar `splice(footerIndex, 0, sectionId)` para insertar antes
4. Si no existe footer, usar `push(sectionId)` para agregar al final

**Lecciones Aprendidas**:
- La migración a múltiples páginas requiere actualizar TODOS los módulos, no solo los principales
- Es importante mantener consistencia en el comportamiento de inserción de secciones
- Los módulos creados antes de la migración necesitan revisión especial

### Problema: Footer desaparece al hacer drag & drop de cualquier sección
**Fecha**: 2025-01-15
**Síntomas**:
- Al reordenar CUALQUIER sección mediante drag & drop en el panel lateral y luego guardar, el footer desaparecía completamente
- Inicialmente se pensó que era un problema específico con módulos multi-instancia (contact forms)
- El problema afectaba a todas las secciones, no solo a las multi-instancia
- El footer se eliminaba del `sectionOrder` y no se renderizaba después de guardar

**Causa Raíz**:
Cuando se actualizaba el `sectionOrder` después del drag & drop en el template container, el código reconstruía el array desde cero pero **NO incluía el footer** al final. Mientras que otros handlers sí tenían la lógica para preservar el footer, el handler del template container carecía de esta validación crítica.

**Código Problemático** (línea ~17291):
```javascript
// Update section order based on DOM
const newOrder = [];

// First, get header sections
$('.sidebar-section-content').first().find('> .sidebar-subsection').each(function() {
    // ... código para obtener header sections
});

// Then, get template sections
$('#template-sections-container').find('> .sidebar-subsection').each(function() {
    // ... código para obtener template sections
});

currentSectionsConfig.sectionOrder = newOrder; // ❌ Footer NO incluido
```

**Solución Implementada**:
Se agregó la verificación para asegurar que el footer siempre se incluya al final del `sectionOrder` después de reconstruir el array.

**Ubicación**: `/wwwroot/js/website-builder.js` (líneas 17291-17294)

```javascript
// Always ensure footer is included if it exists and isn't already in the order
if (!newOrder.includes('footer') && currentSectionsConfig.footer) {
    newOrder.push('footer');
}

currentSectionsConfig.sectionOrder = newOrder;
```

**Archivos Modificados**:
- `/wwwroot/js/website-builder.js` - Líneas 17291-17294 (handler del drag & drop del template container)

**Verificación de la Solución**:
Se confirmó que otros handlers de drag & drop ya tenían esta lógica implementada:
- Línea 16844: Handler principal ✓
- Línea 17403: Handler del header container ✓
- Línea 17517: Handler del footer container ✓
- Línea 19263: Al agregar gallery ✓
- Línea 19402: Al agregar rich text ✓

**Patrón Correcto para Drag & Drop**:
Todos los handlers que reconstruyen `sectionOrder` deben:
1. Recolectar todas las secciones del DOM
2. **SIEMPRE** verificar si existe el footer
3. Si existe, agregarlo al final del array con:
   ```javascript
   if (!newOrder.includes('footer') && currentSectionsConfig.footer) {
       newOrder.push('footer');
   }
   ```

**Lecciones Aprendidas**:
- El footer es una sección especial que debe mantenerse siempre al final del `sectionOrder`
- Cualquier código que reconstruya el `sectionOrder` debe incluir lógica para preservar secciones críticas (header, footer)
- Los problemas de regresión después de implementar múltiples páginas pueden manifestarse en funcionalidades que antes funcionaban correctamente
- Es crítico mantener consistencia en TODOS los handlers de drag & drop

### 2. Header y Footer No Aparecen en Página de Carrito

**Problema Identificado**: Después de implementar múltiples páginas, al cambiar a la página de carrito usando el selector de páginas, el header y footer no se mostraban aunque deberían ser secciones globales que aparecen en todas las páginas.

**Causa Raíz**: 
1. El método `GetDefaultPagesConfig()` en el controlador solo incluía la sección `cart` en el `sectionOrder` de la página de carrito, pero no incluía las secciones globales (announcement, header, footer).
2. El método `GetPageStructure()` devolvía la configuración de la página tal cual estaba guardada, sin incluir las secciones globales del home page.

**Síntomas**:
- Al cambiar a la página de carrito, solo se mostraba la sección del carrito
- Los logs mostraban que `sectionOrder` tenía 4 elementos pero solo se renderizaba 'cart'
- `pageData.sectionsConfig` para la página de carrito no contenía las configuraciones de header/footer

**Solución Implementada**:

1. **Modificación en GetDefaultPagesConfig() (líneas 313-341)**:
   - Actualizado el `sectionOrder` de la página de carrito para incluir todas las secciones globales:
   ```csharp
   ""sectionOrder"": [""announcement"", ""header"", ""cart"", ""footer""],
   ```

2. **Modificación en GetPageStructure() (líneas 452-584)**:
   - Agregada lógica para extraer secciones globales del home page o de SectionsConfigJson
   - Para páginas que no son home, se hace merge de las secciones globales en la respuesta
   - Si una página no existe, se devuelve con las secciones globales incluidas

**Código Clave**:
```csharp
// Extract global sections from home
if (homeSections.TryGetProperty("announcementBar", out JsonElement announcementBar))
    globalSectionsDict["announcementBar"] = announcementBar;
if (homeSections.TryGetProperty("header", out JsonElement header))
    globalSectionsDict["header"] = header;
if (homeSections.TryGetProperty("footer", out JsonElement footer))
    globalSectionsDict["footer"] = footer;

// Merge global sections into sectionsConfig
foreach (var kvp in globalSectionsDict)
{
    if (!sectionsConfig.ContainsKey(kvp.Key))
    {
        sectionsConfig[kvp.Key] = kvp.Value;
    }
}
```

**Lecciones Aprendidas**:
- Las secciones globales (header, footer, announcement) deben ser compartidas entre todas las páginas
- El backend debe asegurar que todas las páginas incluyan las secciones globales, no solo el frontend
- Al implementar múltiples páginas, es crucial mantener la coherencia de las secciones globales
- La configuración por defecto de nuevas páginas debe incluir las secciones globales en el `sectionOrder`