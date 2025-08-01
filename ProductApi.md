# Product API Documentation

**Fecha de documentación**: 31 de Julio de 2025  
**Autor**: Claude  
**Propósito**: Documentar las APIs de productos para evitar confusiones futuras

## Resumen de APIs de Productos

El sistema tiene dos tipos de APIs para productos:

1. **APIs Simplificadas** - Para el Website Builder (búsqueda rápida y listados)
2. **APIs Completas** - Para obtener información detallada de productos

## APIs Simplificadas (Website Builder)

### 1. GET /api/builder/products

**Propósito**: Obtener lista de todos los productos activos  
**Autenticación**: No requiere (AllowAnonymous)  
**Uso**: Featured Product selector, Featured Collection selector

**Respuesta**:
```json
[
  {
    "id": 1,
    "title": "Nombre del Producto",  // NO "name"
    "handle": "nombre-del-producto",
    "price": 99.99,
    "compareAtPrice": 129.99,
    "imageUrl": "https://example.com/image.jpg",  // URL directa, NO array
    "vendor": "Aurora",
    "rating": 5,
    "reviewCount": 0,
    "hasDiscount": true,
    "discountPercentage": 23,
    "variantCount": 3
  }
]
```

**Campos importantes**:
- `title` - El nombre del producto (NO usar `name`)
- `imageUrl` - URL directa de la imagen principal (NO es un array `images`)
- `handle` - Para construir URLs del producto

### 2. GET /api/builder/products/search?query=xxx

**Propósito**: Buscar productos por título, tipo, vendor o SKU  
**Autenticación**: No requiere (AllowAnonymous)  
**Límite**: 20 resultados máximo

**Respuesta**:
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "title": "Producto encontrado",
      "productType": "Electronics",
      "vendor": "Aurora",
      "price": 99.99,
      "compareAtPrice": 129.99,
      "imageUrl": "https://example.com/image.jpg",
      "handle": "producto-encontrado"
    }
  ]
}
```

### 3. GET /api/builder/products/by-handle/{handle}

**Propósito**: Obtener información completa de un producto  
**Autenticación**: No requiere (AllowAnonymous)  
**Uso**: Páginas de producto individuales, Featured Product con múltiples imágenes

**Respuesta**:
```json
{
  "Id": 1,
  "Title": "Producto Completo",
  "Handle": "producto-completo",
  "Description": "Descripción completa del producto",
  "Price": 99.99,
  "CompareAtPrice": 129.99,
  "Vendor": "Aurora",
  "ProductType": "Electronics",
  "Images": [
    {
      "Id": 1,
      "ImageUrl": "https://example.com/image1.jpg",  // Nota: "ImageUrl" con I mayúscula
      "AltText": "Vista frontal",
      "Position": 0
    },
    {
      "Id": 2,
      "ImageUrl": "https://example.com/image2.jpg",
      "AltText": "Vista lateral",
      "Position": 1
    }
  ],
  "Videos": [],
  "Variants": []
}
```

**Diferencias importantes**:
- Los campos vienen con primera letra mayúscula (`Images`, `ImageUrl`, no `images`, `imageUrl`)
- Incluye array completo de imágenes con sus posiciones
- Incluye descripción completa y otros detalles

## APIs de Colecciones

### 1. GET /api/builder/collections

**Propósito**: Obtener lista de colecciones activas  
**Autenticación**: No requiere

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Summer Collection",  // Usa "name" no "title"
    "handle": "summer-collection"
  }
]
```

### 2. GET /api/builder/collections/search?query=xxx

**Propósito**: Buscar colecciones  
**Autenticación**: No requiere (AllowAnonymous)

**Respuesta**:
```json
{
  "success": true,
  "collections": [
    {
      "id": 1,
      "title": "Summer Collection",  // Aquí sí usa "title"
      "handle": "summer-collection",
      "imageUrl": "https://example.com/collection.jpg",
      "productCount": 15
    }
  ]
}
```

### 3. GET /api/builder/collections/{handle}/products

**Propósito**: Obtener productos de una colección  
**Autenticación**: No requiere

## Problemas Comunes y Soluciones

### Problema 1: "undefined" en Featured Product

**Causa**: El código esperaba `product.name` pero la API devuelve `product.title`

**Solución**:
```javascript
// INCORRECTO
<div>${product.name}</div>

// CORRECTO
<div>${product.title}</div>
```

### Problema 2: Imágenes no se muestran

**Causa**: El código esperaba un array `product.images[0].url` pero la API simplificada devuelve `product.imageUrl`

**Solución**:
```javascript
// INCORRECTO
const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '';

// CORRECTO
const imageUrl = product.imageUrl || '';

// O crear un array temporal si es necesario:
let productImages = product?.images || [];
if (product && product.imageUrl && productImages.length === 0) {
    productImages = [{
        url: product.imageUrl,
        altText: product.title || 'Product image',
        position: 0
    }];
}
```

### Problema 3: Inconsistencia entre APIs

**Observación**: Las APIs no son consistentes en nomenclatura:
- Products usa `title`
- Collections simple usa `name`
- Collections search usa `title`

**Recomendación**: Siempre verificar la estructura real de la respuesta antes de usarla.

## Uso en Módulos del Website Builder

### Featured Product Module

```javascript
// Al seleccionar un producto de la API simple
currentSectionsConfig.featuredProduct.selectedProduct = {
    id: product.id,
    name: product.title,        // Guardamos como "name" por compatibilidad
    title: product.title,       // También guardamos como "title"
    handle: product.handle,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    vendor: product.vendor,
    imageUrl: product.imageUrl, // URL simple
    images: [],                 // Array vacío, se llenará si se carga el producto completo
    variants: []
};
```

### Featured Collection Module

```javascript
// Similar manejo para productos en colecciones
// Los productos vienen con la misma estructura de la API simple
```

## Flujo de Carga de Imágenes en Featured Product

### Problema: Solo una imagen vs múltiples imágenes

La API simplificada (`/api/builder/products`) solo devuelve `imageUrl` con una imagen, pero Featured Product necesita mostrar thumbnails.

### Solución implementada:

1. **Selección inicial**: Se usa la API simple para búsqueda rápida
2. **Carga completa**: Después de seleccionar, se carga el producto completo con `loadFullProductData()`
3. **Mapeo de datos**: Se convierten los campos de mayúsculas a minúsculas

```javascript
// En featured-product.js
loadFullProductData: function(handle) {
    $.ajax({
        url: `/api/builder/products/by-handle/${handle}`,
        success: (fullProduct) => {
            // Mapear Images -> images con formato correcto
            const mappedImages = (fullProduct.Images || []).map(img => ({
                url: img.ImageUrl,      // ImageUrl -> url
                altText: img.AltText,
                position: img.Position,
                id: img.Id
            }));
            
            // Actualizar producto con datos completos
            currentSectionsConfig.featuredProduct.selectedProduct.images = mappedImages;
        }
    });
}
```

## Notas Importantes

1. **Performance**: Las APIs simplificadas están optimizadas para carga rápida en el builder
2. **Limitaciones**: Solo devuelven información básica, no incluyen descripciones completas o múltiples imágenes
3. **Seguridad**: Todas las APIs del builder son públicas (AllowAnonymous)
4. **Estado**: Solo devuelven productos/colecciones activos
5. **Carga en dos pasos**: Para módulos que necesitan datos completos, primero se carga data simple, luego la completa

## Verificación de Estructura

Siempre usar console.log para verificar la estructura real:

```javascript
console.log('[DEBUG] API Response:', response);
console.log('[DEBUG] Product structure:', Object.keys(product));
console.log('[DEBUG] Title value:', product.title);
console.log('[DEBUG] Image URL:', product.imageUrl);
```

---

**Última actualización**: 31/07/2025 - Corregido problema de imágenes en Featured Product