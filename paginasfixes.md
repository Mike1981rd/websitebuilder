# Fixes de Páginas Múltiples - Website Builder

## Problema: Header y Footer No Aparecen en Página de Carrito

### Descripción del Problema
Después de implementar la funcionalidad de múltiples páginas en el Website Builder, al cambiar a la página de carrito usando el selector de páginas, el header y footer no se mostraban. Estas secciones deberían ser globales y aparecer en todas las páginas del sitio.

### Síntomas Observados
1. Al seleccionar "Carrito" en el dropdown de páginas, solo se mostraba la sección del carrito
2. Los logs de debug mostraban:
   ```
   [DEBUG] sectionOrder after switch: (4) ['announcement', 'header', 'cart', 'footer']
   [DEBUG] Rendering section: cart
   ```
   - El `sectionOrder` tenía 4 elementos pero solo se renderizaba 'cart'
3. El objeto `pageData.sectionsConfig` para la página de carrito no contenía las configuraciones de header, footer ni announcement

### Causa Raíz
El problema tenía dos causas principales:

1. **Backend - Configuración por defecto incompleta**: El método `GetDefaultPagesConfig()` en el controlador solo incluía la sección `cart` en el `sectionOrder` de la página de carrito, sin las secciones globales.

2. **Backend - Endpoint no incluía secciones globales**: El método `GetPageStructure()` devolvía la configuración de cada página tal cual estaba guardada, sin hacer merge con las secciones globales del home page.

### Solución Implementada

#### 1. Actualización de GetDefaultPagesConfig()
**Archivo**: `/Controllers/WebSitesController.cs`
**Líneas**: 313-341

**Cambio**: Actualizado el `sectionOrder` de la página de carrito para incluir todas las secciones globales.

**Antes**:
```csharp
""sectionOrder"": [""cart""],
```

**Después**:
```csharp
""sectionOrder"": [""announcement"", ""header"", ""cart"", ""footer""],
```

#### 2. Refactorización de GetPageStructure()
**Archivo**: `/Controllers/WebSitesController.cs`
**Líneas**: 452-584

**Cambios principales**:

1. **Extracción de secciones globales** (líneas 464-511):
   - Primero intenta obtener las secciones globales del home page en PagesConfigJson
   - Si no las encuentra, hace fallback a SectionsConfigJson
   - Extrae: announcementBar, header, footer, announcements, announcementOrder

2. **Merge de secciones globales** (líneas 521-549):
   - Para páginas que no son home, hace merge de las secciones globales con la configuración de la página
   - Si la página no tiene una sección global, la agrega desde el home page

3. **Estructura por defecto mejorada** (líneas 570-577):
   - Para páginas nuevas o no existentes, devuelve una estructura con las secciones globales incluidas
   - El `sectionOrder` para cart incluye: ["announcement", "header", "cart", "footer"]

### Código Clave de la Solución

```csharp
// Extracción de secciones globales
if (homeSections.TryGetProperty("announcementBar", out JsonElement announcementBar))
    globalSectionsDict["announcementBar"] = announcementBar;
if (homeSections.TryGetProperty("header", out JsonElement header))
    globalSectionsDict["header"] = header;
if (homeSections.TryGetProperty("footer", out JsonElement footer))
    globalSectionsDict["footer"] = footer;

// Merge de secciones globales en la configuración de la página
foreach (var kvp in globalSectionsDict)
{
    if (!sectionsConfig.ContainsKey(kvp.Key))
    {
        sectionsConfig[kvp.Key] = kvp.Value;
    }
}

// Estructura por defecto para páginas nuevas
var defaultStructure = new Dictionary<string, object>
{
    ["sectionOrder"] = pageId == "cart" ? 
        new[] { "announcement", "header", "cart", "footer" } : 
        new string[] { },
    ["sectionsConfig"] = globalSectionsDict
};
```

### Resultado
Ahora cuando se cambia a la página de carrito:
1. Se muestran correctamente el header y footer además de la sección del carrito
2. Los cambios realizados en header/footer en cualquier página se reflejan en todas las páginas
3. Las secciones globales mantienen su configuración consistente entre páginas

### Lecciones Aprendidas
1. **Consistencia Backend**: Es crucial que el backend garantice la consistencia de datos, no depender solo del frontend
2. **Secciones Globales**: Header, footer y announcement deben ser tratadas especialmente como secciones compartidas
3. **Configuración por Defecto**: Las configuraciones por defecto deben incluir todas las secciones necesarias
4. **Merge Inteligente**: Al cargar páginas individuales, siempre hacer merge con las secciones globales del home

### Testing Recomendado
1. Crear un nuevo sitio web y verificar que la página de carrito muestre header/footer
2. Hacer cambios en header/footer desde home y verificar que se reflejen en cart
3. Agregar nuevas páginas y confirmar que incluyan las secciones globales

## Confirmación de cumplimiento de reglas críticas:
✅ Solo se modificaron archivos existentes, no se crearon nuevos archivos .cs
✅ Se documentó detalladamente el problema y la solución
✅ Se incluyeron referencias exactas a las líneas de código modificadas

---

## Problema: Página de Carrito Vacía en el Editor

### Descripción del Problema
En el editor del Website Builder, al cambiar a la página de carrito, no se mostraba ningún contenido en la tabla del carrito. La página aparecía vacía porque el código estaba diseñado para leer productos del localStorage, que obviamente están vacíos en el contexto del editor.

### Síntomas Observados
1. La página de carrito mostraba solo el título "Carrito" pero sin productos
2. No se visualizaba la estructura de la tabla con productos de ejemplo
3. El editor no permitía ver cómo se vería la página con productos

### Causa Raíz
La función `renderCartPage()` estaba diseñada exclusivamente para el sitio web final, leyendo productos del localStorage. En el contexto del editor, esto resultaba en una página vacía.

### Solución Implementada

#### Modificaciones en renderCartPage()
**Archivo**: `/wwwroot/js/website-render-functions.js`
**Líneas modificadas**: 2680-2988

**Cambios principales**:

1. **Detección del contexto del editor** (línea 2722):
   ```javascript
   const isEditor = window.parent !== window;
   ```

2. **Productos de ejemplo para el editor** (líneas 2725-2744):
   ```javascript
   const editorSampleItems = [
       {
           name: currentLanguage === 'es' ? 'Camiseta Premium' : 'Premium T-Shirt',
           price: 29.99,
           quantity: 2,
           image: 'data:image/svg+xml;base64,...'
       },
       // ... más productos de ejemplo
   ];
   ```

3. **Uso condicional de productos** (línea 2855):
   ```javascript
   const cartItems = isEditor ? ${JSON.stringify(editorSampleItems)} : JSON.parse(localStorage.getItem('cartItems') || '[]');
   ```

4. **Deshabilitación de botones en el editor** (líneas 2908-2939):
   - Botones de cantidad (+/-) deshabilitados con `disabled` attribute
   - Botón de eliminar sin funcionalidad
   - Estilos visuales ajustados (cursor: default, opacity reducida)

5. **Botón de checkout no funcional** (líneas 2831-2844):
   ```javascript
   <button ${isEditor ? 'disabled' : ''} onclick="${isEditor ? '' : "window.location.href='/checkout'"}">
   ```

6. **Funciones helper protegidas** (líneas 2954-2985):
   ```javascript
   function updateCartItemQuantity(index, newQuantity) {
       if (isEditor) return; // Don't do anything in editor
       // ... resto del código
   }
   ```

### Resultado
Ahora en el editor se muestra:
- 3 productos de ejemplo con imágenes placeholder
- Estructura completa de la tabla del carrito
- Controles de cantidad visibles pero no funcionales
- Subtotal calculado con los productos de ejemplo
- Botón de checkout visible pero deshabilitado

### Comportamiento
- **En el editor**: Muestra productos de ejemplo, botones deshabilitados
- **En el sitio final**: Funciona normalmente con localStorage y botones activos

### Lecciones Aprendidas
1. **Contexto dual**: Las funciones de renderizado deben considerar tanto el contexto del editor como del sitio final
2. **Datos de ejemplo**: Es importante mostrar contenido de ejemplo en el editor para una buena experiencia de diseño
3. **Seguridad**: Deshabilitar funcionalidad interactiva en el editor previene comportamientos inesperados

---

## Problema: Productos del Carrito No Se Mostraban en el Editor

### Descripción del Problema
Los productos reales del carrito no se mostraban en la página de carrito del editor, aunque sí aparecían en el drawer del carrito. Esto se debía a que el iframe del preview tiene su propio contexto de localStorage, separado del sitio principal.

### Síntomas Observados
1. El drawer del carrito mostraba los productos reales
2. La página de carrito en el preview mostraba productos de ejemplo, no los reales
3. El localStorage del iframe estaba vacío aunque el del sitio principal tenía productos

### Causa Raíz
El iframe del preview (PreviewTemplate.cshtml) tiene su propio contexto aislado, incluyendo un localStorage separado. No puede acceder directamente al localStorage del sitio principal por restricciones de seguridad del navegador.

### Solución Implementada

#### 1. Paso de datos del padre al iframe
**Archivo**: `/wwwroot/js/website-builder.js`
**Líneas**: 2668-2670

```javascript
// Pass cart items from parent window to iframe
const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
iframeWindow.editorCartItems = cartItems;
```

#### 2. Lectura de datos en el iframe
**Archivo**: `/wwwroot/js/website-render-functions.js`
**Líneas**: 2724-2728, 2864-2876

```javascript
// Get cart items passed from parent window or use defaults
let editorCartItems = [];
if (isEditor && window.editorCartItems) {
    editorCartItems = window.editorCartItems;
}

// In editor, try to use items passed from parent window first
if (isEditor) {
    if (${editorCartItems.length} > 0) {
        cartItems = ${JSON.stringify(editorCartItems)};
    } else {
        cartItems = ${JSON.stringify(editorSampleItems)};
    }
}
```

### Flujo de Datos
1. Cuando se renderiza la sección cart, el código principal lee los productos del localStorage
2. Los productos se asignan a `iframeWindow.editorCartItems`
3. La función `renderCartPage` detecta estos productos y los usa
4. Si no hay productos reales, usa los de ejemplo

### Resultado
- Los productos reales del carrito ahora se muestran en el preview del editor
- Si el carrito está vacío, se muestran productos de ejemplo
- La funcionalidad es consistente entre el drawer y la página de carrito

### Actualización de la Solución
Se descubrió que el enfoque inicial no funcionaba porque el HTML se generaba antes de poder asignar variables al iframe. Se implementó una solución mejorada:

#### Cambio en el paso de datos
**Archivo**: `/wwwroot/js/website-builder.js`
**Líneas**: 2672-2684

```javascript
// Pass cart items as part of config
const cartConfig = {
    ...config,
    cartItems: cartItems
};

finalHtml += iframeWindow.renderCartPage(cartConfig);
```

#### Modificación en renderCartPage
**Archivo**: `/wwwroot/js/website-render-functions.js`
**Líneas**: 2684-2728, 2864-2878

```javascript
const settings = {
    colorScheme: 'default',
    cartItems: [], // Default empty array
    ...config
};

// Use cart items from config if available
const passedCartItems = settings.cartItems || [];

// In the script
const passedItems = ${JSON.stringify(passedCartItems)};
if (passedItems && passedItems.length > 0) {
    cartItems = passedItems;
}
```

### Flujo de Datos Actualizado
1. Se leen los productos del localStorage en el código principal
2. Se pasan como parte de la configuración al llamar renderCartPage
3. La función usa estos productos y los serializa en el HTML generado
4. El script en el HTML renderizado usa estos datos serializados