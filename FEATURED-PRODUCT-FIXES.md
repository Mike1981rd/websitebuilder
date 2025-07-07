# Featured Product Module - Problemas y Soluciones Documentadas

## 📋 Índice
1. [Problema del Orden de Imágenes](#problema-1-orden-de-imágenes)
2. [Problema del Layout y Espacio](#problema-2-layout-y-espacio-en-editor-preview)
3. [Simplificación de Opciones de Layout](#problema-3-simplificación-de-opciones-desktop-layout)
4. [Thumbnails Comprimidos en Layout Bottom](#problema-4-thumbnails-comprimidos-en-layout-bottom)
5. [Panel Lateral Tapando Thumbnails](#problema-5-panel-lateral-tapando-thumbnails)
6. [Funcionalidad Click en Thumbnails](#problema-6-implementar-click-en-thumbnails)
7. [Configuración de Bloques No Se Actualiza](#problema-7-configuración-de-bloques-no-se-actualiza-en-el-editor)

---

## 🔧 PROBLEMA #1: Orden de Imágenes

**Fecha**: Enero 2025

### Descripción
El módulo Featured Product no mostraba la primera imagen guardada según el orden en la base de datos, aunque el sistema sí tenía implementado el campo `Position` en `ProductImage`.

### Investigación
- **Modelo `ProductImage`**: Tiene campo `Position` (entero) para ordenar
- **API Backend**: En `GetProductsForBuilder` ordena por Position: `.OrderBy(img => img.Position)`
- **Frontend**: En `selectProduct` y `refreshProductData` ordena: `[...product.images].sort((a, b) => a.position - b.position)`

### Causa
Todas las imágenes tenían `Position = 0` (valor por defecto), haciendo el orden impredecible.

### Solución
El problema se resolvió solo cuando las imágenes obtuvieron valores de Position correctos. El código estaba bien implementado.

### Verificación
```sql
SELECT p."Title", pi."ImageUrl", pi."Position" 
FROM "Products" p 
JOIN "ProductImages" pi ON p."Id" = pi."ProductId" 
ORDER BY p."Id", pi."Position";
```

---

## 🔧 PROBLEMA #2: Layout y Espacio en Editor Preview

**Fecha**: Enero 2025

### Descripción
En el editor preview, la imagen del producto ocupaba demasiado espacio horizontal (50%), dejando poco espacio para la información del producto. En el preview real se veía correctamente.

### Síntomas
- Imagen muy grande dominando el layout
- Información del producto comprimida a la derecha
- Solo ocurría en el editor preview, no en preview real

### Solución Implementada

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Líneas clave**: ~82-95 (función render)

```javascript
// Cambio de proporciones de 50/50 a 40/60
const imageSection = desktopLayout.includes('thumbnails') ? 
    `<div style="flex: 0 0 40%; max-width: 40%;">` : 
    `<div style="flex: 0 0 40%;">`;

const infoSection = `<div style="flex: 1; min-width: 0; padding-left: 40px;">`;
```

### Cambios específicos:
1. **Proporción 40/60**: Imagen 40%, información 60%
2. **Thumbnails**: Reducidos de 88px a 72px
3. **Espaciado**: Reducido de 20px a 12px
4. **Responsive**: En móviles (<768px) ambas secciones al 100%

---

## 🔧 PROBLEMA #3: Simplificación de Opciones Desktop Layout

**Fecha**: Enero 2025

### Descripción
El select "Desktop layout" tenía demasiadas opciones confusas (column stacks). Se requería simplificar dejando solo las 3 opciones con thumbnails.

### Solución

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Líneas**: ~482-489

**Antes**:
- Thumbnails left
- Thumbnails right
- Thumbnails bottom
- 1 column stack
- 2 column stack
- 1-2-1 column stack
- 1-2-2 column stack
- 2-1-2 column stack

**Después**:
- Thumbnails left ✅
- Thumbnails right ✅
- Thumbnails bottom ✅

---

## 🔧 PROBLEMA #4: Thumbnails Comprimidos en Layout Bottom

**Fecha**: Enero 2025

### Descripción
Al seleccionar "thumbnails bottom", los thumbnails aparecían como líneas verticales estrechas en lugar de imágenes cuadradas.

### Causa
Los thumbnails en layout horizontal (flex row) se comprimían por el comportamiento por defecto de flexbox.

### Solución

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Línea**: ~175

```javascript
<div style="width: ${thumbnailSize}px; height: ${thumbnailSize}px; flex-shrink: 0; ...">
```

**Cambio clave**: Agregar `flex-shrink: 0` para prevenir compresión.

---

## 🔧 PROBLEMA #5: Panel Lateral Tapando Thumbnails

**Fecha**: Enero 2025

### Descripción
En el editor preview con layout "thumbnails bottom", el panel lateral izquierdo tapaba el primer thumbnail.

### Evolución de soluciones:

#### Intento 1: Padding en contenedor (❌)
- Causó scrollbar horizontal y compresión

#### Intento 2: Margin en wrapper (❌)
- Seguía causando problemas de layout

#### Intento 3: Simplificar estructura (❌)
- Los thumbnails seguían siendo tapados

#### Solución Final: Padding condicional (✅)

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Líneas**: ~154-159

```javascript
case 'thumbnails-bottom':
    // Check if we're in editor preview (iframe) or real preview
    const isEditorPreview = typeof window !== 'undefined' && window.parent !== window;
    const paddingLeft = isEditorPreview ? 'padding-left: 50%;' : '';
    thumbnailsStyle = `display: flex; gap: ${spaceBetween}px; justify-content: center; ${paddingLeft}`;
```

**Resultado**:
- **Editor preview**: `padding-left: 50%` evita el panel lateral
- **Preview real**: Sin padding, centrado natural

---

## 🔧 PROBLEMA #6: Implementar Click en Thumbnails

**Fecha**: Enero 2025

### Descripción
Se requería que al hacer click en un thumbnail, la imagen principal cambiara (como Shopify).

### Implementación

#### 1. Estructura HTML mejorada

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Cambios en thumbnails** (~líneas 183-191):
```javascript
<div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
     data-image-index="${index}" 
     style="... ${index === 0 ? 'border: 2px solid var(--primary);' : 'border: 2px solid transparent;'} ...">
```

**Cambios en imagen principal** (~línea 202):
```javascript
<img class="main-product-image" 
     data-product-images='${JSON.stringify(product.images)}' 
     src="${mainImage.url}" ...>
```

#### 2. Event Listeners - Editor Preview

**Archivo**: `/wwwroot/js/website-builder.js`

**Líneas**: ~2369-2402

```javascript
// Initialize Featured Product thumbnail clicks
const productThumbnails = previewDoc.querySelectorAll('.product-thumbnail');
productThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const imageIndex = parseInt(this.dataset.imageIndex);
        const mainImage = this.closest('.section-wrapper').querySelector('.main-product-image');
        
        if (mainImage) {
            const productImages = JSON.parse(mainImage.dataset.productImages || '[]');
            
            if (productImages[imageIndex]) {
                // Update main image
                mainImage.src = productImages[imageIndex].url;
                
                // Update active thumbnail border
                const allThumbnails = this.closest('.product-thumbnails').querySelectorAll('.product-thumbnail');
                allThumbnails.forEach(thumb => {
                    thumb.style.border = '2px solid transparent';
                });
                this.style.border = '2px solid var(--primary)';
            }
        }
    });
});
```

#### 3. Event Listeners - Preview Real

**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`

**Líneas**: ~960-993

Código idéntico al del editor preview para mantener consistencia.

### Características implementadas:
- ✅ Click en thumbnail cambia imagen principal
- ✅ Borde activo se mueve al thumbnail seleccionado
- ✅ Usa color primario del theme (var(--primary))
- ✅ Transición suave de 0.2s en bordes
- ✅ Funciona en editor preview y preview real

---

## 📍 Ubicaciones Clave en el Código

### Archivos principales:
1. **Módulo principal**: `/wwwroot/js/website-builder/modules/featured-product.js`
2. **Editor preview**: `/wwwroot/js/website-builder.js` (líneas ~2369-2402)
3. **Preview real**: `/Views/WebsiteBuilder/Preview.cshtml` (líneas ~960-993)

### Funciones importantes:
- `renderProductImages()`: Renderiza la sección de imágenes con layouts
- `selectProduct()`: Guarda producto seleccionado con imágenes ordenadas
- `refreshProductData()`: Actualiza datos del producto

### Puntos de debug:
```javascript
console.log('[FeaturedProduct] Main image selected:', mainImage);
console.log('[FeaturedProduct] Image positions:', product.images.map(img => ({ url: img.url, position: img.position })));
console.log('[FEATURED PRODUCT] Changed main image to index:', imageIndex);
```

---

---

## 🔧 PROBLEMA #7: Configuración de Bloques No Se Actualiza en el Editor

**Fecha**: Enero 2025

### Descripción
Los cambios en la configuración de bloques hijos del Featured Product (buy-buttons, price, variant-picker, etc.) no se reflejaban en el editor preview, aunque los toggles y controles parecían funcionar correctamente.

### Síntomas
- Cambiar toggles como "Show dynamic checkout button" no actualizaba el preview
- Los valores parecían guardarse (se mostraban en console.log) pero no se aplicaban al renderizar
- Al recargar la página, las configuraciones volvían a los valores por defecto
- El console.log mostraba que `buyButtonsConfig` estaba vacío o undefined al renderizar

### Investigación
Al rastrear el flujo de datos:
1. **Guardado**: `updateBuyButtonsConfig()` guardaba en `blocks.buyButtons` (camelCase)
2. **Lectura**: `renderProductInfo()` buscaba en `blocks['buy-buttons']` (kebab-case)
3. Resultado: Se estaban creando dos objetos diferentes en la configuración

### Causa Raíz
**Inconsistencia en el naming convention**: El sistema usa kebab-case para los IDs de bloques (`'buy-buttons'`, `'variant-picker'`), pero el código estaba guardando con camelCase (`buyButtons`, `variantPicker`).

### Solución Implementada

**Archivo**: `/wwwroot/js/website-builder/modules/featured-product.js`

**Cambio principal** (líneas 1762-1770):
```javascript
// ANTES - Inconsistente:
if (!window.currentSectionsConfig.featuredProduct.blocks.buyButtons) {
    window.currentSectionsConfig.featuredProduct.blocks.buyButtons = {...};
}
window.currentSectionsConfig.featuredProduct.blocks.buyButtons[key] = value;

// DESPUÉS - Consistente con kebab-case:
if (!window.currentSectionsConfig.featuredProduct.blocks['buy-buttons']) {
    window.currentSectionsConfig.featuredProduct.blocks['buy-buttons'] = {...};
}
window.currentSectionsConfig.featuredProduct.blocks['buy-buttons'][key] = value;
```

**Cambio secundario** (línea 413) - Mejoró la claridad pero no era el problema principal:
```javascript
// ANTES:
const showDynamicCheckout = buyButtonsConfig.showDynamicCheckout !== false;

// DESPUÉS:
const showDynamicCheckout = buyButtonsConfig.showDynamicCheckout !== undefined ? 
    buyButtonsConfig.showDynamicCheckout : true;
```

### Verificación
Para verificar que otros bloques no tengan el mismo problema:
```javascript
// Los IDs en blockOrder deben coincidir con las keys usadas al guardar:
blockOrder: ['vendor', 'title', 'price', 'sku', 'variant-picker', 'inventory-status', 'quantity-selector', 'buy-buttons', 'description', 'share']
```

### Impacto
Este fix afecta a todos los bloques del Featured Product. Es importante mantener consistencia:
- Usar **kebab-case** para IDs de bloques: `'buy-buttons'`, `'variant-picker'`
- Acceder siempre con bracket notation: `blocks['buy-buttons']`
- NO mezclar con camelCase: ~~`blocks.buyButtons`~~

---

## 🎯 Lecciones Aprendidas

1. **Verificar datos antes que código**: El problema del orden era de datos, no de implementación
2. **Contexto matters**: La detección `window.parent !== window` resuelve diferencias editor/preview
3. **Flexbox puede ser traicionero**: `flex-shrink: 0` es crucial para mantener tamaños
4. **Simplicidad gana**: Eliminar opciones confusas mejora UX
5. **Sincronizar siempre**: Funcionalidades deben funcionar en editor Y preview real
6. **Naming consistency es crítico**: Mantener la misma convención (kebab-case vs camelCase) en todo el flujo de datos
7. **Los síntomas pueden ser engañosos**: "No se actualiza el preview" puede ser un problema de naming, no de renderizado

---

*Última actualización: Enero 2025*