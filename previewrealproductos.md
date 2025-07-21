# Implementación de Preview Real para Productos - Website Builder

## Resumen Ejecutivo
Este documento detalla la implementación completa del sistema de navegación de productos en el preview real del Website Builder, específicamente la funcionalidad de hacer clic en un producto en Featured Collection y navegar a su página individual con el Product Container mostrando el producto correcto.

**Fecha de implementación**: 21 de Julio de 2025
**Problema inicial**: Al hacer clic en productos en Featured Collection, la navegación no funcionaba y cuando se implementó, solo mostraba header y footer sin el contenido del producto.

## Arquitectura General

### Flujo de Navegación
1. Usuario hace clic en un producto en Featured Collection → `/products/[handle]`
2. El sistema detecta que es una URL de producto
3. Carga la página/template de producto 
4. Product Container detecta el handle y carga ese producto específico
5. Se renderiza la página completa con el producto correcto

### Componentes Involucrados
- **Featured Collection Module**: Renderiza los cards de productos con enlaces
- **ASP.NET Core Routing**: Maneja URLs `/products/{handle}`
- **WebsiteBuilderController**: Detecta páginas de producto
- **Preview.cshtml**: Vista principal del preview real
- **Product Container Module**: Renderiza el producto específico

## Implementación Detallada

### 1. Routing ASP.NET Core

**Archivo**: `/Program.cs`
**Líneas**: ~106-109

```csharp
app.MapControllerRoute(
    name: "product",
    pattern: "products/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

**Propósito**: Define la ruta para que URLs como `/products/camiseta-premium` sean manejadas por el action Preview del WebsiteBuilderController.

### 2. Controller - Detección de Página de Producto

**Archivo**: `/Controllers/WebsiteBuilderController.cs`
**Líneas**: 24-38

```csharp
public IActionResult Preview(string page = null, string handle = null)
{
    // Check if this is being accessed via /cart route
    if (Request.Path.Value?.Equals("/cart", StringComparison.OrdinalIgnoreCase) == true)
    {
        page = "cart";
    }
    
    // Check if this is being accessed via /products/{handle} route
    if (!string.IsNullOrEmpty(handle) || Request.Path.Value?.StartsWith("/products/", StringComparison.OrdinalIgnoreCase) == true)
    {
        page = "product";
        ViewBag.ProductHandle = handle;
    }
    
    // Pass the page parameter to the view
    ViewBag.Page = page;
    return View();
}
```

**Puntos clave**:
- Detecta si la URL comienza con `/products/`
- Establece `page = "product"`
- Pasa el handle del producto vía ViewBag

### 3. Featured Collection - Enlaces de Productos

**Archivo**: `/wwwroot/js/website-builder/modules/featured-collection.js`
**Líneas clave**:

#### Carga de datos de productos (líneas 87-99):
```javascript
// FIX: Si no hay handles pero hay productos, intentar cargarlos
if (!settings.productHandles && settings.products && window.WebsiteBuilderModules.FeaturedCollection.allProducts) {
    console.log('[FEATURED COLLECTION] No handles found, attempting to load from products cache');
    settings.productHandles = [];
    settings.products.forEach((productId, index) => {
        const product = window.WebsiteBuilderModules.FeaturedCollection.allProducts.find(p => (p.Id || p.id) === productId);
        if (product && (product.Handle || product.handle)) {
            settings.productHandles[index] = product.Handle || product.handle;
        }
    });
    console.log('[FEATURED COLLECTION] Handles loaded:', settings.productHandles);
}
```

#### Renderizado de enlaces (líneas 649-680):
```javascript
// Detectar si estamos en el editor o en el preview real
const isEditor = window.parent !== window;
const productUrl = productHandle ? `/products/${productHandle}` : '#';

// Si estamos en el preview real y tenemos handle, agregar link
const shouldAddLink = !isEditor && productHandle;

return `
    <div class="product-card" id="${cardId}" style="position: relative;">
        ${shouldAddLink ? `<a href="${productUrl}" style="text-decoration: none; color: inherit; display: block;">` : ''}
        <!-- contenido del card -->
        ${shouldAddLink ? `</a>` : ''}
    </div>
`;
```

#### Inicialización de datos (líneas 3138-3177):
```javascript
// Función para inicializar los datos de productos en el preview
initializeProductData: function() {
    console.log('[FEATURED COLLECTION] Initializing product data...');
    
    // Detectar si estamos en el preview real
    const isEditor = window.parent !== window;
    if (isEditor) {
        console.log('[FEATURED COLLECTION] In editor mode, skipping product data init');
        return;
    }
    
    // Cargar todos los productos disponibles
    $.ajax({
        url: '/api/builder/products',
        method: 'GET',
        success: (products) => {
            console.log('[FEATURED COLLECTION] Products loaded:', products.length);
            window.WebsiteBuilderModules.FeaturedCollection.allProducts = products;
            
            // Crear cache de productos por ID
            window.WebsiteBuilderModules.FeaturedCollection.productDataCache = {};
            products.forEach(product => {
                const productId = product.Id || product.id;
                window.WebsiteBuilderModules.FeaturedCollection.productDataCache[productId] = product;
            });
        }
    });
}
```

### 4. Preview.cshtml - Manejo de Página de Producto

**Archivo**: `/Views/WebsiteBuilder/Preview.cshtml`

#### Detección de página (líneas 225-231):
```javascript
const urlParams = new URLSearchParams(window.location.search);
const viewBagPage = '@ViewBag.Page';
const viewBagProductHandle = '@ViewBag.ProductHandle';
const currentPageId = urlParams.get('page') || (viewBagPage && viewBagPage !== '' ? viewBagPage : 'home');
```

#### Caso especial para página de producto (líneas 451-492):
```javascript
} else if (currentPageId === 'product') {
    // Special handling for product page
    console.log('[PREVIEW] Loading product page configuration');
    console.log('[PREVIEW] ViewBag.ProductHandle:', viewBagProductHandle);
    
    // Keep existing header and footer configurations
    const existingHeader = currentSectionsConfig.header || {};
    const existingFooter = currentSectionsConfig.footer || {};
    const existingProductContainer = currentSectionsConfig.productContainer || {};
    
    // Check if we have a product template page saved
    if (pagesData['product']) {
        console.log('[PREVIEW] Found product page in pagesData');
        const pageConfig = pagesData['product'];
        
        currentSectionsConfig = {
            ...currentSectionsConfig,
            ...pageConfig.sectionsConfig,
            sectionOrder: pageConfig.sectionOrder || []
        };
        
        // Look for product container in different possible keys
        const productContainerKey = Object.keys(currentSectionsConfig).find(key => 
            key.includes('product-container') || key === 'productContainer'
        );
        
        // Pass the product handle to product container
        if (productContainerKey && currentSectionsConfig[productContainerKey]) {
            currentSectionsConfig[productContainerKey].productHandle = viewBagProductHandle;
        }
    } else {
        // Product page should show header, product container, and footer
        currentSectionsConfig = {
            ...currentSectionsConfig,
            sectionOrder: ['header', 'product-container', 'footer'],
            header: existingHeader,
            footer: existingFooter,
            productContainer: {
                ...existingProductContainer,
                isHidden: false,
                colorScheme: existingProductContainer.colorScheme || 'scheme1',
                productHandle: viewBagProductHandle // Pass the handle from URL
            }
        };
    }
}
```

#### Renderizado de Product Container (líneas 955-995):
```javascript
} else if (sectionId === 'product-container') {
    console.log('[PREVIEW] Processing product container section');
    // Try different possible keys for product container config
    let productContainerConfig = currentSectionsConfig.productContainer || 
                                currentSectionsConfig['product-container'] ||
                                currentSectionsConfig.productcontainer;
    
    // If not found, check if we have any section with product-container in its ID
    if (!productContainerConfig) {
        for (const key in currentSectionsConfig) {
            if (key.includes('product-container')) {
                productContainerConfig = currentSectionsConfig[key];
                console.log('[PREVIEW] Found product container config with key:', key);
                break;
            }
        }
    }
    
    if (productContainerConfig && !productContainerConfig.isHidden) {
        // Use the module's render function if available
        if (window.WebsiteBuilderModules && window.WebsiteBuilderModules.ProductContainer && window.WebsiteBuilderModules.ProductContainer.render) {
            console.log('[PREVIEW] Rendering product container with module');
            const renderedHtml = window.WebsiteBuilderModules.ProductContainer.render(productContainerConfig);
            finalHtml += renderedHtml;
        } else {
            console.log('[PREVIEW] Product Container module not available');
            // Fallback HTML
        }
    }
}
```

#### Inclusión del script (línea 215):
```html
<script src="~/js/website-builder/modules/product-container.js?v=@DateTime.Now.Ticks"></script>
```

### 5. Product Container - Detección de Handle

**Archivo**: `/wwwroot/js/website-builder/modules/product-container.js`

#### Detección de handle en config (líneas 159-176):
```javascript
// Check if we have a product handle passed in config (from Preview.cshtml)
if (config.productHandle && !this.currentProduct) {
    console.log('[PRODUCT-CONTAINER] Product handle found in config:', config.productHandle);
    // Load the product synchronously if possible, or schedule async load
    this.loadProductByHandle(config.productHandle).then(product => {
        if (product) {
            console.log('[PRODUCT-CONTAINER] Product loaded from config handle:', product.name);
            this.currentProduct = product;
            // Re-render the section
            if (typeof renderPreviewContent === 'function') {
                console.log('[PRODUCT-CONTAINER] Re-rendering preview content with loaded product');
                renderPreviewContent();
            }
        }
    }).catch(error => {
        console.error('[PRODUCT-CONTAINER] Error loading product from config handle:', error);
    });
}
```

#### Función loadProductByHandle (líneas 2745-2774):
```javascript
loadProductByHandle: function(handle) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/builder/products/by-handle/${handle}`,
            method: 'GET',
            success: (product) => {
                console.log('[PRODUCT-CONTAINER] Product loaded by handle:', product);
                // Transform to match our expected format
                const transformedProduct = {
                    id: product.id,
                    name: product.title,
                    handle: product.handle,
                    description: product.description,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    vendor: product.vendor,
                    images: product.images?.map(img => ({
                        id: img.id,
                        url: img.imageUrl,
                        altText: img.altText
                    })) || []
                };
                resolve(transformedProduct);
            },
            error: (xhr, status, error) => {
                console.error('[PRODUCT-CONTAINER] Error loading product by handle:', error);
                reject(error);
            }
        });
    });
},
```

### 6. API Endpoint para Productos por Handle

**Archivo**: `/Controllers/ProductsController.cs`
**Líneas**: 770-846

```csharp
// GET: api/builder/products/by-handle/{handle}
[HttpGet]
[Route("api/builder/products/by-handle/{handle}")]
[AllowAnonymous]
public async Task<IActionResult> GetProductByHandle(string handle)
{
    try
    {
        if (string.IsNullOrEmpty(handle))
        {
            return NotFound();
        }

        var product = await _context.Products
            .Where(p => p.Handle == handle && p.Status == "active")
            .Include(p => p.Images.OrderBy(i => i.Position))
            .Include(p => p.Videos.OrderBy(v => v.Position))
            .Include(p => p.Variants.OrderBy(v => v.Position))
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Handle,
                p.Description,
                p.Price,
                p.CompareAtPrice,
                p.Vendor,
                p.ProductType,
                // ... más campos
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound();
        }

        return Json(product);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al obtener producto por handle para Website Builder");
        return StatusCode(500, "Error al obtener el producto");
    }
}
```

## Problemas Encontrados y Soluciones

### Problema 1: Navegación no funcionaba
**Síntoma**: Click en productos no navegaba a ningún lado
**Causa**: Los handles no se estaban pasando a los cards
**Solución**: 
1. Implementar carga de handles desde cache de productos
2. Agregar lógica de enlaces solo en preview real (no en editor)

### Problema 2: Solo se mostraba header y footer
**Síntoma**: Al navegar a `/products/[handle]`, la página estaba vacía
**Causa múltiple**:

1. **No se detectaba como página de producto**
   - **Solución**: Agregar caso especial en Preview.cshtml para `currentPageId === 'product'`

2. **No existía configuración de Product Container**
   - **Solución**: Buscar con múltiples claves posibles (`productContainer`, `product-container`)

3. **Script no incluido en Preview.cshtml**
   - **Solución**: Agregar `<script src="~/js/website-builder/modules/product-container.js">`

### Problema 3: Product Container no cargaba el producto correcto
**Síntoma**: Siempre mostraba el primer producto
**Causa**: No se pasaba el handle al módulo
**Solución**: 
1. Pasar `productHandle` en la configuración desde Preview.cshtml
2. Detectar y usar el handle en Product Container

## Lecciones Aprendidas

### 1. Diferencias Editor vs Preview Real
- **Editor**: `window.parent !== window` (está en iframe)
- **Preview Real**: `window.parent === window` (no hay iframe)
- Los comportamientos deben adaptarse según el contexto

### 2. Inclusión de Scripts
- Los scripts deben incluirse en AMBAS vistas:
  - `PreviewTemplate.cshtml` (para el editor)
  - `Preview.cshtml` (para el preview real)

### 3. Flexibilidad en Nombres de Configuración
- Las secciones pueden guardarse con diferentes claves
- Siempre buscar con múltiples variaciones:
  - camelCase: `productContainer`
  - kebab-case: `product-container`
  - lowercase: `productcontainer`

### 4. Inicialización de Módulos
- Los módulos deben inicializarse automáticamente cuando detectan que están en preview
- Usar `$(document).ready()` para asegurar que el DOM esté listo

## Guía para Futuros Módulos (Collections, etc.)

### 1. Routing
```csharp
// En Program.cs
app.MapControllerRoute(
    name: "collection",
    pattern: "collections/{handle}",
    defaults: new { controller = "WebsiteBuilder", action = "Preview" });
```

### 2. Controller
```csharp
// En WebsiteBuilderController.cs
if (Request.Path.Value?.StartsWith("/collections/", StringComparison.OrdinalIgnoreCase) == true)
{
    page = "collection";
    ViewBag.CollectionHandle = handle;
}
```

### 3. Preview.cshtml
```javascript
} else if (currentPageId === 'collection') {
    // Similar a product, pero para collections
    if (pagesData['collection']) {
        // Cargar configuración guardada
    } else {
        // Configuración por defecto
        currentSectionsConfig = {
            sectionOrder: ['header', 'collection-container', 'footer'],
            // ...configuración
        };
    }
}
```

### 4. Módulo Collection
- Detectar handle desde URL o config
- Cargar colección específica por handle
- Renderizar productos de esa colección

### 5. No olvidar
1. Incluir script en AMBAS vistas (PreviewTemplate y Preview)
2. Agregar caso de renderizado en el switch de secciones
3. Manejar múltiples formatos de nombres de configuración
4. Diferenciar comportamiento editor vs preview real

## Testing y Debugging

### Logs clave para debugging:
1. `[PREVIEW] Loading page: [page]` - Confirma qué página se está cargando
2. `[PREVIEW] Product container config: [config]` - Verifica si encuentra la configuración
3. `[PREVIEW] Module available? [Yes/No]` - Confirma si el módulo está cargado
4. `[PRODUCT-CONTAINER] Product handle found in config: [handle]` - Confirma recepción del handle
5. `[FEATURED-COLLECTION] Got handle from cache: [handle]` - Confirma carga de handles

### Verificaciones importantes:
1. Revisar Network tab para confirmar que scripts se cargan
2. Verificar Console para errores de JavaScript
3. Confirmar que las APIs devuelven datos correctos
4. Verificar que los handles existen en la base de datos

## Implementación en Featured Product

### Problema Adicional: Productos sin Handle
**Fecha**: 21 de Julio de 2025
**Contexto**: Después de implementar exitosamente la navegación en Featured Collection, se intentó replicar en Featured Product.

#### Síntoma
Al hacer clic en el producto de Featured Product:
- No navegaba a ninguna página
- Console log mostraba: `[FEATURED-PRODUCT] renderProductInfo - product handle: undefined`

#### Causa Raíz
El producto seleccionado en Featured Product fue configurado ANTES de que se implementara el sistema de handles automáticos. Por lo tanto:
- El producto existía en la BD con handle
- Pero el objeto `selectedProduct` guardado en la configuración NO tenía el campo handle
- A diferencia de Featured Collection que carga productos frescos cada vez

#### Solución Implementada

1. **Detección de handle faltante**:
```javascript
if (config.selectedProduct && config.selectedProduct.id && !config.selectedProduct.handle) {
    console.log('[FEATURED-PRODUCT] Product missing handle, attempting to fetch...');
    // Cargar handle dinámicamente
}
```

2. **Función `fetchProductHandle`**:
```javascript
fetchProductHandle: function(productId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/builder/products',
            method: 'GET',
            success: (products) => {
                const product = products.find(p => p.id === productId);
                if (product && product.handle) {
                    resolve(product.handle);
                }
            }
        });
    });
}
```

3. **Error de contexto `this`**:
- **Error inicial**: `TypeError: this.fetchProductHandle is not a function`
- **Causa**: El contexto de `this` se pierde en la función `render`
- **Solución**: Usar referencia completa `window.WebsiteBuilderModules.FeaturedProduct.fetchProductHandle`

#### Lecciones Aprendidas
1. **Datos Legacy**: Siempre considerar que pueden existir datos guardados antes de nuevas implementaciones
2. **Carga Dinámica**: Implementar mecanismos para actualizar datos antiguos on-the-fly
3. **Contexto de `this`**: En módulos JavaScript, usar referencias completas para evitar problemas de contexto
4. **Diferencia entre módulos**: Featured Collection carga productos frescos, Featured Product usa datos guardados

### Patrón Recomendado para Futuros Módulos
```javascript
// En render o similar
if (config.savedData && !config.savedData.requiredField) {
    // Cargar campo faltante dinámicamente
    this.loadMissingData(config.savedData.id).then(data => {
        config.savedData.requiredField = data;
        // Re-renderizar
    });
}
```

## Conclusión

La implementación del preview real para productos requirió coordinar múltiples componentes:
- Routing a nivel de ASP.NET Core
- Detección y manejo de páginas especiales
- Inclusión correcta de scripts
- Paso de datos entre componentes
- Manejo de diferentes contextos (editor vs preview)
- **Manejo de datos legacy y actualizaciones dinámicas**

Esta documentación servirá como guía para implementar funcionalidades similares en el futuro, evitando los mismos problemas y aplicando las soluciones probadas.